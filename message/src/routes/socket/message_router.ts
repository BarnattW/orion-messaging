import mongoose, { ObjectId, Types } from "mongoose";
import { User } from "../../models/User";
import { Message } from "../../models/Message";
import { Conversation } from "../../models/Conversation";
import express, { Request, Response } from "express";
import { Server, Socket } from "socket.io";
import { socketsInConversation } from "../../lib/utils";
import { MessageContainer } from "../../models/MessageContainer";
import { messageProducer } from "../../kafka/kafka_producer";

const producer = new messageProducer();
producer.connect();

export const sendMessage = (
  io: Server,
  socket: Socket,
  connectedClients: Map<string, Socket>
) => {
  socket.on("sendMessage", async (data) => {
    try {
      // Destructures data to get necessary values
      const {
        conversationId,
        userId,
        message,
      }: { conversationId: Types.ObjectId; userId: string; message: string } =
        data;

      console.log(data);

      // Finds a conversation with given id
      const conv = await Conversation.findById(conversationId);

      if (!conv) {
        console.log("Send Message: No Conversation");
        return socket.emit("requestError", {
          message: "Failed to Find Conversation",
        });
      }

      // Finds a user with given id
      const user = await User.findOne({ userId });
      if (!user) {
        console.log("Send Message: No User");
        return socket.emit("requestError", {
          message: "Failed to find user",
        });
      }

      const sentMessage = {
        senderId: userId,
        senderUsername: user?.username,
        message: message,
        timestamp: new Date(),
      };

      // Creates a message with given information
      const createdMessage = await Message.create(sentMessage);
      if (!createdMessage) {
        return socket.emit("requestError", {
          message: "Failed to Create Message",
        });
      }

      console.log("Created Message" + createdMessage);

      conv.addMessage(createdMessage);

      // Finds users connected and emits an event
      let result = await socketsInConversation(conv, connectedClients);
      io.sockets.to(result as string[]).emit("sentMessage", {
        message: "Message Sent",
        data: { message: createdMessage, conversationId },
      });

      let receiverIds = [...conv.users];

      const index = receiverIds.indexOf(userId);
      if (index > -1) {
        receiverIds.splice(index, 1);
      }

      producer.send({
        message: message,
        conversationName: conv.title,
        receiverIds: receiverIds
      })

    } catch (e) {
      socket.emit("requestError", {
        message: "Server Error (Send Message)",
      });
      console.log("Unable to send message");
    }
  });
};

export const getMessages = (socket: Socket) => {
  socket.on("getMessages", async (data) => {
    try {
      // Destructures data to get necessary values
      const {
        conversationId,
        timestamp,
      }: { conversationId: Types.ObjectId; timestamp: Date } = data;
      console.log(timestamp);

      // Finds a conversation with given id
      const convo = await Conversation.findById(conversationId);
      if (!convo) {
        console.log("No Conversation");
        return socket.emit("requestError", {
          message: "Conversation Doesn't Exist",
        });
      }

      // Finds the first batch of messages was created before
      // the given timestamp and populates it
      const message = await MessageContainer.findOne({
        _id: { $in: convo.messages },
        timeCreated: { $lt: timestamp },
      })
        .sort({ timeCreated: -1 })
        .populate("messages");

      console.log(message?.messages);

      // Destructures the batch for messages and timestamp. If batch
      // is not found then messages defaults to blank array and
      // timeCreated defaults to given timestamp
      const { messages = [], timeCreated = timestamp } = message ?? {};

      const query = {
        _id: { $in: convo.messages },
        timeCreated: { $lt: timeCreated },
      };

      // Checks if there are any batches of messages left
      const next = await MessageContainer.findOne(query).sort({
        timeCreated: -1,
      });

      const hasMore = next !== null;

      socket.emit("gotMessages", {
        message: "Message Received",
        data: {
          timestamp: timeCreated,
          messages,
          hasMore,
        },
      });
    } catch (e) {
      console.log("Unable to get messages: ", e);
      socket.emit("requestError", {
        message: "Server Error (Get Message)",
      });
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
      // Destructures data to get necessary values
      const {
				messageId,
				text,
				conversationId,
			}: {
				messageId: Types.ObjectId;
				text: string;
				conversationId: Types.ObjectId;
			} = data;

			// Finds message with given messageId
			const message = await Message.findById(messageId);
			if (!message) {
				console.log("Edit Message: Message doesn't exist");
				return socket.emit("requestError", {
					message: "Message doesn't exist",
				});
			}
			message.message = text;
			message.save();
			console.log(message);

			// Finds the conversation message is in
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

			// Finds users connected and emits an event
			let result = await socketsInConversation(conversation, connectedClients);
			io.sockets.to(result as string[]).emit("editedMessage", {
				message: "Message Edited",
				data: {
					message,
					conversationId,
				},
			});
    } catch (e) {
      console.log("Unable to edit message");
      socket.emit("requestError", {
        message: "Server Error (Edit Message)",

      });
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
      // Destructures to obtain messageId
      const {
        conversationId,
        messageId,
      }: { conversationId: Types.ObjectId; messageId: Types.ObjectId } = data;
      console.log(messageId);

      // Finds the message by id and deletes it
      const message = await Message.findByIdAndDelete(messageId);
      if (!message) {
        console.log("Delete Message: Message does not exist");
        return socket.emit("requestError", {
          message: "Message doesn't exist",
        });
      }

      // Removes the message from the message container associated
      const messageContainer = await MessageContainer.findOneAndUpdate(
        { messages: messageId },
        { $pull: { messages: messageId } }
      );

      // Finds the conversation with the message container
      const conversation = await Conversation.findOneAndUpdate(
        { messages: messageContainer?._id},
        messageContainer && messageContainer.messages.length === 1 ? { $pull: { messages: messageContainer._id } } : {},
        { new: true }
      )
      
      console.log(conversation)
      if (!conversation) {
        console.log(
          "Message in messageContainer does not exist in a conversation"
        );
        return;
      }

      // Finds users connected and emits an event
      const result = await socketsInConversation(
        conversation,
        connectedClients
      );

      io.to(result as string[]).emit("deletedMessage", {
        message: `Delete message ${messageId}`,
        data: {
          message,
          conversationId,
        },
      });
    } catch (e) {
      console.log("Unable to delete message: ", e);
      socket.emit("requestError", {
        message: "Server Error (Delete Message)",
      });
    }
  });
};
