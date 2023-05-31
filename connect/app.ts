import mongoose from "mongoose";
import {User} from './models/user'
import { request } from "./models/request";
import express, {Request, Response } from 'express';
import http from 'http';
import {Server, Socket} from 'socket.io';
import {sendFriendRequest, acceptFriendRequest} from './routes/sockets/friendrequests';

const app = express();
const PORT = 3000;
const URI:string = process.env.MONGO_URI!
mongoose.connect(URI).catch((error) => console.error('Connection error:', error));

app.use(express.json());

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});


//routes
import { friendRequests } from "./routes/api/friendrequests";
app.use(friendRequests)
import { friends } from "./routes/api/friends";
app.use(friends)

const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket: Socket) =>{
    sendFriendRequest(socket);
    acceptFriendRequest(socket);
})


io.on('connection', (socket: Socket) => {
    socket.on('ping', () => {
      console.log('Received ping from client (${socket.id})');
      socket.emit('pong');
    });
});