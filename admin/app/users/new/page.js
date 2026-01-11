'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "@/app/components/CustomToaster";

export default function AddUserPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roles, setRoles] = useState([]);
  const [roleId, setRoleId] = useState(""); // MongoDB ObjectId
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch roles dynamically
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/roles");
        if (!res.ok) throw new Error("Failed to fetch roles");
        const data = await res.json();
        setRoles(data);
        if (data[0]?._id) setRoleId(data[0]._id); // default selection
      } catch (err) {
        console.error(err);
        alert("Failed to load roles: " + err.message);
      }
    };
    fetchRoles();
  }, []);

  // Validation
  const validate = () => {
    const newError = {};
    if (!name.trim()) newError.name = "Name is required";
    if (!email.trim()) newError.email = "Email is required";
    if (!password.trim()) newError.password = "Password is required";
    if (!roleId) newError.role = "Role is required";
    setError(newError);
    return Object.keys(newError).length === 0;
  };

  // Handle save
  const handleSave = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          roleId,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Failed to save user");
      }

      showToast("success", "User created successfully!")
      router.push("/users");
    } catch (err) {
      console.error(err);
      alert("Failed to save user: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Add New User</h1>

      <div className="space-y-6 w-full ">
        {/* Name */}
        <div className="w-full">
          <label className="block mb-2 text-sm">Name *</label>
          <input
        
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error.name) setError({ ...error, name: null });
            }}
            placeholder="Enter full name"
            className={`w-full bg-black px-4 py-2 rounded-lg border focus:outline-none text-white placeholder-white/50 ${
              error.name ? "border-red-500" : "border-white/30"
            }`}
          />
          {error.name && <p className="text-red-500 text-sm mt-1">{error.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block mb-2 text-sm">Email *</label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error.email) setError({ ...error, email: null });
            }}
            placeholder="Enter email"
            className={`w-full bg-black px-4 py-2 rounded-lg border focus:outline-none text-white placeholder-white/50 ${
              error.email ? "border-red-500" : "border-white/30"
            }`}
          />
          {error.email && <p className="text-red-500 text-sm mt-1">{error.email}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block mb-2 text-sm">Password *</label>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error.password) setError({ ...error, password: null });
            }}
            placeholder="Enter password"
            className={`w-full bg-black px-4 py-2 rounded-lg border focus:outline-none text-white placeholder-white/50 ${
              error.password ? "border-red-500" : "border-white/30"
            }`}
          />
          {error.password && <p className="text-red-500 text-sm mt-1">{error.password}</p>}
        </div>

        {/* Role */}
        <div>
          <label className="block mb-2 text-sm">Role *</label>
          <select
            value={roleId}
            onChange={(e) => setRoleId(e.target.value)}
            className={`w-full cursor-pointer px-4 py-2 rounded-lg border ${
              error.role ? "border-red-500" : "border-white/30"
            } bg-black text-white focus:outline-none`}
          >
            {roles.map((r) => (
              <option key={r._id} value={r._id}>
                {r.name}
              </option>
            ))}
          </select>
          {error.role && <p className="text-red-500 text-sm mt-1">{error.role}</p>}
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-center mt-4">
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full border cursor-pointer border-white/30 px-6 py-2 rounded-lg hover:bg-white/10 transition disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save User"}
          </button>

          <button
            onClick={() => router.back()}
            className="w-full cursor-pointer border border-white/30 px-6 py-2 rounded-lg hover:bg-white/10 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
