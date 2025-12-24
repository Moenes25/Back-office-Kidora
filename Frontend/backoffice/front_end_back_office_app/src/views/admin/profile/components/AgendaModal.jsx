<<<<<<< HEAD
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
=======
"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronLeft, FaChevronRight, FaAngleDown } from "react-icons/fa";

/* ---------------- HELPERS ---------------- */
const TYPE_UI = {
  ADMIN: { label: "Admin", color: "from-purple-500 to-indigo-500", emoji: "🛡" },
  USER: { label: "User", color: "from-blue-500 to-cyan-400", emoji: "👤" },
  SYSTEM: { label: "System", color: "from-green-500 to-emerald-400", emoji: "⚙" },
};

const getDotStyle = (activities = []) => {
  const types = [...new Set(activities.map((a) => a.type))];
  if (types.length > 1) return "bg-gradient-to-r from-purple-500 to-blue-500";
  return TYPE_UI[types[0]]?.color
    ? `bg-gradient-to-r ${TYPE_UI[types[0]].color}`
    : "bg-gray-300";
};

const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
const pad2 = (n) => String(n).padStart(2, "0");
const dateKey = (y, m, d) => `${y}-${pad2(m + 1)}-${pad2(d)}`;
const monthLabel = (d) =>
  d.toLocaleDateString(undefined, { month: "long", year: "numeric" });

const isSameYMD = (y, m, d, t = new Date()) =>
  y === t.getFullYear() && m === t.getMonth() && d === t.getDate();

/* ---------------- ANIMATIONS ---------------- */
const cellAnim = {
  hidden: { opacity: 0, scale: 0.85 },
  show: { opacity: 1, scale: 1 },
};

const popupAnim = {
  hidden: { opacity: 0, scale: 0.9, y: 10 },
  show: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.9, y: 10 },
};

