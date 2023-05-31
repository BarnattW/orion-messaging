import passport from 'passport';
import { Router, Request, Response } from 'express';

var router = Router();

router.get('/google', function(req: Request, res: Response, next: Function) {
    passport.authenticate('google', { scope: ['profile'] }, function(req: Request, res: Response, err: Error){
        if (err) {
            return next(err);
        }

        if (!req.user) {
            return res.status(401).json({
                success : false,  message : 'Google Authentication Failed' });
        }

        req.login(req.user, loginErr => {
            if (loginErr){
                return next(loginErr)
            }

            return res.status(200).json({ 
                success : true, message : 'Google Authenticated'});
        })
    }) (req, res, next);
});


router.get('/google/callback', passport.authenticate('google', 
    {
        successRedirect: '/',
        failureRedirect: '/login'
    }), 
    
    (req: Request, res: Response) => {
        res.status(200).json(
            req.user
        );
    }
);

export { router as googleRouter };