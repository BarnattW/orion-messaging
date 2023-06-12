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
  getMessages,
  sendMessage,
} from "./routes/conversation_router";
import { createUser } from "./routes/user_router";
import { editMessage } from "./routes/message_router";

mongoose
  .connect(
    "mongodb://127.0.0.1:27017/message?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.9.1"
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
  cors: { origin: "*" },
});

const connectedClients: Map<string, Socket> = new Map();

io.on("connection", async (socket: Socket) => {
  console.log("Socket Connected " + socket.id);

  socket.on("userId", async (userId) => {
    connectedClients.set(userId, socket);

    socket.on("disconnect", () => {
      console.log("Disconnected");
      connectedClients.delete(userId);
    });

    getMessages(socket, connectedClients);
    createConversation(socket, connectedClients);
    addUser(socket, connectedClients);
    sendMessage(io, socket, connectedClients);
    editMessage(io, socket, connectedClients);
  });

  createUser(socket, connectedClients);
});

server.listen(8080, function () {
  console.log("Server connected");
});
