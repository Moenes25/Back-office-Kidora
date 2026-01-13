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

/* ---------------------------------- */
/* MAIN COMPONENT */
/* ---------------------------------- */
export default function NotificationSettings() {
  const [settings, setSettings] = useState({
    newCompany: true,
    deletedAdmin: false,
    addedAdmin: true,
    importantAlerts: true,
    emailNotifications: false,
  });

  const toggle = (key) =>
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="w-full space-y-8 rounded-2xl bg-white p-6 shadow-lg dark:bg-navy-700 dark:text-white">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100">
            <FaBell className="text-purple-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-white">
              Notification Settings
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-300">
              Control how and when you receive alerts
            </p>
          </div>
        </div>

        <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-600">
          Preferences
        </span>
      </div>

      {/* SECTIONS */}
      <Section title="Admin Actions">
        <SettingRow
          icon={<FaUserShield className="text-green-500" />}
          title="New Admin Added"
          desc="Get notified when a new admin account is created."
          checked={settings.addedAdmin}
          onToggle={() => toggle("addedAdmin")}
        />

        <SettingRow
          icon={<FaTrashAlt className="text-red-500" />}
          title="Admin Deleted"
          desc="Receive alerts when an admin account is removed."
          checked={settings.deletedAdmin}
          onToggle={() => toggle("deletedAdmin")}
        />
      </Section>

      <Section title="Company Management">
        <SettingRow
          icon={<FaBuilding className="text-blue-500" />}
          title="New Company Added"
          desc="Alert when a new company is registered."
          checked={settings.newCompany}
          onToggle={() => toggle("newCompany")}
        />
      </Section>

      <Section title="System & Communication">
        <SettingRow
          icon={<FaBell className="text-purple-500" />}
          title="Important Alerts"
          desc="Critical system warnings and security alerts."
          checked={settings.importantAlerts}
          onToggle={() => toggle("importantAlerts")}
        />

        <SettingRow
          icon={<FaEnvelope className="text-orange-500" />}
          title="Email Notifications"
          desc="Send notifications directly to your inbox."
          checked={settings.emailNotifications}
          onToggle={() => toggle("emailNotifications")}
        />
      </Section>
    </div>
  );
}

/* ---------------------------------- */
/* SECTION WRAPPER */
/* ---------------------------------- */
function Section({ title, children }) {
  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:bg-navy-800">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
        {title}
      </h2>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: { staggerChildren: 0.08 },
          },
        }}
        className="space-y-3"
      >
        {children}
      </motion.div>
    </div>
  );
}

/* ---------------------------------- */
/* SETTING ROW */
/* ---------------------------------- */
function SettingRow({ icon, title, desc, checked, onToggle }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 8 },
        visible: { opacity: 1, y: 0 },
      }}
      className="flex items-center justify-between rounded-xl border
                 bg-white p-4 transition dark:bg-navy-700 dark:text-white
                 hover:shadow-md"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 ">
          {icon}
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-800 dark:text-white">{title}</p>
          <p className="text-xs text-slate-500 dark:text-slate-300">{desc}</p>
        </div>
      </div>

      {/* SWITCH */}
      <Switch checked={checked} onToggle={onToggle} />
    </motion.div>
  );
}

/* ---------------------------------- */
/* PREMIUM SWITCH */
/* ---------------------------------- */
function Switch({ checked, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full
                  transition-colors duration-300 ${
                    checked ? "bg-purple-600" : "bg-slate-300"
                  }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white
                    transition-transform duration-300 ${
                      checked ? "translate-x-5" : "translate-x-1"
                    }`}
      />
    </button>
  );
}
