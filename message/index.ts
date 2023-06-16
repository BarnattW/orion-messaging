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

require("dotenv").config();

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

app.set("view engine", "ejs");

app.use("/", (req, res) => {
  res.render("index");
})

const server = http.createServer(app);

const io = new Server(server, {
});

const connectedClients: Map<string, Socket> = new Map();

async function run(){
  const consumer = new messageConsumer();
  consumer.connect();
}
run();

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

  getMessages(socket, connectedClients);
  sendMessage(io, socket, connectedClients);
  editMessage(io, socket, connectedClients);
  deleteMessage(io, socket, connectedClients);

  createConversation(socket, connectedClients);
  deleteConversation(io, socket, connectedClients);
  addUser(io, socket, connectedClients);
  removeUser(io, socket, connectedClients);
  getUsers(socket, connectedClients);
});

server.listen(3000, function () {
  console.log("Server connected");
});
