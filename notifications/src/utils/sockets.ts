import { redisClient } from "../redis/redis";
import {Socket} from "socket.io";
import { io } from "../index";
import { User } from "../models/user";
import { Notifications } from "../models/notifications";
import { sendCachedNotifications } from "../services/sendNotification";
import { addToMap, getSocketIdForUser, getUserIdForSocket, removeFromMap  } from "./biDirectionalMap";
import { deleteNotification } from "../services/deleteNotifications";

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
