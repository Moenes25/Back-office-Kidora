"use client";

import React, { useEffect, useState } from "react";
import { FaCogs, FaEdit, FaPlusCircle, FaSyncAlt, FaTrashAlt } from "react-icons/fa";
import { getAllActivities } from "services/activityService";
import ActivityCard from "./components/ActivityCard";


const ActivityFeedSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    {[1, 2, 3].map((i) => (
      <div key={i} className="flex gap-3 p-4 bg-gray-100 rounded-xl">
        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="w-1/3 h-3 bg-gray-300 rounded"></div>
          <div className="w-full h-3 bg-gray-200 rounded"></div>
        </div>
      </div>
    ))}
  </div>
);

export default function ActivityFeedSection() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const data = await getAllActivities();

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
        timestamp: new Date(a.dateAction),
        type: `${a.action} ${a.entityName}`,
        item: a.recordName || a.nomEtablissement,
        description: `${a.action} on ${a.entityName}`,
        category: a.action?.toLowerCase(),
        icon: getIconByAction(a.action),
      }));

      setActivities(mappedActivities);
    } catch (error) {
      console.error("Failed to load activities", error);
    } finally {
      setLoading(false);
    }
  };

  const getIconByAction = (action) => {
    switch (action) {
      case "CREATION":
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
    <div className="w-full p-6 bg-white shadow-xl rounded-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-700">Activity Feed</h1>
        <div className="flex items-center gap-3">
          <select
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
            className="px-3 py-1 text-sm border rounded-lg"
          >
            <option value="all">All</option>
            <option value="add">Add</option>
            <option value="update">Update</option>
            <option value="delete">Delete</option>
          </select>

          <button
            onClick={fetchActivities}
            className="p-2 text-white rounded-lg gradient-bg hover:bg-purple-600"
            title="Refresh Activities"
          >
            <FaSyncAlt />
          </button>
          
        </div>
      </div>

       

      {loading ? (
        <ActivityFeedSkeleton />
      ) : filteredActivities.length === 0 ? (
        <p className="mt-10 text-sm text-center text-gray-400">
          No activities found
        </p>
      ) : (
        <div className="relative">
          {/* TIME LINE */}
          <div className="absolute w-1 h-full rounded-full left-[6px] gradient-bg"></div>
          {filteredActivities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      )}
    </div>
  );
}
