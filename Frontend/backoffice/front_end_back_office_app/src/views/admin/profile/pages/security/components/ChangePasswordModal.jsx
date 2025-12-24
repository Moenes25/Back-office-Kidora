"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaLock } from "react-icons/fa";
import { useAuth } from "context/AuthContext";
import api from "services/api";

export default function ChangePassword({ onClose, loading }) {
  const { token } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword)
      return alert("All fields are required");

    if (newPassword !== confirmPassword)
      return alert("Passwords do not match");

    try {
      setSaving(true);
      await api.put(
        "/superadmin/update-password",
        null,
        {
          params: {
            oldPassword: currentPassword,
            newPassword,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Password updated successfully ✅");
      onClose();
    } catch (err) {
      alert(err?.response?.data || "Failed to update password");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center
                 bg-black/50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="w-11/12 max-w-md rounded-3xl bg-white
                   shadow-2xl p-6"
      >
        <h4 className="flex items-center gap-2 mb-5
                       text-lg font-bold text-slate-800">
          <FaLock className="text-purple-600" />
          Change Password
        </h4>

        <div className="space-y-3">
          <Input
            type="password"
            placeholder="Current password"
            value={currentPassword}
            onChange={setCurrentPassword}
          />
          <Input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={setNewPassword}
          />
          <Input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={setConfirmPassword}
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handlePasswordChange}
            disabled={saving || loading}
            className="px-5 py-2 rounded-xl text-sm font-semibold text-white
                       bg-gradient-to-r from-purple-500 to-indigo-500
                       disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

const Input = ({ type, placeholder, value, onChange }) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="w-full rounded-xl border border-slate-300 px-4 py-3
               text-sm focus:ring-2 focus:ring-purple-400 outline-none"
  />
);
