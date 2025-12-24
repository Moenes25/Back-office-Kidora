"use client";
<<<<<<< HEAD
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
=======

import React, { useState } from "react";
import { motion } from "framer-motion";
>>>>>>> safa
import { FaLock } from "react-icons/fa";
import { useAuth } from "context/AuthContext";
import api from "services/api";

export default function ChangePassword({ onClose, loading }) {
<<<<<<< HEAD
  const { token } = useAuth(); // ✅ get token from context
=======
  const { token } = useAuth();

>>>>>>> safa
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const handlePasswordChange = async () => {
<<<<<<< HEAD
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setSaving(true);

=======
    if (!currentPassword || !newPassword || !confirmPassword)
      return alert("All fields are required");

    if (newPassword !== confirmPassword)
      return alert("Passwords do not match");

    try {
      setSaving(true);
>>>>>>> safa
      await api.put(
        "/superadmin/update-password",
        null,
        {
          params: {
            oldPassword: currentPassword,
<<<<<<< HEAD
            newPassword: newPassword,
          },
          headers: {
            Authorization: `Bearer ${token}`, // ✅ send token
=======
            newPassword,
          },
          headers: {
            Authorization: `Bearer ${token}`,
>>>>>>> safa
          },
        }
      );

      alert("Password updated successfully ✅");
<<<<<<< HEAD
      onClose(); // close modal
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      alert(error?.response?.data || "Failed to update password");
=======
      onClose();
    } catch (err) {
      alert(err?.response?.data || "Failed to update password");
>>>>>>> safa
    } finally {
      setSaving(false);
    }
  };

  return (
<<<<<<< HEAD
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-11/12 max-w-md p-6 bg-white shadow-xl rounded-2xl"
        >
          <h4 className="flex items-center gap-2 mb-4 text-lg font-semibold">
            <FaLock className="text-purple-600" />
            Change Password
          </h4>

          <div className="space-y-3">
            <input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-400"
            />

            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-400"
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div className="flex justify-end gap-3 mt-5">
            <button
              onClick={onClose}
              disabled={saving || loading}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>

            <button
              onClick={handlePasswordChange}
              disabled={saving || loading}
              className="px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
=======
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
>>>>>>> safa
