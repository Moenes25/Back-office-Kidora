"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiMessageCircle } from "react-icons/fi";
import { useAuth } from "context/AuthContext";
<<<<<<< HEAD
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
=======
import useProfileStats from "hook/useProfileStats";
import ProfileHeaderSkeleton from "./components/ProfileHeaderSkeleton";
import ProfileStats from "./components/ProfileStats";

const DEFAULT_AVATAR = "../../../assets/img/avatars/avatar11.png";

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
                 border border-slate-200
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
              <h2 className="text-lg font-semibold text-slate-900">
                {user?.nom || "Super Admin"}
              </h2>

              <div className="mt-1 flex items-center gap-2
                              text-sm text-slate-500">
                <FiMail />
                {user?.email}
              </div>

              <span className="mt-2 inline-flex rounded-full
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
                       hover:bg-slate-50"
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
>>>>>>> safa
            >
              Fermer
            </button>
          </motion.div>
        </div>
      )}
    </motion.section>
  );
}
