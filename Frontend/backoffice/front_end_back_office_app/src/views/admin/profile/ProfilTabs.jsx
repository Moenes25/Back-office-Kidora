"use client";

import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";

const ProfileTabs = ({ activeTab, setActiveTab, allowedTabs }) => {
  const allTabs = [
    { id: "profile", label: "Profil" },
    { id: "settings", label: "Settings" },
    { id: "security", label: "Security" },
    { id: "activity", label: "Activity" },
    { id: "admin", label: "Admin" },
    { id: "notification", label: "Notifications" },
  ];

  const tabs = allTabs.filter((tab) => allowedTabs.includes(tab.id));
  const activeRef = useRef(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [activeTab]);

  return (
    <div className="relative mt-8">
      {/* Divider top */}
      <div className="absolute -top-3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent dark:via-white/15" />

      <div
        role="tablist"
        aria-orientation="horizontal"
        className="
          relative mb-3 flex gap-2 overflow-x-auto overflow-y-visible scrollbar-none
          rounded-3xl border p-2
          bg-white/30 backdrop-blur supports-[backdrop-filter]:bg-white/20
          border-slate-200/60 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.25)]
          dark:bg-white/5 dark:border-white/10 dark:shadow-[0_8px_28px_-18px_rgba(0,0,0,0.6)]
          dark:text-white
        "
      >
        {tabs.map((tab) => {
          const active = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              ref={active ? activeRef : null}
              role="tab"
              aria-selected={active}
              onClick={() => setActiveTab(tab.id)}
              className="relative isolate rounded-2xl"
            >
              {/* Pastille active */}
              {active && (
                <motion.span
                  layoutId="active-pill"
                  className="
                    absolute inset-0 rounded-2xl
                    bg-gradient-to-br from-white to-slate-50
                    ring-1 ring-black/5
                    dark:from-navy-700 dark:to-navy-600 dark:ring-white/10
                  "
                  transition={{ type: "spring", stiffness: 450, damping: 32 }}
                />
              )}

              {/* Label + underline */}
              <span className="relative z-10 block whitespace-nowrap px-5 py-2.5 text-sm font-semibold">
                <span
                  className={
                    active
                      ? "relative inline-block text-transparent bg-clip-text gradient-text"
                      : "relative inline-block text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                  }
                >
                  {tab.label}
                  {active && (
                    <motion.span
                      layoutId="underline"
                      className="
                        absolute -bottom-1 left-0 right-0 h-[3px] rounded-full
                        bg-gradient-to-r from-indigo-400 to-purple-400
                        dark:from-indigo-300 dark:to-fuchsia-400
                      "
                      transition={{ type: "spring", stiffness: 450, damping: 32 }}
                    />
                  )}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <style>{`
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { scrollbar-width: none; }

        .gradient-text{
          background: linear-gradient(90deg, #8b5cf6, #c048ec, #3b82f6);
          background-size: 200% 200%;
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent; color: transparent;
          animation: gradientMove 5s ease infinite;
        }
        @media (prefers-color-scheme: dark) {
          .gradient-text{
            /* un peu plus lumineuse en dark */
            background: linear-gradient(90deg, #a78bfa, #e879f9, #60a5fa);
          }
        }
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
};

export default ProfileTabs;
