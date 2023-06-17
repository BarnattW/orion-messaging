import mongoose from "mongoose";
import { User } from "../../models/User";
import { Message } from "../../models/Message";
import { Conversation } from "../../models/Conversation";
import express, { Request, Response } from "express";
import { Server, Socket } from "socket.io";
import { socketsInConversation } from "../../lib/utils";
import { MessageContainer } from "../../models/MessageContainer";

export const getConversations = (socket: Socket) => {
  socket.on("getConversations", async (data) => {
    try {
      const { userId }: { userId: string} = data;
      const user = await User.findOne({ userId: userId }).populate(
        "conversations"
      );

      if (!user) {
        console.log("Get Conversations: User not found")
        return socket.emit("requestError", {
          message: "User not found",
        });
      }

      console.log(user);

      socket.emit("gotConversations", {
        message: "Got Conversations",
        data: user.conversations,
      });
      
    } catch (e) {
      console.log("Unable to get conversations", e);
      socket.emit("requestError", {
        message: "Server Error",
      });
    }
  });
};
