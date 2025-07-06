import express from 'express';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import connectDB from './config/db';
import dotenv from 'dotenv';
import path from 'path'
import nodeRoutes from './routes/nodeRoutes';
import authRoutes from './routes/authRoutes';
import rateLimit from 'express-rate-limit';
import './config/passport'; 


dotenv.config();
// MongoDB connection
connectDB();
const app = express();

app.set('trust proxy', 1); // ADD THIS!

app.use(session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: true,       
        sameSite: "none"    
    }
}));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes 
});

const allowedOrigins = [
  'https://braincache-frontend.onrender.com', 
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

app.use(cookieParser());
// app.use(limiter); 
app.use(passport.initialize());
app.use(passport.session());


app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use("/api/notes", nodeRoutes);
app.use("/api/auth",authRoutes);

export default app