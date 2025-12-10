"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "context/AuthContext";
import { FaUser, FaEnvelope, FaCog, FaSignOutAlt } from "react-icons/fa";

const ProfileDropdown = () => {
  const { logout, user } = useAuth();
  const [open, setOpen] = useState(false);

  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="relative inline-flex items-center justify-center w-12 h-12 ">
      {/* Dropdown Button */}
      <button onClick={() => setOpen(!open)} className="w-12 h-12 border-2 rounded-full focus:outline-none ">
        <motion.img
          src={user?.imageUrl || "../../../assets/img/avatars/avatar11.png"}
          alt={user?.nom || "User Avatar"}
          className="flex items-center justify-center object-cover w-full h-full focus:outline-none"
          whileHover={{ scale: 1.1 }}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 z-50 w-64 mt-3 bg-white shadow-xl ring-black top-12 rounded-2xl ring-1 ring-opacity-5 dark:bg-navy-700"
          >
            <motion.div
              className="flex flex-col p-4 border-b border-gray-200 dark:border-white/20"
              variants={itemVariants}
            >
              <p className="text-sm font-bold text-gray-700 dark:text-white">
                👋 Hey, {user?.nom || "Guest"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-300">
                {user?.email}
              </p>
            </motion.div>

            <motion.div
              className="flex flex-col p-4 space-y-2"
              variants={itemVariants}
            >
              <a
                href="/admin/profile"
                className="flex items-center gap-2 text-sm text-gray-700 transition-colors hover:text-purple-600 dark:text-white"
              >
                <FaUser className="text-blue-500" /> Profil
              </a>
              <a
                href="/admin/profile#settings"
                className="flex items-center gap-2 text-sm text-gray-700 transition-colors hover:text-purple-600 dark:text-white"
              >
                <FaCog className="text-green-500" /> Settings
              </a>

              <a
                href="#logout"
                onClick={logout}
                className="flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-600"
              >
                <FaSignOutAlt /> Log Out
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileDropdown;
