'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "@/app/components/CustomToaster";

export default function AddCategoryPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      setError(true);
      return;
    }

    setError(false);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });

      if (!res.ok) throw new Error("Failed to save category");
      showToast("success", "Category created successfully!")
      router.push("/categories");
    } catch (err) {
      console.error(err);
      alert("Failed to save category. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Add New Category</h1>

      <div className="space-y-6 w-full">
        <div>
          <label className="block mb-2 text-sm">Category Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); if (error) setError(false); }}
            placeholder="Enter category name"
            className={`w-full bg-black px-4 py-2 rounded-lg border focus:outline-none text-white placeholder-white/50 ${
              error ? "border-red-500" : "border-white/30"
            }`}
          />
          {error && <p className="text-red-500 text-sm mt-1">Name is required</p>}
        </div>

        <div>
          <label className="block mb-2 text-sm">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Enter category description"
            className="w-full bg-black px-4 py-2 rounded-lg border border-white/30 focus:outline-none text-white placeholder-white/50"
          />
        </div>

        <div className="flex gap-4 justify-center mt-4">
          <button
            onClick={handleSave}
            disabled={loading}
            className="border cursor-pointer border-white/30 px-6 py-2 rounded-lg hover:bg-white/10 transition disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Category"}
          </button>

          <button
            onClick={() => router.back()}
            className="border cursor-pointer border-white/30 px-6 py-2 rounded-lg hover:bg-white/10 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
