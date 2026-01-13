"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaClock } from "react-icons/fa";
import { getEntityData } from "utils/entityIcon";

const getInitials = (name) => {
  if (!name) return "?";
  const parts = name.split(" ");
  return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
};

export default function ActivityCard({ activity }) {
  const { user, action, ui } = activity;
  const entity = getEntityData(action.entity);
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      className="relative flex gap-4 pl-10"
    >
      {/* Timeline Dot */}
      <span
        className={`absolute left-[26px] top-6 h-3 w-3 rounded-full ${ui.dot}`}
      />

      <div
        className={`flex-1 rounded-2xl border border-slate-200
                    p-4 shadow-sm hover:shadow-md dark:bg-white/5 dark:border-white/10 transition ${ui.bg}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <span className={ui.color}>{ui.icon}</span>
            <span className={ui.color}>{ui.label}</span>

            {entity && (
              <span className="flex items-center gap-1 text-slate-400 text-xs">
                • {entity.icon} {entity.label}
              </span>
            )}
          </div>

          <span className="flex items-center gap-1 text-xs text-slate-400">
            <FaClock />
            {new Date(action.date).toLocaleTimeString("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        {/* Content */}
        <p className="mt-1 text-sm text-slate-700 dark:text-white">
          <span className="font-semibold">{action.name}</span>
          {action.etabname && (
            <span className="text-slate-400 dark:text-white"> — {action.etabname}</span>
          )}
        </p>

        {/* User */}
        <div className="flex items-center gap-3 mt-4 ">
          {!user.image || imgError ? (
            <div className="w-11 h-11 rounded-full bg-slate-400
                            flex items-center justify-center text-white font-semibold">
              {getInitials(user.name)}
            </div>
          ) : (
            <img
              src={user.image}
              onError={() => setImgError(true)}
              className="w-11 h-11 rounded-full object-cover"
            />
          )}

          <div>
            <p className="text-sm font-semibold">{user.name}</p>
            <p className="text-xs text-slate-500">
              {user.role} • {user.region}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
