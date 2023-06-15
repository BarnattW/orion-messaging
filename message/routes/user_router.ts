import mongoose from "mongoose";
import { User } from "../models/User";
import { Message } from "../models/Message";
import { Conversation } from "../models/Conversation";
import express, { Request, Response } from "express";
import { Server, Socket } from "socket.io";

export const createUser = (
  socket: Socket,
  connectedClients: Map<string, Socket>
) => {
  socket.on("createUser", async (data) => {
    try {
      const { userId, username } = data;

      const user = {
        userId: userId,
        username: username,
      };

      const createdUser = await User.create(user);

      if (!createdUser) {
        return socket.emit("requestError", {
          message: "Failed to Create User",
        });
      }

      socket.emit("createdUser", {
        message: `User with userId ${createdUser.userId}`,
        data: createdUser,
      });
    } catch (e) {
      socket.emit("requestError", {
        message: "Server Error (Create User)",
      });
      console.log("Unable to create user: ", e);
    }
  });
};
