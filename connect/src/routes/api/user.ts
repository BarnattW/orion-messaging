import { IUser, User } from "../../models/user";
import express, { Request, Response } from "express";
import { insertionSort } from "./functions/sort";
import { consumer } from "./kafka-ops/kafkaproducer";
import { publishMessage } from "./kafka-ops/kafkaproducer";
import { KafkaMessage } from "kafkajs";

const router = express.Router();

export async function createUser() {
	await consumer.connect();
	await consumer.subscribe({
		topic: "user-created",
		fromBeginning: true,
	});

	await consumer.run({
		eachMessage: async ({ topic, partition, message }: {
			topic: string,
			partition: number,
			message: KafkaMessage
		  }) => {
			if (message.value){
				console.log(`Received message: ${message.value}`);
				const newUser = new User();
				//@ts-ignore
				newUser.userId = message.value; //assuming message is a json with userId
				newUser
					.save()
					.then((savedUser: IUser) => {
						console.log(`Saved user: ${savedUser}`);
						const userData = {
							username: savedUser.username,
							userId: savedUser.userId,
						};
						publishMessage("user-data", userData, "data");
					})
					.catch((error) => {
						console.error("Error saving user:", error);
					});
			}
			
		},
	});
}

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
					userId: { $in: user.friends },
				}).populate("friends");
				const sortedFriends = insertionSort(populatedFriends, "username");
				const sortedFriendIds = sortedFriends.map((friend) => friend.userId);
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
			console.log(userId);

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

export const userOps = router;
