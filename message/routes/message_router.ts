import mongoose from "mongoose";
import { User } from "../models/User";
import { Message } from "../models/Message";
import { Conversation } from "../models/Conversation";
import express, { Request, Response } from "express";
import { Server, Socket } from "socket.io";

export const sendMessage = (
  socket: Socket,
  connectedClients: Map<string, Socket>
) => {
  socket.on("sendMessage", async (data) => {
    try {
      const { conversationIds, userId, message } = data;
      const conv = await Conversation.findById(conversationIds);

      if (conv) {
        const sentMessage = {
          senderId: userId,
          message: message,
          timestamp: Date.now(),
        };
        const createdMessage = await Message.create(sentMessage);
        console.log("Created Message");
        conv.addMessage(createdMessage._id);
        conv.save();
        console.log("Added Message");
      }
    } catch (e) {
      console.log("Unable to send message");
    }
  });
};
