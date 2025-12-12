"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiStar, FiUsers, FiActivity } from "react-icons/fi";
import { useAuth } from "context/AuthContext";
import avatar4Img from "../../../assets/img/avatars/avatar4.png";

/* ---------------------- SKELETON LOADER ---------------------- */
const ProfileHeaderSkeleton = () => (
  <div className="relative flex flex-col overflow-hidden shadow-2xl animate-pulse rounded-2xl">
    <div className="relative bg-gray-300 h-36"></div>
    <div className="relative flex flex-col gap-4 p-6 bg-white dark:bg-indigo-900">
      <div className="absolute bg-gray-300 rounded-full -top-14 left-6 h-28 w-28 md:h-32 md:w-32"></div>
      <div className="flex items-start justify-between w-full pr-4 mt-8 md:ml-32">
        <div className="flex flex-col w-40 gap-2">
          <div className="w-32 h-4 bg-gray-300 rounded"></div>
          <div className="w-40 h-3 bg-gray-200 rounded"></div>
        </div>
        <div className="h-10 bg-gray-200 w-14 rounded-xl"></div>
      </div>
      <div className="grid w-full grid-cols-2 gap-4 mt-6 md:grid-cols-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-full h-20 bg-gray-200 rounded-xl"></div>
        ))}
      </div>
    </div>
  </div>
);

/* ---------------------- MAIN COMPONENT ---------------------- */
const ProfileHeader = () => {
  const { user, token } = useAuth();
  const [openMessages, setOpenMessages] = useState(false);
  const [adminsCount, setAdminsCount] = useState(0);
  const [etablissementsCount, setEtablissementsCount] = useState(0);

  /* ---------------------- Fetch Counts ---------------------- */
  useEffect(() => {
    const fetchAdminsCount = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setAdminsCount(data.length);
      } catch (err) {
        console.error("Failed to fetch admins count:", err);
      }
    };

    const fetchEtablissementsCount = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/etablissement/all`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        setEtablissementsCount(data.length);
      } catch (err) {
        console.error("Failed to fetch etablissements count:", err);
      }
    };

    fetchAdminsCount();
    fetchEtablissementsCount();
  }, [token]);

  /* ---------------------- Skeleton Loader ---------------------- */
  if (!user) return <ProfileHeaderSkeleton />;

  /* ---------------------- Image URL Logic ---------------------- */
  const getImageUrl = () => {
    if (!user.imageUrl) return avatar4Img;

    // if it's an absolute URL
    if (user.imageUrl.startsWith("http")) {
      return user.imageUrl;
    }

    // if it's a relative path
    return `${process.env.REACT_APP_API_URL}/auth/uploads/${user.imageUrl}`;
  };

  return (
    <div className="relative flex flex-col overflow-hidden shadow-2xl rounded-2xl">
      {/* Top Gradient */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative h-36 bg-gradient-to-r from-purple-400 via-blue-400 to-blue-200"
      >
        <span className="absolute w-24 h-24 rounded-full animate-pulse-slow -left-6 -top-6 bg-white/10"></span>
        <span className="absolute w-16 h-16 rounded-full animate-pulse-slow bottom-4 right-8 bg-white/20"></span>
      </motion.div>

      {/* Bottom Section */}
      <div className="relative flex flex-col gap-4 p-6 bg-white dark:bg-indigo-900">
        {/* Avatar */}
        <motion.div className="absolute flex items-center justify-center bg-white border-4 border-white rounded-full shadow-lg -top-14 left-6 h-28 w-28 md:h-32 md:w-32">
          <img
            src={getImageUrl()}
            alt="User"
            className="object-cover w-24 h-24 rounded-full md:h-28 md:w-28"
          />
          <span className="absolute w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-md bottom-2 right-2"></span>
        </motion.div>

        {/* Name + Email */}
        <div className="flex items-start justify-between pr-4 mt-8 md:ml-32">
          <div className="flex flex-col">
            <motion.h2
              className="text-xl font-bold text-gray-800"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {user.nom || "Guest"}
            </motion.h2>

            <motion.div
              className="flex items-center gap-2 text-sm text-gray-500"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <FiMail className="text-gray-400" />
              <span>{user.email || "guest@example.com"}</span>
            </motion.div>
          </div>

          {/* Messages */}
          <div>
            <button
              onClick={() => setOpenMessages(true)}
              className={`underline-offset-3 relative flex items-center gap-1 rounded-xl p-3 text-gray-600 transition-all hover:underline ${
                openMessages ? "text-red-600" : ""
              }`}
            >
              <span className="absolute left-5 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                5
              </span>
              <FiMail className="text-xl text-gray-700" />
              <p className="mt-1 text-[12px] text-gray-600">Messages</p>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mt-6 md:grid-cols-4">
          {[
            {
              label: "Admins",
              value: adminsCount,
              icon: <FiUsers />,
              gradient: "from-purple-500 to-purple-300",
            },
            {
              label: "Etablissements",
              value: etablissementsCount,
              icon: <FiActivity />,
              gradient: "from-blue-400 to-blue-200",
            },
            {
              label: "Activity Score",
              value: "92%",
              icon: <FiStar />,
              gradient: "from-yellow-400 to-yellow-200",
            },
          ].map((card, idx) => (
            <motion.div
              key={idx}
              className={`rounded-xl bg-gradient-to-br p-[1px] shadow-lg ${card.gradient}`}
              whileHover={{ scale: 1.03, y: -3 }}
            >
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${card.gradient} text-white`}
                >
                  {card.icon}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-gray-500">
                    {card.label}
                  </span>
                  <span className="text-lg font-bold text-gray-800">
                    {card.value}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Messages Modal */}
      {openMessages && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="p-5 bg-white shadow-xl w-96 rounded-2xl">
            <h3 className="mb-3 text-lg font-semibold text-gray-700">
              Messages
            </h3>
            <p className="mb-4 text-sm text-gray-600">vide</p>
            <button
              onClick={() => setOpenMessages(false)}
              className="px-4 py-2 mt-2 text-white bg-purple-500 rounded-lg"
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
