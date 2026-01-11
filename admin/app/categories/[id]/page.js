'use client';

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { showToast } from "@/app/components/CustomToaster";

export default function CategoryDetailPage() {
  const router = useRouter();
  const { id: categoryId } = useParams();

  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false); // track delete state

  useEffect(() => {
    if (!categoryId) return;

    const fetchCategory = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/categories/${categoryId}`);
        if (!res.ok) throw new Error("Category not found");
        const data = await res.json();
        setCategory(data);
      } catch (err) {
        setCategory(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [categoryId]);

  const handleDelete = async () => {

    setDeleting(true);
    try {
      const res = await fetch(`http://localhost:5000/api/categories/${categoryId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete category");
      showToast("success", "Category deleted successfully!")
      router.push("/categories"); // redirect after delete
    } catch (err) {
      console.error(err);
      alert("Failed to delete category. Try again.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div className="min-h-screen p-8 text-white">Loading...</div>;

  if (!category) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <h1 className="text-2xl font-bold">Category not found</h1>
        <button
          onClick={() => router.push("/categories")}
          className="mt-4 border border-white/30 px-4 py-2 rounded-lg hover:bg-white/10"
        >
          Back to Categories
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Category Details</h1>
        <button
          onClick={() => router.push("/categories")}
          className="border border-white/30 px-4 py-2 rounded-lg hover:bg-white/10"
        >
          Back
        </button>
      </div>

      <div className="w-full space-y-6">
        <div>
          <label className="block text-sm mb-1 text-white/60">Name</label>
          <div className="border border-white/20 rounded-lg px-4 py-3">{category.name}</div>
        </div>

        <div>
          <label className="block text-sm mb-1 text-white/60">Description</label>
          <div className="border border-white/20 rounded-lg px-4 py-3 text-white/70">
            {category.description || "—"}
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4 mt-10">
        <Link
          href={`/categories/${category._id}/edit`}
          className="border border-white/30 px-6 py-2 rounded-lg hover:bg-white/10 transition"
        >
          Update
        </Link>

        <button
          onClick={handleDelete}
          disabled={deleting}
          className="border border-white/30 cursor-pointer   px-6 py-2 rounded-lg hover:bg-white/10 transition disabled:opacity-50"
        >
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
}
