"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaBell,
  FaEnvelope,
  FaUserShield,
  FaBuilding,
  FaTrashAlt,
} from "react-icons/fa";

export default function NotificationSettings() {
  const [settings, setSettings] = useState({
    newCompany: true,
    deletedAdmin: false,
    addedAdmin: true,
    importantAlerts: true,
    emailNotifications: false,
  });

  const toggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Animation variants
  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="w-full p-6 bg-white shadow-md rounded-xl">
      {/* PAGE TITLE */}
      <div className="flex items-center  mb-6 gap-2 py-4 ">
        <FaBell size={20} className="text-purple-600" />
        <h1 className="text-xl font-semibold text-gray-700">
          Notification Settings
        </h1>
      </div>

      {/* SECTIONS */}
      <div className="space-y-8">
        {/* SECTION 1 */}
        <div>
          <h2 className="mb-3 text-sm font-semibold text-gray-500">
            ADMIN ACTIONS
          </h2>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            className="space-y-4"
          >
            {/* ADD ADMIN */}
            <SettingRow
              icon={<FaUserShield className="text-green-500" />}
              title="New Admin Added"
              desc="Receive alerts when a new admin account is created."
              checked={settings.addedAdmin}
              onClick={() => toggle("addedAdmin")}
              variants={rowVariants}
            />

            {/* DELETE ADMIN */}
            <SettingRow
              icon={<FaTrashAlt className="text-red-500" />}
              title="Admin Deleted"
              desc="Get notified when an admin account is removed."
              checked={settings.deletedAdmin}
              onClick={() => toggle("deletedAdmin")}
              variants={rowVariants}
            />
          </motion.div>
        </div>

        {/* SECTION 2 */}
        <div>
          <h2 className="mb-3 text-sm font-semibold text-gray-500">
            COMPANY MANAGEMENT
          </h2>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            className="space-y-4"
          >
            {/* ADD COMPANY */}
            <SettingRow
              icon={<FaBuilding className="text-blue-500" />}
              title="New Company Added"
              desc="Alert you when a new company is registered."
              checked={settings.newCompany}
              onClick={() => toggle("newCompany")}
              variants={rowVariants}
            />
          </motion.div>
        </div>

        {/* SECTION 3 */}
        <div>
          <h2 className="mb-3 text-sm font-semibold text-gray-500">SYSTEM</h2>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            className="space-y-4"
          >
            {/* IMPORTANT ALERTS */}
            <SettingRow
              icon={<FaBell className="text-purple-500" />}
              title="Important Alerts"
              desc="Critical system notifications and warnings."
              checked={settings.importantAlerts}
              onClick={() => toggle("importantAlerts")}
              variants={rowVariants}
            />

            {/* EMAIL NOTIFICATIONS */}
            <SettingRow
              icon={<FaEnvelope className="text-orange-500" />}
              title="Email Notifications"
              desc="Send notification events to your email inbox."
              checked={settings.emailNotifications}
              onClick={() => toggle("emailNotifications")}
              variants={rowVariants}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* 🔥 COMPONENT FOR ROW */
function SettingRow({ icon, title, desc, checked, onClick, variants }) {
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      className="flex items-center justify-between px-4 py-3 transition border border-gray-200 rounded-lg hover:bg-gray-50"
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
          {icon}
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-700">{title}</p>
          <p className="text-xs text-gray-500">{desc}</p>
        </div>
      </div>

      {/* SWITCH BUTTON */}
      <button
        onClick={onClick}
        className={`relative inline-flex h-5 w-10 items-center rounded-full transition-all ${
          checked ? "bg-purple-600" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </motion.div>
  );
}
