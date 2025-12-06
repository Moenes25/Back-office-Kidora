"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import api from "services/api";
import { IoPersonAdd } from "react-icons/io5";
import InputField from "components/fields/InputField";

const roles = ["Super Admin", "Admin", "Moderator"];

const AddAdminModal = ({ open, onClose, onSuccess }) => {
  const [newAdmin, setNewAdmin] = useState({
    nom: "",
    email: "",
    tel: "",
    password: "",
    confirmPassword: "",
    role: roles[1],
  });

  const handleAddAdmin = async () => {
    if (newAdmin.password !== newAdmin.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      const res = await api.post("/auth/register", newAdmin);
      onSuccess(res.data);
      onClose();
      setNewAdmin({
        nom: "",
        email: "",
        tel: "",
        password: "",
        confirmPassword: "",
        role: roles[1],
      });
    } catch (error) {
      console.error("Error adding admin:", error);
      alert("Failed to add admin");
    }
  };

  if (!open) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="relative w-full max-w-lg p-6 mx-4 bg-white rounded-2xl shadow-xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-3 text-2xl text-gray-500 hover:text-gray-800 transition-colors"
        >
          ×
        </button>

        {/* Title */}
        <h3 className="mb-6 text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500">
          Add New Admin
        </h3>

        {/* Form */}
        <div className="flex flex-col gap-4">
          {/* Role */}
          <div className="relative">
            <label className="absolute top-0 left-4 text-sm text-gray-500">Role</label>
            <select
              value={newAdmin.role}
              onChange={(e) =>
                setNewAdmin({ ...newAdmin, role: e.target.value })
              }
              className="w-full p-4 mt-2 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              {roles.map((role, idx) => (
                <option key={idx} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          {/* Name and Phone */}
          <div className="flex flex-col md:flex-row gap-4">
            <InputField
              type="text"
              placeholder="Full Name"
              value={newAdmin.nom}
              onChange={(e) => setNewAdmin({ ...newAdmin, nom: e.target.value })}
              className="flex-1 p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            <InputField
              type="text"
              placeholder="Phone"
              value={newAdmin.tel}
              onChange={(e) => setNewAdmin({ ...newAdmin, tel: e.target.value })}
              className="flex-1 p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>

          {/* Email */}
          <InputField
            type="email"
            placeholder="Email"
            value={newAdmin.email}
            onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400"
          />

          {/* Passwords */}
          <div className="flex flex-col md:flex-row gap-4">
            <InputField
              type="password"
              placeholder="Password"
              value={newAdmin.password}
              onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
              className="flex-1 p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            <InputField
              type="password"
              placeholder="Confirm Password"
              value={newAdmin.confirmPassword}
              onChange={(e) => setNewAdmin({ ...newAdmin, confirmPassword: e.target.value })}
              className="flex-1 p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>

          {/* Save Button */}
          <motion.button
            onClick={handleAddAdmin}
            className="flex items-center justify-center gap-2 py-3 mt-2 font-medium text-white rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 shadow-lg hover:from-purple-600 hover:to-blue-600 transition-transform"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <IoPersonAdd size={20} />
            Save
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AddAdminModal;
