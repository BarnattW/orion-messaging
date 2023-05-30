import mongoose from "mongoose";
import {User} from '../models/user'
import { request } from "../models/request";
import express, {Request, Response} from 'express';

const router = express.Router();

router.post('/api/addFriend', async (req, res) =>{
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

export const friendRequests = router;