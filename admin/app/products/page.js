'use client';

import { useState, useEffect } from "react";
import Link from "next/link";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold">Products</h1>

        <div className="flex gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 sm:w-64 bg-black border border-white/30 px-4 py-2 rounded-lg text-white placeholder-white/50 focus:outline-none"
          />

          <Link
            href="/products/new"
            className="whitespace-nowrap border border-white/30 px-4 py-2 rounded-lg hover:bg-white/10 transition"
          >
            + Add New
          </Link>
        </div>
      </div>

      {loading ? (
        <p className="text-white/60">Loading products...</p>
      ) : (
        <>
          <div className="border-b border-white/20 pb-2 mb-3 flex gap-6 text-white/70">
            <div className="w-1/4">Name</div>
            <div className="flex-1">Description</div>
            <div className="w-1/6">Price</div>
          </div>

          <div className="space-y-2">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((p) => (
                <Link key={p._id} href={`/products/${p._id}`} className="block w-full">
                  <div className="flex gap-6 border border-white/20 rounded-lg px-4 py-3 hover:bg-white/5 transition">
                    <div className="w-1/4 font-medium">{p.name}</div>
                    <div className="flex-1 text-white/70 text-sm truncate">{p.description}</div>
                    <div className="w-1/6">{p.price.toFixed(2)}</div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-white/60">No products found.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
