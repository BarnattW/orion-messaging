import mongoose from "mongoose";
import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import { handleNotifications } from "./services/handleNotifications";

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

server.listen(8080, () => {
  console.log('Socket.IO server is running');
});

