import mongoose from 'mongoose';
import { User } from '../models/User'
import { Router, Request, Response } from 'express';

var router = Router();

router.get('/getUser/:id', async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            res.status(404).json({ success: false , message: 'User not found' });
        }
        
        return res.status(200).json({ user });
    } catch (e) {
        return res.status(500).json({ message : "Error" });
    }
});

export {router as userRouter};