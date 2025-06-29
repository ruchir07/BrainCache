import { useNoteStore } from "../store/noteStore";
import { useEffect } from "react";

const Dashboard = () => {
    const { notes, setNotes, addNote } = useNoteStore();

    useEffect(() => {
        const fetchNotes = async() =>{
            const res = await fetch("http://localhost:3000/api/notes", {
                credentials: "include"
            });
            if(res.ok){
                const data = await res.json();
                setNotes(data.notes);
            };
        }
        fetchNotes();
    },[]);

    return (
    <div>
      {notes.map((note) => (
        <div key={note._id}>{note.title}</div>
      ))}
    </div>
     );
};

export default Dashboard;