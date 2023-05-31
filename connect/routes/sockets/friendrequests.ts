import mongoose from "mongoose";
import {User} from '../../models/user'
import { request } from "../../models/request";
import express, {Request, Response} from 'express';
import {Server, Socket} from 'socket.io';

export const sendFriendRequest = (socket: Socket) =>{
    socket.on('sendFriendRequest', async (senderUsername: string, receiverUsername: string, requestType: string) =>{
        try {
        
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
                socket.emit('requestError', { message: 'Sender or receiver not found' });
                console.log("sender or receiver cannot be found");
                return;
            }
        
            const newRequest = new request({
                senderId: sender._id,
                receiverId: receiver._id,
                requestType: requestType,
                status: 'pending'
            });
        
            await newRequest.save();
    
            sender.outgoingrequests.push(newRequest._id);
            await sender.save();
    
            receiver.incomingrequests.push(newRequest._id);
            await receiver.save();
        
            socket.emit('requestSent', 
                { 
                    message: '${requestType} request created',
                    data: newRequest
                }
            );
    
            
        } catch (error) {
            console.error('Error creating friend request:', error);
    
            socket.emit('requestError', { message: 'Server error' });
        }
    
    }
);

};