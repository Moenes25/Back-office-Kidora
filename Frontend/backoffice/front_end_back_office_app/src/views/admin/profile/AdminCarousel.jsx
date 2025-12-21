"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import api from "services/api";
import { useAuth } from "context/AuthContext";
import avatar from "assets/img/avatars/avatar4.png";

export default function AdminCarousel() {
  const { user, loading: authLoading } = useAuth();

  const [admins, setAdmins] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ---------------------------------
  // FETCH ADMINS
  // ---------------------------------
  const fetchAdmins = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      let res;

      // SUPER ADMIN → ALL
      if (user.role === "SUPER_ADMIN") {
        res = await api.get("/auth/all");
      } else {
        // OTHERS → BY REGION
        res = await api.get(`/auth/byRegion?region=${user.region}`);
      }

      const formatted = res.data.map((admin) => ({
        id: admin.id,
        name: admin.nom,
        role: admin.role,
        avatar: admin.imageUrl || avatar,
        active: admin.isActive,
      }));

      setAdmins(formatted);
    } catch (err) {
      console.error("Failed to fetch admins:", err);
      setError("Failed to load admins");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  // ---------------------------------
  // LOADING STATE
  // ---------------------------------
  if (authLoading || loading) {
    return (
      <div className="flex gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-200 h-28 w-36 animate-pulse rounded-2xl"
          />
        ))}
      </div>
    );
  }

  // ---------------------------------
  // ERROR OR EMPTY STATE
  // ---------------------------------
  if (error || !admins.length) {
    return (
      <div className="flex flex-col items-center justify-center w-full gap-2 p-4 text-gray-500 bg-white shadow-xl rounded-xl">
        <p>{error || "No admins found"}</p>
        <button
          onClick={fetchAdmins}
          className="px-3 py-1 mt-2 text-white transition bg-purple-500 rounded hover:bg-purple-600"
        >
          Retry
        </button>
      </div>
    );
  }

  // ---------------------------------
  // RENDER CAROUSEL
  // ---------------------------------
  return (
    <div className="w-full p-4 bg-white shadow-xl rounded-xl">
      {/* TITLE */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2"
      >
        <h4 className="font-semibold text-gray-700">Team’s Kidora</h4>

        {/* REGION */}
        {user?.role !== "SUPER_ADMIN" && user?.region && (
          <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">
            {user.region}
          </span>
        )}

        {/* OPTIONAL FOR SUPER ADMIN */}
        {user?.role === "SUPER_ADMIN" && (
          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
            All Regions
          </span>
        )}
      </motion.div>

      {/* CAROUSEL */}
      <motion.div
        className="flex gap-3 mt-3 overflow-x-auto scrollbar-none"
        drag="x"
        dragConstraints={{ left: -600, right: 0 }}
      >
        {admins.map((admin) => (
          <motion.div
            key={admin.id}
            whileHover={{ scale: 1.05 }}
            onClick={() => setActiveId(admin.id)}
            className="flex-shrink-0 cursor-pointer w-36"
          >
            <div
              className={`flex flex-col items-center rounded-2xl border p-3 transition-all ${
                activeId === admin.id
                  ? "border-purple-400 bg-gradient-to-br from-purple-50 to-purple-100 shadow-lg"
                  : "border-gray-200 bg-white"
              }`}
            >
              {/* AVATAR */}
              <div className="relative">
                <img
                  src={admin.avatar}
                  alt={admin.name}
                  onError={(e) => (e.currentTarget.src = avatar)}
                  className="object-cover w-16 h-16 border-2 border-white rounded-full shadow"
                />
                <span
                  className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                    admin.active ? "animate-pulse bg-green-500" : "bg-red-500"
                  }`}
                />
              </div>

              {/* INFO */}
              <div className="mt-2 text-center">
                <h3 className="text-sm font-semibold text-gray-800 truncate">
                  {admin.name}
                </h3>
                <p className="truncate text-[10px] text-gray-500">
                  {admin.role}
                </p>
              </div>
            </div>
          </motion.div>
        ))}

        {/* COUNT CARD */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center justify-center flex-shrink-0 text-white shadow-md h-28 w-36 rounded-2xl bg-gradient-to-br from-purple-400 to-blue-400"
        >
          +{admins.length}
        </motion.div>
      </motion.div>

      {/* SCROLLBAR HIDE */}
      <style jsx>{`
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
