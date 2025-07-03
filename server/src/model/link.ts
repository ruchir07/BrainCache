import mongoose, { Schema, model,Document, Mongoose, Types } from 'mongoose';

export interface ILink{
    hash: string,
    userId: Types.ObjectId
}

const linkSchema = new Schema({
    hash: String,
    userId:{type: mongoose.Types.ObjectId, ref:"User", required:true,unique:true},
});

export default model<ILink>("Links",linkSchema);