'use client';

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { showToast } from "@/app/components/CustomToaster";

export default function UpdateCategoryPage() {
  const router = useRouter();
  const { id: categoryId } = useParams();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!categoryId) return;

    const fetchCategory = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/categories/${categoryId}`);
        if (!res.ok) throw new Error("Failed to fetch category");
        const data = await res.json();
        setName(data.name);
        setDescription(data.description || "");
      } catch (err) {
        console.error(err);
        alert("Failed to load category");
      }
    };

    fetchCategory();
  }, [categoryId]);

  const handleSave = async () => {
    if (!name.trim()) {
      setError(true);
      return;
    }

    setError(false);
    setLoading(true);

    try {
      const res = await fetch(`http://localhost:5000/api/categories/${categoryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });

      if (!res.ok) throw new Error("Failed to update category");
      showToast("success", "Category updated successfully!")
      router.push(`/categories`);
    } catch (err) {
      console.error(err);
      alert("Failed to update category. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Update Category</h1>

      <div className="space-y-6 w-full">
        <div>
          <label className="block mb-2 text-sm">Category Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); if (error) setError(false); }}
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
            className="w-full bg-black px-4 py-2 rounded-lg border border-white/30 focus:outline-none text-white placeholder-white/50"
          />
        </div>

        <div className="flex gap-4 justify-center mt-4">
          <button
            onClick={handleSave}
            disabled={loading}
            className="border cursor-pointer border-white/30 px-6 py-2 rounded-lg hover:bg-white/10 transition disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
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
