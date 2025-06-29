import express from 'express';
import passport from 'passport';
import { generateToken } from '../utils/generateToken';

const router = express.Router();

router.get('/google',(req,res,next) => {
    next();  
},passport.authenticate('google',{
    scope: ['profile', 'email'],
}));

router.get('/google/callback',
    passport.authenticate('google', {failureRedirect: '/'}),
    ( req,res) => {
    // On success, redirect to frontend with token (to be added next)
        const user = req.user as any;
        const token = generateToken(user._id);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
        });

        res.redirect('http://localhost:5173/dashboard');  //This has to be changed to the frontend URL
    }
);

router.get('/logout',(req,res) =>{
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
});

export default router;