import mongoose from "mongoose";
import {User} from './models/user'
import { request } from "./models/request";
import express, {Request, Response } from 'express';
import http from 'http';
import {Server, Socket} from 'socket.io';
import {
	sendFriendRequest,
	acceptFriendRequest,
} from "./routes/sockets/friendrequests";

const app = express();
const PORT = 3000;
//const URI:string = process.env.MONGO_URI!
//mongoose.connect(URI).catch((error) => console.error('Connection error:', error));

app.use(express.json());

//routes
import { friendRequests } from "./routes/api/friendrequests";
app.use(friendRequests);
import { friends } from "./routes/api/friends";
app.use(friends);
import { createUser } from "./routes/api/friends";
app.use(createUser);


const server = http.createServer(app);
const io = new Server(server, {
	path: "/socket/connect-socket",
});

const connectedClients: Map<string, Socket> = new Map();

io.on('connection', (socket: Socket) =>{
	socket.on('ping', () => {
		console.log('Received ping from client (${socket.id})');
		socket.emit('pong');
	  });

    socket.on('userId', (userId) => {
    //LISTEN TO FRONTEND AND GET USERID
    connectedClients.set(userId, socket);
    
    socket.on('disconnect', ()=>
        {
            connectedClients.delete(userId);
        }
    );

    sendFriendRequest(socket, connectedClients);
    acceptFriendRequest(socket, connectedClients);
    });
});

	// Add your socket event handlers here

	socket.on("ping", () => {
		console.log("Received ping from client: " + socket.id);
	});

	socket.on("userId", (userId) => {
		//LISTEN TO FRONTEND AND GET USERID
		connectedClients.set(userId, socket);

		socket.on("disconnect", () => {
			connectedClients.delete(userId);
		});

		sendFriendRequest(socket, connectedClients);
		acceptFriendRequest(socket, connectedClients);
	});
});

const newUser = new User();
