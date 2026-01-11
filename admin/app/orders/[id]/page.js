'use client';

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { showToast } from "@/app/components/CustomToaster";

export default function OrderDetailPage() {
  const router = useRouter();
  const { id: orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/orders/${orderId}`);
        if (!res.ok) throw new Error("Failed to fetch order");
        const data = await res.json();
        setOrder(data);
        setStatus(data.status);
      } catch (err) {
        console.error(err);
        alert("Failed to load order");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handleStatusChange = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to update status");
      }

      const data = await res.json();
      setOrder(data);
      showToast("success",  `Order ${status} successfully!`)
      router.push("/orders")
    } catch (err) {
      console.error(err);
      alert("Failed to update status: " + err.message);
    }
  };

  if (loading) return <div className="min-h-screen bg-black text-white p-8">Loading...</div>;
  if (!order) return <div className="min-h-screen bg-black text-white p-8">Order not found</div>;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <button
        onClick={() => router.push("/orders")}
        className="mb-6 border border-white/30 px-4 py-2 rounded-lg hover:bg-white/10 transition"
      >
        Back to Orders
      </button>

      <h1 className="text-3xl font-bold mb-6">Order Details</h1>

      <div className="w-full px-10 space-y-6">
        {/* User Email */}
        <div className="w-full">
          <label className="block mb-1 text-sm text-white/60">User Email</label>
          <div className="border border-white/30 px-4 py-3 rounded-lg bg-black">{order.userEmail}</div>
        </div>

        {/* Shipping Address */}
        <div className="w-full">
          <label className="block mb-1 text-sm text-white/60">Shipping Address</label>
          <div className="border border-white/30 px-4 py-3 rounded-lg bg-black space-y-1">
            <p>City - {order.shippingAddress.street}</p>
            <p>Street - {order.shippingAddress.city}</p>
            <p>House No - {order.shippingAddress.country}</p>
          </div>
        </div>

        {/* Items */}
        <div className="w-full">
          <label className="block mb-1 text-sm text-white/60">Order Items</label>
          <div className="border border-white/30 px-4 py-3 rounded-lg bg-black space-y-2">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between">
                <span>{item.product?.name || item.product}</span>
                <span>
                  {item.quantity} x Rs {item.priceAtPurchase.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="w-full">
          <label className="block mb-1 text-sm text-white/60">Total Amount</label>
          <div className="border border-white/30 px-4 py-3 rounded-lg bg-black font-semibold">
            Rs {order.totalAmount.toFixed(2)}
          </div>
        </div>

        {/* Status */}
        <div className="w-full space-y-2">
          <label className="block text-sm text-white/60">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full cursor-pointer px-4 py-2 rounded-lg border border-white/30 bg-black text-white focus:outline-none"
          >
            {["Pending", "Accepted", "Shipped", "Completed", "Cancelled"].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button
            onClick={handleStatusChange}
            className="w-full cursor-pointer border border-white/30 px-6 py-2 rounded-lg hover:bg-white/10 transition"
          >
            Update Status
          </button>
        </div>
      </div>
    </div>
  );
}
