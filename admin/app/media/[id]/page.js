'use client';

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { showToast } from "@/app/components/CustomToaster";

export default function MediaDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMedia = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/media/${id}`);
      if (!res.ok) throw new Error("Failed to fetch media");
      setMedia(await res.json());
    } catch (err) {
      console.error(err);
      alert("Failed to load media");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [id]);

  const handleDelete = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/media/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete media");
      showToast("success", "Media deleted successfully!")
      router.push("/media");
    } catch (err) {
      console.error(err);
      alert("Failed to delete media");
    }
  };

  if (loading) return <div className="p-8 text-white">Loading...</div>;
  if (!media) return <div className="p-8 text-white">Media not found</div>;

  return (
    <div className="min-h-screen bg-black text-white p-8 space-y-6">
      <button
        onClick={() => router.push("/media")}
        className="px-4 py-2 border border-white/30 rounded-lg hover:bg-white/10 transition"
      >
        Back to Media
      </button>

      <h1 className="text-3xl font-bold">{media.originalName}</h1>
      <p className="text-white/60">File Name: {media.fileName}</p>
      <p className="text-white/60">Type: {media.mimeType}</p>
      <p className="text-white/60">Size: {(media.size/1024).toFixed(2)} KB</p>
      <p className="text-white/60">Uploaded At: {new Date(media.createdAt).toLocaleString()}</p>

      {media.mimeType.startsWith("image/") && (
        <img
          src={`http://localhost:5000${media.filePath}`}
          alt={media.originalName}
          className="w-64 mt-4 rounded-lg border border-white/30"
        />
      )}

      <button
        onClick={handleDelete}
        className="px-6 py-2 border border-red-500 cursor-pointer text-red-500 rounded-lg hover:bg-red-500/10 transition mt-4"
      >
        Delete Media
      </button>
    </div>
  );
}
