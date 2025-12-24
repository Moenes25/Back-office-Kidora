<<<<<<< HEAD
import { statsConfig } from "utils/statsConfig";
import StatsCard from "./StatsCard";


export default function ProfileStats({ stats }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {statsConfig.map((item) => (
        <StatsCard
          key={item.key}
          label={item.label}
          value={
            item.format
              ? item.format(stats[item.key])
              : stats[item.key]
          }
          icon={item.icon}
          gradient={item.gradient}
        />
      ))}
=======
"use client";

import StatsCard from "./StatsCard";
import { FiUsers, FiBriefcase, FiStar } from "react-icons/fi";

export default function ProfileStats({ stats }) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      
      <StatsCard
        label="Admins"
        value={stats.admins ?? 0}
        icon={<FiUsers />}
        accent="#6366f1"
      />

      <StatsCard
        label="Entreprises"
        value={stats.entreprises ?? 0}
        icon={<FiBriefcase />}
        accent="#22c55e"
      />

      <StatsCard
        label="Activity Score"
        value={`${stats.activityScore ?? 0}%`}
        icon={<FiStar />}
        accent="#f59e0b"
      />

>>>>>>> safa
    </div>
  );
}
