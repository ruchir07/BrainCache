import express from 'express';
import passport from 'passport';
import { generateToken } from '../utils/generateToken';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.get('/google',passport.authenticate('google',{
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
            secure: true,
            sameSite: 'none',
        });
        console.log("✅ Login successful — redirecting to /home");
        res.redirect('https://brain-cache-bay.vercel.app/home');  //This has to be changed to the frontend URL
    }
);

router.get('/profile', (req, res) => {
    if (!req.user) {
        res.status(401).json({ message: 'Not authenticated' });
        return
    }

  const token = jwt.sign(
    { id: (req.user as any)._id },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  );

  res.json({ user: req.user, token });
  return;
});

router.get('/logout',(req,res) =>{
    req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed", error: err });
    }

    res.clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    res.status(200).json({ message: 'Logged out successfully' });
  });
});

export default router;