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
      const createdUser = User.create(user);
    } catch (e) {
      console.log("Unable to create user");
    }
  });
};
