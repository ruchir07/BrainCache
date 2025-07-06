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

app.use(cors(
  {
    origin: ["https://brain-cache-alpha.vercel.app"],
    methods: ["POST","GET","DELETE"],
    credentials: true
  }
));

app.set('trust proxy', 1); // ADD THIS!

app.use(session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
        httpOnly: true,
        secure: true,       
        sameSite: "none"    
    }
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
