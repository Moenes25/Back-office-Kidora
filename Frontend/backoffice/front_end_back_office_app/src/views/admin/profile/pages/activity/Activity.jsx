"use client";
import { useEffect, useState } from "react";
import { getAllActivities } from "services/activityService";
import { normalizeAction } from "utils/activityMapper";
import { ACTION_UI } from "utils/activityUIConfig";
import { groupActivitiesByDay } from "utils/groupByDate";
import ActivityCard from "./components/ActivityCard";

export default function ActivityFeedSection() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
  setLoading(true);
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
    (a, b) =>
      new Date(b.action.date) - new Date(a.action.date)
  );

  setActivities(sorted);
  setLoading(false);
};


  const grouped = groupActivitiesByDay(activities);

  if (loading) return <p className="text-gray-400">Loading…</p>;

  return (
    <div className="relative p-6 bg-white shadow rounded-2xl">
      {/* Timeline line */}
      <div className="absolute left-[22px] top-20 bottom-6 w-px bg-gray-200" />

      {Object.entries(grouped).map(([day, acts]) => (
        <div key={day} className="mb-8">
          {/* Day Header */}
          <h3 className="mb-4 ml-10 text-sm font-semibold text-gray-500">
            {day}
          </h3>

          <div className="space-y-4">
            {acts.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
