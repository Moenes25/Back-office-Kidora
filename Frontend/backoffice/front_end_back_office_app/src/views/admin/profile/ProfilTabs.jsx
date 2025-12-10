import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";

const ProfileTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "profile", label: "Profil" },
    { id: "settings", label: "Settings" },
    { id: "security", label: "Security" },
    { id: "activity", label: "Activity" },
    { id: "admin", label: "Admin" },
    { id: "notification", label: "Notifications" },
  ];

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
    <div className="relative mt-6 border-b border-gray-200">
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
              relative inline-flex items-center px-4 py-2 font-semibold rounded-lg transition-all
              ${
                activeTab === tab.id
                  ? "text-white bg-gradient-to-br from-purple-500 to-blue-500 shadow-lg"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              }
            `}
          >
            <span className="z-10">{tab.label}</span>

            {/* Animated underline for active tab */}
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

      {/* Hide scrollbar */}
      <style>{`
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default ProfileTabs;
