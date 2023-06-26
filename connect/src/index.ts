import mongoose from "mongoose";
import express, {Request, Response } from 'express';
import http from 'http';
import { friendRequests } from "../src/routes/api/friendrequests";
import { friends } from "../src/routes/api/friends";
import { createUser } from "../src/routes/api/user";
import { userOps } from "../src/routes/api/user";
import { groupRoutes } from "./routes/api/groups";


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