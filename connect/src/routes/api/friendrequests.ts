import mongoose from "mongoose";
import { User } from "../../models/user";
import { request } from "../../models/request";
import express, { Request, Response } from "express";
import { publishMessage } from "./kafka-ops/kafkaproducer";
import { insertionSortFriends } from "./functions/sort";

const router = express.Router();

router.post("/api/connect/sendFriendRequest", async(req: Request, res: Response) =>{
	try {
		const { senderUsername, receiverUsername } = req.body;

		User.createIndexes();

		const sender = await User.findOne({
			username: senderUsername,
		});
		const receiver = await User.findOne({
			username: receiverUsername,
		});
		if (!sender || !receiver) {
			return res.status(404).json({ message: "Sender or receiver not found" });
		}

		//check if already friends
		if (sender.friends.includes(receiver.userId)) {
			return res
				.status(400)
				.json({ message: `${receiverUsername} is already your friend` });
			}

		//check if friendrequest is pending
		const outgoingRequestIds = sender.outgoingrequests;
		
		request.createIndexes();

		const outgoingRequests = await request.find({
			_id: { $in: outgoingRequestIds },
			requestType: "friend",
			receiverId: receiver.userId
		});
		console.log(outgoingRequests);
		if (outgoingRequests.length > 0){
			return res.status(400).json({ message: `Friend request to ${receiverUsername} is currently pending` });
		}

		//check if self
		if (sender.userId === receiver.userId){
			return res.status(400).json({message: 'You cannot send a friend request to yourself'});
		}

		const newRequest = new request({
			receiverUsername: receiverUsername,
			senderUsername: senderUsername,
			senderId: sender.userId,
			receiverId: receiver.userId,
			requestType: "friend",
			status: "pending",
		});

		await newRequest.save();

		sender.outgoingrequests.push(newRequest._id);
		await sender.save();

		receiver.incomingrequests.push(newRequest._id);
		await receiver.save();

		
		await publishMessage("friends", newRequest, "requestCreated")

		return res.status(201).json({
			message: `Friend Request Sent Sucessfully`,
			data: newRequest,
		});

		
	} catch (error) {
		console.error(`Error sending friend request:`, error);

		return res.status(500).json({ message: "Server error" });
	}
}
);

router.put(
	"/api/connect/acceptFriendRequest/:requestId",
	async (req: Request, res: Response) => {
		try {

			request.createIndexes();

			const { requestId } = req.params;
			const friendReq = await request.findById(requestId);

			if (!friendReq) {
				return res.status(404).json({ message: "Friend request not found" });
			}

			User.createIndexes();

			const sender = await User.findOne({ userId: friendReq.senderId });
			const receiver = await User.findOne({ userId: friendReq.receiverId });

			if (!sender || !receiver) {
				return res
					.status(404)
					.json({ message: "Sender or receiver not found" });
			}

			sender.friends.push(receiver.userId);
			receiver.friends.push(sender.userId);

			await sender.save();
			await receiver.save();
			
			const users = {
				receiverId: receiver.userId,
				senderId: sender.userId
			}

			await insertionSortFriends(sender);

			await insertionSortFriends(receiver);

			await sender.save();
			await receiver.save();

			//publish to kafka
			await publishMessage("friends", users, "request-accepted");

			await request.findByIdAndDelete(requestId);

			await User.findOneAndUpdate(
				{ userId: receiver.userId },
				{
					$pull: { incomingrequests: requestId },
				}
			);

			await User.findOneAndUpdate(
				{ userId: sender.userId },
				{
					$pull: { outgoingrequests: requestId },
				}
			);

			return res.status(200).json({ message: "Friend Request Accepted" });
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

			request.createIndexes();

			const { requestId } = req.params;
			const friendReq = await request.findById(requestId);

			if (!friendReq) {
				return res.status(404).json({ message: "Friend request not found" });
			}

			User.createIndexes();

			const sender = await User.findOne({ userId: friendReq.senderId });
			const receiver = await User.findOne({ userId: friendReq.receiverId });

			if (!sender || !receiver) {
				return res
					.status(404)
					.json({ message: "Sender or receiver not found" });
			}

			//publish to kafka
			await publishMessage("friends", receiver, "reject");

			await request.findByIdAndDelete(requestId);

			await User.findOneAndUpdate(
				{ userId: receiver.userId },
				{
					$pull: { incomingrequests: requestId },
				}
			);

			await User.findOneAndUpdate(
				{ userId: sender.userId },
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

router.get(
	"/api/connect/:userId/getFriendReqs", 
	async (req: Request, res: Response) => 
	{
		try {
			const { userId } = req.params;
	
			User.createIndexes();
	
			const user = await User.findOne({ userId: userId });
			console.log(user);
	
			if (!user) {
				return res.status(404).json({ message: "User not found" });
			}
	
			const outgoingRequestIds = user.outgoingrequests;
	
			request.createIndexes();
	
			const outgoingRequests = await request.find({
			  _id: { $in: outgoingRequestIds },
			  requestType: "friend",
			});
	
			const incomingRequestIds = user.incomingrequests;
	
			const incomingRequests = await request.find({
			  _id: { $in: incomingRequestIds },
			  requestType: "friend",
			});
		
		
		
	
			console.log(outgoingRequests, incomingRequests);
	
			return res.status(200).json({
				outgoing: outgoingRequests,
				incoming: incomingRequests,
			});
		} catch (error) {
			console.error("Error fetching friend requests:", error);
	
			return res.status(500).json({ message: "Server error" });
		}
	}
);

export const friendRequests = router;
