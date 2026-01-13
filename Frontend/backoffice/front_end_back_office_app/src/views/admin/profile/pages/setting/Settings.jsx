"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  FaGlobe,
  FaPalette,
  FaBell,
  FaRobot,
  FaMoneyBillWave,
  FaLifeRing,
  FaChartLine,
  FaUserShield,
} from "react-icons/fa";

import RolesPermissions from "./components/Permission";

/* ================= SETTINGS ================= */
const Settings = () => {
  return (
    <div className="mx-auto space-y-10">

      {/* ================= ROLES & PERMISSIONS ================= */}
      <RolesPermissions />

      {/* ================= GENERAL PREFERENCES ================= */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-3xl bg-white border border-slate-200
                   shadow-[0_25px_60px_-35px_rgba(0,0,0,0.25)] p-8 dark:bg-navy-700 dark:text-white
                   "
      >
       <div className="flex items-center gap-3 mb-6">
  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100">
    <FaPalette className="text-purple-600" />
  </div>
  <h1 className="text-xl font-bold text-slate-800 dark:text-white
  ">General Preferences</h1>
</div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6  dark:text-white
        ">
          <PreferenceCard
            icon={<FaGlobe />}
            title="Language"
            className="dark:text-white"
            description="Choose your preferred application language."
          >
            <Select>
              <option>Français</option>
              <option>العربية</option>
              <option>English</option>
            </Select>
          </PreferenceCard>

          <PreferenceCard
            icon={<FaPalette />}
            title="Theme"
            description="Customize the appearance of the interface."
          >
            <Select>
              <option>Light</option>
              <option>Dark</option>
              <option>Auto</option>
            </Select>
          </PreferenceCard>
        </div>
      </motion.section>

      {/* ================= NOTIFICATIONS ================= */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="rounded-3xl bg-white border border-slate-200 dark:bg-navy-700 dark:text-white
                   shadow-[0_25px_60px_-35px_rgba(0,0,0,0.25)] p-8"
      >
   
<div className="flex items-center gap-3 mb-6">
  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100">
    <FaBell className="text-purple-600" />
  </div>
  <h1 className="text-xl font-bold text-slate-800 dark:text-white
  ">Notifications</h1>
</div>

        <div className="space-y-4">
          <NotificationItem
            icon={<FaUserShield />}
            label="Account modifications"
          />
          <NotificationItem
            icon={<FaRobot />}
            label="AI Alerts"
          />
          <NotificationItem
            icon={<FaMoneyBillWave />}
            label="Payments & Subscriptions"
          />
          <NotificationItem
            icon={<FaLifeRing />}
            label="Customer Support"
          />
          <NotificationItem
            icon={<FaChartLine />}
            label="Weekly Report"
          />
        </div>
      </motion.section>
    </div>
  );
};

export default Settings;

/* ================= UI COMPONENTS ================= */

const PreferenceCard = ({ icon, title, description, children }) => (
  <motion.div
    whileHover={{ y: -4 }}
    className="rounded-2xl border border-slate-200 p-5
               shadow-sm hover:shadow-md transition"
  >
    <div className="flex items-start gap-3 mb-4">
      <div className="text-purple-600 text-lg">{icon}</div>
      <div>
        <p className="font-semibold text-slate-700 dark:text-white">{title}</p>
        <p className="text-xs text-slate-500 dark:text-slate-300">{description}</p>
      </div>
    </div>
    {children}
  </motion.div>
);

const Select = ({ children }) => (
  <select
    className="w-full rounded-xl border border-slate-300 px-4 py-3
               text-sm font-medium text-slate-700
               focus:ring-2 focus:ring-purple-400
               focus:border-transparent transition"
  >
    {children}
  </select>
);

const NotificationItem = ({ icon, label }) => (
  <motion.div
    whileHover={{ scale: 1.01 }}
    className="flex items-center justify-between
               p-4 rounded-2xl border border-slate-200
               hover:bg-slate-50 transition dark:hover:bg-navy-700
               "
  >
    <div className="flex items-center gap-3">
      <span className="text-purple-500">{icon}</span>
      <span className="font-medium text-slate-700 dark:text-white
      ">{label}</span>
    </div>

    <Switch />
  </motion.div>
);

const Switch = () => {
  const [on, setOn] = React.useState(true);

  return (
    <button
      onClick={() => setOn(!on)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full
        transition-all ${on ? "bg-purple-600" : "bg-slate-300"}`}
    >
      <span
        className={`inline-block h-5 w-5 bg-white rounded-full shadow
          transform transition-transform
          ${on ? "translate-x-5" : "translate-x-1"}`}
      />
    </button>
  );
};
