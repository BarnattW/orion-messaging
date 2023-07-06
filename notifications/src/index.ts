import mongoose from "mongoose";
import express, {Request, Response } from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import { removeSocketForUser, storeKeySocketPair } from "./utils/sockets";

const app = express();
const PORT = 3000;
const URI: string = process.env.MONGO_URI!;
//const URI = "mongodb://127.0.0.1:27017/myapp";
mongoose
	.connect(URI)
	.catch((error) => console.error("Connection error:", error));



app.use(express.json());

app.listen(3000, () => {
	console.log(`Server Started on Port 3000`);
});

const server = http.createServer(app);
const io = new Server(server, {
	path: "/socket/notification-socket"
  });

io.on('connection', async(socket: Socket) => {
	console.log('socket connected');
	socket.on("connection", () => {
	socket.emit("connection", {
		message: "user connected",
	});
});

	socket.on("userId", async (userId) => {
		const socketString = JSON.stringify(socket);
		storeKeySocketPair(userId, "notification", socketString);
		
	});

	socket.on('disconnect', async(userId) => {
		console.log('socket connection closed');
		removeSocketForUser(userId, "notification");
  });
});

server.listen(8080, () => {
  console.log('Socket.IO server is running');
});