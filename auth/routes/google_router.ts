import passport from 'passport';
import { Router, Request, Response } from 'express';
import { issueJWT } from '../lib/utils';

var router = Router();

router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

router.get('/google/callback', passport.authenticate('google'), function(req: Request, res: Response){
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false, message: 'Google Authentication Failed' });
            }
    
            const token = issueJWT(req.user);      
            res.cookie('jwt', token.token, { maxAge : 7 * 24 * 60 * 60 * 1000 });

            res.redirect("/dashboard/friends/m");
        } catch (e) {
            return res.status(500).json({ success: false, message: 'Internal Server Error'});
        }
    }
);

export { router as googleRouter };