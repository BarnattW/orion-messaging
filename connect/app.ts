import mongoose from "mongoose";
import {User, IUser} from './models/user'
import { request } from "./models/request";
import express, {Request, Response } from 'express';
import http from 'http';
import {Server, Socket} from 'socket.io';
import { friendRequests } from "./routes/api/friendrequests";
import { friends } from "./routes/api/friends";
import { createUser } from "./routes/api/user";
import {consumer} from './routes/api/idkwhattonamethis/kafkaproducer'
import { KafkaMessage } from "kafkajs";
import { publishMessage } from "./routes/api/idkwhattonamethis/kafkaproducer";


// import {
// 	sendFriendRequest,
// 	acceptFriendRequest,
// } from "./routes/sockets/friendrequests";

const app = express();
const PORT = 3000;
const URI: string = process.env.MONGO_URI!;
//const URI = "mongodb://127.0.0.1:27017/myapp";
mongoose
	.connect(URI)
	.catch((error) => console.error("Connection error:", error));

app.use(express.json());

//routes

app.use(friendRequests);

app.use(friends);

app.use(createUser);

const server = http.createServer(app);
const io = new Server(server, {
	path: "/socket/connect-socket",
});

// const connectedClients: Map<string, Socket> = new Map();

// io.on('connection', (socket: Socket) =>{
// 	socket.on('ping', () => {
// 		console.log('Received ping from client (${socket.id})');
// 		socket.emit('pong');
// 	  });

//     socket.on('userId', (userId) => {
//     //LISTEN TO FRONTEND AND GET USERID
//     connectedClients.set(userId, socket);

//     socket.on('disconnect', ()=>
//         {
//             connectedClients.delete(userId);
//         }
//     );

//     sendFriendRequest(socket, connectedClients);
//     acceptFriendRequest(socket, connectedClients);
//     });
// });

app.listen(3000, () => {
	console.log(`Server Started on Port 3000`);
});

async function run() {
	await consumer.connect();
	await consumer.subscribe({
		topic: "user-created",
		fromBeginning: true,
	});

	await consumer.run({
		eachMessage: async ({ topic, partition, message }: {
			topic: string,
			partition: number,
			message: KafkaMessage
		  }) => {
			if (message.value){
				console.log(`Received message: ${message.value}`);
				const newUser = new User();
				//@ts-ignore
				newUser.userId = message.value; //assuming message is a json with userId
				newUser
					.save()
					.then((savedUser: IUser) => {
						console.log(`Saved user: ${savedUser}`);
						const userData = {
							username: savedUser.username,
							userId: savedUser.userId,
						};
						publishMessage("user-data", JSON.stringify(userData), "data");
					})
					.catch((error) => {
						console.error("Error saving user:", error);
					});
			}
			
		},
	});
}

run();

//consumer group auth
//topic: "user-created"

//TESTING WITHOUT KAFKA
// const newUser = new User();
// newUser.userId = newUser._id.toString();
// // Call the save method explicitly

// newUser.save()
//   .then((savedUser: IUser) => {
//     console.log(`Saved user: ${savedUser}`);
//   })
//   .catch((error) => {
//     console.error('Error saving user:', error);
//   });