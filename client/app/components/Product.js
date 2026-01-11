"use client";
import React from "react";
import Image from "next/image";

const Product = ({ product }) => {
    return (
        <div className="bg-neutral-800 relative rounded-md cursor-pointer p-2">
            <div className="flex h-50 sm:h-70 items-center justify-center">
                <Image
                    width={250}
                    height={250}
                    
                    src={`http://localhost:5000${product.mediaRef.filePath}`}
                    alt={product.name}
                    loading="lazy"
                    className="object-cover"
                />
            </div>

            <div className="px-2 h-36">
                <p className="text-yellow text-lg sm:text-xl font-bold">
                    {product.name}
                </p>
                <p className="text-sm line-clamp-2 my-2">
                    {product.description}
                </p>
                <p className="text-yellow text-xl sm:text-2xl font-bold">
                    Rs. {product.price}
                </p>
            </div>

            <button className="absolute left-1/2 flex w-4/5 sm:w-3/4 items-center justify-center font-bold font-poppins -bottom-4 -translate-x-1/2 bg-red-500 text-white hover:text-red-500 hover:bg-white gap-1 px-1 py-2 rounded transition duration-500 hover:outline hover:outline-1 outline-red-500 cursor-pointer">
                <span className="text-sm">ADD TO CART</span>
            </button>
        </div>
    );
};

export default Product;