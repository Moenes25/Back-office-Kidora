import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ---------------- HELPERS ---------------- */
const getDotColor = (activities = []) => {
  const types = [...new Set(activities.map((a) => a.type))];

  if (types.length > 1)
    return "bg-gradient-to-r from-purple-500 to-blue-500";
  if (types[0] === "ADMIN") return "bg-purple-500";
  if (types[0] === "USER") return "bg-blue-500";
  if (types[0] === "SYSTEM") return "bg-green-500";
  return "bg-gray-300";
};

const isToday = (day) => {
  const today = new Date();
  return day === today.getDate();
};

/* ---------------- COMPONENT ---------------- */
const MiniCalendar = ({ month, activities = {} }) => {
  const [selectedDay, setSelectedDay] = useState(null);
  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 border shadow-lg rounded-2xl border-white/30 bg-white/70 backdrop-blur-xl"
    >
      {/* Header */}
      <h3 className="mb-3 text-sm font-semibold gradient-text">
        {month}
      </h3>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => {
          const dateKey = `2025-03-${String(day).padStart(2, "0")}`;
          const dayActivities = activities[dateKey];

          return (
            <div key={day} className="relative">
              <motion.button
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  setSelectedDay(
                    selectedDay === dateKey ? null : dateKey
                  )
                }
                className={`
                  relative flex h-8 w-8 items-center justify-center rounded-full text-xs
                  transition
                  ${
                    selectedDay === dateKey
                      ? "bg-purple-100 font-semibold"
                      : "hover:bg-white"
                  }
                `}
              >
                {day}

                {/* Today Pulse */}
                {isToday(day) && (
                  <motion.span
                    className="absolute inset-0 border border-purple-400 rounded-full"
                    animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                    }}
                  />
                )}

                {/* Activity Dot */}
                {dayActivities && (
                  <span
                    className={`absolute bottom-0.5 h-1.5 w-1.5 rounded-full ${getDotColor(
                      dayActivities
                    )}`}
                  />
                )}
              </motion.button>

              {/* Popup */}
              <AnimatePresence>
                {selectedDay === dateKey && dayActivities && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.92, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 8 }}
                    transition={{ type: "spring", stiffness: 260 }}
                    className="absolute z-50 p-3 mt-2 border shadow-xl w-44 rounded-xl border-white/40 bg-white/90 backdrop-blur-xl"
                  >
                    <p className="text-xs font-semibold gradient-text">
                      {day} {month}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      🔔 {dayActivities.length} activities
                    </p>

                    <div className="mt-2 space-y-1">
                      {dayActivities.map((a, i) => (
                        <p key={i} className="text-xs">
                          {a.type === "ADMIN" && "🛡 Admin"}
                          {a.type === "USER" && "👤 User"}
                          {a.type === "SYSTEM" && "⚙ System"}
                          <span className="text-gray-400">
                            {" "}
                            · {a.region}
                          </span>
                        </p>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default MiniCalendar;
