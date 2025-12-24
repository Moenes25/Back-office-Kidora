"use client";

import { useEffect, useState } from "react";
import { useAuth } from "context/AuthContext";

export default function useProfileStats() {
  const { token } = useAuth();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllStats = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        // 🚀 fetch everything ONCE
        const [etabRes, adminRes, activityRes] = await Promise.all([
          fetch(`${process.env.REACT_APP_API_URL}/etablissement/all`, { headers }),
          fetch(`${process.env.REACT_APP_API_URL}/auth/all`, { headers }),
          fetch(`${process.env.REACT_APP_API_URL}/activity/all`, { headers }),
        ]);

        if (!etabRes.ok || !adminRes.ok || !activityRes.ok)
          throw new Error("Stats fetch failed");

        const [etabs, admins, activities] = await Promise.all([
          etabRes.json(),
          adminRes.json(),
          activityRes.json(),
        ]);

        //  compute stats client-side
        setStats({
          entreprises: etabs.length,
          admins: admins.length,
          activityScore: Math.min(100, activities.length),
        });
      } catch (error) {
        console.error("Profile stats error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchAllStats();
  }, [token]);

  return { stats, loading };
}
