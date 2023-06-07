import mongoose from "mongoose";
import {User} from '../../models/user'
import { request } from "../../models/request";
import express, {Request, Response} from 'express';

const router = express.Router();

router.post('/api/createUser', async(req: Request,  res: Response) => {
    try{
        const{userId} = req.body;

        const newUser = new User({
            onlineStatus: true,
            userId: userId,
            friends: [],
            incomingrequests: [],
            outgoingrequests: []
        });

        await newUser.save();
        return res.status(201).json(
            { 
                message: 'user ${username} created' ,
                data: newUser
            }
            );
    } catch(error){
        console.error('Error creating user:', error);

        return res.status(500).json({ message: 'Server error' });
    }
});

router.put('/api/onlineStatus', async (req: Request, res: Response) =>{
    try{
        const{userId, newStatus} = req.body;

        const user = await User.findByIdAndUpdate(userId, { onelineStatus: newStatus }, { new: true });
        if (!user){
            return res.status(404).json({message: 'user not found'});
        }
        return res.json(user);
    } catch(error){
        console.error(error);
        return res.status(500).json({message: 'Server error'})
    }
})

export const createUser = router;