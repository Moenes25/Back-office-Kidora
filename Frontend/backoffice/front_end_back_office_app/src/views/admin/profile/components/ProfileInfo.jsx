"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ProfileInfo = () => {
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    fullName: "Nesrine Nasri",
    email: "nesrine@example.com",
    phone: "+216 55 000 111",
    role: "Super Admin",
    createdAt: "12 Janvier 2025",
    lastLogin: "Aujourd’hui à 10:45",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setIsEditing(false);
    // 👉 Later: send updated info to backend via Axios
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-6 bg-white border border-purple-200 shadow-lg dark:bg-navy-700 dark:border-navy-600 rounded-2xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-purple-700 dark:text-white">
          Personal Information
        </h3>

        {!isEditing ? (
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 text-sm text-white transition bg-purple-600 rounded-lg shadow hover:bg-purple-700"
          >
            Edit
          </motion.button>
        ) : (
          <div className="flex gap-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-sm transition bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              onClick={handleSave}
              className="px-4 py-2 text-sm text-white transition bg-green-500 rounded-lg shadow hover:bg-green-600"
            >
              Save
            </motion.button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {[
          { label: "Full Name", name: "fullName" },
          { label: "Email", name: "email" },
          { label: "Phone", name: "phone" },
          { label: "Role", name: "role" },
          { label: "Account Created", name: "createdAt" },
          { label: "Last Login", name: "lastLogin" },
        ].map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 transition bg-white shadow cursor-pointer dark:bg-navy-700 rounded-xl hover:shadow-xl"
          >
            <p className="mb-1 text-xs text-gray-400 dark:text-gray-300">{item.label}</p>

            <AnimatePresence mode="wait">
              {!isEditing ? (
                <motion.p
                  key="view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm font-semibold text-gray-700 dark:text-white"
                >
                  {form[item.name]}
                </motion.p>
              ) : (
                <motion.input
                  key="edit"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  type="text"
                  name={item.name}
                  value={form[item.name]}
                  onChange={handleChange}
                  className="w-full px-3 py-2 mt-1 text-sm transition border border-gray-300 rounded-lg dark:border-gray-600 focus:ring-2 focus:ring-purple-400 dark:focus:ring-purple-500"
                />
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ProfileInfo;
