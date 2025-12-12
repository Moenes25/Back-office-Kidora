"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "context/AuthContext";
import { FaUser, FaEnvelope, FaCog, FaSignOutAlt } from "react-icons/fa";
import avatarFallback from "../../../assets/img/avatars/avatar4.png";

const ProfileDropdown = () => {
  const { logout, user, token, updateUser } = useAuth();
  const [open, setOpen] = useState(false);

  const getImageUrl = () => {
    if (!user?.imageUrl) return avatarFallback;

    if (user.imageUrl.startsWith("http")) return user.imageUrl;

    // if relative path
    return `${process.env.REACT_APP_API_URL.replace("/api", "")}/uploads/${user.imageUrl}`;
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (!user?.id || !token) return;
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        updateUser(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, [user?.id, token]);

  return (
    <div className="relative inline-flex items-center justify-center w-12 h-12">
      {/* Dropdown Button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-12 h-12 overflow-hidden transition-all border-2 rounded-full shadow-md focus:outline-none hover:shadow-lg"
      >
        <motion.img
          src={getImageUrl()}
          alt={user?.nom || "User Avatar"}
          className="object-cover w-full h-full"
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.2 }}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 z-50 w-64 mt-3 overflow-hidden bg-white border shadow-xl top-10 rounded-2xl dark:bg-navy-700 border-gray-200/40 dark:border-white/20"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-white/10">
              <p className="text-sm font-bold text-gray-800 dark:text-white">
                Hey, {user?.nom || "Guest"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-300">
                {user?.email}
              </p>
            </div>

            {/* Menu */}
            <motion.div className="flex flex-col p-2 space-y-1">
              <motion.a
                href="/admin/profile"
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 transition-all rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-navy-600"
                whileHover={{ x: 4 }}
              >
                <FaUser className="text-blue-500" /> Profile
              </motion.a>

              <motion.a
                href="/admin/profile#settings"
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 transition-all rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-navy-600"
                whileHover={{ x: 4 }}
              >
                <FaCog className="text-green-500" /> Settings
              </motion.a>

              <div className="my-1 border-t border-gray-300 dark:border-white/10"></div>

              <motion.button
                onClick={logout}
                className="flex items-center w-full gap-2 px-3 py-2 text-sm font-medium text-red-500 transition-all rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                whileHover={{ x: 4 }}
              >
                <FaSignOutAlt /> Log Out
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileDropdown;
