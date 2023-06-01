import mongoose from "mongoose";
import {User} from './models/user'
import { request } from "./models/request";
import express, {Request, Response } from 'express';
import http from 'http';
import {Server, Socket} from 'socket.io';
import {
	sendFriendRequest,
	acceptFriendRequest,
} from "./routes/sockets/friendrequests";
import cors from "cors";

const app = express();
const PORT = 3000;
//const URI:string = process.env.MONGO_URI!
//mongoose.connect(URI).catch((error) => console.error('Connection error:', error));

app.use(express.json());
app.use(
	cors({
		origin: "http://localhost:3001",
		credentials: true,
	})
);

//routes
import { friendRequests } from "./routes/api/friendrequests";
app.use(friendRequests);
import { friends } from "./routes/api/friends";
app.use(friends);

const server = http.createServer(app);
const io = new Server(server, {
	path: "/socket/connect-socket",
});

const connectedClients: Map<string, Socket> = new Map();

io.on("connection", (socket: Socket) => {
	console.log("A client connected: " + socket.id);

	// Add your socket event handlers here

	socket.on("ping", () => {
		console.log("Received ping from client: " + socket.id);
	});

	socket.on("userId", (userId) => {
		//LISTEN TO FRONTEND AND GET USERID
		connectedClients.set(userId, socket);

		socket.on("disconnect", () => {
			connectedClients.delete(userId);
		});

		sendFriendRequest(socket, connectedClients);
		acceptFriendRequest(socket, connectedClients);
	});
});

server.listen(3000, () => {
	console.log(`Server is running on port ${PORT}`);
});