"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { FaSyncAlt, FaFilter, FaCalendarAlt } from "react-icons/fa";
import { getAllActivities } from "services/activityService";
import { normalizeAction } from "utils/activityMapper";
import { ACTION_UI } from "utils/activityUIConfig";
import { groupActivitiesByDay } from "utils/groupByDate";
import ActivityCard from "./components/ActivityCard";
import { ENTITY_CONFIG } from "utils/entityIcon";
import { FaStream } from "react-icons/fa";

export default function ActivityFeedSection() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filterAction, setFilterAction] = useState("");
  const [filterEntity, setFilterEntity] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const data = await getAllActivities();

      const mapped = data.map((a) => {
        const type = normalizeAction(a.action);
        return {
          id: a.id,
          user: {
            name: a.adminNom,
            role: a.adminRole,
            image: a.adminImage,
            region: a.adminRegion,
          },
          action: {
            type,
            name: a.recordName,
            date: a.dateAction,
            entity: a.entityName,
            etabname: a.nomEtablissement,
          },
          ui: ACTION_UI[type],
        };
      });

      setActivities(
        mapped.sort(
          (a, b) => new Date(b.action.date) - new Date(a.action.date)
        )
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredActivities = useMemo(() => {
    return activities.filter((a) => {
      const matchAction = filterAction ? a.action.type === filterAction : true;
      const matchEntity = filterEntity ? a.action.entity === filterEntity : true;
      const matchDate = filterDate
        ? new Date(a.action.date).toDateString() ===
          new Date(filterDate).toDateString()
        : true;
      return matchAction && matchEntity && matchDate;
    });
  }, [activities, filterAction, filterEntity, filterDate]);

  const grouped = groupActivitiesByDay(filteredActivities);

  const flatActivities = Object.entries(grouped).flatMap(([day, acts]) =>
    acts.map((act) => ({ ...act, day }))
  );

  const visibleActivities = flatActivities.slice(0, visibleCount);
  const visibleGrouped = groupActivitiesByDay(visibleActivities);

  return (
    <section
      className="relative rounded-3xl bg-white border border-slate-200
                 shadow-[0_30px_70px_-35px_rgba(0,0,0,0.25)] p-8"
    >
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between mb-6">
 <div className="flex items-center gap-3">
  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100">
    <FaStream className="text-purple-600" />
  </div>
  <div>
    <h2 className="text-xl font-bold text-slate-800">Activity Feed</h2>
    <p className="text-sm text-slate-500">
      Track all system actions and user operations
    </p>
  </div>
</div>

        <button
          onClick={fetchActivities}
          className="flex items-center gap-2 px-4 py-2
                     rounded-xl text-sm font-semibold text-white
                     bg-gradient-to-r from-purple-500 to-indigo-500
                     hover:scale-[1.03] transition"
        >
          <FaSyncAlt />
          Refresh
        </button>
      </div>

      {/* ================= FILTER BAR ================= */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap gap-3 mb-10"
      >
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl
                        border border-slate-200 bg-slate-50">
          <FaFilter className="text-slate-400" />
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="bg-transparent text-sm outline-none"
          >
            <option value="">All Actions</option>
            {Object.keys(ACTION_UI).map((key) => (
              <option key={key} value={key}>
                {ACTION_UI[key].label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 px-3 py-2 rounded-xl
                        border border-slate-200 bg-slate-50">
          <select
            value={filterEntity}
            onChange={(e) => setFilterEntity(e.target.value)}
            className="bg-transparent text-sm outline-none"
          >
            <option value="">All Entities</option>
            {Object.keys(ENTITY_CONFIG).map((key) => (
              <option key={key} value={key}>
                {ENTITY_CONFIG[key].label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 px-3 py-2 rounded-xl
                        border border-slate-200 bg-slate-50">
          <FaCalendarAlt className="text-slate-400" />
          <input
            type="date"
            value={filterDate || ""}
            onChange={(e) => setFilterDate(e.target.value)}
            className="bg-transparent text-sm outline-none"
          />

          + {filterDate && (
   <button
     onClick={() => setFilterDate("")}
     className="ml-1 rounded-lg px-2 py-1 text-xs font-semibold
                text-purple-600 hover:text-purple-700
                bg-white border border-slate-200 hover:border-purple-300"
     title="Show all days"
   >
     All days
   </button>
 )}
        </div>
      </motion.div>

      {/* ================= TIMELINE ================= */}
      <div className="absolute left-[30px] top-[180px] bottom-8 w-px bg-slate-200" />

      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-slate-200 ml-10" />
          ))}
        </div>
      ) : (
        <>
          {Object.entries(visibleGrouped).map(([day, acts]) => (
            <div key={day} className="mb-10">
              <h3 className="ml-10 mb-4 text-sm font-semibold text-slate-500">
                {day}
              </h3>

              <div className="space-y-4">
                {acts.map((activity) => (
                  <ActivityCard key={activity.id} activity={activity} />
                ))}
              </div>
            </div>
          ))}

          {visibleCount < flatActivities.length && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setVisibleCount((p) => p + 6)}
                className="px-6 py-2 rounded-xl text-sm font-semibold
                           text-white bg-gradient-to-r from-purple-500 to-indigo-500
                           hover:scale-[1.03] transition"
              >
                Load More
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
