"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { TbActivity } from "react-icons/tb";
import {
  FaAddressCard,
  FaPlusCircle,
  FaEdit,
  FaTrashAlt,
  FaCogs,
  FaClock,
} from "react-icons/fa";

export default function ActivityFeedSection() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const activities = [
    {
      id: 1,
      user: { initials: "NR", name: "Nesrin", role: "Super Admin", color: "bg-purple-100 text-purple-700" },
      timestamp: "2 hours ago",
      type: "Add Company",
      icon: <FaPlusCircle className="text-green-500" />,
      item: "Acme Corp",
      description: "Added a new company with full access.",
      category: "add",
    },
    {
      id: 2,
      user: { initials: "AD", name: "Admin User", role: "Admin", color: "bg-red-100 text-red-600" },
      timestamp: "3 hours ago",
      type: "Edit User",
      icon: <FaEdit className="text-yellow-500" />,
      item: "Sara Chen",
      description: "Updated user roles and permissions.",
      category: "edit",
    },
    {
      id: 3,
      user: { initials: "MM", name: "Morgan", role: "Manager", color: "bg-blue-100 text-blue-700" },
      timestamp: "Yesterday, 10:30 AM",
      type: "Delete Project",
      icon: <FaTrashAlt className="text-red-500" />,
      item: "Project Helium 01",
      description: "Deleted project and all related records.",
      category: "delete",
    },
    {
      id: 4,
      user: { initials: "TJ", name: "Taylor", role: "Admin", color: "bg-teal-100 text-teal-700" },
      timestamp: "April 10, 2:15 PM",
      type: "Settings Updated",
      icon: <FaCogs className="text-blue-500" />,
      item: "Notification Settings",
      description: "Updated system-wide alerts.",
      category: "settings",
    },
  ];

  const filters = [
    { id: "all", label: "All Activity" },
    { id: "add", label: "Additions" },
    { id: "edit", label: "Edits" },
    { id: "delete", label: "Deletions" },
    { id: "settings", label: "Settings" },
  ];

  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  const filteredActivities =
    activeFilter === "all"
      ? activities
      : activities.filter((a) => a.category === activeFilter);

  /* 🔥 CARD COMPONENT */
  const ActivityCard = ({ activity }) => {
    const { user, timestamp, type, item, description, icon } = activity;

    return (
      <motion.div
        variants={rowVariants}
        initial="hidden"
        animate="visible"
        className="relative w-full p-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition"
      >
        {/* TOP USER INFO */}
        <div className="flex items-center gap-3 mb-3">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold shadow ${user.color}`}
          >
            {user.initials}
          </div>

          <div className="flex-1">
            <p className="text-sm font-bold text-gray-800">
              {user.name} <span className="font-medium text-gray-500">• {type}</span>
            </p>

            <div className="flex items-center gap-1 text-xs text-blue-600">
              <FaClock className="w-3 h-3" />
              {timestamp}
            </div>
          </div>
        </div>

        {/* DESCRIPTION */}
        <p className="text-sm text-gray-700 mb-3">
          <span className="font-semibold text-gray-900">{item}</span> — {description}
        </p>

        {/* ACTION BOTTOM */}
        <div className="flex items-center gap-2 px-3 py-2 text-xs border rounded-lg bg-gray-50">
          {icon}
          <span className="font-medium text-gray-700">View Details</span>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="w-full p-6 bg-white shadow-md rounded-xl">
      {/* HEADER */}
      <div className="flex flex-col justify-between mb-6 sm:flex-row sm:items-center">
        <div className="flex items-center  mb-6 gap-2 py-4 ">
        <FaAddressCard size={20} className="text-purple-600" />
        <h1 className="text-xl font-semibold text-gray-700">
          Activity
        </h1>
      </div>

       
        </div>
         {/* FILTER DROPDOWN */}
        <div className="relative mt-3 sm:mt-0">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            {filters.find((f) => f.id === activeFilter)?.label}
          </button>

          {isDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsDropdownOpen(false)}
              />

              <div className="absolute right-0 z-20 w-56 mt-2 bg-white border border-gray-200 shadow-lg rounded-xl">
                <div className="p-2">
                  {filters.map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => {
                        setActiveFilter(filter.id);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
                        activeFilter === filter.id
                          ? "bg-purple-50 text-purple-600"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
      </div>

      {/* ACTIVITY LIST */}
      <div className="grid grid-cols-1 gap-4">
        {filteredActivities.map((activity) => (
          <ActivityCard key={activity.id} activity={activity} />
        ))}
      </div>

      {/* EMPTY STATE */}
      {filteredActivities.length === 0 && (
        <div className="py-10 text-center text-gray-500">
          <p className="text-sm">No activities match the selected filter</p>
          <button
            onClick={() => setActiveFilter("all")}
            className="px-4 py-2 mt-3 text-sm font-medium text-purple-600 transition-colors rounded-lg bg-purple-50 hover:bg-purple-100"
          >
            Show all activities
          </button>
        </div>
      )}
    </div>
  );
}
