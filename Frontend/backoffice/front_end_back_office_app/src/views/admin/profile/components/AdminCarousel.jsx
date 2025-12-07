"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";

const admins = [
  { id: 1, name: "Alice Johnson", role: "Designer", avatar: "https://randomuser.me/api/portraits/women/21.jpg", active: true },
  { id: 2, name: "Bob Smith", role: "Developer", avatar: "https://randomuser.me/api/portraits/men/32.jpg", active: false },
  { id: 3, name: "Carol White", role: "Product Manager", avatar: "https://randomuser.me/api/portraits/women/44.jpg", active: true },
  { id: 4, name: "David Brown", role: "QA", avatar: "https://randomuser.me/api/portraits/men/55.jpg", active: false },
  { id: 5, name: "Eve Black", role: "Marketing", avatar: "https://randomuser.me/api/portraits/women/66.jpg", active: true },
];

export default function AdminCarousel() {
  const [activeId, setActiveId] = useState(null);

  return (
    <div className="w-full p-4 bg-white shadow-xl dark:bg-gray-900 rounded-xl ">
        <motion.h4>
          <span className="font-semibold text-gray-700 ">Team's Kidora</span>
        </motion.h4>
      <motion.div
        className="flex gap-3 mt-2 overflow-x-auto scrollbar-none"
        drag="x"
        dragConstraints={{ left: -800, right: 0 }}
      >
        {admins.map((admin) => (
          <motion.div
            key={admin.id}
            className="relative flex-shrink-0 cursor-pointer w-36"
            whileHover={{ scale: 1.05 }}
            onClick={() => setActiveId(admin.id)}
          >
            <motion.div
              className={`flex flex-col items-center p-3 rounded-2xl shadow-md border transition-all duration-300 ${
                activeId === admin.id
                  ? "border-purple-400 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100"
                  : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              }`}
            >
              <div className="relative">
                <img
                  src={admin.avatar}
                  alt={admin.name}
                  className="w-16 h-16 border-2 border-white rounded-full shadow-md"
                />
                <span
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                    admin.active ? "bg-green-500 animate-pulse" : "bg-red-500"
                  }`}
                />
              </div>

              <div className="mt-2 text-center">
                <h3 className="text-sm font-semibold text-gray-800 truncate dark:text-gray-100">
                  {admin.name}
                </h3>
                <p className="text-[10px] text-gray-500 dark:text-gray-300 truncate">{admin.role}</p>
              </div>
            </motion.div>
          </motion.div>
        ))}

        {/* Total admins */}
        <motion.div
          className="flex items-center justify-center flex-shrink-0 text-base font-semibold text-white shadow-md w-36 h-28 rounded-2xl bg-gradient-to-br from-purple-400 to-blue-400"
          whileHover={{ scale: 1.05 }}
        >
          +{admins.length}
        </motion.div>
      </motion.div>

      <style jsx>{`
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
