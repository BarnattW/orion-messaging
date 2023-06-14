import mongoose from "mongoose";
import { User } from "../models/User";
import { Message } from "../models/Message";
import { Conversation } from "../models/Conversation";
import express, { Request, Response } from "express";
import { Server, Socket } from "socket.io";
import { socketsInConversation } from "../lib/utils";
import { MessageContainer } from "../models/MessageContainer";

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
        data: createdMessage,
      });
    } catch (e) {
      socket.emit("requestError", {
        message: "Server Error (Send Message)",
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

      socket.emit("gotMessage", {
        message: "Message Received",
        data: {
          newIndex: index - 1,
          messages: message?.messages,
        },
      });
    } catch (e) {
      console.log("Unable to get messages: ", e);
      socket.emit("requestError", {
        message: "Server Error (Get Message)"
      })
    }
  });
};

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
      console.log("Unable to edit message");
      socket.emit("requestError", {
        message: "Server Error (Edit Message)"
      })
    }
  });
};

export const deleteMessage = (
  io: Server,
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

      const conversation = await Conversation.findOne({ messages: messageContainer?._id})

      if (!conversation) {
        console.log("Message in messageContainer does not exist in a conversation");
        return;
      }

      const result = await socketsInConversation(conversation, connectedClients);

      io.to(result as string[]).emit("deletedMessage", {
        message: `Delete message ${messageId}`,
        data: message
      })
    } catch (e) {
      console.log("Unable to delete message: ", e);
      socket.emit("requestError", {
        message: "Server Error (Delete Message)"
      })
    }
  });
};
