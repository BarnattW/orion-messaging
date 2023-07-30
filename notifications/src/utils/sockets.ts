import { redisClient } from "../redis/redis";
import {Socket} from "socket.io";
import { io } from "../index";
import { User } from "../models/user";
import { Notifications } from "../models/notifications";
import { sendCachedNotifications } from "../services/sendNotification";
import { addToMap, getSocketIdForUser, getUserIdForSocket, removeFromMap  } from "./biDirectionalMap";



io.on('connection', async(socket: Socket) => {
	console.log('socket connected');
	socket.on("connection", () => {
	socket.emit("connection", {
		message: "user connected",
	});
});

	socket.on("userId", async (userId) => {
		addToMap(userId, socket.id);
		const user = await User.findOne({userId: userId});
		if (!user){
			return;
		}
		user.onlineStatus = true;
		const notifications = await pullNotificationsForUser(userId);
		if (notifications.length != 0){
			sendCachedNotifications(userId, notifications, "cached");
		}

		else{
			console.log("no notifications found")
		}
		
	});

	socket.on('disconnect', async() => {
		console.log('socket connection closed');
		const userId = await getUserIdForSocket(socket.id);
		const user = await User.findOne({userId: userId});
		if (!user || !userId){
			console.log("error while disconnecting")
			return;
		}
		removeFromMap(userId,socket.id);
		user.onlineStatus = false;
  });
});

export async function pullNotificationsForUser(userId: string) {
	try {
	const cached = await Notifications.find({ receiverId: userId });

	if (cached.length === 0) {
		console.log("no notifications");
		return [];
	}
	return cached;
	}catch (error) {
		console.error('Error fetching notifications:', error);
		return [];
	}
};
