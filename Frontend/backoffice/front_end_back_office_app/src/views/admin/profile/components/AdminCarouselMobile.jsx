"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export default function AdminCarouselMobile({ admins }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* --- Floating Messenger Button --- */}
      <div
        className="fixed z-50 flex flex-col items-center cursor-pointer md:hidden top-20 right-8"
        onClick={() => setOpen(true)}
      >
        {/* Avatar */}
        <img
          src={admins[0].avatar}
          alt="avatar"
          className="relative border-2 border-white rounded-full shadow-lg w-14 h-14"
        />

        {/* Count badge */}
        <span className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 p-2 text-xs font-bold text-white bg-red-500 rounded-full shadow-md">
          +{admins.length}
        </span>
      </div>

      {/* --- Popup Bottom Sheet --- */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/40 backdrop-blur-sm md:hidden">
          <motion.div
            initial={{ y: 300 }}
            animate={{ y: 0 }}
            exit={{ y: 300 }}
            transition={{ duration: 0.35 }}
            className="w-full p-5 bg-white shadow-lg rounded-t-3xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Administrators</h2>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* Admins List */}
            <div className="grid grid-cols-4 gap-4">
              {admins.map((admin) => (
                <div key={admin.id} className="flex flex-col items-center">
                  <img
                    src={admin.avatar}
                    alt="avatar"
                    className="border rounded-full shadow w-14 h-14"
                  />
                  <p className="mt-1 text-xs font-semibold text-center">
                    {admin.name.split(" ")[0]}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
