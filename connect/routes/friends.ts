import mongoose from "mongoose";
import {User} from '../models/user'
import { request } from "../models/request";
import express, {Request, Response} from 'express';

const router = express.Router();

router.delete('/api/removeFriend/:userID/:friendID', async (req, res) =>{
    try{
        const{userID, friendID} = req.params;

        const user = await User.findById(userID);
        const friend = await User.findById(friendID);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const friendIndex = user.friends.findIndex((friend) => friend.toString() === friendID);

        if (friendIndex === -1) {
            return res.status(404).json({ message: 'Friend not found in ${user}\'s friends list' });
        }

        user.friends.splice(friendIndex, 1);
        await user.save();

        return res.status(200).json({ message: 'Friend removed successfully' });

    } catch (error) {
        console.error('Error removing friend:', error);
        return res.status(500).json({ message: 'Server error' });
    }
})


router.get('/api/getFriends/:userID', async (req, res) =>{
    try{
        const {userID} = req.params;
        const user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const friends = await User.find({ _id: { $in: user.friends } });

        return res.status(200).json({ friends });
    } catch (error) {
        console.error('Error getting friends:', error);

        return res.status(500).json({ message: 'Server error' });
  }

})



export const friends = router;