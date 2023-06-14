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
        socket.emit("requestError", {
          message: "Failed to Create User",
        });
        return;
      }

      socket.emit("userCreated", {
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
