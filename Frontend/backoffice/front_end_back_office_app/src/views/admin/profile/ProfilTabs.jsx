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

<<<<<<< HEAD
  
  const tabs = allTabs.filter(tab => allowedTabs.includes(tab.id));

  const containerRef = useRef(null);
=======
  const tabs = allTabs.filter(tab => allowedTabs.includes(tab.id));
>>>>>>> safa
  const activeRef = useRef(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [activeTab]);

  return (
<<<<<<< HEAD
    <div className="relative px-2 mt-6 border-b border-gray-200 rounded-lg">
=======
    <div className="relative mt-8">
      {/* TOP DIVIDER */}
      <div className="absolute -top-3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent" />

>>>>>>> safa
      <div
        role="tablist"
        aria-orientation="horizontal"
        className="relative flex gap-2 overflow-x-auto  overflow-y-visible scrollbar-none
                   rounded-3xl bg-white/20 
                   border border-slate-200/60
                   p-2 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.25)] mb-3"
      >
<<<<<<< HEAD
        {tabs.map((tab) => (
          <button
            key={tab.id}
            ref={activeTab === tab.id ? activeRef : null}
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              relative inline-flex items-center px-4 py-2 font-semibold rounded-t-lg transition-all
              ${activeTab === tab.id 
                ? " bg-white shadow-md" 
                : " text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              }
            `}
          >
            <span
              className={activeTab === tab.id ? "gradient-text front-bold z-10" : "z-10"}
            >
              {tab.label}
            </span>

            {activeTab === tab.id && (
              <motion.span
                layoutId="underline"
                className="absolute bottom-0 left-0 w-full h-1 rounded-full bg-gradient-to-r from-purple-300 to-blue-300"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        ))}
=======
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

>>>>>>> safa
      </div>

      <style>{`
        .scrollbar-none::-webkit-scrollbar { display: none; }
<<<<<<< HEAD
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }

        .gradient-text {
          background: linear-gradient(90deg, #8b5cf6, #c048ec, #3b82f6);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradientMove 3s ease infinite;
        }
=======
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

>>>>>>> safa

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
