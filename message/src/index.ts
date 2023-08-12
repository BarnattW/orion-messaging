import mongoose, { connect } from "mongoose";
import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
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
import { redis } from "./redis/redis";

mongoose
  .connect(
    process.env.MONGO_URI!
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

io.on("connection", async (socket: Socket) => {
	console.log("Socket Connected " + socket.id);
	socket.on("connection", () => {
		socket.emit("connection", {
			message: "user connected",
		});
	});

  socket.on("userId", async (userId) => {
    console.log("userId called", userId)
    await redis.hset("message", userId, socket.id);
    await redis.hset("sockets", socket.id, userId);
    console.log(await redis.hget("message", userId))
  });

  socket.on("disconnect", async () => {
    console.log("Disconnected");
    const userId = await redis.hget("sockets", socket.id);
    console.log("disconnected userId: ", userId)
    if (userId == null) return;
    await redis.hdel("message", userId);
    await redis.hdel("sockets", socket.id);

  });

  getMessages(socket);
  sendMessage(io, socket);
  editMessage(io, socket);
  deleteMessage(io, socket);

  createConversation(io, socket);
  deleteConversation(socket);
  addUser(io, socket);
  removeUser(io, socket);
  getUsers(socket);

  getConversations(socket)
});

async function run(){
  const consumer = new messageConsumer(io);
  consumer.connect();
}
run();

server.listen(8080, function () {
  console.log("Server connected");
});
