import mongoose from "mongoose";
import {User} from '../models/user'
import { request } from "../models/request";
import express, {Request, Response} from 'express';

const router = express.Router();

router.post('/api/sendFriendRequest', async (req: Request,  res: Response) =>{
    try {
        const {senderId, receiverId} = req.body;
    
        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);

        if (!sender|| !receiver) {
            return res.status(404).json({ message: 'Sender or receiver not found' });
        }
    
        const newRequest = new request({
            senderId: sender,
            receiverId: receiver,
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

router.put('/api/acceptFriendRequest/:requestId', async (req: Request,  res: Response)=>{
    try{
        const {requestId} = req.params;
        const friendReq = await request.findById(requestId);

        if (!friendReq){
            return res.status(404).json({ message: 'Friend request not found' });
        }

        const sender = await User.findById(friendReq.senderId);
        const receiver = await User.findById(friendReq.receiverId);

        if (!sender || !receiver) {
            return res.status(404).json({ message: 'Sender or receiver not found' });
        }

        sender.friends.push(receiver._id);
        receiver.friends.push(sender._id);

        await sender.save();
        await receiver.save();

        await request.findByIdAndDelete(requestId);

        await User.findByIdAndUpdate(sender._id, {
            $pull: { incomingrequests: requestId }
        });

        await User.findByIdAndUpdate(receiver._id, {
            $pull: { outgoingrequests: requestId }
        });

        return res.status(200).json({ message: 'Friend request accepted' });
        
    } catch (error) {
        console.error('Error creating friend request:', error);

        return res.status(500).json({ message: 'Server error' });
    }
})

router.get('/api/:userId/getFriendReqs', async(req: Request,  res: Response) =>{
    try{
        const {userId} = req.params;

        const user = await User.findOne({ Id: userId });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const outgoingfriendreqs = await User.find(
            { 
                Id: { $in: user.outgoingrequests } , 
                outgoingrequests: {
                    $elemMatch: {
                        requestType: 'friend'
                    }
                }
            }
        );
        const incomingfriendreqs = await User.find(
            { 
                Id: { $in: user.incomingrequests } , 
                incomingrequests: {
                    $elemMatch: {
                        requestType: 'friend'
                    }
                }
            }
        );

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