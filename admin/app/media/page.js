'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { showToast } from "../components/CustomToaster";

export default function MediaPage() {
  const [mediaList, setMediaList] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchMedia = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/media");
      if (!res.ok) throw new Error("Failed to fetch media");
      setMediaList(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleDelete = async (id) => {

    try {
      const res = await fetch(`http://localhost:5000/api/media/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete media");

      setMediaList((prev) => prev.filter((m) => m._id !== id));
      showToast("success", "Media deleted successfully!")
    } catch (err) {
      console.error(err);
      alert("Failed to delete media");
    }
  };

  const filteredMedia = mediaList.filter((m) =>
    m.originalName.toLowerCase().includes(search.toLowerCase()) ||
    m.mimeType.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold">Media Library</h1>

        <div className="flex gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search media..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 sm:w-64 bg-black border border-white/30 px-4 py-2 rounded-lg text-white placeholder-white/50 focus:outline-none"
          />

          <Link
            href="/media/new"
            className="whitespace-nowrap border border-white/30 px-4 py-2 rounded-lg hover:bg-white/10 transition"
          >
            + Add New
          </Link>
        </div>
      </div>

      {loading ? (
        <p className="text-white/60">Loading media...</p>
      ) : (
        <>
          {/* Table header */}
          <div className="border-b border-white/20 pb-2 mb-3 flex gap-6 text-white/70">
            <div className="flex-1">File</div>
            <div className="w-40">Type</div>
            <div className="w-32">Size</div>
            <div className="w-40 text-right">Actions</div>
          </div>

          {/* Media list */}
          <div className="space-y-2">
            {filteredMedia.length > 0 ? (
              filteredMedia.map((m) => (
                <div
                  key={m._id}
                  className="flex gap-6 items-center border border-white/20 rounded-lg px-4 py-3"
                >
                  <div className="flex-1">
                    <p className="font-medium">{m.originalName}</p>
                    <p className="text-xs text-white/50">
                      {new Date(m.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="w-40 text-sm text-white/70">
                    {m.mimeType}
                  </div>

                  <div className="w-32 text-sm text-white/70">
                    {(m.size / 1024).toFixed(2)} KB
                  </div>

                  <div className="w-40 flex justify-end gap-2">
                    <Link
                      href={`/media/${m._id}`}
                      className="px-3 py-1 border border-white/30 rounded-lg hover:bg-white/10 transition"
                    >
                      View
                    </Link>

                    <button
                      onClick={() => handleDelete(m._id)}
                      className="px-3 py-1 cursor-pointer border border-red-500 rounded-lg text-red-500 hover:bg-red-500/10 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-white/60">No media found.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
