import mongoose, { Types } from "mongoose";
import { IUser, User } from "../../models/User";
import { Message } from "../../models/Message";
import { Conversation, IConversation } from "../../models/Conversation";
import express, { Request, Response } from "express";
import { Server, Socket } from "socket.io";
import { socketsInConversation } from "../../lib/utils";
import { MessageContainer } from "../../models/MessageContainer";

export const createConversation = (
  io: Server,
  socket: Socket,
  connectedClients: Map<string, Socket>
) => {
  socket.on("createConversation", async (data) => {
    try {
      const {
        title,
        conversationType,
        users,
      }: { title: string; conversationType: string; users: string[] } = data;

      const newChat = {
        title: title,
        conversationType: conversationType,
        users: users,
      };

      const conv = await Conversation.create(newChat);
      const user = await User.updateMany(
        { userId: { $in: users } },
        { $push: { conversations: conv._id } }
      );

      if (!conv) {
        console.log("Create Conversation: Failed to create conversation");
        socket.emit("requestError", {
          message: `Failed to create conversation`,
        });
        return;
      }

      console.log("Conversation Created");

      const result = await socketsInConversation(conv, connectedClients);

      io.to(result as string[]).emit("createdConversation", {
        message: `Conversation of Type ${conv.conversationType} created`,
        data: conv,
      });
    } catch (e) {
      console.log("Unable to create: ", e);
      socket.emit("requestError", {
        message: "Server Error",
      });
    }
  });
};

export const addUser = (
  io: Server,
  socket: Socket,
  connectedClients: Map<string, Socket>
) => {
  socket.on("addUser", async (data) => {
    try {
      const {
        conversationId,
        userId,
      }: { conversationId: Types.ObjectId; userId: string } = data;
      console.log(data);

      const conv = await Conversation.findById(conversationId);
      if (!conv) {
        console.log("Add User: Conversation not found");
        return socket.emit("requestError", {
          message: "Conversation not found",
        });
      }

      if (conv.users.includes(userId)) {
        console.log("Add User: User already in conversation");
        return socket.emit("requestError", {
          message: "User already in conversation",
        });
      }

      const user = await User.findOne({ userId: userId });
      if (!user) {
        console.log("Add User: User not found");
        return socket.emit("requestError", {
          message: "User not found",
        });
      }

      conv.users.push(userId);
      conv.save();

      user.conversations.push(conversationId);
      user.save();

      console.log("");

      const result = await socketsInConversation(conv, connectedClients);

      io.to(result as string[]).emit("addedUser", {
        message: `Added user ${userId} to conversation ${conv._id}`,
        data: conv,
      });
    } catch (e) {
      console.log("Unable to add user: ", e);
      socket.emit("requestError", {
        message: "Server Error",
      });
    }
  });
};

export const removeUser = (
  io: Server,
  socket: Socket,
  connectedClients: Map<string, Socket>
) => {
  socket.on("removeUser", async (data) => {
    try {
      const {
        conversationId,
        userId,
      }: { conversationId: Types.ObjectId; userId: string } = data;

      const user = await User.findOneAndUpdate(
        { userId: userId },
        { $pull: { conversations: conversationId } }
      );

      if (!user) {
        console.log("Remove User: User not found");
        return socket.emit("requestError", {
          message: "User does not exist",
        });
      }
      const conversation = await Conversation.findOneAndUpdate(
        { _id: conversationId },
        { $pull: { users: userId } }
      );

      if (!conversation) {
        console.log("Remove User: Conversation not found");
        return socket.emit("requestError", {
          message: "Conversation does not exist",
        });
      }

      const result = await socketsInConversation(
        conversation,
        connectedClients
      );

      io.to(result as string[]).emit("removedUser", {
        message: `Removed user ${userId} from ${conversationId}`,
        data: {
          user: user,
          conversation: conversation,
        },
      });
    } catch (e) {
      console.log("Unable to remove user: ", e);
      socket.emit("requestError", {
        message: "Server Error",
      });
    }
  });
};

export const getUsers = (socket: Socket) => {
  socket.on("getUsers", async (data) => {
    try {
      const { conversationId }: { conversationId: Types.ObjectId } = data;

      const conversation: IConversation | null = await Conversation.findById(
        conversationId
      ).populate("conversationUsers");

      if (!conversation) {
        console.log("Get Users: Conversation not found");
      }
      const users: IUser[] = (conversation as any).conversationUsers;

      socket.emit("gotUsers", {
        message: `Users of conversation ${conversationId}`,
        data: users,
      });
    } catch (e) {
      console.log("Unable to get users: ", e);
      socket.emit("requestError", {
        message: "Server Error",
      });
    }
  });
};

export const deleteConversation = (
  io: Server,
  socket: Socket,
  connectedClients: Map<string, Socket>
) => {
  socket.on("deleteConversation", async (data) => {
    try {
      const { conversationId }: { conversationId: Types.ObjectId } = data;
      console.log(conversationId);
      const deletedConversation = await Conversation.deleteOne({
        _id: conversationId,
      });
    } catch (e) {
      console.log("Unable to delete conversation", e);
      socket.emit("requestError", {
        message: "Server Error",
      });
    }
  });
};
