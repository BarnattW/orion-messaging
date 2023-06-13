import mongoose from "mongoose";
import { User } from "../models/User";
import { Message } from "../models/Message";
import { Conversation } from "../models/Conversation";
import express, { Request, Response } from "express";
import { Server, Socket } from "socket.io";
import { socketsInConversation } from "../lib/utils";
import { MessageContainer } from "../models/MessageContainer";

export const editMessage = (
  io: Server,
  socket: Socket,
  connectedClients: Map<string, Socket>
) => {
  socket.on("editMessage", async (data) => {
    try {
      const { messageId, text } = data;
      const message = await Message.findById(messageId);
      if (!message) {
        console.log("Message doesn't exist");
        return;
      }
      message.message = text;
      message.save();
      console.log(message);

      const messageContainer = await MessageContainer.findOne({
        messages: messageId,
      });

      const conversation = await Conversation.findOne({
        messages: messageContainer?._id,
      });

      if (!conversation) {
        console.log("Message doesn't exist in a conversation");
        return;
      }

      let result = await socketsInConversation(conversation, connectedClients);

      io.sockets.to(result as string[]).emit("editMessage", {
        message: "Message Edited",
        data: message,
      });
    } catch (e) {
      console.log(e);
    }
  });
};

export const deleteMessage = (
  socket: Socket,
  connectedClients: Map<string, Socket>
) => {
  socket.on("deleteMessage", async (data) => {
    try {
      const { messageId } = data;

      console.log(messageId);
      const message = await Message.findByIdAndDelete(messageId);
      if (!message) {
        console.log("Message does not exist");
        return;
      }

      const messageContainer = await MessageContainer.findOneAndUpdate(
        { messages: messageId },
        { $pull: { messages: messageId } }
      );
    } catch (e) {
      console.log(e);
    }
  });
};
