"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  FaUserShield, 
  FaPlusCircle, 
  FaEdit, 
  FaTrashAlt, 
  FaCogs, 
  FaClock 
} from "react-icons/fa";

export default function ActivityFeedSection() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const activities = [
    {
      id: 1,
      user: { initials: 'NR', name: 'Nesrin', role: 'Super Admin', color: 'bg-purple-100 text-purple-700' },
      timestamp: '2 hours ago',
      type: 'Add Company',
      icon: <FaPlusCircle className="w-4 h-4" />,
      item: 'Company: Acme Corp',
      description: 'Added a new company to the platform with full admin access.',
      category: 'add',
      color: 'bg-green-50 text-green-700'
    },
    {
      id: 2,
      user: { initials: 'AD', name: 'Admin User', role: 'Admin', color: 'bg-red-100 text-red-600' },
      timestamp: '3 hours ago',
      type: 'Edit User',
      icon: <FaEdit className="w-4 h-4" />,
      item: 'User: Sara Chen',
      description: 'Updated user permissions and roles.',
      category: 'edit',
      color: 'bg-yellow-50 text-yellow-700'
    },
    {
      id: 3,
      user: { initials: 'MM', name: 'Morgan', role: 'Manager', color: 'bg-blue-100 text-blue-700' },
      timestamp: 'Yesterday, 10:30 AM',
      type: 'Delete Project',
      icon: <FaTrashAlt className="w-4 h-4" />,
      item: 'Project: Helium 01',
      description: 'Deleted a project and all its associated resources.',
      category: 'delete',
      color: 'bg-red-50 text-red-700'
    },
    {
      id: 4,
      user: { initials: 'TJ', name: 'Taylor', role: 'Admin', color: 'bg-teal-100 text-teal-700' },
      timestamp: 'April 10, 2:15 PM',
      type: 'Settings Updated',
      icon: <FaCogs className="w-4 h-4" />,
      item: 'Notification Settings',
      description: 'Updated system-wide notification settings for all users.',
      category: 'settings',
      color: 'bg-blue-50 text-blue-700'
    }
  ];

  const filters = [
    { id: "all", label: "All Activity" },
    { id: "add", label: "Additions" },
    { id: "edit", label: "Edits" },
    { id: "delete", label: "Deletions" },
    { id: "settings", label: "Settings" }
  ];

  const currentFilter = filters.find(f => f.id === activeFilter) || filters[0];
  const filteredActivities = activeFilter === "all" ? activities : activities.filter(a => a.category === activeFilter);

  const ActivityCard = ({ activity }) => {
    const { user, timestamp, type, item, description, icon, color } = activity;
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }}
        className="p-5 mb-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden shadow-xl rounded-2xl"
      >
        <div className="flex items-start gap-4">
          <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm ${user.color}`}>
            {user.initials}
          </div>
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2">
              <div>
                <h3 className="text-sm font-semibold text-gray-800">{user.name}</h3>
                <span className="px-2 py-0.5 text-xs font-medium rounded bg-gray-100 text-gray-600">{user.role}</span>
              </div>
              <div className="flex items-center gap-2 mt-1 sm:mt-0 text-xs text-gray-500">
                <FaClock className="w-3 h-3" /> {timestamp}
              </div>
            </div>

            <div className={`flex items-center gap-2 px-2 py-1 rounded text-sm font-medium ${color}`}>
              {icon} <span>{type}</span>
            </div>

            <div className="mt-2 text-sm text-gray-700">
              <strong>{item}</strong>
              <p>{description}</p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="w-full p-6 bg-white rounded-xl shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-700">Activity Feed</h1>

        <div className="relative mt-3 sm:mt-0">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            {currentFilter.label}
          </button>

          {isDropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
              <div className="absolute right-0 z-20 w-56 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg">
                <div className="p-2">
                  {filters.map(filter => (
                    <button
                      key={filter.id}
                      onClick={() => {
                        setActiveFilter(filter.id);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
                        activeFilter === filter.id ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"
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
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredActivities.map(activity => (
          <ActivityCard key={activity.id} activity={activity} />
        ))}
      </div>

      {filteredActivities.length === 0 && (
        <div className="py-10 text-center text-gray-500">
          <p className="text-sm">No activities match the selected filter</p>
          <button
            onClick={() => setActiveFilter("all")}
            className="px-4 py-2 mt-3 text-sm font-medium text-blue-600 transition-colors rounded-lg bg-blue-50 hover:bg-blue-100"
          >
            Show all activities
          </button>
        </div>
      )}
    </div>
  );
}
