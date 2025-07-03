import { useEffect,useState } from "react";
import { useParams } from "react-router-dom";
import NoteCard from "../components/notecard";
import { Loader2 } from "lucide-react";

export type NoteType = "all" | "note" | "file" | "link";

interface INote {
    _id: string;
    userId: string;
    type: NoteType
    title: string;
    content: string;
    tags: string[];
    fileUrl?: string;
    vector?: number[];
    createdAt: Date;
}

const SharedNotes = () => {
    const { hash } = useParams();
    const [notes,setNotes] = useState<INote[]>([]);
    const [owner, setOwner] = useState<string>("");
    const [sortBy,setSortBy] = useState<'date' | 'type'>("date");
    const [loading,setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchSharedNotes = async() => {
            const res = await fetch(`http://localhost:3000/api/notes/brain/${hash}`);
            const data = await res.json();
            console.log("🔗 Shared notes response:", data);
            if(res.ok){
                setNotes(Array.isArray(data.notes) ? data.notes : []);
            }
        };
        fetchSharedNotes();
    },[hash]);

    const sortedNotes = [...notes].sort((a,b) => {
        if(sortBy === 'date'){
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        else{
            return a.type.localeCompare(b.type);
        }
    });

    return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              🧠 {owner ? `${owner}'s Shared Brain` : "Shared Brain"}
            </h1>
            <p className="text-sm text-gray-500">Accessed via public link</p>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm font-bold text-gray-700">
              Sort by:
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1 rounded border text-sm"
            >
              <option value="date">Newest First</option>
              <option value="type">Type</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12 text-gray-500">
            <Loader2 className="animate-spin h-6 w-6 mr-2" />
            Loading shared notes...
          </div>
        ) : sortedNotes.length === 0 ? (
          <div className="text-center text-gray-500 italic mt-20">
            No shared notes available.
          </div>
        ) : (
          <div className="space-y-6">
            {sortedNotes.map((note) => (
              <NoteCard key={note._id} {...note} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SharedNotes;