import mongoose from "mongoose";
import {User} from '../../models/user'
import { request } from "../../models/request";
import express, {Request, Response} from 'express';
import { publishMessage } from "./kafkaproducer";

const router = express.Router();


    

export const sendRequest = async (req: Request,  res: Response, requestType: String) =>{
    try {
        const {senderUsername, receiverUsername} = req.body;
    
        const sender = await User.findOne(
            {
                username: senderUsername
            }
        );
        const receiver = await User.findOne(
            {
                username: receiverUsername
            }
        );

        if (!sender|| !receiver) {
            return res.status(404).json({ message: 'Sender or receiver not found' });
        }
    
        const newRequest = new request({
            senderId: sender._id,
            receiverId: receiver._id,
            requestType: requestType,
            status: 'pending'
        });
    
        await newRequest.save();

        await publishMessage('${requestType}', newRequest);

        sender.outgoingrequests.push(newRequest._id);
        await sender.save();

        receiver.incomingrequests.push(newRequest._id);
        await receiver.save();
    
        return res.status(201).json(
            { 
                message: '${requestType} request created' ,
                data: newRequest
            }
            );
        
    } catch (error) {
        console.error('Error creating ${requestType} request:', error);

        return res.status(500).json({ message: 'Server error' });
    }

}

router.post('/api/sendFriendRequest', (req: Request, res: Response) =>
  sendRequest(req, res, 'friend'));

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

        //publish to kafka
        await publishMessage('Friend request accepted', receiver.friends);

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

export const getRequest = async(req: Request,  res: Response, requestType: String) =>{
    try{
        const {userId} = req.params;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const outgoingreqs = await User.find(
            { 
                Id: { $in: user.outgoingrequests } , 
                outgoingrequests: {
                    $elemMatch: {
                        requestType: requestType
                    }
                }
            }
        );
        const incomingreqs = await User.find(
            { 
                Id: { $in: user.incomingrequests } , 
                incomingrequests: {
                    $elemMatch: {
                        requestType: requestType
                    }
                }
            }
        );

        return res.status(200).json(
            { 
                outgoing: outgoingreqs ,
                incoming: incomingreqs
            }
        );
    } catch(error){
        console.error('Error fetching friend requests:', error);

        return res.status(500).json({message: 'Server error'});
    }
}
router.get('/api/:userId/getFriendReqs', (req: Request, res: Response) =>
getRequest(req, res, 'friend'));

export const friendRequests = router;