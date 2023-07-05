import mongoose from "mongoose";
import express, {Request, Response } from 'express';
import http from 'http';
import { friendRequests } from "../src/routes/api/friendrequests";
import { friends } from "../src/routes/api/friends";
import { createUser } from "../src/routes/api/user";
import { userOps } from "../src/routes/api/user";
import { groupRoutes } from "./routes/api/groups";
import { Server, Socket } from "socket.io";
import { User } from "./models/user";

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
app.use(userOps);
app.use(friends);
app.use(groupRoutes);

createUser();

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

app.listen(3000, () => {
	console.log(`Server Started on Port 3000`);
});

const server = http.createServer(app);
const io = new Server(server, {
	path: "/socket/notification-socket"
  });

io.on('connection', async(socket: Socket) => {

	socket.on("userId", async (userId) => {
		const user = await User.findOne({ userId: userId });
		if (!user){
			console.log("user not found");
			return;
		}
		user.onlineStatus = true;
		user.save();
		console.log(`${user.username} logged on`);
	});

	socket.on('disconnect', async(userId) => {
		const user = await User.findOne({ userId: userId });
		if (!user){
			console.log("user not found");
			return;
		}
		user.onlineStatus = false;
		user.save();
		console.log(`${user.username} logged off`);
  });
});
