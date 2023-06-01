import mongoose from 'mongoose';
import { User } from '../models/User'
import { Router, Request, Response } from 'express';
import passport from 'passport';

var router = Router();

router.get('/getUserId', passport.authenticate('jwt'), async (req: Request, res: Response) => {
    try {
        // Is there a session?
        if (!req.user){
            return res.status(401).json({ message: "No session"});
        }
        
        return res.status(200).json(req.user.userId);
        
    } catch (e) {
        return res.status(500).json({ message : "Internal Server Error" });
    }
});

export {router as userRouter};