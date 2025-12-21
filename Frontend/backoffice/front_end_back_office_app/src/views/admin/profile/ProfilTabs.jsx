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

  const containerRef = useRef(null);
  const activeRef = useRef(null);

  useEffect(() => {
    if (activeRef.current?.scrollIntoView) {
      activeRef.current.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [activeTab]);

  return (
    <div className="relative px-2 mt-6 border-b border-gray-200 rounded-lg">
      <div
        ref={containerRef}
        role="tablist"
        aria-orientation="horizontal"
        className="flex gap-4 px-2 -mx-2 overflow-x-auto whitespace-nowrap scrollbar-none sm:mx-0 sm:px-0"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
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
      </div>

      <style>{`
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }

        .gradient-text {
          background: linear-gradient(90deg, #8b5cf6, #c048ec, #3b82f6);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradientMove 3s ease infinite;
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
