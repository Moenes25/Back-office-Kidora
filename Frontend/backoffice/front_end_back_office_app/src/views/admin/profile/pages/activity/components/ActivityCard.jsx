"use client";
import { motion } from "framer-motion";
import { FaClock } from "react-icons/fa";

export default function ActivityCard({ activity }) {
  const { user, action, ui } = activity;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative flex gap-4 pl-10"
    >
      {/* Timeline Dot */}
      <span
        className={`absolute left-[18px] top-4 h-3 w-3 rounded-full ${ui.dot}`}
      />

      {/* Card */}
      <div className={`flex-1 rounded-lg border border-gray-200 p-3 ${ui.bg}`}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className={ui.color}>{ui.icon}</span>
            <span className={ui.color}>{ui.label}</span>
            {action.entity && (
              <span className="text-gray-400">• {action.entity}</span>
            )}
          </div>

          <div className="flex items-center gap-1 text-xs text-gray-400">
            <FaClock />
            {new Date(action.date).toLocaleTimeString("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>

        {/* Content */}
        <p className="mt-1 text-sm text-gray-700">
          <span className="font-semibold">{action.name}</span>
          {action.etabname && (
            <span className="text-gray-400"> — {action.etabname}</span>
          )}
        </p>

        {/* User */}
        <div className="flex items-center gap-2">
          <img
            src={user.image}
            alt=""
            className="object-cover w-12 h-12 rounded-full"
          />
          <div className="">
            <div className="flex items-center gap-1">
              <p className="text-sm font-medium">{user.name} </p>
              <p className="text-xs">{user.region} </p>
            </div>
            <p className="text-xs">{user.role} </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
