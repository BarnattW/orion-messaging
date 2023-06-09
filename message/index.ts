import mongoose, { connect } from "mongoose";
import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import { User } from "./models/User";
import { Conversation } from "./models/Conversation";
import { Message } from "./models/Message";
import {
  addUserToConvo,
  createConversation,
} from "./routes/conversation_router";
import { sendMessage } from "./routes/message_router";
import { createUser } from "./routes/user_router";

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
  
  socket.on('userId', (userId) => {
    console.log(userId);
    connectedClients.set(userId, socket);
      socket.on('disconnect', () => {
         connectedClients.delete(userId);
      })
  })

  createUser(socket, connectedClients);

  createConversation(socket, connectedClients);
  addUserToConvo(socket, connectedClients);

  sendMessage(socket, connectedClients);
});

server.listen(8080, function () {
  console.log("Server connected");
});
