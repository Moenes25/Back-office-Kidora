"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiStar, FiUsers, FiActivity } from "react-icons/fi";
import { useAuth } from "context/AuthContext";
import ProfileHeaderSkeleton from "./components/ProfileHeaderSkeleton";
import useProfileStats from "hook/useProfileStats";
import ProfileStats from "./components/ProfileStats";

/* ---------------- CONSTANTS ---------------- */
const DEFAULT_AVATAR = "../../../assets/img/avatars/avatar11.png";

//feat(profile): add skeleton loading for profile page
//feat(profile): fetch profile stats via dedicated hook

const ProfileHeader = () => {
  const { user } = useAuth();
  const [openMessages, setOpenMessages] = useState(false);
  const { stats, loading } = useProfileStats();

  if (loading) return <ProfileHeaderSkeleton />;

  const messageCount = 5;

  return (
    <div className="relative flex flex-col overflow-hidden shadow-2xl rounded-2xl">
      {/* ---------------- TOP GRADIENT ---------------- */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative h-36 bg-gradient-to-r from-purple-400 via-blue-400 to-blue-200"
      >
        <span className="absolute w-24 h-24 rounded-full animate-pulse-slow -left-6 -top-6 bg-white/10" />
        <span className="absolute w-16 h-16 rounded-full animate-pulse-slow bottom-4 right-8 bg-white/20" />
      </motion.div>

      {/* ---------------- CONTENT ---------------- */}
      <div className="relative flex flex-col gap-6 p-6 bg-white dark:bg-indigo-900">
        {/* Avatar */}
        <div className="absolute overflow-hidden border-4 border-white rounded-full shadow-lg -top-14 left-6 h-28 w-28 md:h-32 md:w-32">
          <img
            src={user?.imageUrl || DEFAULT_AVATAR}
            alt="User avatar"
            className="object-cover w-full h-full"
          />
          <span className="absolute w-4 h-4 bg-green-500 border-2 border-white rounded-full bottom-2 right-2" />
        </div>

        {/* User info + messages */}
        <div className="flex items-start justify-between mt-8 md:ml-32">
          <div>
            <motion.h2
              initial={{ x: -15, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="text-xl font-bold text-gray-800"
            >
              {user?.nom || "Guest"}
            </motion.h2>

            <motion.div
              initial={{ x: -15, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-2 text-sm text-gray-500"
            >
              <FiMail />
              {user?.email || "guest@example.com"}
            </motion.div>
          </div>

          {/* Messages Button */}
          <button
            onClick={() => setOpenMessages(true)}
            className="relative flex flex-col items-center p-3 text-gray-600 transition rounded-xl hover:underline"
          >
            <span className="absolute left-5 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {messageCount}
            </span>
            <FiMail className="text-xl" />
            <span className="text-xs">Messages</span>
          </button>
        </div>

        {/* ---------------- STATS ---------------- */}
        {user?.role === "SUPER_ADMIN" && stats && (
          <ProfileStats stats={stats} />
        )}
      </div>

      {/* ---------------- MESSAGES MODAL ---------------- */}
      {openMessages && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="p-5 bg-white shadow-xl w-96 rounded-2xl">
            <h3 className="mb-3 text-lg font-semibold text-gray-700">
              Messages
            </h3>
            <p className="text-sm text-gray-600">Aucun message</p>
            <button
              onClick={() => setOpenMessages(false)}
              className="px-4 py-2 mt-4 text-white bg-purple-500 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileHeader;
