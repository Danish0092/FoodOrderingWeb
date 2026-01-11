"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import axios from "axios";
import Product from "./Product";
import Item from "./Item";

const Menu = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [show, setShow] = useState(false);
  const [categories, setCategories] = useState([]);
  const [productsData, setProductsData] = useState({});
  const navRef = useRef(null);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/categories");
        
        setCategories(res.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products");
        const products = res.data;
        const grouped = {};

        products.forEach((product) => {
          const catName = product.category?.name || "Others";
          if (!grouped[catName]) grouped[catName] = [];

          const productWithImage = {
            ...product,
            image: `http://localhost:5000/uploads/file-097018979.jpeg`,
          };

          grouped[catName].push(productWithImage);
        });

        setProductsData(grouped);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  // Scroll handling for active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section");
      const scrollPosition = window.scrollY + 160;

      for (const section of sections) {
        const offsetTop = section.offsetTop;
        const offsetBottom = offsetTop + section.offsetHeight;

        if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
          setActiveSection(section.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll active nav link into view
  useEffect(() => {
    if (navRef.current) {
      const activeLink = navRef.current.querySelector(
        `#link-${activeSection}`
      );
      if (activeLink) {
        activeLink.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
      }
    }
  }, [activeSection]);

  return (
    <div>


      {/* Navigation */}
      <nav
        ref={navRef}
        className="sticky top-20 z-10 flex px-4 sm:px-16 bg-neutral-900 h-20"
      >
        <div className="flex gap-8 items-center overflow-x-auto scrollbar-hide">
          {categories.map((cat) => (
            <Link
              id={`link-${cat.name}`}
              key={cat._id}
              href={`#${cat.name}`}
              className={`relative transition-colors duration-300 hover:text-yellow-500 text-lg sm:text-2xl font-bold font-poppins whitespace-nowrap
              ${
                activeSection === cat.name
                  ? "text-yellow-500"
                  : "text-white"
              }`}
            >
              {cat.name}
              {activeSection === cat.name && (
                <motion.div
                  layoutId="underline"
                  className="absolute left-0 -bottom-1 bg-yellow-500 rounded-md w-full h-0.5"
                  transition={{ type: "spring", stiffness: 100, damping: 15 }}
                />
              )}
            </Link>
          ))}
        </div>
      </nav>

      {/* Sections */}
      {categories.map((cat) => {
        const products = productsData[cat.name] || [];
        return (
          <section
            key={cat._id}
            id={cat.name}
            className="bg-neutral-950 pb-20 px-2 sm:px-10 scroll-mt-40"
          >
            <span className="text-white font-bold font-poppins mb-6 text-3xl block">
              {cat.name}
            </span>

            {products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
                {products.map((product) => (
                  <div
                    key={product._id}
                    onClick={() => {
                      setSelectedProduct(product);
                      setShow(true);
                    }}
                  >
                    <Product product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-green text-lg">
                No products available in this category yet.
              </p>
            )}
          </section>
        );
      })}

      {/* Product Modal */}
      <Item
        show={show}
        product={selectedProduct}
        onClose={() => {
          setSelectedProduct(null);
          setShow(false);
        }}
      />
    </div>
  );
};

export default Menu;
