import mongoose from "mongoose";
import {User} from './models/user'
import { request } from "./models/request";
import express, {Request, Response } from 'express';
require('dotenv').config();

const app = express();
const PORT = 3000;
const URI:string = process.env.DATABASE_URI!
mongoose.connect('mongodb://localhost:27017/database').catch((error) => console.error('Connection error:', error));

app.use(express.json());
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});


//routes

app.post('/api/addFriend', async (req, res) =>{
    try {
        const {senderID, receiverID} = req.body;
    
        const sender = await User.findById(senderID);
        const receiver = await User.findById(receiverID);

        if (!sender|| !receiver) {
            return res.status(404).json({ message: 'Sender or receiver not found' });
        }
    
        const newRequest = new request({
            senderID: sender,
            receiverID: receiver,
            requestType: 'friend',
            status: 'pending'
        });
    
        await newRequest.save();

        sender.outgoingrequests.push(newRequest._id);
        await sender.save();

        receiver.incomingrequests.push(newRequest._id);
        await receiver.save();
    
        return res.status(201).json(
            { 
                message: 'Friend request created' ,
                data: newRequest
            }
            );
        
    } catch (error) {
        console.error('Error creating friend request:', error);

        return res.status(500).json({ message: 'Server error' });
      }

})


app.get('/api/users', async (req, res) => {
    try {
      const users = await User.find();
      return res.json(users);
    } catch (error) {
      console.error('Error retrieving users:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  });