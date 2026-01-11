"use client";
import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import CustomToaster, { showToast } from "@/app/components/CustomToaster";
import { AppContext } from "../context/AppContext";

export default function CheckoutPage() {
  const { userData} = useContext(AppContext);
  const router = useRouter();

  const [cartItems, setCartItems] = useState([]);
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");



  // 🛒 Load cart
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(savedCart);
  }, []);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const deliveryCharges = 150;
  const total = subtotal + deliveryCharges;

  const handleOrder = async (e) => {
    e.preventDefault();

    if (!street || !city || !country) {
      showToast("error", "Please fill all required fields");
      return;
    }

    if (cartItems.length === 0) {
      showToast("error", "Your cart is empty");
      return;
    }

    if (!userData?.email) {
      showToast("error", "User email not found");
      return;
    }

    const orderData = {
      userEmail: userData.email,
      items: cartItems.map((item) => ({
        product: item._id,
        quantity: item.quantity,
        priceAtPurchase: item.price,
      })),
      totalAmount: total,
      shippingAddress: {
        street,
        city,
        country,
      },
    };

    try {
      const res = await axios.post(
        "http://localhost:5000/api/orders",
        orderData,
        { withCredentials: true }
      );

      showToast("success", "Order placed successfully 🎉");

      localStorage.removeItem("cart");
      setCartItems([]);

      setTimeout(() => router.push("/"), 2000);
    } catch (error) {
      showToast(
        "error",
        error.response?.data?.message || "Failed to place order"
      );
    }
  };

  return (
    <>
      <CustomToaster />
      <div className="min-h-screen bg-gray flex flex-col items-center justify-center mt-10 py-10 px-4">
        <div className="w-full md:w-2/3 bg-neutral shadow-lg rounded-2xl p-6 sm:p-8 grid sm:grid-cols-2 gap-8">

          {/* ORDER SUMMARY */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-yellow text-center">
              Order Summary
            </h2>

            <div className="space-y-4 max-h-72 overflow-y-auto pr-2 scrollbar-hide">
              {cartItems.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-gray rounded-lg p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 relative">
                      <Image
                        src={
                          item?.mediaRef?.filePath
                            ? `http://localhost:5000${item.mediaRef.filePath}`
                            : "/burger.png"
                        }
                        alt={item.name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-yellow-600 font-bold text-sm">
                        Rs {item.price}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold">x{item.quantity}</span>
                </div>
              ))}
            </div>

            {/* TOTAL */}
            <div className="mt-6 border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rs {subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span>Rs {deliveryCharges}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold border-t pt-3">
                <span className="text-yellow-600">Total</span>
                <span className="text-yellow-600">Rs {total}</span>
              </div>
            </div>
          </div>

          {/* CONTACT & DELIVERY */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-yellow text-center">
              Contact & Delivery
            </h2>

            <form onSubmit={handleOrder} className="space-y-4">
              {/* EMAIL (READ ONLY) */}
              <input
                type="email"
                value={userData?.email || ""}
                readOnly
                className="w-full p-3 rounded-md bg-gray opacity-70 cursor-not-allowed"
              />

              <input
                type="text"
                placeholder="City*"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="w-full p-3 rounded-md bg-gray"
              />
              <input
                type="text"
                placeholder="Street*"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-3 rounded-md bg-gray"
              />
              <input
                type="text"
                placeholder="House*"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full p-3 rounded-md bg-gray"
              />

              <button
                type="submit"
                className="bg-yellow cursor-pointer w-full font-bold text-lg rounded-sm p-3"
              >
                Confirm Order
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
