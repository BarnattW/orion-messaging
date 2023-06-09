import mongoose from "mongoose";
import { User } from "../models/User";
import { Message } from "../models/Message";
import { Conversation } from "../models/Conversation";
import express, { Request, Response } from "express";
import { Server, Socket } from "socket.io";
import { socketsInConversation } from "../lib/utils";

export const sendMessage = (
  socket: Socket,
  connectedClients: Map<string, Socket>
) => {
  socket.on("sendMessage", async (data) => {
    try {
      const { conversationIds, userId, message } = data;
      
      const conv = await Conversation.findById(conversationIds);

      if (!conv) {
        socket.emit("requestError", {
          message: "Failed to Find Conversation",
        });
        return;
      }

      const sentMessage = {
        senderId: userId,
        message: message,
        timestamp: Date.now(),
      };

      const createdMessage = await Message.create(sentMessage);

      if (!createdMessage) {
        socket.emit("requestError", {
          message: "Failed to Create Message",
        });
      }
      console.log("Created Message");

      conv.addMessage(createdMessage._id);
      conv.save();

      let result = await socketsInConversation(conv, connectedClients);

      socket.to(result as string[]).emit("newMessage", {
        message: "Message Sent",
        data: message,
      });
    } catch (e) {
      socket.emit("requestError", {
        message: "Server Error"
      });
      console.log("Unable to send message");
    }
  });
};
