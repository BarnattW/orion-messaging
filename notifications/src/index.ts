import mongoose from "mongoose";
import express, {Request, Response } from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import { removeSocketForUser, storeKeySocketPair } from "./utils/sockets";

const app = express();
const PORT = 3000;
const URI: string = process.env.MONGO_URI!;
//const URI = "mongodb://127.0.0.1:27017/myapp";
mongoose
	.connect(URI)
	.catch((error) => console.error("Connection error:", error));



app.use(express.json());

app.listen(3000, () => {
	console.log(`Server Started on Port 3000`);
});

