import mongoose from "mongoose";
import {User} from './models/user'
import { request } from "./models/request";
import express, {Request, Response } from 'express';

const app = express();
const PORT = 3000;
const URI:string = process.env.DATABASE_URI!
mongoose.connect('mongodb://localhost:27017/database').catch((error) => console.error('Connection error:', error));

app.use(express.json());
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});


//routes
import { friendRequests } from "./routes/friendrequests";
app.use(friendRequests)
import { friends } from "./routes/friends";
app.use(friends)



app.get('/api/users', async (req, res) => {
    try {
      const users = await User.find();
      return res.json(users);
    } catch (error) {
      console.error('Error retrieving users:', error);
      return res.status(500).json({ message: 'Server error' });
    }
});