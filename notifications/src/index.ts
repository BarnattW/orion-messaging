import mongoose from "mongoose";
import express, {Request, Response } from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import { removeSocketForUser, storeKeySocketPair } from "./utils/sockets";
import { User } from "./models/user";
import { addUser } from "./utils/userCreation";
import { pullNotificationsForUser } from "./utils/sockets";
import { handleFriends } from "./services/friendrequests";
import { handleMessages } from "./services/messages";

const app = express();
const PORT = 3000;
const URI: string = process.env.MONGO_URI!;
//const URI = "mongodb://127.0.0.1:27017/myapp";
mongoose
	.connect(URI)
	.catch((error) => console.error("Connection error:", error));

handleMessages();
handleFriends();
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
	path: "/socket/notifications-socket"
  });

io.on("connection", async (socket: Socket) => {
	console.log("socket connected");
	socket.on("connection", () => {
		socket.emit("connection", {
			message: "user connected",
		});
	});

	socket.on("userId", async (userId) => {
		const socketString = JSON.stringify(socket);
		storeKeySocketPair(userId, "notification", socketString);
		const user = await User.findOne({ userId: userId });
		if (!user) {
			return;
		}
		user.onlineStatus = true;
		pullNotificationsForUser(userId);
	});

	socket.on("disconnect", async (userId) => {
		console.log("socket connection closed");
		removeSocketForUser(userId, "notification");
		const user = await User.findOne({ userId: userId });
		if (!user) {
			return;
		}
		user.onlineStatus = false;
	});
});

addUser();

server.listen(8080, () => {
  console.log('Socket.IO server is running');
});

