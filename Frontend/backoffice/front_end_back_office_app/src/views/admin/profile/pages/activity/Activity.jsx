"use client";
import { useEffect, useState, useMemo } from "react";
import { FaSyncAlt } from "react-icons/fa";
import { getAllActivities } from "services/activityService";
import { normalizeAction } from "utils/activityMapper";
import { ACTION_UI } from "utils/activityUIConfig";
import { groupActivitiesByDay } from "utils/groupByDate";
import ActivityCard from "./components/ActivityCard";
import { ENTITY_CONFIG } from "utils/entityIcon";

export default function ActivityFeedSection() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [filterAction, setFilterAction] = useState("");
  const [filterEntity, setFilterEntity] = useState("");
  const [filterDate, setFilterDate] = useState("");

  // Pagination / Show more
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

      const sorted = mapped.sort(
        (a, b) => new Date(b.action.date) - new Date(a.action.date)
      );

      setActivities(sorted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters
  const filteredActivities = useMemo(() => {
    return activities.filter((a) => {
      const matchAction = filterAction ? a.action.type === filterAction : true;
      const matchEntity = filterEntity ? a.action.entity === filterEntity : true;
      const matchDate = filterDate
        ? new Date(a.action.date).toDateString() === new Date(filterDate).toDateString()
        : true;
      return matchAction && matchEntity && matchDate;
    });
  }, [activities, filterAction, filterEntity, filterDate]);

  const grouped = groupActivitiesByDay(filteredActivities);

  // Flatten grouped activities to control visible count
  const flatActivities = Object.entries(grouped).flatMap(([day, acts]) =>
    acts.map((act) => ({ ...act, day }))
  );

  const visibleActivities = flatActivities.slice(0, visibleCount);

  // Regroup visible activities
  const visibleGrouped = groupActivitiesByDay(visibleActivities);

  return (
    <div className="relative p-6 bg-white shadow rounded-2xl">
      {/* Header with refresh */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-700">Activity Feed</h2>
        <button
          onClick={fetchActivities}
          className="flex items-center gap-1 px-3 py-1 text-sm text-white bg-purple-600 rounded-lg hover:bg-purple-700"
        >
          <FaSyncAlt /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}
          className="px-3 py-2 border rounded-lg"
        >
          <option value="">All Actions</option>
          {Object.keys(ACTION_UI).map((key) => (
            <option key={key} value={key}>
              {ACTION_UI[key].label}
            </option>
          ))}
        </select>

        <select
          value={filterEntity}
          onChange={(e) => setFilterEntity(e.target.value)}
          className="px-3 py-2 border rounded-lg"
        >
          <option value="">All Entities</option>
          {Object.keys(ENTITY_CONFIG).map((key) => (
            <option key={key} value={key}>
              {ENTITY_CONFIG[key].label}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="px-3 py-2 border rounded-lg"
        />
      </div>

      {/* Timeline line */}
      <div className="absolute left-[22px] top-20 bottom-6 w-px bg-gray-200" />

      {loading ? (
        // Skeleton loader
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-4 pl-10 animate-pulse">
              <div className="absolute left-[18px] top-4 h-3 w-3 rounded-full bg-gray-300" />
              <div className="flex-1 h-24 p-3 bg-gray-200 border border-gray-200 rounded-lg" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {Object.entries(visibleGrouped).map(([day, acts]) => (
            <div key={day} className="mb-8">
              {/* Day Header */}
              <h3 className="mb-4 ml-10 text-sm font-semibold text-gray-500">{day}</h3>

              <div className="space-y-4">
                {acts.map((activity) => (
                  <ActivityCard key={activity.id} activity={activity} />
                ))}
              </div>
            </div>
          ))}

          {/* Show More button */}
          {visibleCount < flatActivities.length && (
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setVisibleCount((prev) => prev + 6)}
                className="px-4 py-2 text-white transition bg-purple-600 rounded-lg hover:bg-purple-700"
              >
                Show More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
