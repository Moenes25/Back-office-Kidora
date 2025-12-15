import React, { useState, useEffect } from "react";
import { FaLock } from "react-icons/fa";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { MdMail } from "react-icons/md";
import api from "services/api";

const EditAdminModal = ({ admin, onClose, onEditSuccess }) => {
  const [email, setEmail] = useState(admin.email);
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(admin.role); // current role
  const [rolesList, setRolesList] = useState([]); // all roles from backend
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch roles from backend
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await api.get("/auth/roles"); 
        setRolesList(res.data); 
      } catch (err) {
        console.error("Failed to fetch roles:", err);
      }
    };
    fetchRoles();
  }, []);

  const handleSave = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      if (email && email !== admin.email) formData.append("newEmail", email);
      if (password) formData.append("newPassword", password);
      if (role && role !== admin.role) formData.append("newRole", role); 

      const res = await api.put(`/auth/update/${admin.id}`, formData);
      onEditSuccess(res.data);
      onClose();
    } catch (err) {
      console.error("Edit failed:", err);
      alert("Failed to update admin profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="p-6 space-y-5 bg-white shadow-xl w-80 rounded-xl">
        <h3 className="text-lg font-bold text-center gradient-text">
          Edit {admin.nom}
        </h3>

        {/* Email */}
        <div className="relative w-full">
          <MdMail
            size={20}
            className="absolute text-gray-600 -translate-y-1/2 left-4 top-1/2"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full py-4 pl-12 pr-4 text-gray-700 bg-transparent border border-gray-300 outline-none peer rounded-xl"
          />
          <label className="absolute px-1 text-gray-500 transition-all duration-200 -translate-y-1/2 bg-white left-12 top-1/2 peer-valid:top-0 peer-valid:text-xs peer-focus:top-0 peer-focus:text-xs">
            Email
          </label>
        </div>

        {/* Password */}
        <div className="relative w-full">
          <FaLock className="absolute text-gray-600 -translate-y-1/2 left-4 top-1/2" />
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New password"
            className="w-full py-4 pl-12 pr-10 text-gray-700 bg-transparent border border-gray-300 outline-none rounded-xl"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute text-gray-500 right-4 top-5"
          >
            {showPassword ? <IoEyeOffOutline className="text-red-500" /> : <IoEyeOutline />}
          </button>
        </div>

        {/* Role Dropdown */}
        <div className="relative w-full">
          <label className="block mb-1 text-gray-500">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full py-3 pl-3 pr-10 text-gray-700 bg-transparent border border-gray-300 rounded-xl"
          >
            {rolesList.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:underline"
            disabled={loading}
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 text-white rounded-lg bg-gradient-to-r from-purple-600 to-yellow-500 hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditAdminModal;
