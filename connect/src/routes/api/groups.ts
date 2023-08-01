import mongoose from "mongoose";
import { User } from "../../models/user";
import { request } from "../../models/request";
import express, { Request, Response } from "express";
import { publishMessage } from "./kafka-ops/kafkaproducer";
import { Group } from "../../models/groups";

const router = express.Router();

router.post("/api/connect/createGroup", async (req: Request, res: Response) => {
	try {
		const { groupName, userId } = req.body;
		const user = await User.findOne({ userId: userId });

		if (!user) {
			return res.status(404).json({ message: "user not found" });
		}

		const newGroup = new Group();
		newGroup.name = groupName;
		newGroup.creator = userId;
		newGroup.users.push(userId);

		await newGroup.save();

		publishMessage("group", newGroup, "create");

		return res
			.status(201)
			.json({ message: "group created successfully", data: newGroup });
	} catch (error) {
		console.error("Error creating group:", error);

		return res.status(500).json({ message: "Server error" });
	}
});

router.post(
	"/api/connect/sendGroupRequest",
	async (req: Request, res: Response) => {
		try {
			const { senderUsername, receiverUsername, groupId } = req.body;
			console.log(req.body);

			User.createIndexes();

			const sender = await User.findOne({
				username: senderUsername,
			});
			const receiver = await User.findOne({
				username: receiverUsername,
			});
			console.log(sender, receiver);

			if (!sender || !receiver) {
				return res
					.status(404)
					.json({ message: "Sender or receiver not found" });
			}

			const group = await Group.findById(groupId);
			console.log(group);

			if (!group) {
				return res.status(404).json({ message: "Group not found" });
			}

			const newRequest = new request({
				receiverUsername: receiverUsername,
				senderUsername: senderUsername,
				senderId: sender.userId,
				receiverId: receiver.userId,
				groupId: groupId,
				requestType: "group",
				status: "pending",
			});

			await newRequest.save();

			receiver.incomingrequests.push(newRequest._id);
			await receiver.save();

			sender.outgoingrequests.push(newRequest._id);
			await sender.save();

			//await publishMessage("group", newRequest, "create");

			return res.status(201).json({
				message: `group request created`,
				data: newRequest,
			});
		} catch (error) {
			console.error(`Error creating group request:`, error);

			return res.status(500).json({ message: "Server error" });
		}
	}
);

router.put(
	"/api/connect/acceptGroupRequest/:requestId",
	async (req: Request, res: Response) => {
		try {
			request.createIndexes();

			const { requestId } = req.params;
			const groupReq = await request.findById(requestId);

			if (!groupReq) {
				return res.status(404).json({ message: "Group request not found" });
			}

			Group.createIndexes();

			const group = await Group.findById(groupReq.groupId);

			if (!group) {
				return res.status(404).json({ message: "group not found" });
			}

			User.createIndexes();

			const sender = await User.findOne({ userId: groupReq.senderId });
			const receiver = await User.findOne({ userId: groupReq.receiverId });

			if (!sender || !receiver) {
				return res
					.status(404)
					.json({ message: "Sender or receiver not found" });
			}

			group.users.push(receiver.userId);

			await group.save();

			const data = {
				groupId: group._id,
				newUser: receiver.userId,
			};

			//publish to kafka
			await publishMessage("group", data, "accept");

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

			return res.status(200).json({ message: "Group request accepted" });
		} catch (error) {
			console.error("Error creating group request:", error);

			return res.status(500).json({ message: "Server error" });
		}
	}
);

router.put(
	"/api/connect/rejectGroupRequest/:requestId",
	async (req: Request, res: Response) => {
		try {

			request.createIndexes();

			const { requestId } = req.params;
			const groupReq = await request.findById(requestId);

			if (!groupReq) {
				return res.status(404).json({ message: "Group request not found" });
			}

			Group.createIndexes();

			const group = await Group.findById(groupReq.groupId);

			if (!group){
				return res.status(404).json({ message: "group not found"});
			}

			User.createIndexes();

			const sender = await User.findOne({ userId: groupReq.senderId });
			const receiver = await User.findOne({ userId: groupReq.receiverId });

			if (!sender || !receiver) {
				return res
					.status(404)
					.json({ message: "Sender or receiver not found" });
			}

			//publish to kafka
			await publishMessage("group", receiver, "reject");

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

			return res.status(200).json({ message: "Group request rejected" });
		} catch (error) {
			console.error("Error deleting group request:", error);

			return res.status(500).json({ message: "Server error" });
		}
	}
);

router.get(
	"/api/connect/:userId/getGroupReqs", 
	async (req: Request, res: Response) => 
	{
		try {
			const { userId } = req.params;
	
			User.createIndexes();
	
			const user = await User.findOne({ userId: userId });
	
			if (!user) {
				return res.status(404).json({ message: "User not found" });
			}
	
			const outgoingRequestIds = user.outgoingrequests;
	
			request.createIndexes();
	
			const outgoingRequests = await request.find({
			  _id: { $in: outgoingRequestIds },
			  requestType: "group",
			});
	
			const incomingRequestIds = user.incomingrequests;
	
			const incomingRequests = await request.find({
			  _id: { $in: incomingRequestIds },
			  requestType: "group",
			});
	
			return res.status(200).json({
				outgoing: outgoingRequests,
				incoming: incomingRequests,
			});
		} catch (error) {
			console.error("Error fetching group requests:", error);
	
			return res.status(500).json({ message: "Server error" });
		}
	}
);


router.put("/api/connect/renameGroup", async (req: Request, res: Response) => {
	try{
		const { groupId, newName } = req.body;

		const group = await Group.findById(groupId);

		if (!group) {
			return res.status(404).json({ message: "group not found" });
		}

		await Group.findByIdAndUpdate(groupId, {name: newName}, {new: true});

		const data = {
			groupId: groupId,
			newTitle: newName
		}

		await publishMessage("group", data, "rename");

		return res.status(200).json({message: `name changed to ${newName}`});
	} catch (error) {
		console.error("Error changing group name", error);
		return res.status(500).json({ message: "Server error" });
	}
});

router.put("/api/connect/leaveGroup", async (req: Request, res: Response) => {
	try{
		const { groupId, userId } = req.body;

		const group = await Group.findById(groupId);

		if (!group) {
			return res.status(404).json({ message: "group not found" });
		}

		User.createIndexes();
	
		const user = await User.findOne({ userId: userId });

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		await Group.findOneAndUpdate(
			{ _id: groupId },
			{
				$pull: { users: userId },
			}
		);

		const data = {
			userId: userId,
			groupId: groupId
		}

		if (group.users.length === 0){
			await Group.findByIdAndDelete(groupId);

			await publishMessage("group", group, "delete");

			return res.status(200).json({ message: "group removed successfully" });
		}

		await publishMessage("group", data, "leave");

		return res.status(200).json({message: "left group successfully"});

	} catch (error) {

		console.error("Error leaving group", error);
		return res.status(500).json({ message: "Server error" });

	}
});


export const groupRoutes = router;