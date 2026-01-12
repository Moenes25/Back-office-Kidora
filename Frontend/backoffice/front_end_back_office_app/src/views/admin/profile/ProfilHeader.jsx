"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiMessageCircle } from "react-icons/fi";
import { useAuth } from "context/AuthContext";
import useProfileStats from "hook/useProfileStats";
import ProfileHeaderSkeleton from "./components/ProfileHeaderSkeleton";
import ProfileStats from "./components/ProfileStats";

const DEFAULT_AVATAR = "../../../assets/img/avatars/avatar11.png";
const messages = [
  {
    id: 1,
    type: "system",
    title: "Security Update",
    content: "Your password was successfully changed.",
    time: "2 min ago",
    color: "indigo",
  },
  {
    id: 2,
    type: "admin",
    title: "New Admin Added",
    content: "Sara Ben has been added to Sfax region.",
    time: "1 hour ago",
    color: "emerald",
  },
  {
    id: 3,
    type: "ai",
    title: "AI Insight",
    content: "Admin activity increased by 18% this week.",
    time: "Yesterday",
    color: "purple",
  },
];

export default function ProfileHeader() {
  const { user } = useAuth();
  const { stats, loading } = useProfileStats();
  const [openMessages, setOpenMessages] = useState(false);

  if (loading) return <ProfileHeaderSkeleton />;

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative rounded-3xl
                 bg-white/80 backdrop-blur-xl
                 border border-slate-200 dark:text-white dark:bg-navy-800 dark:border-navy-700
                 shadow-[0_20px_50px_-25px_rgba(0,0,0,0.25)]"
    >
      <div className="p-6">

        {/* TOP ROW */}
        <div className="flex items-center justify-between">

          {/* LEFT */}
          <div className="flex items-center gap-5">
            <div className="relative">
              {/* subtle glow */}
              <span className="absolute inset-0 rounded-2xl
                               bg-indigo-500/10 blur-xl" />

              <img
                src={user?.imageUrl || DEFAULT_AVATAR}
                alt="Avatar"
                className="relative h-20 w-20 rounded-2xl
                           object-cover ring-1 ring-slate-200"
              />

              <span className="absolute -bottom-1 -right-1 h-4 w-4
                               rounded-full bg-emerald-500
                               ring-2 ring-white" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {user?.nom || "Super Admin"}
              </h2>

              <div className="mt-1 flex items-center gap-2
                              text-sm text-slate-500 dark:text-white">
                <FiMail />
                {user?.email}
              </div>

              <span className="mt-2 inline-flex rounded-full dark:text-white dark:bg-navy-600 dark:border-navy-500
                               bg-slate-100 px-3 py-0.5
                               text-xs font-semibold text-slate-600">
                {user?.role}
              </span>
            </div>
          </div>

          {/* RIGHT ICON ACTION */}
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setOpenMessages(true)}
            className="relative grid place-items-center
                       h-11 w-11 rounded-xl
                       bg-white shadow-sm
                       border border-slate-200
                       text-slate-600
                       hover:bg-slate-50 dark:text-white dark:bg-navy-800 dark:border-navy-500"
                       
          >
            <FiMessageCircle className="text-xl" />

            {/* badge */}
            <span className="absolute -top-1 -right-1
                             flex h-5 w-5 items-center justify-center
                             rounded-full bg-indigo-600
                             text-[11px] font-bold text-white">
              5
            </span>
          </motion.button>
        </div>

        {/* STATS */}
        {user?.role === "SUPER_ADMIN" && stats && (
          <div className="mt-6">
            <ProfileStats stats={stats} />
          </div>
        )}
      </div>

      {/* MODAL */}
      {openMessages && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/30">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-[360px] rounded-2xl bg-white p-6 shadow-xl"
          >
            <h3 className="text-lg font-semibold text-slate-800">
              Messages
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Aucun message.
            </p>
            <button
              onClick={() => setOpenMessages(false)}
              className="mt-4 w-full rounded-xl
                         bg-indigo-600 py-2
                         font-semibold text-white
                         hover:bg-indigo-700"
            >
              Fermer
            </button>
          </motion.div>
        </div>
      )}
    </motion.section>
  );
}
