import { IUser, User } from "../../models/user";
import express, { Request, Response } from "express";
import { consumer } from "./kafka-ops/kafkaproducer";
import { publishMessage } from "./kafka-ops/kafkaproducer";
import { KafkaMessage } from "kafkajs";
import { getUsername, setUsername } from "../../redis/lrucache";

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
			//@ts-ignore
			const parseMessage = JSON.parse(message.value?.toString());
			const {userId} = parseMessage;

			if (message.value){
				console.log(`Received message: ${message.value}`);
				const newUser = new User();
				//@ts-ignore
				newUser.userId = userId; //assuming message is a json with userId
				newUser
					.save()
					.then((savedUser: IUser) => {
						console.log(`Saved user: ${savedUser}`);
						const userData = {
							username: savedUser.username,
							userId: savedUser.userId,
						};
						setUsername(newUser.userId, newUser.username);
						publishMessage("user-data", userData, "data");
					})
					.catch((error) => {
						console.error("Error saving user:", error);
					});
			}
			
		},
	});
}

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
			
			await setUsername(userId, newUsername);

			if (!user) {
				return res.status(404).json({ message: "user not found" });
			}

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
			const username = await getUsername(userId);

			return res.json(username);
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: "Server error" });
		}
	}
);

export const userOps = router;
