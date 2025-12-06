"use client";

import React from "react";
import { motion } from "framer-motion";
import Dropdown from "components/dropdown";
import { FaBuilding, FaTrashAlt, FaUserPlus, FaEdit, FaBell } from "react-icons/fa";

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

export default function NotificationsDropdown() {
  const unreadCount = rawNotifications.length;

  const groups = {
    Today: rawNotifications.filter((n) => n.day === "today"),
    Yesterday: rawNotifications.filter((n) => n.day === "yesterday"),
    "This Week": rawNotifications.filter((n) => n.day === "week"),
  };

  return (
    <Dropdown
      button={
        <div className="relative cursor-pointer">
          <FaBell size={22} className="text-white dark:text-white" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </div>
      }
      classNames="py-2 top-6 -left-[260px] md:-left-[270px] w-max "
      children={
        <div className="flex flex-col w-[300px] max-h-[200px] bg-white dark:bg-navy-700 rounded-xl p-3 shadow-lg overflow-y-auto space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-gray-700 dark:text-white">
              Notifications
            </p>
            <button className="text-xs font-bold text-gray-500 hover:text-gray-700 dark:text-gray-300">
              Mark all read
            </button>
          </div>

          {/* Notifications List */}
          {Object.keys(groups).map(
            (g) =>
              groups[g].length > 0 && (
                <div key={g}>
                  <p className="mb-1 text-[10px] text-gray-400">{g}</p>
                  <div className="space-y-1">
                    {groups[g].map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`flex items-start gap-2 p-2 rounded-lg border ${item.color} hover:shadow-sm transition cursor-pointer`}
                      >
                        <div className="flex items-center justify-center bg-white rounded-full shadow-sm w-7 h-7">
                          {item.icon}
                        </div>
                        <div className="flex-1 text-[11px]">
                          <p className="font-semibold text-gray-700 dark:text-white">
                            {item.user}
                          </p>
                          <p className="text-gray-600 dark:text-gray-300">
                            {item.action}{" "}
                            <span className="font-medium">{item.target}</span>
                          </p>
                          <p className="text-[9px] text-gray-400 mt-0.5">{item.time}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )
          )}
        </div>
      }
    />
  );
}
