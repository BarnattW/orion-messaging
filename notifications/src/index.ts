import mongoose from "mongoose";
import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import { addUser } from "./utils/userCreation";
import { handleFriends } from "./services/friendrequests";
import { handleMessages } from "./services/messages";
import { handleGroups } from "./services/grouprequests";

const app = express();
const PORT = 3000;
const URI: string = process.env.MONGO_URI!;
//const URI = "mongodb://127.0.0.1:27017/myapp";
mongoose
	.connect(URI)
	.catch((error) => console.error("Connection error:", error));

handleMessages();
handleFriends();
handleGroups();
addUser();
app.use(express.json());

const server = http.createServer(app);
export const io = new Server(server, {
	path: "/socket/notifications-socket"
  });

server.listen(8080, () => {
  console.log('Socket.IO server is running');
});

