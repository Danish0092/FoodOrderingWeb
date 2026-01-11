'use client';

import { useState, useEffect } from "react";
import Link from "next/link";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/users");
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold">Users</h1>

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 w-full sm:flex-auto bg-black border border-white/30 px-4 py-2 rounded-lg text-white placeholder-white/50 focus:outline-none"
          />

          <Link
            href="/users/new"
            className="w-full sm:w-auto border border-white/30 px-4 py-2 rounded-lg hover:bg-white/10 transition text-center"
          >
            + Add New
          </Link>
        </div>
      </div>

      {/* User List */}
      {loading ? (
        <p className="text-white/60">Loading users...</p>
      ) : (
        <>
          <div className="border-b border-white/20 pb-2 mb-3 flex gap-6 text-white/70">
            <div className="w-1/4">Username</div>
            <div className="w-1/4">Email</div>
            <div className="flex-1">Role</div>
          </div>

          <div className="space-y-2">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <Link
                  key={user._id}
                  href={`/users/${user._id}`}
                  className="block w-full"
                >
                  <div className="flex gap-6 border border-white/20 rounded-lg px-4 py-3 hover:bg-white/5 transition">
                    <div className="w-1/4 font-medium">{user.name}</div>
                    <div className="w-1/4 text-white/70 truncate">{user.email}</div>
                    <div className="flex-1 text-white/70">
                      {user.role?.name || "No role"}
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-white/60">No users found.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
