import { useState } from "react";
import {useNoteStore} from "../store/noteStore"

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
      const res = await fetch("http://localhost:3000/api/notes/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();
      if (res.ok) {
        setUploadedFileUrl(data.fileUrl);
      } else {
        alert("File upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed");
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

    const res = await fetch("http://localhost:3000/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const newNote = await res.json();
      addNote(newNote);
      onClose();
    } else {
      alert("Failed to add note");
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
            <>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                onChange={handleFileChange}
                className="mb-2"
              />
              {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
              {uploadedFileUrl && (
                <p className="text-sm text-green-600">✅ File uploaded</p>
              )}
            </>
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