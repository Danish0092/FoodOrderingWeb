"use client";
import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { AppContext } from "../context/AppContext";
import { showToast } from "../components/CustomToaster";

const Cart = ({ show, setShow }) => {
  const { userData } = useContext(AppContext);

  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
  }, [show]);

  // Update localStorage whenever cart changes
  const updateCart = (newCart) => {
    setCartItems(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const increaseQuantity = (id) => {
    const newCart = cartItems.map((item) =>
      item._id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    updateCart(newCart);
  };

  const decreaseQuantity = (id) => {
    const newCart = cartItems.map((item) =>
      item._id === id
        ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 }
        : item
    );
    updateCart(newCart);
  };

  const removeItem = (id) => {
    const newCart = cartItems.filter((item) => item._id !== id);
    updateCart(newCart);
    showToast("success", "Item removed from cart");
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    // User not logged in
    if (!userData) {
      showToast("error", "Please login to continue");
      setShow(false);
      return;
    }

    // Cart empty
    if (cartItems.length < 1) {
      showToast("error", "Your cart is empty");
      return;
    }

    // All good
    setShow(false);
    window.location.href = "/checkout";
  };

  return (
    <div
      className={`fixed z-40 inset-0 bg-black/40 
      transition-opacity duration-300  
      ${show ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >
      <div
        className={`fixed right-0 top-0 flex flex-col gap-2 justify-between w-full sm:w-1/3 h-full py-8 px-3
        bg-neutral transform transition-transform duration-300
        ${show ? "translate-x-0" : "translate-x-full"}`}
      >
        <i
          className="ri-arrow-right-s-line absolute top-7 text-yellow text-4xl cursor-pointer"
          onClick={() => setShow(false)}
        ></i>

        <p className="w-full text-yellow text-2xl sm:text-4xl text-center font-bold">
          Your Cart
        </p>

        <span className="bg-gray h-0.5 "></span>

        <ul className="p-2 h-2/3 space-y-2 sm:space-y-4 overflow-y-scroll scrollbar-hide">
          {cartItems.length === 0 && (
            <p className="text-white text-center mt-10">
              Your cart is empty
            </p>
          )}

          {cartItems.map((item) => (
            <li
              key={item._id}
              className="grid grid-cols-3 p-2 gap-3 items-center justify-items-center bg-gray"
            >
              <Image
                src={
                  item.mediaRef?.filePath
                    ? `http://localhost:5000${item.mediaRef.filePath}`
                    : "/burger.png"
                }
                alt={item.name}
                width={100}
                height={100}
                className="rounded"
              />

              <div>
                <p className="text-xl leading-none line-clamp-3 font-bold">
                  {item.name}
                </p>
                <p className="text-yellow font-bold">
                  Rs: {item.price * item.quantity}
                </p>
              </div>

              <div className="flex flex-col items-center">
                <div className="flex gap-2">
                  <button
                    onClick={() => decreaseQuantity(item._id)}
                    className="bg-yellow rounded-sm px-1"
                  >
                    <i className="ri-subtract-line text-neutral"></i>
                  </button>
                  <span className="font-bold">{item.quantity}</span>
                  <button
                    onClick={() => increaseQuantity(item._id)}
                    className="bg-yellow rounded-sm px-1"
                  >
                    <i className="ri-add-line text-neutral"></i>
                  </button>
                </div>

                <i
                  onClick={() => removeItem(item._id)}
                  className="ri-delete-bin-3-fill text-yellow text-2xl cursor-pointer mt-2"
                ></i>
              </div>
            </li>
          ))}
        </ul>

        <span className="bg-gray h-0.5 "></span>

        <div className="flex justify-between items-center font-bold text-lg">
          <span>Sub Total</span>
          <span>Rs. {subtotal}</span>
        </div>

        <button
          onClick={handleCheckout}
          className="bg-yellow cursor-pointer w-full font-bold text-lg text-center rounded-sm p-3 mt-2"
        >
          Proceed To Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
