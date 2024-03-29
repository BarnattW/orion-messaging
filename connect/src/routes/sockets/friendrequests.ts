import mongoose from "mongoose";
import { User } from "../../models/user";
import { request } from "../../models/request";
import express, { Request, Response } from "express";
import { Server, Socket } from "socket.io";

export const sendFriendRequest = (
	socket: Socket,
	connectedClients: Map<string, Socket>
) => {
	socket.on(
		"sendFriendRequest",
		async (
			senderUsername: string,
			receiverUsername: string,
			receiverUserId: string
		) => {
			try {
				const sender = await User.findOne({
					username: senderUsername,
				});
				const receiver = await User.findOne({
					username: receiverUsername,
				});

				if (!sender || !receiver) {
					socket.emit("requestError", {
						message: "Sender or receiver not found",
					});
					console.log("sender or receiver cannot be found");
					return;
				}

				const newRequest = new request({
					senderId: sender._id,
					receiverId: receiver._id,
					requestType: "friend",
					status: "pending",
				});

				await newRequest.save();

				sender.outgoingrequests.push(newRequest._id);
				await sender.save();

				receiver.incomingrequests.push(newRequest._id);
				await receiver.save();

				socket.emit("requestSent", {
					message: "${requestType} request created",
					data: newRequest,
				});

				socket.to(receiverUserId).emit("friendRequestReceived", {
					senderUserId: sender._id,
					message: "You have received a friend request",
				});
			} catch (error) {
				console.error("Error creating friend request:", error);

				socket.emit("requestError", { message: "Server error" });
			}
		}
	);
};

export const acceptFriendRequest = (
	socket: Socket,
	connectedClients: Map<string, Socket>
) => {
	socket.on("acceptFriendRequest", async (requestId: string) => {
		try {
			const friendReq = await request.findById(requestId);

			if (!friendReq) {
				socket.emit("requestError", { message: "Friend request not found" });
				return;
			}

			const sender = await User.findOne({ userId: friendReq.senderId });
			const receiver = await User.findOne({ userId: friendReq.receiverId });

			if (!sender || !receiver) {
				socket.emit("requestError", {
					message: "Sender or receiver not found",
				});
				return;
			}

			sender.friends.push(receiver._id);
			receiver.friends.push(sender._id);

			await sender.save();
			await receiver.save();

			await request.findByIdAndDelete(requestId);

			await User.findOneAndUpdate(
				{ userId: sender._id },
				{
					$pull: { incomingrequests: requestId },
				}
			);

			await User.findOneAndUpdate(
				{ userId: receiver._id },
				{
					$pull: { outgoingrequests: requestId },
				}
			);

			if (connectedClients.has(sender.id)) {
				const senderSocket = connectedClients.get(sender.id);
				if (senderSocket) {
					senderSocket.emit("friendRequestAccepted", {
						message: "Friend request accepted",
					});
				}
			}
			if (connectedClients.has(receiver.id)) {
				const receiverSocket = connectedClients.get(receiver.id);
				if (receiverSocket) {
					receiverSocket.emit("friendRequestAccepted", {
						message: "Friend request accepted",
					});
				} else {
					console.log("receiver not found");
				}
			}
		} catch (error) {
			console.error("Error accepting friend request:", error);

			socket.emit("requestError", { message: "Server error" });
		}
	});
};
