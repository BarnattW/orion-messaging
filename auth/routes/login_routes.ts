import passport from 'passport';

import { Router as router } from 'express';
import { User } from "../models/User";

router.get('/google', passport.authenticate('google', { scope: ['profile'] }, undefined));

router.get('/google/callback', passport.authenticate('google', {
    successfulRedirect: '/',
    failureRedirect: '/login'
}), (req, res) => {
    console.log('redirected', req.user)
    console.log(req.isAuthenticated());
    const token = utils.issueJWT(req.user);
    res.cookie('jwt', token.token, {maxAge : 7 * 24 * 60 * 60 * 1000});
    res.redirect('/');
})

export { router as authRouter };