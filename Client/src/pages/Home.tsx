import { useState, useEffect } from "react";
import NotesHeader from "./NotesHeader"
import NoteCard from "../components/notecard";
import Sidebar from "../components/sidebar";
import { useAuthStore } from "../store/AuthStore";
import { useCategoryStore } from "@/store/categoryStore";


export type NoteType = "all" | "note" | "link" | "file" ;

interface Note {
    userId: string;
    type: NoteType;
    title: string;
    content: string;
    tags: string[];
    fileUrl?: string;
    vector?: number[];
    createdAt: Date;
    updatedAt: Date;
}

const Home = () => {

    const { token } = useAuthStore();
    const [notes, setNotes] = useState<Note[]>([]);
    const { activeCategory } = useCategoryStore();

    useEffect(() => {
        const fetchNotes = async () => {
        const res = await fetch("http://localhost:3000/api/notes", {
            headers: {
                'Authorization': `${token}`
            },
            credentials: "include",
        });

        if(res.ok){
           const data = await res.json();
           setNotes(data); 
        }
        };
        fetchNotes();
    },[token]);

    const filteredNotes = notes.filter((note) => {
        return activeCategory === "all" ? true : note.type === activeCategory;
    });

    return (
    <div className="flex h-screen">
      <div className="w-64 bg-black text-white shadow-md">
        <Sidebar />
      </div>

      <div className="flex-1 bg-white text-black p-6 overflow-y-auto">
        <NotesHeader />
        <h1>
            {filteredNotes.length === 0 ? (<p>No notes found.</p>) : 
            (filteredNotes.map(( note,idx ) => (
                <NoteCard
                    key={idx}
                    userId={note.userId}
                    type={note.type}
                    title={note.title}
                    content={note.content}
                    tags={note.tags}
                    fileUrl={note.fileUrl}
                    createdAt={note.createdAt}
                />
            )))}
        </h1>
      </div>
    </div>
    );

}
export default Home;