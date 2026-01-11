'use client';
import { useEffect, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { AppContext } from './context/AppContext';
import axios from "axios";
import { showToast } from "./components/CustomToaster";
import Link from "next/link";
import { Users, Image, Layers, Package, ShoppingCart, Plus } from "lucide-react";

const collections = [
  { name: "Users", href: "/users", icon: Users },
  { name: "Media", href: "/media", icon: Image },
  { name: "Categories", href: "/categories", icon: Layers },
  { name: "Products", href: "/products", icon: Package },
  { name: "Orders", href: "/orders", icon: ShoppingCart },
];

export default function DashboardHome() {
  const router = useRouter();
  const { backendUrl, isLoggedIn, setIsLoggedIn, setUserData, fetchAuth, loading } = useContext(AppContext);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      await fetchAuth();
      setAuthChecked(true);
    };
    checkAuth();
  }, [fetchAuth]);

  useEffect(() => {
    if (authChecked && !isLoggedIn) {
      router.push("/login");
    }
  }, [authChecked, isLoggedIn, router]);

  const handleLogout = async () => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/logout`, {}, { withCredentials: true });
      if (data.success) {
        showToast("success", data.message);
        setUserData(null);
        setIsLoggedIn(false);
        router.push('/login');
      } else {
        showToast("error", data.message);
      }
    } catch (err) {
      showToast("error", err.response?.data?.message || err.message || "Something went wrong");
    }
  };

  if (loading || !authChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isLoggedIn) return null;

  return (
    <div className="bg-black min-h-screen text-white p-8">
      <div className="flex items-center justify-between pb-10">
        <div className="rounded-xl px-6 py-4 border border-white/20">
          <h1 className="text-2xl font-semibold">Welcome to your dashboard</h1>
        </div>

        <button
          className="flex items-center gap-2 bg-gray rounded-sm py-1 sm:py-2.5 px-2 sm:px-5 cursor-pointer"
          onClick={handleLogout}
        >
          <i className="ri-logout-circle-r-line"></i> Logout
        </button>
      </div>

      <h2 className="text-3xl font-bold mb-6">Collections</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {collections.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="group rounded-2xl border border-white/20 p-6 hover:bg-white/5 transition"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <item.icon className="w-6 h-6 text-white" />
                <span className="text-lg font-medium">{item.name}</span>
              </div>

              <div className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center">
                <Plus className="w-5 h-5 text-white" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
