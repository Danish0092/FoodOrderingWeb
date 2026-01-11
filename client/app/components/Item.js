"use client";
import React, { useState } from "react";
import Image from "next/image";
import { showToast } from "@/app/components/CustomToaster";

export default function Item({ show, product, onClose }) {
  const [quantity, setQuantity] = useState(1);

  const addToCart = () => {
    if (!product) return;

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingIndex = cart.findIndex((p) => p._id === product._id);

    if (existingIndex !== -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    showToast("success", `${product.name} added to cart!`);
    setQuantity(1);
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center 
        bg-neutral/40 z-40 backdrop-blur-xs 
        transition-opacity duration-300 ease-out
        ${show ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >
      <section
        className={`relative bg-gray sm:w-2/3 w-full p-4 rounded-sm
          transform transition-all duration-300 ease-out
          ${
            show
              ? "scale-100 translate-y-0 opacity-100"
              : "scale-95 translate-y-4 opacity-0"
          }`}
      >
        <button
          onClick={onClose}
          className="absolute flex items-center justify-center top-4 right-4 
            w-8 h-8 bg-transparent hover:bg-red 
            rounded-full border-2 border-red transition-colors cursor-pointer"
        >
          <i className="ri-close-line text-2xl font-medium"></i>
        </button>

        {product && (
          <div className="grid grid-cols-1 md:grid-cols-2 justify-items-center gap-6 items-center">
            <Image
              src={
                product?.mediaRef?.filePath
                  ? `http://localhost:5000${product.mediaRef.filePath}`
                  : "/burger.png"
              }
              alt={product.name}
              width={300}
              height={300}
              className="object-cover rounded-xl"
              priority
            />

            <div className="flex flex-col gap-4 items-center justify-center">
              <h1 className="text-3xl font-bold text-yellow">
                {product.name}
              </h1>
              <p className="text-center">{product.description}</p>
              <p className="text-2xl font-bold">Rs. {product.price}</p>

              <div className="flex gap-2 text-2xl">
                <button
                  onClick={() =>
                    setQuantity(quantity > 1 ? quantity - 1 : 1)
                  }
                  className="bg-yellow rounded-sm px-1"
                >
                  <i className="ri-subtract-line text-neutral"></i>
                </button>
                <span className="font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="bg-yellow rounded-sm px-1"
                >
                  <i className="ri-add-line text-neutral"></i>
                </button>
              </div>

              <button
                onClick={addToCart}
                className="bg-yellow-500 w-full hover:bg-yellow-600 text-black font-semibold px-6 py-3 rounded-lg shadow-md transition cursor-pointer"
              >
                Add to Cart
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
