import { Request,Response,NextFunction } from "express";
import knowledgeItem from "../model/knowledgeItem";
import mongoose from "mongoose";
import user from "../model/user";
import link from "../model/link";
import { generateEmbeddingText } from "../utils/embedding"; 
import {random} from "../utils/generateLink";

export const getAllNotes = async(req: Request, res: Response) => {
    try{
        const userId = (req as any).user?._id; 

        const notes = await knowledgeItem.find({
            userId: new mongoose.Types.ObjectId(userId)
        });

        // const notes = await knowledgeItem.find({ user:userId });

        res.status(200).json(notes);
    }
    catch(error) {
        res.status(500).json({ message: "Error fetching notes", error });
    }
};

export const createNote = async(req: Request, res: Response) => {
    try{
        const userId = (req as any).user?._id; // Assuming user ID is stored in req.user 

        const {type, title, content, tags,fileUrl} = req.body;

        const newNote = new knowledgeItem({
            userId,
            type,
            title,
            content,
            tags,
            fileUrl
        });
        const savedNote = await newNote.save();
        res.status(201).json(savedNote);
    }catch(error) {
        res.status(400).json({ message: "Invalid Data", error });
    }
};

export const createUser = async(req: Request, res: Response) => {
    try{
        const newUser = new user(req.body);
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    }catch(error) {
        res.status(400).json({ message: "Invalid Data", error });
    }
};

export const updateNote = async(req: Request, res: Response):Promise<void> => {
    try{
        const updated = await knowledgeItem.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true,}
        );
        if(!updated){
            res.status(404).json({ message: "Note not found" });
        }
        res.status(200).json(updated);
    }
    catch(err) {
        res.status(400).json({ error: "Error updating note"});
    }
};

export const deleteNote = async(req: Request, res: Response):Promise<void> => {
    try{
        const deleted = await knowledgeItem.findByIdAndDelete(req.params.id);
        if(!deleted){
            res.status(404).json({ message: "Note not found" });
            return;
        }
        res.status(200).json({ message: "Note deleted successfully" });
        
    }catch(err){
        res.status(400).json({ error: "Delete failed" });
    }
};

export const shareBrain = async(req:Request,res:Response):Promise<void> => {
    try{
        const share = req.body.share;
        if(share){

            let existing = await link.findOne({userId: req.user});

            if(!existing){
                const newLink = await link.create({
                    userId: req.user,
                    hash: random(10),
                });
                existing = newLink
            }

            res.json({
                message:"Link create",
                shareUrl:`https://braincache-frontend.onrender.com/shared/${existing.hash}`
            })
        }else{
            const deleting = await link.deleteOne({
                userId: req.user
            });
            if(deleting){
                res.status(200).json({
                    message: "Link Deleted Successfully"
                });
                return;
            }
        }
    }
    catch(error){
        res.status(201).json("Error Creating Link:" + error);
    }
}

export const accessBrain = async(req:Request,res:Response):Promise<void> =>{

    const hash = req.params.shareLink;
    const links = await link.findOne({
        hash
    });

    if(!links){
        res.status(411).json({
            message: "Sorry incorrect input"
        });
        return;
    }

    //userId
    const content = await knowledgeItem.find({
        userId: links.userId
    });

    const per = await user.findOne({
        _id: links.userId
    });

    if(!per){
        res.status(411).json({
            message:"user not found,"
        });
        return;
    }

    res.json({
        username: per.email,
        notes: content
    })

}