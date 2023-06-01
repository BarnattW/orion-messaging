import { Router, Request, Response, NextFunction } from 'express';

var router = Router();

router.post('/logout', (req: Request, res: Response, next: NextFunction) => {
    try {
        req.logout(function(err: Error) {
            if (err){
                return res.status(500).json({ success: false, message: 'Error during logout'});
            }
        });
        req.session = null as any;
        res.clearCookie('cookie');
        res.clearCookie('jwt');
        res.redirect('/');
    } catch (err){
        console.error(err);
        return res.status(500).json({ success: false, message: 'Internal Server Error'});
    }

});

export { router as logoutRouter }
