import mongoose from "mongoose";
import { User } from "../models/User";
import { Message } from "../models/Message";
import { Conversation, IConversation } from "../models/Conversation";
import express, { Request, Response } from "express";
import { Server, Socket } from "socket.io";
import { socketsInConversation } from "../lib/utils";
import { MessageContainer } from "../models/MessageContainer";

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

      if (!conv) {
        socket.emit("requestError", {
          message: `Failed to create conversation`,
        });
        return;
      }

      console.log("Conversation Created");

      socket.emit("messageSent", {
        message: `Conversation of Type ${conv.conversationType} created`,
        data: conv,
      });
    } catch (e) {
      socket.emit("requestError", {
        message: "Server Error",
      });
      console.log("Unable to create");
    }
  });
};

export const addUser = (
  socket: Socket,
  connectedClients: Map<string, Socket>
) => {
  socket.on("addUserToConvo", async (data) => {
    try {
      const { conversationId, userId } = data;
      console.log(data);
      const conv = await Conversation.findById(conversationId);
      if (!conv) {
        console.log("Did not find conversation");
        return;
      }

      const user = await User.findOne({userId: userId});
      if (!user) {
        console.log("Did not find user");
        return;
      }

      conv.users.push(userId);
      conv.save();

      user.conversations.push(conversationId);
      user.save();

      console.log("Added User");

      socket.emit("addedUser", {
        message: `Added user ${userId} to conversation ${conv._id}`,
        data: conv,
      });
    } catch (e) {
      console.log("Unable to add user");
      socket.emit("requestError", {
        message: "Server Error",
      });
    }
  });
};

export const getUsers = (
  socket: Socket,
  connectedClients: Map<string, Socket>
) => {
  socket.on("getUsers", async (data) => {
    const { conversationId } = data;
    
    const conversation = await Conversation.findById(conversationId).populate('conversationUsers');
    console.log((conversation as any).conversationUsers);

    socket.emit("gotUser", {
      message: "Got users",
    })
  })
}

export const deleteConversation = (
  io: Server,
  socket: Socket,
  connectedClients: Map<string, Socket>
) => {
  socket.on("deleteConversation", async (data) => {
    const { conversationId } = data;
    console.log(conversationId)
    const deletedConversation = await Conversation.deleteOne({_id: conversationId});

  });
};