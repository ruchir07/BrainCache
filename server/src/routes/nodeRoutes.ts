import express from 'express';
import {
    getAllNotes,
    createNote,
    createUser,
    updateNote,
    deleteNote
} from '../controllers/noteController';

const router = express.Router();

router.get('/', getAllNotes);
router.post('/', createNote);
router.post('/user', createUser);    
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

export default router;