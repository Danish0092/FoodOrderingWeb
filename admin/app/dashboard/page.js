"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUser, logout } from "@/app/lib/auth";

export default function Dashboard() {
  const router = useRouter();
  const user = getUser();

  useEffect(() => {
    if (!user) router.push("/login");
  }, []);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="mt-2">Welcome, {user.username}</p>

        <button
          onClick={() => {
            logout();
            router.push("/login");
          }}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
