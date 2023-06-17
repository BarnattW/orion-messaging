import mongoose, { connect } from "mongoose";
import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import { User } from "./models/User";
import { Conversation } from "./models/Conversation";
import { Message } from "./models/Message";
import {
  addUser,
  createConversation,
  deleteConversation,
  getUsers,
  removeUser
} from "./routes/socket/conversation_router";
import { deleteMessage, editMessage, getMessages,
  sendMessage, } from "./routes/socket/message_router";
import { messageConsumer } from "./kafka/kafka_consumer";
import { getConversations } from "./routes/socket/user_router";

require("dotenv").config()

mongoose
  .connect(
    process.env.MONGO_URI as string
  )
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err.message);
  });

const app = express();
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  path: "/socket/message-socket"
});

const connectedClients: Map<string, Socket> = new Map();

io.on("connection", async (socket: Socket) => {
	console.log("Socket Connected " + socket.id);
	socket.on("connection", () => {
		socket.emit("connection", {
			message: "user connected",
		});
	});

  socket.on("userId", async (userId) => {
    connectedClients.set(userId, socket);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected");
    const result = [...connectedClients].find(([key, value]) => socket === value)?.[0];
    if (result) connectedClients.delete(result);
  });

  getMessages(socket);
  sendMessage(io, socket, connectedClients);
  editMessage(io, socket, connectedClients);
  deleteMessage(io, socket, connectedClients);

  createConversation(io, socket, connectedClients);
  deleteConversation(io, socket, connectedClients);
  addUser(io, socket, connectedClients);
  removeUser(io, socket, connectedClients);
  getUsers(socket);

  getConversations(socket)
});

async function run(){
  const consumer = new messageConsumer();
  consumer.connect();
}
run();

server.listen(8080, function () {
  console.log("Server connected");
});
