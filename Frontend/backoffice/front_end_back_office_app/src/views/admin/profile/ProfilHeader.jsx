"use client";
import React from "react";
import avatar11Img from "../../../assets/img/avatars/avatar11.png";
import { motion } from "framer-motion";
import { FiMail, FiStar, FiUsers, FiActivity } from "react-icons/fi";

const ProfileHeader = () => {
  return (
    <div className="relative flex flex-col shadow-2xl rounded-2xl overflow-hidden">
      {/* Top Gradient Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative h-32 bg-gradient-to-r from-purple-400 via-blue-400 to-blue-200"
      >
        <span className="absolute w-24 h-24 rounded-full animate-pulse-slow -left-6 -top-6 bg-white/10"></span>
        <span className="absolute w-16 h-16 rounded-full animate-pulse-slow bottom-4 right-8 bg-white/20"></span>
      </motion.div>

      {/* Bottom White Section */}
      <div className="bg-white p-6  relative flex flex-col gap-4">
        {/* Avatar overlapping */}
        <motion.div
          className="absolute -top-12 left-6 w-28 h-28 border-4 border-white shadow-lg rounded-full overflow-hidden"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <img src={avatar11Img} alt="User" className="w-full h-full object-cover" />
        </motion.div>

        {/* Info & Stats */}
        <div className="ml-32 flex flex-col ">
          <motion.h2
            className="text-lg font-bold text-gray-800"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Nesrine Nasri
          </motion.h2>

          <motion.div
            className="flex items-center gap-2 text-sm text-gray-500"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <FiMail className="text-gray-400" />
            <span>nesrine@example.com</span>
          </motion.div>

        </div>
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
            <motion.div
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 rounded-xl text-white shadow-lg"
              whileHover={{ scale: 1.05 }}
            >
              <FiUsers size={24} />
              <div className="flex flex-col">
                <span className="text-sm">Admins</span>
                <span className="font-bold text-lg">12</span>
              </div>
            </motion.div>

            <motion.div
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-400 via-teal-400 to-blue-400 rounded-xl text-white shadow-lg"
              whileHover={{ scale: 1.05 }}
            >
              <FiActivity size={24} />
              <div className="flex flex-col">
                <span className="text-sm">Projects</span>
                <span className="font-bold text-lg">8</span>
              </div>
            </motion.div>

            <motion.div
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-xl text-white shadow-lg"
              whileHover={{ scale: 1.05 }}
            >
              <FiStar size={24} />
              <div className="flex flex-col">
                <span className="text-sm">Activity Score</span>
                <span className="font-bold text-lg">92%</span>
              </div>
            </motion.div>
          </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
