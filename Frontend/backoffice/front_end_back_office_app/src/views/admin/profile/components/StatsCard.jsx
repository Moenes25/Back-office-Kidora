"use client";

import { motion } from "framer-motion";

export default function StatsCard({ label, value, icon, gradient }) {
  return (
    <motion.div
      className={`rounded-xl bg-gradient-to-br p-[1px] shadow-lg ${gradient}`}
      whileHover={{ scale: 1.03, y: -3 }}
    >
      <div className="flex items-center gap-3 p-3 bg-white rounded-xl">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white`}
        >
          {icon}
        </div>

        <div className="flex flex-col">
          <span className="text-xs font-medium text-gray-500">
            {label}
          </span>
          <span className="text-lg font-bold text-gray-800">
            {value}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
