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

  const tabs = allTabs.filter(tab => allowedTabs.includes(tab.id));
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
      {/* TOP DIVIDER */}
      <div className="absolute -top-3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent" />

      <div
        role="tablist"
        aria-orientation="horizontal"
        className="relative flex gap-2 overflow-x-auto  overflow-y-visible scrollbar-none
                   rounded-3xl bg-white/20 
                   border border-slate-200/60
                   p-2 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.25)] mb-3"
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
      className="relative isolate "
    >
      {/* Fond actif (pill) */}
      {active && (
        <motion.span
          layoutId="active-pill"
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white to-slate-50 shadow-md"
          transition={{ type: "spring", stiffness: 450, damping: 32 }}
        />
      )}

      {/* Label + underline calé sur le mot */}
      <span className="relative z-10 block px-5 py-2.5 text-sm font-semibold whitespace-nowrap">
        <span
          className={
            active
              ? "relative inline-block text-transparent bg-clip-text gradient-text"
              : "relative inline-block text-slate-500 hover:text-slate-800"
          }
        >
          {tab.label}
          {active && (
            <motion.span
              layoutId="underline"
              className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full
                         bg-gradient-to-r from-indigo-400 to-purple-400"
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
  /* Fallback cross-browser */
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
    </div>
  );
};

export default ProfileTabs;
