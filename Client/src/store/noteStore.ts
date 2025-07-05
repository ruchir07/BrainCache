import {create} from 'zustand';

type NoteType = "all" | "note" | "link" | "file" ;

interface Note {
    _id: string;
    userId: string;
    title: string;
    content: string;
    tags: string[];
    type: NoteType;
    fileUrl?: string;
    fileType?: string;
    createdAt: Date;
    updatedAt: Date;
}

interface NoteState {
    notes: Note[];
    setNotes: (notes: Note[]) => void;
    addNote: (note: Note) => void;
    deleteNote: (id: string) => void;
}

export const useNoteStore = create<NoteState>((set) => ({
    notes: [],
    setNotes: (notes: Note[]) => set({notes}),
    addNote: (note: Note) => set((state) => ({notes: [note,...state.notes]})),
    deleteNote: (id) =>
        set((state) => ({notes: state.notes.filter((n) => n._id !== id)}))
}));