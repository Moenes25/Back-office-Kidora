"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";

// react-icons
import { FiEye, FiEdit, FiRefreshCcw, FiTrash } from "react-icons/fi";

const admins = [
  { id: 1, name: "Nesrin", role: "Super Admin" },
  { id: 2, name: "Sara", role: "Admin" },
  { id: 3, name: "Ali", role: "Moderator" },
];

const modules = [
  { name: "Institutions", icon: "🏛️" },
  { name: "Admins", icon: "👥" },
  { name: "Billing", icon: "💳" },
  { name: "Settings", icon: "⚙️" },
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

// ICONS MAP
const permissionIcons = {
  read: <FiEye className="text-lg" />,
  write: <FiEdit className="text-lg" />,
  update: <FiRefreshCcw className="text-lg" />,
  delete: <FiTrash className="text-lg" />,
};

export default function PermissionViewPage() {
  const [selectedAdmin, setSelectedAdmin] = useState(admins[0]);

  return (
    <div className="py-4">
      {/* ADMINS LIST TOP */}
      <div className="flex gap-6 pb-3 mb-10 overflow-x-auto border-b border-gray-300 scrollbar-none">
        {admins.map((admin) => (
          <motion.div
            key={admin.id}
            onClick={() => setSelectedAdmin(admin)}
            whileHover={{ scale: 1.05 }}
            className={`cursor-pointer px-4 py-2 rounded-md whitespace-nowrap transition-all
              ${
                selectedAdmin.id === admin.id
                  ? "text-purple-700 border-b-2 border-purple-700"
                  : "text-gray-700"
              }`}
          >
            <p className="font-semibold">{admin.name}</p>
            <p className="text-sm opacity-75">{admin.role}</p>
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
              transition={{ duration: 0.3, delay: i * 0.1 }}
              className="p-6 bg-white border border-gray-200 shadow-sm rounded-2xl"
            >
              {/* module header */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{m.icon}</span>
                <h2 className="text-xl font-semibold text-gray-700">
                  {m.name}
                </h2>
              </div>

              {/* Permission items */}
              <div className="flex flex-col gap-3">
                {Object.entries(perm).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-xl bg-gray-50"
                  >
                    <div className="flex items-center gap-2">
                      {permissionIcons[key]}
                      <span className="font-medium text-gray-700 capitalize">
                        {key}
                      </span>
                    </div>

                    <span
                      className={`text-sm font-semibold ${
                        value ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {value ? "Allowed" : "Not allowed"}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
