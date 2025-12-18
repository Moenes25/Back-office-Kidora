"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaClock } from "react-icons/fa";

export default function ActivityCard({ activity }) {
  const formatDate = (date) =>
    new Date(date).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="relative flex items-start gap-4 mb-6"
    >
      
      {/* Timeline Dot */}
      <div className="flex flex-col items-center ">
        <span className="relative z-10 w-4 h-4 rounded-full gradient-bg"></span>
      </div>

      {/* Card Content */}
      <div className="flex items-start justify-between flex-1 gap-3 p-4 transition shadow-sm bg-gray-50 rounded-xl hover:shadow-md">
        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 font-bold text-white bg-purple-300 rounded-full">
            {activity.user.image ? (
              <img
                src={activity.user.image}
                alt={activity.user.name}
                onError={(e) =>
                  (e.currentTarget.src =
                    "https://via.placeholder.com/40")
                }
                className="object-cover w-full h-full rounded-full"
              />
            ) : (
              <span className="text-purple-700">{activity.user.initials}</span>
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">
              {activity.user.name} — {activity.item}
            </p>
            <p className="text-xs text-gray-500">{activity.description}</p>
            <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
              <FaClock /> {formatDate(activity.timestamp)}
            </div>
          </div>
        </div>

        {/* Action Icon */}
        <div className="self-start mt-1">{activity.icon}</div>
      </div>
    </motion.div>
  );
}
