"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";

const admins = [
  { id: 1, name: "Alice Johnson", role: "Designer", avatar: "https://randomuser.me/api/portraits/women/21.jpg", active: true },
  { id: 2, name: "Bob Smith", role: "Developer", avatar: "https://randomuser.me/api/portraits/men/32.jpg", active: false },
  { id: 3, name: "Carol White", role: "Product Manager", avatar: "https://randomuser.me/api/portraits/women/44.jpg", active: true },
  { id: 4, name: "David Brown", role: "QA", avatar: "https://randomuser.me/api/portraits/men/55.jpg", active: false },
  { id: 5, name: "Eve Black", role: "Marketing", avatar: "https://randomuser.me/api/portraits/women/66.jpg", active: true },
  { id: 6, name: "Alice Johnson", role: "Designer", avatar: "https://randomuser.me/api/portraits/women/21.jpg", active: true },
  { id: 7, name: "Bob Smith", role: "Developer", avatar: "https://randomuser.me/api/portraits/men/32.jpg", active: false },
  { id: 8, name: "Carol White", role: "Product Manager", avatar: "https://randomuser.me/api/portraits/women/44.jpg", active: true },
  { id: 9, name: "David Brown", role: "QA", avatar: "https://randomuser.me/api/portraits/men/55.jpg", active: false },
  { id: 10, name: "Eve Black", role: "Marketing", avatar: "https://randomuser.me/api/portraits/women/66.jpg", active: true },
];

export default function AdminCarousel() {
  const [activeId, setActiveId] = useState(null);

  return (
    <div className="relative w-full p-4 overflow-x-auto bg-white rounded-lg shadow-lg scrollbar-none">
      <motion.div
        className="flex items-center space-x-0"
        drag="x"
        dragConstraints={{ left: -1200, right: 0 }}
      >
        {admins.map((admin, index) => (
          <motion.div
            key={admin.id}
            className="relative flex flex-col items-center cursor-pointer group"
            whileHover={{ scale: 1.2, zIndex: 50 }}
            onClick={() => setActiveId(admin.id)}
            style={{ marginLeft: index === 0 ? 0 : -12 }} // overlapping
          >
            {/* Avatar */}
            <div className="relative">
              <img
                src={admin.avatar}
                alt={admin.name}
                className={`w-12 h-12 rounded-full border-2 shadow-md ${
                  activeId === admin.id ? "border-purple-500" : "border-white"
                }`}
              />
              {/* Status dot */}
              <span
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                  admin.active ? "bg-green-500" : "bg-red-500"
                }`}
              />
            </div>

            {/* Tooltip */}
            <div className="absolute z-50 px-3 py-1 text-[12px] text-gray-800 transition-opacity bg-white rounded-md shadow-lg opacity-0 top-2 left-8 group-hover:opacity-100 whitespace-nowrap">
              <div className="font-semibold">{admin.name}</div>
              <div className="text-[10px] text-gray-500">{admin.role}</div>
            </div>
          </motion.div>
        ))}

        {/* Total admins at the end */}
        <div className="flex items-center justify-center w-12 h-12 ml-4 text-sm font-semibold text-white rounded-full shadow-md bg-purple-500/40">
          +{admins.length}
        </div>
      </motion.div>

      <style jsx>{`
        /* Hide scrollbar */
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;     /* Firefox */
        }
      `}</style>
    </div>
  );
}
