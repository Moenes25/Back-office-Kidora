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
        className="flex gap-6 px-2 -mx-2 overflow-x-auto whitespace-nowrap scrollbar-none sm:mx-0 sm:px-0"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            ref={activeTab === tab.id ? activeRef : null}
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="relative inline-flex items-center pb-3 font-medium text-gray-500 whitespace-nowrap hover:text-gray-800"
          >
            <span className="z-10">{tab.label}</span>

            {/* Animated underline */}
            {activeTab === tab.id && (
              <motion.span
                layoutId="underline"
                className="absolute bottom-0 left-0 w-full h-1 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Scrollbar hide styles */}
      <style>{`
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default ProfileTabs;
