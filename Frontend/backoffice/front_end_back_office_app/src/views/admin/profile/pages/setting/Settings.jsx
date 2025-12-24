<<<<<<< HEAD
import React from "react";
import RolesPermissions from "./components/Permission";


const Settings = () => {
  return (
    <div className="">
      <div className="mx-auto space-y-8 ">

        {/* Roles & Permissions */}
        
          <RolesPermissions />
        

        {/* General Preferences */}
        <div className="p-6 bg-white shadow-lg rounded-2xl">
          <h4 className="mb-4 text-xl font-semibold text-gray-800">
            General Preferences
          </h4>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Language */}
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-gray-500">
                Language
              </label>
              <select className="w-full p-3 transition border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent">
                <option>Français</option>
                <option>العربية</option>
                <option>English</option>
              </select>
            </div>

            {/* Theme */}
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-gray-500">
                Theme
              </label>
              <select className="w-full p-3 transition border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent">
                <option>Light</option>
                <option>Dark</option>
                <option>Auto</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="p-6 bg-white shadow-lg rounded-2xl">
          <h4 className="mb-4 text-xl font-semibold text-gray-800">
            Notifications
          </h4>

          <div className="flex flex-col gap-4">
            {[
              "Account modifications",
              "AI Alerts",
              "Payments & Subscriptions",
              "Customer Support",
              "Weekly Report",
            ].map((item, index) => (
              <label
                key={index}
                className="flex items-center gap-3 p-3 transition border border-gray-200 rounded-lg cursor-pointer hover:bg-purple-50"
              >
                <input type="checkbox" defaultChecked className="w-5 h-5 text-purple-500 transition rounded focus:ring-2 focus:ring-purple-400" />
                <span className="font-medium text-gray-700">{item}</span>
              </label>
            ))}
          </div>
        </div>

      </div>
=======
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
                   shadow-[0_25px_60px_-35px_rgba(0,0,0,0.25)] p-8"
      >
       <div className="flex items-center gap-3 mb-6">
  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100">
    <FaPalette className="text-purple-600" />
  </div>
  <h1 className="text-xl font-bold text-slate-800">General Preferences</h1>
</div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PreferenceCard
            icon={<FaGlobe />}
            title="Language"
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
        className="rounded-3xl bg-white border border-slate-200
                   shadow-[0_25px_60px_-35px_rgba(0,0,0,0.25)] p-8"
      >
   
<div className="flex items-center gap-3 mb-6">
  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100">
    <FaBell className="text-purple-600" />
  </div>
  <h1 className="text-xl font-bold text-slate-800">Notifications</h1>
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
>>>>>>> safa
    </div>
  );
};

export default Settings;
<<<<<<< HEAD
=======

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
        <p className="font-semibold text-slate-700">{title}</p>
        <p className="text-xs text-slate-500">{description}</p>
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
               hover:bg-slate-50 transition"
  >
    <div className="flex items-center gap-3">
      <span className="text-purple-500">{icon}</span>
      <span className="font-medium text-slate-700">{label}</span>
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
>>>>>>> safa
