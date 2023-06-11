import mongoose from "mongoose";
import { User } from "../../models/user";
import { request } from "../../models/request";
import express, { Request, Response } from "express";
import { publishMessage } from "./idkwhattonamethis/kafkaproducer";
import { insertionSort } from "./idkwhattonamethis/sort";

const router = express.Router();

export const sendRequest = async (
	req: Request,
	res: Response,
	requestType: String
) => {
	try {
		const { senderUsername, receiverUsername } = req.body;
		console.log("check", senderUsername, receiverUsername);

		const sender = await User.findOne({
			username: senderUsername,
		});
		const receiver = await User.findOne({
			username: receiverUsername,
		});

		console.log("log send,recevier", sender, receiver);
		if (!sender || !receiver) {
			return res.status(404).json({ message: "Sender or receiver not found" });
		}

		const newRequest = new request({
			receiverUsername: receiverUsername,
			senderUsername: senderUsername,
			senderId: sender.userId,
			receiverId: receiver.userId,
			requestType: requestType,
			status: "pending",
		});

		await newRequest.save();

		//await publishMessage(`${requestType}`, newRequest);

		sender.outgoingrequests.push(newRequest._id);
		await sender.save();

		receiver.incomingrequests.push(newRequest._id);
		await receiver.save();

		return res.status(201).json({
			message: `${requestType} request created`,
			data: newRequest,
		});
	} catch (error) {
		console.error(`Error creating ${requestType} request:`, error);

		return res.status(500).json({ message: "Server error" });
	}
};

router.post("/api/connect/sendFriendRequest", (req: Request, res: Response) =>
	sendRequest(req, res, "friend")
);

router.put(
	"/api/connect/acceptFriendRequest/:requestId",
	async (req: Request, res: Response) => {
		try {
			const { requestId } = req.params;
			const friendReq = await request.findById(requestId);

			if (!friendReq) {
				return res.status(404).json({ message: "Friend request not found" });
			}

			const sender = await User.findOne({ userId: friendReq.senderId });
			const receiver = await User.findOne({ userId: friendReq.receiverId });

			if (!sender || !receiver) {
				return res
					.status(404)
					.json({ message: "Sender or receiver not found" });
			}

			sender.friends.push(receiver._id);
			receiver.friends.push(sender._id);

			//SORT
			const populatedSenderFriends = await User.find({
				_id: { $in: receiver.friends },
			}).populate("friends");
			const sortedSenderFriends = insertionSort(
				populatedSenderFriends,
				"username"
			);
			const sortedSenderFriendIds = sortedSenderFriends.map(
				(friend) => friend._id
			);
			sender.friends = sortedSenderFriendIds;

			const populatedReceiverFriends = await User.find({
				_id: { $in: receiver.friends },
			}).populate("friends");
			const sortedReceiverFriends = insertionSort(
				populatedReceiverFriends,
				"username"
			);
			const sortedReceiverFriendIds = sortedReceiverFriends.map(
				(friend) => friend._id
			);
			sender.friends = sortedReceiverFriendIds;

			await sender.save();
			await receiver.save();

			//publish to kafka
			await publishMessage("Friend request accepted", receiver.friends);

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

			return res.status(200).json({ message: "Friend request accepted" });
		} catch (error) {
			console.error("Error creating friend request:", error);

			return res.status(500).json({ message: "Server error" });
		}
	}
);

router.put(
	"/api/connect/rejectFriendRequest/:requestId",
	async (req: Request, res: Response) => {
		try {
			const { requestId } = req.params;
			const friendReq = await request.findById(requestId);

			if (!friendReq) {
				return res.status(404).json({ message: "Friend request not found" });
			}

			const sender = await User.findOne({ userId: friendReq.senderId });
			const receiver = await User.findOne({ userId: friendReq.receiverId });

			if (!sender || !receiver) {
				return res
					.status(404)
					.json({ message: "Sender or receiver not found" });
			}

			//publish to kafka
			await publishMessage("Friend request rejected", receiver.friends);

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

			return res.status(200).json({ message: "Friend request rejected" });
		} catch (error) {
			console.error("Error deleting friend request:", error);

			return res.status(500).json({ message: "Server error" });
		}
	}
);

export const getRequest = async (
	req: Request,
	res: Response,
	requestType: String
) => {
	try {
		const { userId } = req.params;

		const user = await User.findOne({ userId: userId });

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		const outgoingRequests = await User.find(
			{ userId },
			{ outgoingrequests: { $elemMatch: { requestType: "your_request_type" } } }
		)
			.populate("outgoingrequests")
			.exec();
		const incomingreqs = await User.findOne(
			{ userId },
			{ outgoingrequests: { $elemMatch: { requestType: "your_request_type" } } }
		)
			.populate("incomingrequests")
			.exec();

		console.log(outgoingRequests, incomingreqs);

		return res.status(200).json({
			outgoing: outgoingRequests,
			incoming: incomingreqs,
		});
	} catch (error) {
		console.error("Error fetching friend requests:", error);

		return res.status(500).json({ message: "Server error" });
	}
};
router.get(
	"/api/connect/:userId/getFriendReqs",
	(req: Request, res: Response) => getRequest(req, res, "friend")
);

export const friendRequests = router;
