import mongoose from "mongoose";
import { User } from "../../models/user";
import { request } from "../../models/request";
import express, { Request, Response } from "express";

const router = express.Router();

router.delete(
	"/api/connect/removeFriend",
	async (req: Request, res: Response) => {
		try {
			const { userId, friendId } = req.body;

			User.createIndexes();

			const user = await User.findOne({ userId: userId });
			const friend = await User.findOne({ userId: friendId });

			if (!user) {
				return res.status(404).json({ message: "User not found" });
			}

			if (!friend) {
				return res.status(404).json({ message: "User not found" });
			}

			//find friend in user's friends list and delete
			const friendIndex = user.friends.findIndex(
				(friend) => friend.toString() === friendId
			);

			if (friendIndex === -1) {
				return res
					.status(404)
					.json({ message: `Friend not found in ${user}'s friends list` });
			}

			user.friends.splice(friendIndex, 1);
			await user.save();

			//find user in friend's friends list and delete
			const friendIndexOfUser = friend.friends.findIndex(
				(friend) => friend.toString() === userId
			);

			friend.friends.splice(friendIndexOfUser, 1);
			await friend.save();


			return res.status(200).json({ message: "Friend removed successfully" });
		} catch (error) {
			console.error("Error removing friend:", error);
			return res.status(500).json({ message: "Server error" });
		}
	}
);

router.get(
	"/api/connect/getFriends/:userId",
	async (req: Request, res: Response) => {
		try {

			User.createIndexes();

			const { userId } = req.params;
			const user = await User.findOne({ userId: userId });
			if (!user) {
				return res.status(404).json({ message: "User not found" });
			}
			const friends = await User.find({ userId: { $in: user.friends } }).exec();

			// Extract only the usernames from the friends array
			//const friendUsernames = friends.map((friend) => friend.username);

			return res.status(200).json({ friends });
		} catch (error) {
			console.error("Error getting friends:", error);

			return res.status(500).json({ message: "Server error" });
		}
	}
);

export const friends = router;
