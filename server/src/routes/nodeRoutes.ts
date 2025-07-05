import express from 'express';
import { protect } from '../middleware/authMiddleware';
import multer from 'multer';
import { cloudinary } from '../utils/cloudinary';
import { Request,Response } from 'express';
import fs from "fs";

import {
    getAllNotes,
    createNote,
    createUser,
    updateNote,
    deleteNote,
    shareBrain,
    accessBrain
} from '../controllers/noteController';
import { link } from 'fs';

const upload = multer({dest: "temp/"});

const router = express.Router();

router.post("/upload", upload.single("file"), async (req, res):Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "auto", 
      folder: "braincache_uploads",
      use_filename: true,
      unique_filename: false
    });

    fs.unlinkSync(req.file.path); 

    const originalName = req.file.originalname;
    const fileType = req.file.mimetype.split('/').pop();

    res.status(201).json({
      fileUrl: result.secure_url,
      fileType,
      originalName
    });
  } catch (error) {
    console.error("Upload failed:", error);
    res.status(500).json({ message: "Upload failed", error });
    return;
  }
});

router.get('/',protect, getAllNotes);

router.post('/brain/share',protect,shareBrain);

router.get('/brain/:shareLink',accessBrain);

router.post('/',protect, createNote);
router.post('/user', createUser);    
router.put('/:id',protect, updateNote);
router.delete('/:id',protect, deleteNote);

export default router;