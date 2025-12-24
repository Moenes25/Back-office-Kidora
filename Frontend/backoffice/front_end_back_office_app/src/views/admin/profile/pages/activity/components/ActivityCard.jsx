"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaClock } from "react-icons/fa";
import { getEntityData } from "utils/entityIcon";

const getInitials = (name) => {
<<<<<<< HEAD
  if (!name || typeof name !== "string") return "?";

  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0]?.toUpperCase();

  return (parts[0][0] + parts[1][0]).toUpperCase();
=======
  if (!name) return "?";
  const parts = name.split(" ");
  return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
>>>>>>> safa
};

export default function ActivityCard({ activity }) {
  const { user, action, ui } = activity;
  const entity = getEntityData(action.entity);
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
<<<<<<< HEAD
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
=======
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
>>>>>>> safa
      className="relative flex gap-4 pl-10"
    >
      {/* Timeline Dot */}
      <span
<<<<<<< HEAD
        className={`absolute left-[18px] top-4 h-3 w-3 rounded-full ${ui.dot}`}
      />

      {/* Card */}
      <div className={`flex-1 rounded-lg border border-gray-200 p-3 ${ui.bg}`}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium">
=======
        className={`absolute left-[26px] top-6 h-3 w-3 rounded-full ${ui.dot}`}
      />

      <div
        className={`flex-1 rounded-2xl border border-slate-200
                    p-4 shadow-sm hover:shadow-md transition ${ui.bg}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold">
>>>>>>> safa
            <span className={ui.color}>{ui.icon}</span>
            <span className={ui.color}>{ui.label}</span>

            {entity && (
<<<<<<< HEAD
              <span className="flex items-center gap-1 text-gray-400">
                • {entity.icon}
                {entity.label}
=======
              <span className="flex items-center gap-1 text-slate-400 text-xs">
                • {entity.icon} {entity.label}
>>>>>>> safa
              </span>
            )}
          </div>

<<<<<<< HEAD
          <div className="flex items-center gap-1 text-xs text-gray-400">
=======
          <span className="flex items-center gap-1 text-xs text-slate-400">
>>>>>>> safa
            <FaClock />
            {new Date(action.date).toLocaleTimeString("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
            })}
<<<<<<< HEAD
          </div>
        </div>

        {/* Content */}
        <p className="mt-1 text-sm text-gray-700">
          <span className="font-semibold">{action.name}</span>
          {action.etabname && (
            <span className="text-gray-400"> — {action.etabname}</span>
=======
          </span>
        </div>

        {/* Content */}
        <p className="mt-1 text-sm text-slate-700">
          <span className="font-semibold">{action.name}</span>
          {action.etabname && (
            <span className="text-slate-400"> — {action.etabname}</span>
>>>>>>> safa
          )}
        </p>

        {/* User */}
<<<<<<< HEAD
        <div className="flex items-center gap-3 mt-3">
          {/* Avatar */}
          {!user.image || imgError ? (
            <div className="flex items-center justify-center w-12 h-12 text-sm font-semibold text-white bg-gray-400 rounded-full">
=======
        <div className="flex items-center gap-3 mt-4">
          {!user.image || imgError ? (
            <div className="w-11 h-11 rounded-full bg-slate-400
                            flex items-center justify-center text-white font-semibold">
>>>>>>> safa
              {getInitials(user.name)}
            </div>
          ) : (
            <img
              src={user.image}
<<<<<<< HEAD
              alt={user.name}
              onError={() => setImgError(true)}
              className="object-cover w-12 h-12 rounded-full"
            />
          )}

          {/* User info */}
          <div>
            <div className="flex items-center gap-1">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-gray-400">{user.region}</p>
            </div>
            <p className="text-xs text-gray-500">{user.role}</p>
=======
              onError={() => setImgError(true)}
              className="w-11 h-11 rounded-full object-cover"
            />
          )}

          <div>
            <p className="text-sm font-semibold">{user.name}</p>
            <p className="text-xs text-slate-500">
              {user.role} • {user.region}
            </p>
>>>>>>> safa
          </div>
        </div>
      </div>
    </motion.div>
  );
}
