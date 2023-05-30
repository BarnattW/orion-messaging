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

router.put('/api/acceptRequest/:requestID', async (req, res)=>{
    try{
        const {requestID} = req.params;
        const friendReq = await request.findById(requestID);

        if (!friendReq){
            return res.status(404).json({ message: 'Friend request not found' });
        }

        const sender = await User.findById(friendReq.senderID);
        const receiver = await User.findById(friendReq.receiverID);

        if (!sender || !receiver) {
            return res.status(404).json({ message: 'Sender or receiver not found' });
        }

        sender.friends.push(receiver._id);
        receiver.friends.push(sender._id);

        await sender.save();
        await receiver.save();

        await request.findByIdAndDelete(requestID);

        await User.findByIdAndUpdate(sender._id, {
            $pull: { incomingrequests: requestID }
        });

        await User.findByIdAndUpdate(receiver._id, {
            $pull: { outgoingrequests: requestID }
        });

        return res.status(200).json({ message: 'Friend request accepted' });
        
    } catch (error) {
        console.error('Error creating friend request:', error);

        return res.status(500).json({ message: 'Server error' });
    }
})

router.get('/api/:userID/friendReqs', async(req, res) =>{
    try{
        const {userID} = req.params;

        const user = await User.findById(userID);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const outgoingfriendreqs = await User.find({ _id: { $in: user.outgoingrequests } });
        const incomingfriendreqs = await User.find({ _id: { $in: user.incomingrequests } });

        return res.status(200).json(
            { 
                outgoing: outgoingfriendreqs ,
                incoming: incomingfriendreqs
            }
        );
    } catch(error){
        console.error('Error fetching friend requests:', error);
        return res.status(500).json({message: 'Server error'});
    }
})

export const friendRequests = router;