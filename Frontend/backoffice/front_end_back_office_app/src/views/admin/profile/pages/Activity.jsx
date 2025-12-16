"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaPlusCircle,
  FaEdit,
  FaTrashAlt,
  FaCogs,
  FaClock,
} from "react-icons/fa";
import { getAllActivities } from "services/activityService";

export default function ActivityFeedSection() {
  const [activities, setActivities] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const data = await getAllActivities();

      // 🔄 Mapping backend → UI
      const mappedActivities = data.map((a) => ({
        id: a.id,
        user: {
          name: a.adminNom,
          initials: a.adminNom
            ? a.adminNom
                .split(" ")
                .map((n) => n[0])
                .join("")
            : "AD",
          color: "bg-purple-100 text-purple-700",
          image: a.adminImage,
        },
        timestamp: new Date(a.dateAction).toLocaleString(),
        type: `${a.action} ${a.entityName}`,
        item: a.recordName || a.nomEtablissement,
        description: `${a.action} on ${a.entityName}`,
        category: a.action?.toLowerCase(),
        icon: getIconByAction(a.action),
      }));

      setActivities(mappedActivities);
    } catch (error) {
      console.error("Failed to load activities", error);
    }
  };

  const getIconByAction = (action) => {
    switch (action) {
      case "ADD":
        return <FaPlusCircle className="text-green-500" />;
      case "UPDATE":
        return <FaEdit className="text-yellow-500" />;
      case "DELETE":
        return <FaTrashAlt className="text-red-500" />;
      default:
        return <FaCogs className="text-blue-500" />;
    }
  };

  const filteredActivities =
    activeFilter === "all"
      ? activities
      : activities.filter((a) => a.category === activeFilter);

  return (
    <div className="w-full p-6 bg-white shadow-md rounded-xl">
      <h1 className="mb-6 text-xl font-semibold text-gray-700">Activity</h1>

      <div className="grid grid-cols-1 gap-4">
        {filteredActivities.map((activity) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 border rounded-xl bg-gray-50"
          >
            {/* USER */}
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center justify-center w-10 h-10 font-bold rounded-full">
                {activity.user.image ? (
                  <img
                    src={activity.user.image}
                    alt={activity.user.name}
                    className="object-cover w-full h-full rounded-full"
                  />
                ) : (
                  <span className={`${activity.user.color}`}>
                    {activity.user.initials}
                  </span>
                )}
              </div>

              <div>
                <p className="text-sm font-bold text-gray-800">
                  {activity.user.name}
                </p>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <FaClock />
                  {activity.timestamp}
                </div>
              </div>
            </div>

            {/* DESCRIPTION */}
            <p className="text-sm text-gray-700">
              <span className="font-semibold">{activity.item}</span> —{" "}
              {activity.description}
            </p>

            {/* ICON */}
            <div className="flex items-center gap-2 mt-3 text-xs">
              {activity.icon}
              <span className="text-gray-600">View details</span>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredActivities.length === 0 && (
        <p className="mt-10 text-sm text-center text-gray-400">
          No activities found
        </p>
      )}
    </div>
  );
}
