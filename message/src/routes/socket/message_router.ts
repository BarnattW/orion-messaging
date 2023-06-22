import mongoose, { Types } from "mongoose";
import { User } from "../../models/User";
import { Message } from "../../models/Message";
import { Conversation } from "../../models/Conversation";
import express, { Request, Response } from "express";
import { Server, Socket } from "socket.io";
import { socketsInConversation } from "../../lib/utils";
import { MessageContainer } from "../../models/MessageContainer";

export const sendMessage = (
  io: Server,
  socket: Socket,
  connectedClients: Map<string, Socket>
) => {
  socket.on("sendMessage", async (data) => {
    try {
      const {
        conversationId,
        userId,
        message,
      }: { conversationId: Types.ObjectId; userId: string; message: string } = data;

      console.log(data);
      const conv = await Conversation.findById(conversationId);

      if (!conv) {
        console.log("Send Message: No Conversation");
        return socket.emit("requestError", {
          message: "Failed to Find Conversation",
        });
      }

      const user = await User.findOne({ userId: userId });

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
        timestamp: new Date()
      };

      const createdMessage = await Message.create(sentMessage);

      if (!createdMessage) {
        return socket.emit("requestError", {
          message: "Failed to Create Message",
        });
      }

      console.log("Created Message" + createdMessage);

      conv.addMessage(createdMessage);

      let result = await socketsInConversation(conv, connectedClients);

      io.sockets.to(result as string[]).emit("sentMessage", {
				message: "Message Sent",
				data: { message: createdMessage, conversationId },
			});
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
			const {
				conversationId,
				timestamp,
			}: { conversationId: Types.ObjectId; timestamp: Date } = data;

			console.log(timestamp);
			const convo = await Conversation.findById(conversationId);

			if (!convo) {
				console.log("No Conversation");
				return socket.emit("requestError", {
					message: "Conversation Doesn't Exist",
				});
			}

			const message = await MessageContainer.findOne({
				_id: { $in: convo?.messages },
				timeCreated: { $lt: timestamp },
			})
				.sort({ timeCreated: -1 })
				.populate("messages");

			console.log(message?.messages);

			let messages: Types.ObjectId[] = [];
			let timeCreated = timestamp;
			let hasMore = false;

			if (message?.messages) {
				messages = message.messages;
				timeCreated = message.timeCreated;
			}

			const test = await MessageContainer.findOne({
				_id: { $in: convo?.messages },
				timeCreated: { $lt: message?.timeCreated },
			}).sort({ timeCreated: -1 });

			if (test) {
				hasMore = true;
			}

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
      const { messageId, text }: { messageId: Types.ObjectId; text: string } =
        data;
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

      io.sockets.to(result as string[]).emit("editedMessage", {
        message: "Message Edited",
        data: message,
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
      const { messageId }: { messageId: Types.ObjectId } = data;

      console.log(messageId);
      const message = await Message.findByIdAndDelete(messageId);
      if (!message) {
        console.log("Delete Message: Message does not exist");
        return socket.emit("requestError", {
          message: "Message doesn't exist",
        });
      }

      const messageContainer = await MessageContainer.findOneAndUpdate(
        { messages: messageId },
        { $pull: { messages: messageId } }
      );

      const conversation = await Conversation.findOne({
        messages: messageContainer?._id,
      });

      if (!conversation) {
        console.log(
          "Message in messageContainer does not exist in a conversation"
        );
        return;
      }

      const result = await socketsInConversation(
        conversation,
        connectedClients
      );

      io.to(result as string[]).emit("deletedMessage", {
        message: `Delete message ${messageId}`,
        data: message,
      });
    } catch (e) {
      console.log("Unable to delete message: ", e);
      socket.emit("requestError", {
        message: "Server Error (Delete Message)",
      });
    }
  });
};
