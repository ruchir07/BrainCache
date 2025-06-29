import {create} from 'zustand';

interface Note {
    _id: string;
    title: string;
    content: string;
    tags: string[];
    type: string;
    fileUrl?: string;
}

interface NoteState {
    notes: Note[];
    setNotes: (notes: Note[]) => void;
    addNote: (note: Note) => void;
}

export const useNoteStore = create<NoteState>((set) => ({
    notes: [],
    setNotes: (notes) => set({notes}),
    addNote: (note) => set((state) => ({notes: [note,...state.notes]}))
}));