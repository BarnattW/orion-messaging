import mongoose from "mongoose";
import { IUser, User } from "../../models/User";
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
      const user = await User.findOne({ userId: userId }).populate({
        path: "conversations", 
        populate: {
          path: "conversationUsers"
        }
      });

      if (!user) {
        console.log("Get Conversations: User not found")
        return socket.emit("requestError", {
          message: "User not found",
        });
      }
      
     
      const convoWithUserInformation = await Promise.all(user.conversations.map(async conversation => {
        //@ts-ignore
        const userData = conversation.conversationUsers.map(user => ({
          userId: user.userId,
          username: user.username
        }));
        return {
          //@ts-ignore
          ...conversation.toObject(),
          userData
        };
      }));
      
      console.log(convoWithUserInformation)
      socket.emit("gotConversations", {
        message: "Got Conversations",
        data: convoWithUserInformation,
      });
      
    } catch (e) {
      console.log("Unable to get conversations", e);
      socket.emit("requestError", {
        message: "Server Error",
      });
    }
  });
};
