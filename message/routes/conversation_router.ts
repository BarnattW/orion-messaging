import mongoose from "mongoose";
import { User } from "../models/User";
import { Message } from "../models/Message";
import { Conversation } from "../models/Conversation";
import express, { Request, Response } from "express";
import { Server, Socket } from "socket.io";

export const createConversation = (
  socket: Socket,
  connectedClients: Map<string, Socket>
) => {
  socket.on("createConversation", async (data) => {
    try {
      const { title, conversationType, users } = data;
      const newChat = {
        title: title,
        conversationType: conversationType,
        users: users,
      };
      const conv = await Conversation.create(newChat);
      console.log("Conversation Created");
    } catch (e) {
      console.log("Unable to create");
    }
  });
};

export const addUserToConvo = (
  socket: Socket,
  connectedClients: Map<string, Socket>
) => {
  socket.on("addUserToConvo", async (data) => {
    try {
      const { conversationId, userId } = data;

      const conv = await Conversation.findById(
        new mongoose.Types.ObjectId(conversationId)
      );

      const user = await User.findById(userId);

      if (conv && user) {
        conv.users.push(userId);
        conv.save();

        user.conversations.push(conversationId);
        user.save();
      }
    } catch (e) {
      console.log("Unable to add user");
    }
  });
};
