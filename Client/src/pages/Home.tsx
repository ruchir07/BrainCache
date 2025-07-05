import { useEffect } from "react";
import NotesHeader from "./NotesHeader"
import NoteCard from "../components/notecard";
import Sidebar from "../components/sidebar";
import { useAuthStore } from "../store/AuthStore";
import { useCategoryStore } from "@/store/categoryStore";
import { useNavigate } from "react-router-dom";
import { useNoteStore } from "@/store/noteStore";


export type NoteType = "all" | "note" | "link" | "file" ;



const Home = () => {

    const { token } = useAuthStore();
    const notes = useNoteStore((state) => state.notes);
    const setNotes = useNoteStore((state) => state.setNotes);
    const { activeCategory } = useCategoryStore();
    const { user } = useAuthStore();
    const navigate = useNavigate();


    useEffect(() => {
        if (!user) {
        navigate("/login", { replace: true });
        }
    }, [user]);


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
            (filteredNotes.map(( note ) => (
                <NoteCard key={note._id} {...note} />
            )))}
        </h1>
      </div>
    </div>
    );

}
export default Home;