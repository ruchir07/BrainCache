import { Schema, model, Document,Types } from 'mongoose';
import { z } from 'zod';

export type knowledgeType = 'note' | 'file' | 'link';

export interface IKnowledgeItem extends Document {

    userId: Types.ObjectId;
    type: knowledgeType;
    title: string;
    content: string;
    tags: string[];
    fileUrl?: string;
    vector?: number[];
    createdAt: Date;
    updatedAt: Date;
}

export const knowledgeItemSchema = new Schema<IKnowledgeItem>({
    userId: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    type: { type: String, enum: ['note', 'file', 'link'], required: true },
    title: { type: String, required: true },
    content: { type: String},
    tags: { type: [String], default: [] },
    fileUrl: { type: String },
    vector: { type: [Number] },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

export default model<IKnowledgeItem>('KnowledgeItem', knowledgeItemSchema);

