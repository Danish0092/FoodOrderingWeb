'use client';

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { showToast } from "@/app/components/CustomToaster";


export default function UserDetailPage() {
  const router = useRouter();
  const { id: userId } = useParams();

  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await fetch(`http://localhost:5000/api/admin/users/${userId}`);
        if (!userRes.ok) throw new Error("Failed to fetch user");
        const userData = await userRes.json();

        const rolesRes = await fetch(`http://localhost:5000/api/roles`);
        const rolesData = await rolesRes.json();
        if (!rolesRes.ok) throw new Error("Failed to fetch roles");

        setUser(userData);
        setRoles(rolesData);

        setSelectedRoleId(userData.role?._id || (rolesData[0]?._id || ""));
      } catch (err) {
        console.error(err);
        alert("Failed to load user or roles: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleRoleUpdate = async () => {

    setUpdating(true);
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roleId: selectedRoleId }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to update role");
      }

      const data = await res.json();
      setUser(data.user); 

      showToast("success", "User role updated successfully!")
      router.push("/users")
    } catch (err) {
      console.error(err);
      alert("Failed to update role: " + err.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-black text-white p-8">Loading...</div>;
  if (!user) return <div className="min-h-screen bg-black text-white p-8">User not found</div>;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <button
        onClick={() => router.push("/users")}
        className="mb-6 border border-white/30 px-4 py-2 rounded-lg hover:bg-white/10 transition"
      >
        Back to Users
      </button>

      <h1 className="text-3xl font-bold mb-6">User Details</h1>

      <div className="w-full px-10 space-y-6">
        {/* Name */}
        <div className="w-full">
          <label className="block mb-1 text-sm text-white/60">Name</label>
          <div className="border border-white/30 px-4 py-3 rounded-lg bg-black">{user.name}</div>
        </div>

        {/* Email */}
        <div className="w-full">
          <label className="block mb-1 text-sm text-white/60">Email</label>
          <div className="border border-white/30 px-4 py-3 rounded-lg bg-black">{user.email}</div>
        </div>

        {/* Role */}
        <div className="w-full space-y-2">
          <label className="block text-sm text-white/60">Role</label>
          <select
            value={selectedRoleId}
            onChange={(e) => setSelectedRoleId(e.target.value)}
            className="w-full px-4 py-2 cursor-pointer rounded-lg border border-white/30 bg-black text-white focus:outline-none"
          >
            {roles.map((r) => (
              <option  key={r._id} value={r._id}>
                {r.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleRoleUpdate}
            disabled={updating}
            className="w-full border cursor-pointer border-white/30 px-6 py-2 rounded-lg hover:bg-white/10 transition disabled:opacity-50"
          >
            {updating ? "Updating..." : "Update Role"}
          </button>
        </div>
      </div>
    </div>
  );
}
