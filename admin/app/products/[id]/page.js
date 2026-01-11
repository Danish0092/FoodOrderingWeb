'use client';

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { showToast } from "@/app/components/CustomToaster";
import Link from "next/link";

export default function ProductDetailPage() {
  const router = useRouter();
  const { id: productId } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${productId}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleDelete = async () => {

    setDeleting(true);
    try {
      const res = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete product");
      showToast("success", "Product deleted successfully!")
      router.push("/products");
    } catch (err) {
      console.error(err);
      alert("Failed to delete product. Try again.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div className="min-h-screen p-8 text-white">Loading...</div>;

  if (!product) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <button
          onClick={() => router.push("/products")}
          className="mt-4 border border-white/30 px-4 py-2 rounded-lg hover:bg-white/10"
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Product Details</h1>
        <button
          onClick={() => router.push("/products")}
          className="border border-white/30 px-4 py-2 rounded-lg hover:bg-white/10"
        >
          Back
        </button>
      </div>

      <div className="w-full space-y-6">
        <div>
          <label className="block text-sm mb-1 text-white/60">Name</label>
          <div className="border border-white/20 rounded-lg px-4 py-3">{product.name}</div>
        </div>

        <div>
          <label className="block text-sm mb-1 text-white/60">Description</label>
          <div className="border border-white/20 rounded-lg px-4 py-3 text-white/70">{product.description || "—"}</div>
        </div>

        <div>
          <label className="block text-sm mb-1 text-white/60">Price</label>
          <div className="border border-white/20 rounded-lg px-4 py-3">{product.price.toFixed(2)}</div>
        </div>

        <div>
          <label className="block text-sm mb-1 text-white/60">Category</label>
          <div className="border border-white/20 rounded-lg px-4 py-3">{product.category?.name || "—"}</div>
        </div>

        <div>
          <label className="block text-sm mb-1 text-white/60">Image</label>
          {product.mediaRef ? (
            <div className="border border-white/20 rounded-lg px-4 py-3 text-white/70">
              {product.mediaRef.originalName || product.mediaRef.fileName}
            </div>
          ) : (
            <div className="text-white/60">No image</div>
          )}
        </div>
      </div>

      <div className="flex justify-center gap-4 mt-10">
        <Link
          href={`/products/${product._id}/edit`}
          className="border border-white/30 px-6 py-2 rounded-lg hover:bg-white/10 transition"
        >
          Update
        </Link>

        <button
          onClick={handleDelete}
          disabled={deleting}
          className="border cursor-pointer border-white/30 px-6 py-2 rounded-lg hover:bg-white/10 transition disabled:opacity-50"
        >
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
}
