"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Dropdown from "components/dropdown";
import { FaBuilding, FaTrashAlt, FaUserPlus, FaEdit } from "react-icons/fa";
import { IoMdNotificationsOutline } from "react-icons/io";

const seed = [
  { id: 1, type: "company", icon: <FaBuilding size={14} className="text-blue-500" />, user: "Super Admin", action: "added company", target: "TechNova", time: "08:30", day: "today", color: "border-blue-200 bg-blue-50" },
  { id: 2, type: "admin_delete", icon: <FaTrashAlt size={14} className="text-red-500" />, user: "Super Admin", action: "deleted admin", target: "Mohamed Ali", time: "07:50", day: "today", color: "border-red-200 bg-red-50" },
  { id: 3, type: "admin_add", icon: <FaUserPlus size={14} className="text-green-600" />, user: "Super Admin", action: "added admin", target: "Sara Ben", time: "16:10", day: "yesterday", color: "border-green-200 bg-green-50" },
  { id: 4, type: "edit", icon: <FaEdit size={14} className="text-purple-600" />, user: "Super Admin", action: "updated company", target: "FinancePro", time: "11:22", day: "week", color: "border-purple-200 bg-purple-50" },
];

export default function NotificationsDropdown() {
  const [items, setItems] = useState(seed);
  const [activeFilter, setActiveFilter] = useState("all"); // all | today | yesterday | week

  const unread = items.length;

  const filtered = useMemo(() => {
    if (activeFilter === "all") return items;
    return items.filter((n) => n.day === activeFilter);
  }, [items, activeFilter]);

  const markAll = () => setItems([]);
  const removeOne = (id) => setItems((prev) => prev.filter((n) => n.id !== id));

  // Motion
  const menu = {
    initial: { opacity: 0, y: -8, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.16 } },
    exit: { opacity: 0, y: -8, scale: 0.98, transition: { duration: 0.12 } },
  };

  const item = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
  };

  const filters = [
    { key: "all", label: "All" },
    { key: "today", label: "Today" },
    { key: "yesterday", label: "Yesterday" },
    { key: "week", label: "This Week" },
  ];

  return (
    <Dropdown
      button={
        <div className="relative cursor-pointer">
          <IoMdNotificationsOutline size={24} className="text-gray-700 dark:text-white" />
          {!!unread && (
            <>
              <span className="absolute -top-1 -right-1 z-10 grid h-4 w-4 place-items-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {unread}
              </span>
              <span className="absolute -top-1 -right-1 h-4 w-4 animate-ping rounded-full bg-red-400 opacity-60" />
            </>
          )}
        </div>
      }
      classNames="top-8 -left-[300px] w-max"
      children={
        <AnimatePresence>
          <motion.div
            variants={menu}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-[340px] max-h-[520px] overflow-hidden rounded-2xl bg-white dark:bg-navy-800 border border-slate-200 dark:border-white/10"
            style={{
              boxShadow:
               "rgba(0, 0, 0, 0.56) 0px 22px 70px 4px",
            }}
          >
            {/* Header */}
            <div className="px-4 pt-3 pb-2 border-b border-slate-200 dark:border-white/10 bg-white dark:bg-navy-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-indigo-600 text-white shadow-md">
                    <FaEdit size={12} />
                  </span>
                  <p className="text-[15px] font-bold text-gray-900 dark:text-white">Notifications</p>
                </div>
                <button
                  onClick={markAll}
                  className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-300 dark:hover:text-indigo-200"
                >
                  Mark all read
                </button>
              </div>

              {/* Filtres (tabs) */}
              <div className="mt-3 grid grid-cols-4 gap-2">
                {filters.map((f) => {
                  const active = activeFilter === f.key;
                  return (
                    <button
                      key={f.key}
                      onClick={() => setActiveFilter(f.key)}
                      className={[
                        "relative rounded-lg px-2 py-1 text-[11px] font-semibold transition",
                        active
                          ? "bg-indigo-600 text-white shadow-[0_6px_18px_rgba(79,70,229,.25)]"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-navy-700 dark:text-slate-200 dark:hover:bg-navy-600",
                      ].join(" ")}
                    >
                      {f.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Liste */}
            <div className="max-h-[420px] overflow-auto px-3 py-3 space-y-2">
              <AnimatePresence initial={false}>
                {filtered.length ? (
                  filtered.map((n) => (
                    <motion.div
                      key={n.id}
                      variants={item}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                        style={{
                       boxShadow:
                        "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px",
                        }}
                       whileHover={{
                         y: -1,
                         boxShadow:
                         "rgba(0, 0, 0, 0.30) 0px 60px 70px -10px, rgba(0, 0, 0, 0.16) 0px -14px 34px, rgba(0, 0, 0, 0.16) 0px 6px 10px, rgba(0, 0, 0, 0.22) 0px 14px 16px, rgba(0, 0, 0, 0.12) 0px -4px 7px",
                         }}
                        className={`group flex items-start gap-3 rounded-xl border ${n.color} p-3 bg-white dark:bg-navy-700 transition`}
                        >
                     {/* Avatar / Icône */}
                      <div
                     className="grid h-9 w-9 place-items-center rounded-full
                     bg-white dark:bg-navy-600
                     border border-slate-200 dark:border-white/10
                    shrink-0"
                  style={{
                 boxShadow:
                  "rgba(0,0,0,0.25) 0px 12px 18px -8px, \
                   rgba(0,0,0,0.12) 0px 2px 6px, \
                   rgba(10,37,64,0.2) 0px 0px 0px 1px inset"
                    }}
                  >
                {n.icon}
                </div>


                      {/* Contenu */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[12.5px] font-semibold text-gray-900 dark:text-white truncate">
                          {n.user}
                        </p>
                        <p className="text-[12.5px] text-gray-700 dark:text-gray-200">
                          {n.action} <span className="font-medium">{n.target}</span>
                        </p>
                        <p className="mt-0.5 text-[10px] text-slate-400">{n.time}</p>
                      </div>

                      {/* Bouton TRASH */}
                      <button
                        onClick={() => removeOne(n.id)}
                        className="ml-2 grid h-8 w-8 place-items-center rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                        aria-label="Delete notification"
                        title="Delete"
                      >
                        <FaTrashAlt size={13} />
                      </button>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid place-items-center py-10 text-center"
                  >
                    <div className="mb-2 grid h-10 w-10 place-items-center rounded-full bg-slate-100 dark:bg-navy-700">
                      <IoMdNotificationsOutline className="text-slate-400" />
                    </div>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">No items here</p>
                    <p className="text-xs text-slate-400">Try another filter.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </AnimatePresence>
      }
    />
  );
}
