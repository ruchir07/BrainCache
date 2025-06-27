import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import connectDB from './config/db';
import dotenv from 'dotenv';
import nodeRoutes from './routes/nodeRoutes';


dotenv.config();
// MongoDB connection
connectDB();

const app = express();
app.use(cors());
app.use(express.json());


app.use("/api/notes", nodeRoutes);

// app.use("/api/auth",authRoutes);

export default app