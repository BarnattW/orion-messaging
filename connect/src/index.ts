import mongoose from "mongoose";
import express, {Request, Response } from 'express';
import http from 'http';
import { friendRequests } from "../routes/api/friendrequests";
import { friends } from "../routes/api/friends";
import { createUser } from "../routes/api/user";
import { userOps } from "../routes/api/user";


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