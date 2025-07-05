import { useState } from "react";
import {useNoteStore} from "../store/noteStore"
import { toast } from "sonner"

interface AddContentModelProps {
    show: boolean;
    onClose: () => void;
}


const AddContentModel = ({ show, onClose }: AddContentModelProps) => {
  const { addNote } = useNoteStore();
  const [type, setType] = useState<"note" | "file" | "link">("note");
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  if (!show) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const res = await fetch("https://braincache-backend.onrender.com/api/notes/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();
      if (res.ok) {
        setUploadedFileUrl(data.fileUrl);
      } else {
        toast.error("File upload failed");
      }
    } 
    catch (err) {
      console.error("Upload error:", err);
      toast.error("Error uploading file");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload: any = {
      type: formData.get("type"),
      title: formData.get("title"),
      content: formData.get("content"),
      tags: formData.get("tags")?.toString().split(",").map((tag) => tag.trim()),
    };

    if ((type === "file" || type === "link") && uploadedFileUrl) {
      payload.fileUrl = uploadedFileUrl;
    }

    const res = await fetch("https://braincache-backend.onrender.com/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const newNote = await res.json();
      addNote(newNote);
      toast.success("Note Added");
      onClose();
    } else {
       toast.error("Failed to add note");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-[400px]">
        <h2 className="text-xl font-semibold mb-4">Add New Content</h2>

        <form onSubmit={handleSubmit}>
          <select
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            required
            className="w-full mb-2 p-2 border rounded"
          >
            <option value="note">Note</option>
            <option value="link">Link</option>
            <option value="file">File</option>
          </select>

          <input
            name="title"
            placeholder="Title"
            required
            className="w-full mb-2 p-2 border rounded"
          />

          <textarea
            name="content"
            placeholder="Content or description"
            className="w-full mb-2 p-2 border rounded"
          />

          {type === "file" && (
            <div className="mb-4">
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-blue-500 transition"
              >
                <svg
                  className="w-8 h-8 text-gray-400 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16V4m0 0l-4 4m4-4l4 4M17 8v12m0 0l-4-4m4 4l4-4"
                  />
                </svg>
                <span className="text-sm text-gray-600">
                  Click to choose a file (PDF, DOCX, PNG, JPG)
                </span>
                {uploadedFileUrl && (
                  <span className="mt-2 text-xs text-green-600">✅ File uploaded</span>
                )}
                {uploading && (
                  <span className="mt-2 text-xs text-gray-500">Uploading...</span>
                )}
              </label>

              <input
                id="file-upload"
                type="file"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          )}

          {type === "link" && (
            <input
              name="fileUrl"
              placeholder="Paste URL (YouTube, Twitter, etc)"
              className="w-full mb-2 p-2 border rounded"
              onChange={(e) => setUploadedFileUrl(e.target.value)}
            />
          )}

          <input
            name="tags"
            placeholder="Comma-separated tags"
            className="w-full mb-4 p-2 border rounded"
          />

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 bg-gray-200 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddContentModel;
