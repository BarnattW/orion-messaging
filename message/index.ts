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
} from "./routes/conversation_router";
import { createUser } from "./routes/user_router";
import { deleteMessage, editMessage, getMessages,
  sendMessage, } from "./routes/message_router";

mongoose
  .connect(
    process.env.MONGO_URI
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

  socket.on("userId", async (userId) => {
    connectedClients.set(userId, socket);

    socket.on("disconnect", () => {
      console.log("Disconnected");
      connectedClients.delete(userId);
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

  createUser(socket, connectedClients);
});

server.listen(8080, function () {
  console.log("Server connected");
});
