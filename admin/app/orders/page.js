'use client';

import { useState, useEffect } from "react";
import Link from "next/link";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/orders");
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error(err);
        alert("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Orders</h1>

      {loading ? (
        <p>Loading orders...</p>
      ) : (
        <div className="space-y-4">
          {orders.length === 0 && <p>No orders found.</p>}
          {orders.map((order) => (
            <Link
              key={order._id}
              href={`/orders/${order._id}`}
              className="block border border-white/30 rounded-lg px-4 py-3 hover:bg-white/5 transition"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{order.userEmail}</p>
                  <p className="text-sm text-white/70">
                    {order.items.length} item{order.items.length > 1 ? "s" : ""} • Rs {order.totalAmount.toFixed(2)}
                  </p>
                </div>
                <div>
                  <span className="text-sm px-2 py-1 border border-white/30 rounded-lg">
                    {order.status}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
