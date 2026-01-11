'use client';

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/categories");
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold">Categories</h1>

        <div className="flex gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 sm:w-64 bg-black border border-white/30 px-4 py-2 rounded-lg text-white placeholder-white/50 focus:outline-none"
          />

          <Link
            href="/categories/new"
            className="whitespace-nowrap border border-white/30 px-4 py-2 rounded-lg hover:bg-white/10 transition"
          >
            + Add New
          </Link>
        </div>
      </div>

      {loading ? (
        <p className="text-white/60">Loading categories...</p>
      ) : (
        <>
          <div className="border-b border-white/20 pb-2 mb-3 flex gap-6 text-white/70">
            <div className="w-1/4">Name</div>
            <div className="flex-1">Description</div>
          </div>

          <div className="space-y-2">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((cat) => (
                <Link key={cat._id} href={`/categories/${cat._id}`} className="block w-full">
                  <div className="flex gap-6 border border-white/20 rounded-lg px-4 py-3 hover:bg-white/5 transition">
                    <div className="w-1/4 font-medium">{cat.name}</div>
                    <div className="flex-1 text-white/70 text-sm truncate">{cat.description}</div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-white/60">No categories found.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
  