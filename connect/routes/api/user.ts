import mongoose from "mongoose";
import { User } from "../../models/user";
import { request } from "../../models/request";
import express, { Request, Response } from "express";
import { insertionSort } from "./idkwhattonamethis/sort";

const router = express.Router();

router.post("/api/connect/createUser", async (req: Request, res: Response) => {
	try {
		const { userId } = req.body;

		const newUser = new User({
			onlineStatus: true,
			userId: userId,
			friends: [],
			incomingrequests: [],
			outgoingrequests: [],
		});

		await newUser.save();
		return res.status(201).json({
			message: "user ${username} created",
			data: newUser,
		});
	} catch (error) {
		console.error("Error creating user:", error);

		return res.status(500).json({ message: "Server error" });
	}
});

router.put("/api/connect/onlineStatus", async (req: Request, res: Response) => {
	try {
		const { userId, newStatus } = req.body;

		const user = await User.findOneAndUpdate(
			{ userId: userId },
			{ onlineStatus: newStatus },
			{ new: true }
		);
		if (!user) {
			return res.status(404).json({ message: "user not found" });
		}
		return res.json(user);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Server error" });
	}
});

router.put(
	"/api/connect/changeUsername",
	async (req: Request, res: Response) => {
		try {
			const { userId, newUsername } = req.body;

			const user = await User.findOneAndUpdate(
				{ userId: userId },
				{ username: newUsername },
				{ new: true }
			);
			if (!user) {
				return res.status(404).json({ message: "user not found" });
			}

			const usersWithUserAsFriend = await User.find({ friends: userId });

			usersWithUserAsFriend.forEach(async (user) => {
				const populatedFriends = await User.find({
					_id: { $in: user.friends },
				}).populate("friends");
				const sortedFriends = insertionSort(populatedFriends, "username");
				const sortedFriendIds = sortedFriends.map((friend) => friend._id);
				user.friends = sortedFriendIds;
			});

			return res.json(user);
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: "Server error" });
		}
	}
);

router.get(
	"/api/connect/:userId/getUsername",
	async (req: Request, res: Response) => {
		try {
			const { userId } = req.params;

			const user = await User.findOne({ userId: userId });
			console.log(user);
			if (!user) {
				return res.status(404).json({ message: "user not found" });
			}
			return res.json(user.username);
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: "Server error" });
		}
	}
);

export const createUser = router;
