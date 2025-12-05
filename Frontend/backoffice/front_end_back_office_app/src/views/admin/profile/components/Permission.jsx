"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiEye, FiEdit, FiRefreshCcw, FiTrash } from "react-icons/fi";
import { IconContext } from "react-icons";

const admins = [
  { id: 1, name: "Nesrin", role: "Super Admin" },
  { id: 2, name: "Sara", role: "Admin" },
  { id: 3, name: "Ali", role: "Moderator" },
];

const modules = [
  { name: "Institutions", icon: <FiEye /> },
  { name: "Admins", icon: <FiEdit /> },
  { name: "Billing", icon: <FiRefreshCcw /> },
  { name: "Settings", icon: <FiTrash /> },
];

const initialPermissions = {
  1: {
    Institutions: { read: true, write: true, update: true, delete: true },
    Admins: { read: true, write: true, update: false, delete: false },
    Billing: { read: true, write: false, update: false, delete: false },
    Settings: { read: true, write: true, update: true, delete: false },
  },
  2: {
    Institutions: { read: true, write: false, update: false, delete: false },
    Admins: { read: true, write: false, update: false, delete: false },
    Billing: { read: true, write: false, update: false, delete: false },
    Settings: { read: true, write: false, update: false, delete: false },
  },
  3: {
    Institutions: { read: true, write: false, update: false, delete: false },
    Admins: { read: false, write: false, update: false, delete: false },
    Billing: { read: false, write: false, update: false, delete: false },
    Settings: { read: true, write: false, update: false, delete: false },
  },
};

// ICONS MAP with gradient & soft animation
const permissionIcons = {
  read: <FiEye className="text-lg" />,
  write: <FiEdit className="text-lg" />,
  update: <FiRefreshCcw className="text-lg" />,
  delete: <FiTrash className="text-lg" />,
};

export default function PermissionViewPage() {
  const [selectedAdmin, setSelectedAdmin] = useState(admins[0]);

  return (
    <div className="px-4 py-6">
      {/* ADMINS LIST TOP */}
      <div className="flex gap-6 pb-3 mb-8 overflow-x-auto border-b border-gray-200 scrollbar-none">
        {admins.map((admin) => (
          <motion.div
            key={admin.id}
            onClick={() => setSelectedAdmin(admin)}
            whileHover={{ scale: 1.08 }}
            className={`cursor-pointer px-5 py-3 rounded-2xl whitespace-nowrap transition-all 
              ${
                selectedAdmin.id === admin.id
                  ? "bg-gradient-to-r from-purple-400 to-blue-400 text-white shadow-lg"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
          >
            <p className="font-semibold">{admin.name}</p>
            <p className="text-sm opacity-70">{admin.role}</p>
          </motion.div>
        ))}
      </div>

      {/* MODULES + PERMISSIONS */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {modules.map((m, i) => {
          const perm = initialPermissions[selectedAdmin.id][m.name];

          return (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="p-6 bg-white border border-gray-100 shadow-lg rounded-3xl"
            >
              {/* module header */}
              <div className="flex items-center gap-3 mb-5">
                <IconContext.Provider
                  value={{
                    className:
                      "text-3xl bg-gradient-to-br from-purple-500 to-blue-400 text-transparent bg-clip-text",
                  }}
                >
                  {m.icon}
                </IconContext.Provider>
                <h2 className="text-xl font-semibold text-gray-800">{m.name}</h2>
              </div>

              {/* Permission items */}
              <div className="flex flex-col gap-3">
                {Object.entries(perm).map(([key, value]) => (
                  <motion.div
                    key={key}
                    whileHover={{ scale: 1.03 }}
                    className="flex items-center justify-between p-3 transition-all border border-gray-200 rounded-xl bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <IconContext.Provider
                        value={{
                          className:
                            "text-lg bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text",
                        }}
                      >
                        {permissionIcons[key]}
                      </IconContext.Provider>
                      <span className="font-medium text-gray-700 capitalize">{key}</span>
                    </div>

                    <span
                      className={`text-sm font-semibold ${
                        value ? "text-green-500" : "text-red-400"
                      }`}
                    >
                      {value ? "Allowed" : "Not allowed"}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
