"use client";
import React, { } from "react";
import avatar11Img from "../../../assets/img/avatars/avatar11.png";
import { motion } from "framer-motion";


const ProfileHeader = () => {
  
  

  return (
    <div className="flex flex-col justify-between overflow-hidden shadow-xl rounded-2xl">
      {/* Top Gradient Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative h-32 bg-gradient-to-r from-purple-400 via-blue-400 to-blue-200"
      >
        
        <span className="absolute w-24 h-24 rounded-full animate-pulse-slow -left-6 -top-6 bg-white/10"></span>
        <span className="absolute w-16 h-16 rounded-full animate-pulse-slow bottom-4 right-8 bg-white/20"></span>

        {/* Avatar */}
        <motion.div
          className="absolute text-white transform -translate-x-1/2 bg-red-600 border-4 border-white rounded-full -bottom-12 left-4 text-7xl"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <img src={avatar11Img} alt="User" className="rounded-full w-28 h-28 " />
        </motion.div>
      </motion.div>

      {/* Bottom White Section */}
      <div className="flex items-start gap-6 p-6 pt-16 bg-white">
        {/* User Info */}
        <div className="flex flex-col flex-1 gap-1">
          <motion.h2
            className="text-2xl font-bold text-gray-800"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Nesrine Nasri
          </motion.h2>
          <motion.p
            className="text-sm font-medium text-gray-500"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Super Admin
          </motion.p>
          <motion.p
            className="text-sm text-gray-400"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            nesrine@example.com
          </motion.p>
        </div>
      </div>

      
    </div>
  );
};

export default ProfileHeader;
