import { Share2 } from 'lucide-react';
import AddContentModel from "../components/AddContent"
import ShareLinkPopup from '../components/ShareLinkPopUp'
import { usePopupStore } from "../store/popupStore"
import { useState } from 'react';


const NotesHeader = () => {
  const [showModel, setShowModel] = useState(false);

  // ✅ Zustand store usage should be here
  const { showPopup, link, setShowPopup, setLink } = usePopupStore();

  const handleShareBrain = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/notes/brain/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ share: true }),
      });

      const data = await res.json();

      if (res.ok ) {
        setLink(data.shareUrl);
        setShowPopup(true);
      } else {
        alert("Failed to create share link");
      }
    } catch (err) {
      console.error("Error sharing brain:", err);
      alert("Something went wrong");
    }
  };

  return (
    <>
      <div className="flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold text-gray-900">All Notes</h1>

        <div className="flex space-x-4">
          <button
            onClick={handleShareBrain}
            className="flex items-center gap-x-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition"
          >
            <Share2 className="h-4 w-4" />
            <span>Share Brain</span>
          </button>

          <button
            onClick={() => setShowModel(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          >
            + Add Content
          </button>
        </div>

        {showPopup && (
          <ShareLinkPopup />
        )}
      </div>

      <AddContentModel show={showModel} onClose={() => setShowModel(false)} />
    </>
  );
};

export default NotesHeader;

