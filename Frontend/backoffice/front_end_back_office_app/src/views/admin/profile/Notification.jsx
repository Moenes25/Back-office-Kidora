"use client";

<<<<<<< HEAD
import { useState } from "react";
import { motion } from "framer-motion";
=======
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
>>>>>>> safa
import {
  FaBuilding,
  FaTrashAlt,
  FaUserPlus,
  FaEdit,
  FaBell,
<<<<<<< HEAD
} from "react-icons/fa";

export default function Notifications() {
  const [filter, setFilter] = useState("all");

  const rawNotifications = [
    {
      id: 1,
      type: "company",
      icon: <FaBuilding size={14} className="text-blue-500" />,
=======
  FaCheckDouble,
} from "react-icons/fa";

/* ----------------------------- CONFIG UI ----------------------------- */
const FILTERS = [
  { key: "all", label: "All" },
  { key: "company", label: "Company" },
  { key: "admin_add", label: "Admin Added" },
  { key: "admin_delete", label: "Admin Deleted" },
  { key: "edit", label: "Updates" },
];

const TYPE_STYLE = {
  company: {
    dot: "bg-blue-500",
    ring: "ring-blue-200",
    pill: "from-blue-500 to-cyan-400",
    soft: "bg-blue-50 border-blue-200",
    glow: "shadow-[0_14px_40px_-22px_rgba(59,130,246,0.55)]",
  },
  admin_delete: {
    dot: "bg-red-500",
    ring: "ring-red-200",
    pill: "from-red-500 to-rose-400",
    soft: "bg-red-50 border-red-200",
    glow: "shadow-[0_14px_40px_-22px_rgba(239,68,68,0.55)]",
  },
  admin_add: {
    dot: "bg-emerald-500",
    ring: "ring-emerald-200",
    pill: "from-emerald-500 to-lime-400",
    soft: "bg-emerald-50 border-emerald-200",
    glow: "shadow-[0_14px_40px_-22px_rgba(16,185,129,0.55)]",
  },
  edit: {
    dot: "bg-purple-500",
    ring: "ring-purple-200",
    pill: "from-purple-500 to-indigo-400",
    soft: "bg-purple-50 border-purple-200",
    glow: "shadow-[0_14px_40px_-22px_rgba(168,85,247,0.55)]",
  },
};

const iconByType = {
  company: <FaBuilding size={14} className="text-blue-600" />,
  admin_delete: <FaTrashAlt size={14} className="text-red-600" />,
  admin_add: <FaUserPlus size={14} className="text-emerald-600" />,
  edit: <FaEdit size={14} className="text-purple-600" />,
};

/* ----------------------------- MOTION ----------------------------- */
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const itemAnim = {
  hidden: { opacity: 0, y: 10, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, y: 8, scale: 0.98, transition: { duration: 0.18 } },
};

export default function Notifications() {
  const [filter, setFilter] = useState("all");

  const [rawNotifications, setRawNotifications] = useState([
    {
      id: 1,
      type: "company",
>>>>>>> safa
      user: "Super Admin",
      action: "added company",
      target: "TechNova",
      time: "08:30",
      day: "today",
<<<<<<< HEAD
      color: "border-blue-300 bg-blue-50",
=======
      unread: true,
>>>>>>> safa
    },
    {
      id: 2,
      type: "admin_delete",
<<<<<<< HEAD
      icon: <FaTrashAlt size={14} className="text-red-500" />,
=======
>>>>>>> safa
      user: "Super Admin",
      action: "deleted admin",
      target: "Mohamed Ali",
      time: "07:50",
      day: "today",
<<<<<<< HEAD
      color: "border-red-300 bg-red-50",
=======
      unread: true,
>>>>>>> safa
    },
    {
      id: 3,
      type: "admin_add",
<<<<<<< HEAD
      icon: <FaUserPlus size={14} className="text-green-500" />,
=======
>>>>>>> safa
      user: "Super Admin",
      action: "added admin",
      target: "Sara Ben",
      time: "16:10",
      day: "yesterday",
<<<<<<< HEAD
      color: "border-green-300 bg-green-50",
=======
      unread: false,
>>>>>>> safa
    },
    {
      id: 4,
      type: "edit",
<<<<<<< HEAD
      icon: <FaEdit size={14} className="text-purple-500" />,
=======
>>>>>>> safa
      user: "Super Admin",
      action: "updated company",
      target: "FinancePro",
      time: "11:22",
      day: "week",
<<<<<<< HEAD
      color: "border-purple-300 bg-purple-50",
    },
  ];

  const filteredNotifications =
    filter === "all"
      ? rawNotifications
      : rawNotifications.filter((n) => n.type.includes(filter));

  const groups = {
    Today: filteredNotifications.filter((n) => n.day === "today"),
    Yesterday: filteredNotifications.filter((n) => n.day === "yesterday"),
    "This Week": filteredNotifications.filter((n) => n.day === "week"),
  };

  return (
    <div className=" bg-white rounded-xl shadow-md p-4 h-[520px] flex flex-col">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-gray-700 text-md">Notifications</h2>
        <FaBell className="text-purple-600" size={18} />
      </div>

      {/* FILTER SWITCH */}
      <div className="flex gap-2 mb-3">
        {["all", "company", "admin_add", "admin_delete", "edit"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-2 py-1 text-xs rounded-lg border ${
              filter === f
                ? "bg-purple-100 text-purple-700 border-purple-300"
                : "text-gray-500 border-gray-200 hover:bg-gray-100"
            }`}
          >
            {f.replace("_", " ").toUpperCase()}
          </button>
        ))}
      </div>

      {/* SCROLLABLE SECTION */}
      <div className="pr-1 space-y-5 overflow-y-auto no-scrollbar">
        {Object.keys(groups).map(
          (g) =>
            groups[g].length > 0 && (
              <div key={g}>
                <p className="mb-1 text-xs text-gray-400">{g}</p>

                <div className="space-y-2">
                  {groups[g].map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className={`flex items-start gap-3 p-3 rounded-lg border ${item.color} hover:shadow-sm transition`}
                    >
                      <div className="flex items-center justify-center bg-white rounded-full shadow-sm w-7 h-7">
                        {item.icon}
                      </div>

                      <div className="flex-1">
                        <p className="text-xs font-semibold text-gray-700">
                          {item.user}
                        </p>
                        <p className="text-xs text-gray-600">
                          {item.action}{" "}
                          <span className="font-medium text-gray-900">
                            {item.target}
                          </span>
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1">
                          {item.time}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )
=======
      unread: false,
    },
  ]);

  const unreadCount = useMemo(
    () => rawNotifications.filter((n) => n.unread).length,
    [rawNotifications]
  );

  const filteredNotifications = useMemo(() => {
    if (filter === "all") return rawNotifications;
    return rawNotifications.filter((n) => n.type === filter);
  }, [filter, rawNotifications]);

  const groups = useMemo(
    () => ({
      Today: filteredNotifications.filter((n) => n.day === "today"),
      Yesterday: filteredNotifications.filter((n) => n.day === "yesterday"),
      "This Week": filteredNotifications.filter((n) => n.day === "week"),
    }),
    [filteredNotifications]
  );

  const markAllAsRead = () => {
    setRawNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const toggleRead = (id) => {
    setRawNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: !n.unread } : n))
    );
  };

  return (
    <div className="relative flex h-[520px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_30px_70px_-35px_rgba(0,0,0,0.25)]">
      {/* BACKGROUND AURA */}
      <div className="pointer-events-none absolute -top-24 right-[-80px] h-56 w-56 rounded-full bg-purple-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-[-80px] h-56 w-56 rounded-full bg-indigo-200/40 blur-3xl" />

      {/* HEADER */}
      <div className="relative mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100">
            <FaBell className="text-purple-600" />
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-purple-600 px-1 text-[10px] font-bold text-white"
              >
                {unreadCount}
              </motion.span>
            )}
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800">
              Notifications
            </h2>
            <p className="text-xs text-slate-500">
              Latest updates and admin events
            </p>
          </div>
        </div>

        <button
          onClick={markAllAsRead}
          disabled={unreadCount === 0}
          className="group flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition
                     hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FaCheckDouble className="text-purple-600 transition-transform group-hover:scale-110" />
          Mark all read
        </button>
      </div>

      {/* FILTER PILLS (animated) */}
      <div className="relative mb-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const active = filter === f.key;
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`relative overflow-hidden rounded-full px-3 py-1.5 text-xs font-semibold transition
                ${active ? "text-white" : "text-slate-600 hover:bg-slate-100"}
              `}
            >
              {active && (
                <motion.span
                  layoutId="notif-filter"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-indigo-500"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              <span className="relative z-10">{f.label}</span>
            </button>
          );
        })}
      </div>

      {/* SCROLLABLE LIST */}
      <div className="relative flex-1 overflow-y-auto pr-1 no-scrollbar">
        {/* bottom fade */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-10 bg-gradient-to-t from-white to-transparent" />

        {Object.keys(groups).every((k) => groups[k].length === 0) ? (
          <div className="mt-10 flex flex-col items-center justify-center text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
              <FaBell className="text-slate-400" />
            </div>
            <p className="text-sm font-semibold text-slate-700">
              No notifications
            </p>
            <p className="text-xs text-slate-500">
              Try switching filters to see more items.
            </p>
          </div>
        ) : (
          Object.entries(groups).map(([groupName, items]) =>
            items.length > 0 ? (
              <div key={groupName} className="mb-6">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    {groupName}
                  </p>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                    {items.length}
                  </span>
                </div>

                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="space-y-2"
                >
                  <AnimatePresence mode="popLayout">
                    {items.map((n) => (
                      <NotificationRow
                        key={n.id}
                        n={n}
                        onToggleRead={() => toggleRead(n.id)}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              </div>
            ) : null
          )
>>>>>>> safa
        )}
      </div>

      {/* HIDE SCROLLBAR */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
<<<<<<< HEAD
=======

/* ----------------------------- ROW ----------------------------- */
function NotificationRow({ n, onToggleRead }) {
  const style = TYPE_STYLE[n.type] || TYPE_STYLE.edit;

  return (
    <motion.div
      variants={itemAnim}
      initial="hidden"
      animate="show"
      exit="exit"
      whileHover={{ y: -2 }}
      className={`group relative overflow-hidden rounded-xl border p-3 ${style.soft} ${style.glow} transition`}
    >
      {/* gradient stripe */}
      <div
        className={`pointer-events-none absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b ${style.pill}`}
      />

      <div className="flex items-start gap-3">
        {/* icon bubble */}
        <div
          className={`relative mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm ring-4 ${style.ring}`}
        >
          {iconByType[n.type]}
          {n.unread && (
            <motion.span
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 1.6 }}
              className={`absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full ${style.dot}`}
            />
          )}
        </div>

        {/* content */}
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-bold text-slate-800">{n.user}</p>
              <p className="mt-0.5 text-xs text-slate-700">
                {n.action}{" "}
                <span className="font-semibold text-slate-900">{n.target}</span>
              </p>
            </div>

            <div className="flex flex-col items-end">
              <p className="text-[10px] font-semibold text-slate-500">{n.time}</p>

              <button
                onClick={onToggleRead}
                className="mt-1 rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-bold text-slate-600 opacity-0 transition
                           hover:bg-white group-hover:opacity-100"
              >
                {n.unread ? "Mark read" : "Unread"}
              </button>
            </div>
          </div>

          {/* subtle hint bar */}
          <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/60">
            <motion.div
              initial={{ width: "30%" }}
              animate={{ width: n.unread ? "65%" : "35%" }}
              transition={{ duration: 0.35 }}
              className={`h-full bg-gradient-to-r ${style.pill}`}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
>>>>>>> safa
