'use client';

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { showToast } from "@/app/components/CustomToaster";

export default function EditProductPage() {
  const router = useRouter();
  const { id: productId } = useParams();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [mediaRef, setMediaRef] = useState("");
  const [categories, setCategories] = useState([]);
  const [mediaItems, setMediaItems] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Fetch categories, media, and product details
  useEffect(() => {
    if (!productId) return;

    const fetchData = async () => {
      try {
        const [catRes, mediaRes, prodRes] = await Promise.all([
          fetch("http://localhost:5000/api/categories"),
          fetch("http://localhost:5000/api/media"),
          fetch(`http://localhost:5000/api/products/${productId}`),
        ]);

        if (!catRes.ok || !mediaRes.ok || !prodRes.ok) throw new Error("Failed to fetch data");

        const [catData, mediaData, prodData] = await Promise.all([
          catRes.json(),
          mediaRes.json(),
          prodRes.json(),
        ]);

        setCategories(catData);
        setMediaItems(mediaData);
        setName(prodData.name);
        setDescription(prodData.description || "");
        setPrice(prodData.price);
        setCategory(prodData.category?._id || "");
        setMediaRef(prodData.mediaRef?._id || "");
      } catch (err) {
        console.error(err);
        alert("Failed to load product data");
      } finally {
        setFetching(false);
      }
    };

    fetchData();
  }, [productId]);

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
      const res = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          price: Number(price),
          category,
          mediaRef: mediaRef || null,
        }),
      });

      if (!res.ok) throw new Error("Failed to update product");
      showToast("success", "Product updated successfully!")
      router.push(`/products`);
    } catch (err) {
      console.error(err);
      alert("Failed to update product. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="min-h-screen p-8 text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Edit Product</h1>

      <div className="space-y-6 w-full px-10">
        {/* Name */}
        <div>
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
        <div>
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
        <div>
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
        <div>
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
        <div>
          <label className="block mb-2 text-sm">Choose Image</label>
          <select
            value={mediaRef}
            onChange={(e) => setMediaRef(e.target.value)}
            className="w-full cursor-pointer px-4 py-2 rounded-lg border border-white/30 focus:outline-none text-white bg-black"
          >
            <option value="">No image</option>
            {mediaItems.map((m) => (
              <option key={m._id} value={m._id}>
                {m.originalName} {/* Correct field for display */}
              </option>
            ))}
          </select>

          {/* Optional preview of selected image */}
          {mediaRef && (
            <div className="mt-2">
              <img
                src={`http://localhost:5000/uploads/${
                  mediaItems.find((m) => m._id === mediaRef)?.fileName
                }`}
                alt="Selected Media"
                className="w-32 h-32 object-cover rounded-lg border border-white/30"
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-center mt-4">
          <button
            onClick={handleSave}
            disabled={loading}
            className="border border-white/30 cursor-pointer px-6 py-2 rounded-lg hover:bg-white/10 transition disabled:opacity-50"
          >
            {loading ? "Saving..." : "Update Product"}
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
