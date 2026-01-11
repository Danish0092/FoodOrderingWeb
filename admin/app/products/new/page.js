'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "@/app/components/CustomToaster";

export default function AddProductPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [mediaRef, setMediaRef] = useState("");
  const [categories, setCategories] = useState([]);
  const [mediaItems, setMediaItems] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch categories and media
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/categories");
        if (!res.ok) throw new Error("Failed to fetch categories");
        setCategories(await res.json());
      } catch (err) {
        console.error(err);
      }
    };

    const fetchMedia = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/media");
        if (!res.ok) throw new Error("Failed to fetch media");
        setMediaItems(await res.json());
      } catch (err) {
        console.error(err);
      }
    };

    fetchCategories();
    fetchMedia();
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = true;
    if (!price || isNaN(price) || Number(price) < 0) newErrors.price = true;
    if (!category) newErrors.category = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          price: Number(price),
          category,
          mediaRef: mediaRef || null,
        }),
      });

      showToast("success", "Product created successfully!")
      router.push("/products");
    } catch (err) {
      console.error(err);
      alert("Failed to save product. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Add New Product</h1>

      <div className="space-y-6 px-10 w-full">
        {/* Name */}
        <div className="w-full">
          <label className="block mb-2 text-sm">Product Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full px-4 py-2 rounded-lg border focus:outline-none text-white bg-black placeholder-white/50 ${
              errors.name ? "border-red-500" : "border-white/30"
            }`}
            placeholder="Enter product name"
          />
        </div>

        {/* Description */}
        <div className="w-full">
          <label className="block mb-2 text-sm">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 rounded-lg border border-white/30 focus:outline-none text-white bg-black placeholder-white/50"
            placeholder="Enter description"
          />
        </div>

        {/* Price */}
        <div className="w-full">
          <label className="block mb-2 text-sm">Price *</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={`w-full px-4 py-2 rounded-lg border focus:outline-none text-white bg-black placeholder-white/50 ${
              errors.price ? "border-red-500" : "border-white/30"
            }`}
            placeholder="Enter price"
          />
        </div>

        {/* Category */}
        <div className="w-full">
          <label className="block mb-2 text-sm">Category *</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={`w-full cursor-pointer px-4 py-2 rounded-lg border focus:outline-none text-white bg-black placeholder-white/50 ${
              errors.category ? "border-red-500" : "border-white/30"
            }`}
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Media */}
        <div className="w-full">
          <label className="block cursor-pointer mb-2 text-sm">Choose Image</label>
          <select
            value={mediaRef}
            onChange={(e) => setMediaRef(e.target.value)}
            className="w-full px-4 py-2 cursor-pointer rounded-lg border border-white/30 focus:outline-none text-white bg-black"
          >
            <option value="">No image</option>
            {mediaItems.map((m) => (
              <option key={m._id} value={m._id}>
                {m.originalName} {/* Corrected field */}
              </option>
            ))}
          </select>
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-center mt-4 w-full">
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full cursor-pointer border border-white/30 px-6 py-2 rounded-lg hover:bg-white/10 transition disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Product"}
          </button>

          <button
            onClick={() => router.back()}
            className="w-full border cursor-pointer border-white/30 px-6 py-2 rounded-lg hover:bg-white/10 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
