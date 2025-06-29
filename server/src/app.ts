import express from 'express';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import connectDB from './config/db';
import dotenv from 'dotenv';
import nodeRoutes from './routes/nodeRoutes';
import authRoutes from './routes/authRoutes';
import rateLimit from 'express-rate-limit';
import './config/passport'; 


dotenv.config();
// MongoDB connection
connectDB();
const app = express();

app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: true,
}));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes 
});


app.use(cookieParser());
app.use(limiter); 
app.use(passport.initialize());
app.use(passport.session());

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.use('/uploads', express.static('uploads')); 
app.use("/api/notes", nodeRoutes);
app.use("/api/auth",authRoutes);

export default app