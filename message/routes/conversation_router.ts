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

export const sendMessage = (
  io: Server,
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
      console.log("Created Message" + createdMessage);

      conv.addMessage(createdMessage._id);

      let result = await socketsInConversation(conv, connectedClients);

      io.sockets.to(result as string[]).emit("newMessage", {
        message: "Message Sent",
        data: message,
      });
    } catch (e) {
      socket.emit("requestError", {
        message: "Server Error",
      });
      console.log("Unable to send message");
    }
  });
};

export const getMessages = (
  socket: Socket,
  connectedClients: Map<string, Socket>
) => {
  socket.on("getMessages", async (data) => {
    try {
      const { conversationId, index } = data;

      const convo = await Conversation.findById(conversationId);

      const message = await MessageContainer.findById({
        _id: convo?.messages[index]
      }).populate('messages');

      console.log(message?.messages);

      if (!convo) {
        console.log("No Conversation");
        socket.emit("requestError", {
          message: "Conversation Doesn't Exist",
        });
        return;
      }

      const messages = convo.messages[index];

      socket.emit("gotMessage", {
        message: "Message Received",
        data: {
          newIndex: index - 1,
          messages: message?.messages,
        },
      });
    } catch (e) {
      console.log(e);
    }
  });
};
