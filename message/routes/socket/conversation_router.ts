import mongoose from "mongoose";
import { User } from "../../models/User";
import { Message } from "../../models/Message";
import { Conversation, IConversation } from "../../models/Conversation";
import express, { Request, Response } from "express";
import { Server, Socket } from "socket.io";
import { socketsInConversation } from "../../lib/utils";
import { MessageContainer } from "../../models/MessageContainer";

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
      const user = await User.updateMany( 
        { userId: { $in : users} },
        { $push: { conversations: conv._id}}
      )

      if (!conv) {
        socket.emit("requestError", {
          message: `Failed to create conversation`,
        });
        return;
      }

      console.log("Conversation Created");

      socket.emit("createdConversation", {
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
      const { conversationId, userId } = data;

      const user = await User.findOneAndUpdate(
        { userId: userId },
        { $pull: { conversations: conversationId }}
      );

      if (!user) {
        console.log("User does not exist");
        return socket.emit("requestError", {
          message: "User does not exist"
        })
      }
      const conversation = await Conversation.findOneAndUpdate(
        { _id: conversationId },
        { $pull: { users: userId }}
      );

      if (!conversation){
        console.log("Conversation does not exist");
        return socket.emit("requestError", {
          message: "Conversation does not exist"
        })
      }

      const result = await socketsInConversation(conversation, connectedClients);

      io.to(result as string[]).emit("removedUser", {
        message: `Removed user ${userId} from ${conversationId}`,
        data: {
          user: user,
          conversation: conversation
        }
      })
    } catch (e) {
      console.log("Unable to remove user: ", e);
      socket.emit("requestError", {
        message: "Server Error"
      })
    }
  })
}

export const getUsers = (
  socket: Socket,
  connectedClients: Map<string, Socket>
) => {
  socket.on("getUsers", async (data) => {
    try {
      const { conversationId } = data;
      
      const conversation = await Conversation.findById(conversationId).populate('conversationUsers');
      const users = (conversation as any).conversationUsers;

      socket.emit("gotUsers", {
        message: `Users of conversation ${conversationId}`,
        data: users
      })
    } catch (e) {
      console.log("Unable to get users: ", e);
      socket.emit("requestError", {
        message: "Server Error"
      })
    }
  })
}

export const deleteConversation = (
  io: Server,
  socket: Socket,
  connectedClients: Map<string, Socket>
) => {
  socket.on("deleteConversation", async (data) => {
    try {
      const { conversationId } = data;
      console.log(conversationId)
      const deletedConversation = await Conversation.deleteOne({_id: conversationId});
    } catch (e) {
      console.log("Unable to delete conversation");
      socket.emit("requestError", {
        message: "Server Error"
      })
    }
      
  });
};