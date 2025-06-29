import { Request,Response,NextFunction } from "express";
import knowledgeItem from "../model/knowledgeItem";
import user from "../model/user";
import { generateEmbeddingText } from "../utils/embedding"; 
export const getAllNotes = async(req: Request, res: Response) => {
    try{
        const userId = (req as any).user?._id; // Assuming user ID is stored in req.user
        const notes = await knowledgeItem.find({ user:userId });
        res.status(200).json(notes);
    }
    catch(error) {
        res.status(500).json({ message: "Error fetching notes", error });
    }
};

export const createNote = async(req: Request, res: Response) => {
    try{
        const userId = (req as any).user?._id; // Assuming user ID is stored in req.user 

        const {type, title, content, tags} = req.body;

        if (!type || !title) {
            res.status(400).json({ message: "Missing required fields: type or title" });
            return;
        }

        console.log("Embedding content:", content);
        const vector = await generateEmbeddingText(content || '');

        const newNote = new knowledgeItem({
            userId,
            type,
            title,
            content,
            tags,
            vector
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
        }
        res.status(200).json({ message: "Note deleted successfully" });
        
    }catch(err){
        res.status(400).json({ error: "Delete failed" });
    }
};