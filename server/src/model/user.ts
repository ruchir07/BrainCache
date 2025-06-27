import { Schema, model,Document } from 'mongoose';

export interface IUser extends Document {
    googleId: string;
    name: string;
    email: string;
    createdAt: Date;
}

const userSchema = new Schema<IUser>({

    googleId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now }
});

export default model<IUser>('User', userSchema);
