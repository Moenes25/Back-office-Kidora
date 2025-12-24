"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "services/api";
import { FaLock } from "react-icons/fa";
import { MdMail } from "react-icons/md";
import {
  IoEyeOutline,
  IoEyeOffOutline,
  IoShieldCheckmarkOutline,
  IoClose,
} from "react-icons/io5";

/* ------------------ Styles helpers ------------------ */
const inputBase =
  "w-full rounded-xl border bg-slate-50 px-4 py-3 text-sm text-slate-700 " +
  "focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white transition";

/* ------------------ Component ------------------ */
const EditAdminModal = ({ admin, onClose, onEditSuccess }) => {
  const [email, setEmail] = useState(admin.email);
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(admin.role);
  const [rolesList, setRolesList] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ------------------ Fetch roles ------------------ */
  useEffect(() => {
    api
      .get("/auth/roles")
      .then((res) => setRolesList(res.data))
      .catch((err) => console.error("Failed to fetch roles:", err));
  }, []);

  /* ------------------ Save ------------------ */
  const handleSave = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      if (email && email !== admin.email) formData.append("newEmail", email);
      if (password) formData.append("newPassword", password);
      if (role && role !== admin.role) formData.append("role", role);

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
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.9, y: 30, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 30, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 25 }}
          className="relative w-[95%] max-w-md rounded-2xl bg-white p-6 shadow-2xl"
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 rounded-lg
                       text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <IoClose size={20} />
          </button>

          {/* Header */}
          <div className="mb-6 text-center">
            <h3 className="text-xl font-bold gradient-text">
              Edit Admin
            </h3>
            <p className="text-sm text-slate-500">
              Update account credentials & permissions
            </p>
          </div>

          {/* FORM */}
          <div className="space-y-4">
            {/* Email */}
            <div className="relative">
              <MdMail className="absolute left-4 top-4 text-indigo-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`${inputBase} pl-10`}
                placeholder="Email address"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <FaLock className="absolute left-4 top-4 text-yellow-500" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${inputBase} pl-10 pr-10`}
                placeholder="New password (optional)"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4 text-slate-400"
              >
                {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
              </button>
            </div>

            {/* Role */}
            <div className="relative">
              <IoShieldCheckmarkOutline className="absolute left-4 top-4 text-purple-500" />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className={`${inputBase} pl-10`}
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
                disabled={loading}
                className="px-4 py-2 text-sm text-slate-600
                           hover:underline disabled:opacity-50"
              >
                Cancel
              </button>

              <motion.button
                onClick={handleSave}
                disabled={loading}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-5 py-2 text-sm font-semibold text-white
                           rounded-xl bg-gradient-to-r from-purple-600 to-indigo-500
                           shadow-md hover:shadow-lg disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save changes"}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EditAdminModal;
