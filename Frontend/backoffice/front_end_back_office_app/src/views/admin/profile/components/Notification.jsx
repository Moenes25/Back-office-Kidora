"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaBuilding,
  FaTrashAlt,
  FaUserPlus,
  FaEdit,
  FaBell,
} from "react-icons/fa";

export default function Notifications() {
  const [filter, setFilter] = useState("all");

  const rawNotifications = [
    {
      id: 1,
      type: "company",
      icon: <FaBuilding size={14} className="text-blue-500" />,
      user: "Super Admin",
      action: "added company",
      target: "TechNova",
      time: "08:30",
      day: "today",
      color: "border-blue-300 bg-blue-50",
    },
    {
      id: 2,
      type: "admin_delete",
      icon: <FaTrashAlt size={14} className="text-red-500" />,
      user: "Super Admin",
      action: "deleted admin",
      target: "Mohamed Ali",
      time: "07:50",
      day: "today",
      color: "border-red-300 bg-red-50",
    },
    {
      id: 3,
      type: "admin_add",
      icon: <FaUserPlus size={14} className="text-green-500" />,
      user: "Super Admin",
      action: "added admin",
      target: "Sara Ben",
      time: "16:10",
      day: "yesterday",
      color: "border-green-300 bg-green-50",
    },
    {
      id: 4,
      type: "edit",
      icon: <FaEdit size={14} className="text-purple-500" />,
      user: "Super Admin",
      action: "updated company",
      target: "FinancePro",
      time: "11:22",
      day: "week",
      color: "border-purple-300 bg-purple-50",
    },
  ];

  const filteredNotifications =
    filter === "all"
      ? rawNotifications
      : rawNotifications.filter((n) => n.type.includes(filter));

  const groups = {
    Today: filteredNotifications.filter((n) => n.day === "today"),
    Yesterday: filteredNotifications.filter((n) => n.day === "yesterday"),
    "This Week": filteredNotifications.filter((n) => n.day === "week"),
  };

  return (
    <div className=" bg-white rounded-xl shadow-md p-4 h-[520px] flex flex-col">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-gray-700 text-md">Notifications</h2>
        <FaBell className="text-purple-600" size={18} />
      </div>

      {/* FILTER SWITCH */}
      <div className="flex gap-2 mb-3">
        {["all", "company", "admin_add", "admin_delete", "edit"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-2 py-1 text-xs rounded-lg border ${
              filter === f
                ? "bg-purple-100 text-purple-700 border-purple-300"
                : "text-gray-500 border-gray-200 hover:bg-gray-100"
            }`}
          >
            {f.replace("_", " ").toUpperCase()}
          </button>
        ))}
      </div>

      {/* SCROLLABLE SECTION */}
      <div className="pr-1 space-y-5 overflow-y-auto no-scrollbar">
        {Object.keys(groups).map(
          (g) =>
            groups[g].length > 0 && (
              <div key={g}>
                <p className="mb-1 text-xs text-gray-400">{g}</p>

                <div className="space-y-2">
                  {groups[g].map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className={`flex items-start gap-3 p-3 rounded-lg border ${item.color} hover:shadow-sm transition`}
                    >
                      <div className="flex items-center justify-center bg-white rounded-full shadow-sm w-7 h-7">
                        {item.icon}
                      </div>

                      <div className="flex-1">
                        <p className="text-xs font-semibold text-gray-700">
                          {item.user}
                        </p>
                        <p className="text-xs text-gray-600">
                          {item.action}{" "}
                          <span className="font-medium text-gray-900">
                            {item.target}
                          </span>
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1">
                          {item.time}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )
        )}
      </div>

      {/* HIDE SCROLLBAR */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
