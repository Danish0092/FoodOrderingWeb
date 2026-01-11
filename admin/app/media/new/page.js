'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "@/app/components/CustomToaster";

export default function AddMediaPage() {
  const router = useRouter();

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file); 

      const res = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to upload media");
      }

      showToast("success", "Media uploaded successfully!")
      router.push("/media");
    } catch (err) {
      console.error(err);
      setError("Failed to upload media");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Upload Media</h1>

      <div className="max-w-xl space-y-6">
        <div className="w-full">
          <label className="block mb-2 text-sm">Choose File *</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className={`w-full px-4 cursor-pointer py-2 rounded-lg border bg-black text-white focus:outline-none
              ${error ? "border-red-500" : "border-white/30"}`}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleUpload}
            disabled={loading}
            className="w-full border cursor-pointer border-white/30 px-6 py-2 rounded-lg hover:bg-white/10 transition disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>

          <button
            onClick={() => router.back()}
            className="w-full cursor-pointer border border-white/30 px-6 py-2 rounded-lg hover:bg-white/10 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
