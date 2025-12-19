"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiStar, FiUsers, FiActivity } from "react-icons/fi";
import { useAuth } from "context/AuthContext";
import avatarImg from "../../../assets/img/avatars/avatar11.png";

const ProfileHeader = () => {
  const { user, token, updateUser } = useAuth();
  const [openMessages, setOpenMessages] = useState(false);
  const messageCount = 5;

  useEffect(() => {
    if (!user?.id) return;

    const fetchUser = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/auth/${user.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        updateUser(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, [user?.id, token]);

  return (
    <div className="relative overflow-hidden bg-white shadow-2xl rounded-2xl">
      {/* ===== TOP HEADER ===== */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative h-36 bg-gradient-to-r from-purple-700 via-blue-600 to-cyan-500"
      >
        {/* Decorative shapes */}
        <span className="absolute w-24 h-24 rounded-full -left-6 -top-6 bg-purple-300/20" />
        <span className="absolute w-16 h-16 rounded-full bottom-6 right-10 bg-blue-300/20" />
      </motion.div>

      {/* ===== CONTENT ===== */}
      <div className="relative p-6">
        {/* Avatar */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute overflow-hidden bg-white border-4 border-white rounded-full shadow-xl -top-16 left-6 h-28 w-28"
        >
          <img
            src={user?.imageUrl || avatarImg}
            alt="User"
            className="object-cover w-full h-full"
          />
          <span className="absolute w-4 h-4 bg-green-500 border-2 border-white rounded-full bottom-2 right-2" />
        </motion.div>

        {/* Name & Messages */}
        <div className="flex items-start justify-between mt-14 md:ml-36">
          <div>
            <motion.h2
              className="text-xl font-bold text-gray-800"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {user?.nom || "Guest"}
            </motion.h2>

            <motion.div
              className="flex items-center gap-2 text-sm text-gray-500"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.35 }}
            >
              <FiMail />
              <span>{user?.email || "guest@example.com"}</span>
            </motion.div>
          </div>

          {/* Messages */}
          <button
            onClick={() => setOpenMessages(true)}
            className={`relative flex flex-col items-center gap-1 p-3 rounded-xl transition hover:bg-purple-50 ${
              openMessages ? "text-purple-700" : "text-gray-600"
            }`}
          >
            <span className="absolute flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-purple-600 rounded-full -top-1 right-2">
              {messageCount}
            </span>
            <FiMail className="text-xl" />
            <span className="text-[12px]">Messages</span>
          </button>
        </div>

        {/* ===== STATS ===== */}
        <div className="grid grid-cols-2 gap-4 mt-6 md:grid-cols-4">
          {[
            {
              label: "Admins",
              value: 12,
              icon: <FiUsers />,
              gradient: "from-purple-600 to-purple-400",
            },
            {
              label: "Entreprises",
              value: 8,
              icon: <FiActivity />,
              gradient: "from-blue-600 to-blue-400",
            },
            {
              label: "Activity Score",
              value: "92%",
              icon: <FiStar />,
              gradient: "from-yellow-400 to-yellow-300",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4, scale: 1.03 }}
              className={`rounded-xl bg-gradient-to-br p-[1px] shadow-lg ${item.gradient}`}
            >
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${item.gradient} text-white`}
                >
                  {item.icon}
                </div>
                <div>
                  <p className="text-xs text-gray-500">{item.label}</p>
                  <p className="text-lg font-bold text-gray-800">
                    {item.value}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ===== MESSAGES MODAL ===== */}
      {openMessages && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-5 bg-white shadow-2xl w-96 rounded-2xl"
          >
            <h3 className="mb-3 text-lg font-semibold text-gray-700">
              Messages
            </h3>
            <p className="mb-4 text-sm text-gray-600">No messages yet.</p>
            <button
              onClick={() => setOpenMessages(false)}
              className="w-full px-4 py-2 text-white transition bg-purple-600 rounded-lg hover:bg-purple-700"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ProfileHeader;