export default function MiniCalendar({ month, activities = {} }) {
  // current month state
  const [current, setCurrent] = useState(() => {
    if (month) {
      const parsed = new Date(month);
      if (!Number.isNaN(parsed.getTime()))
        return new Date(parsed.getFullYear(), parsed.getMonth(), 1);
    }
    const t = new Date();
    return new Date(t.getFullYear(), t.getMonth(), 1);
  });

  const [selectedDay, setSelectedDay] = useState(null);
  const [openMonthPicker, setOpenMonthPicker] = useState(false);
  const monthPickerRef = useRef(null);

  const year = current.getFullYear();
  const monthIdx = current.getMonth();
  const days = useMemo(() => getDaysInMonth(year, monthIdx), [year, monthIdx]);

  // Ferme le picker au clic extérieur
  useEffect(() => {
    const onDocClick = (e) => {
      if (!openMonthPicker) return;
      if (monthPickerRef.current && !monthPickerRef.current.contains(e.target)) {
        setOpenMonthPicker(false);
      }
    };
    const onEsc = (e) => {
      if (e.key === "Escape") setOpenMonthPicker(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [openMonthPicker]);

  // Nettoie la sélection si on change de mois
  useEffect(() => {
    setSelectedDay(null);
  }, [year, monthIdx]);

  const changeMonth = (delta) => {
    setCurrent((c) => new Date(c.getFullYear(), c.getMonth() + delta, 1));
  };

  const onPickMonth = (value) => {
    // value format "YYYY-MM"
    const [yStr, mStr] = value.split("-");
    const y = parseInt(yStr, 10);
    const m = parseInt(mStr, 10);
    if (!Number.isNaN(y) && !Number.isNaN(m)) {
      setCurrent(new Date(y, m - 1, 1));
      setOpenMonthPicker(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/70
                 backdrop-blur-xl p-5 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.3)]"
    >
      {/* BACKGROUND GLOW */}
      <div className="pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full bg-purple-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-blue-300/30 blur-3xl" />

      {/* HEADER (with arrows + month dropdown) */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => changeMonth(-1)}
            aria-label="Previous month"
            className="rounded-lg p-1.5 border border-slate-200 hover:bg-white transition"
          >
            <FaChevronLeft />
          </button>

          <button
            onClick={() => setOpenMonthPicker((v) => !v)}
            className="relative flex items-center gap-1 rounded-lg px-2 py-1 hover:bg-white transition"
            aria-haspopup="dialog"
            aria-expanded={openMonthPicker}
          >
            <h3 className="text-sm font-bold gradient-text">
              {monthLabel(current)}
            </h3>
            <FaAngleDown className="text-slate-500" />
          </button>

          <button
            onClick={() => changeMonth(1)}
            aria-label="Next month"
            className="rounded-lg p-1.5 border border-slate-200 hover:bg-white transition"
          >
            <FaChevronRight />
          </button>
        </div>

        <span className="text-xs text-gray-500">
          {Object.keys(activities).length} active days
        </span>
      </div>

      {/* Month dropdown (native month input for simplicity) */}
      <AnimatePresence>
        {openMonthPicker && (
          <motion.div
            ref={monthPickerRef}
            variants={popupAnim}
            initial="hidden"
            animate="show"
            exit="exit"
            className="absolute z-50 mt-1 rounded-2xl border border-white/40 bg-white/95 backdrop-blur-xl p-3 shadow-xl"
          >
            <label className="text-xs font-semibold text-slate-600">
              Jump to month
            </label>
            <input
              type="month"
              defaultValue={`${year}-${pad2(monthIdx + 1)}`}
              onChange={(e) => onPickMonth(e.target.value)}
              className="mt-2 w-44 rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* CALENDAR GRID */}
      <div className="grid grid-cols-7 gap-2 mt-2">
        {Array.from({ length: days }, (_, i) => i + 1).map((day) => {
          const key = dateKey(year, monthIdx, day);
          const dayActivities = activities[key];

          return (
            <motion.div
              key={day}
              variants={cellAnim}
              initial="hidden"
              animate="show"
              className="relative flex justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.18 }}
                whileTap={{ scale: 0.9 }}
                onClick={() =>
                  setSelectedDay((s) => (s === key ? null : key))
                }
                className={`relative flex h-9 w-9 items-center justify-center rounded-full text-xs font-medium transition
                  ${
                    selectedDay === key
                      ? "bg-purple-100 text-purple-700 font-semibold"
                      : "hover:bg-white"
                  }`}
              >
                {day}

                {/* TODAY HALO */}
                {isSameYMD(year, monthIdx, day) && (
                  <motion.span
                    className="absolute inset-0 rounded-full border border-purple-400"
                    animate={{ scale: [1, 1.7], opacity: [0.6, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}

                {/* ACTIVITY DOT */}
                {dayActivities && (
                  <motion.span
                    className={`absolute -bottom-0.5 h-2 w-2 rounded-full ${getDotStyle(
                      dayActivities
                    )}`}
                    animate={{ scale: [1, 1.25, 1] }}
                    transition={{ duration: 1.4, repeat: Infinity }}
                  />
                )}
              </motion.button>

              {/* POPUP */}
              <AnimatePresence>
                {selectedDay === key && dayActivities && (
                  <motion.div
                    variants={popupAnim}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    transition={{ type: "spring", stiffness: 280, damping: 20 }}
                    className="absolute top-12 z-50 w-48 rounded-2xl border border-white/40 bg-white/90 backdrop-blur-xl p-3 shadow-xl"
                  >
                    <p className="text-xs font-bold gradient-text">
                      {day}{" "}
                      {current.toLocaleDateString(undefined, {
                        month: "long",
                      })}{" "}
                      {year}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      🔔 {dayActivities.length} activities
                    </p>

                    <div className="mt-2 space-y-1">
                      {dayActivities.map((a, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs">
                          <span>{TYPE_UI[a.type]?.emoji}</span>
                          <span className="font-medium">
                            {TYPE_UI[a.type]?.label}
                          </span>
                          <span className="text-gray-400">· {a.region}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Styles utilitaires */}
      <style>{`
        .gradient-text {
          background: linear-gradient(90deg, #8b5cf6, #c048ec, #3b82f6);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          animation: gradientMove 5s ease infinite;
        }
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </motion.div>
  );
}
>>>>>>> safa
