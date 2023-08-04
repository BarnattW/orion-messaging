import mongoose from "mongoose";
import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import { handleNotifications } from "./services/handleNotifications";
import { User } from "./models/user";
import { sendCachedNotifications } from "./services/sendNotification";
import { addToMap, getSocketIdForUser, getUserIdForSocket, removeFromMap  } from "./utils/biDirectionalMap";
import { deleteNotification } from "./services/deleteNotifications";
import { pullNotificationsForUser } from "./utils/sockets";


const app = express();
const PORT = 3000;
const URI: string = process.env.MONGO_URI!;
//const URI = "mongodb://127.0.0.1:27017/myapp";
mongoose
	.connect(URI)
	.catch((error) => console.error("Connection error:", error));

handleNotifications();
app.use(express.json());

const server = http.createServer(app);
export const io = new Server(server, {
	path: "/socket/notifications-socket"
  });

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
		user.save();
		const notifications = await pullNotificationsForUser(userId);
		
		if (notifications.length != 0){
			console.log("notifications!!!!!!!!!!!!!!!!!");
			console.log(notifications)
			sendCachedNotifications(userId, notifications, "cached");
		}

		else{
			console.log("no notifications found")
		}
		
	});

	socket.on("deleteNotification", async (notifId) =>{
		const deleted = await deleteNotification(notifId);
		if (deleted.length != 0){
			socket.emit("error deleting notification")
		}
	})

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
		user.save();
		console.log(user.onlineStatus);
  });
});

server.listen(8080, () => {
  console.log('Socket.IO server is running');
});

