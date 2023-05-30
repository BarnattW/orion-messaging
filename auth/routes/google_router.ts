import passport from 'passport';
import express from 'express';

var router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

router.get('/google/callback', passport.authenticate('google', {
        successRedirect: '/',
        failureRedirect: '/login'
    }), 
    (req, res) => {
        console.log('redirected', req.user)
})

export { router as googleRouter };