import express from 'express';
import { upload } from '../middleware/upload';
import { protect } from '../middleware/authMiddleware';
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

const router = express.Router();

router.post('/upload',protect,upload.single('file'),async(req, res):Promise<void> => {
    if (!req.file) {
        res.status(400).json({ message: 'No file uploaded' });
        return;
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    res.status(201).json({ fileUrl });
});

router.get('/',protect, getAllNotes);

router.post('/brain/share',protect,shareBrain);

router.get('/brain/:shareLink',accessBrain);

router.post('/',protect, createNote);
router.post('/user', createUser);    
router.put('/:id',protect, updateNote);
router.delete('/:id',protect, deleteNote);

export default router;