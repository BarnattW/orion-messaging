import mongoose from "mongoose";
import {User} from './models/user'
import { request } from "./models/request";
import express, {Request, Response } from 'express';
require('dotenv').config();

const app = express();
const PORT = 3000;
const URI:string = process.env.DATABASE_URI!
mongoose.connect(URI).catch((error) => console.error('Connection error:', error));

app.use(express.json());

//routes

app.post('/api/addFriend', async (req, res) =>{
    try {
        const { senderId, receiverId } = req.body;
    
        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);

        if (!sender || !receiver) {
          return res.status(404).json({ message: 'Sender or receiver not found' });
        }
    
        const newRequest = new request({
          sender: senderId,
          receiver: receiverId,
          type: 'friend',
          status: 'pending'
        });
    
        await newRequest.save();

        sender.outgoingrequests.push(newRequest._id);
        await sender.save();

        receiver.incomingrequests.push(newRequest._id);
        await receiver.save();
    
        return res.status(201).json({ message: 'Friend request created' });
        
    } catch (error) {
        console.error('Error creating friend request:', error);

        return res.status(500).json({ message: 'Server error' });
      }

})