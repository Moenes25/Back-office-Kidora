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

<<<<<<< HEAD
=======
/* ---------------------------------- */
/* MAIN COMPONENT */
/* ---------------------------------- */
>>>>>>> safa
export default function NotificationSettings() {
  const [settings, setSettings] = useState({
    newCompany: true,
    deletedAdmin: false,
    addedAdmin: true,
    importantAlerts: true,
    emailNotifications: false,
  });

<<<<<<< HEAD
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
=======
  const toggle = (key) =>
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="w-full space-y-8 rounded-2xl bg-white p-6 shadow-lg">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100">
            <FaBell className="text-purple-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">
              Notification Settings
            </h1>
            <p className="text-sm text-slate-500">
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
>>>>>>> safa
    </div>
  );
}

<<<<<<< HEAD
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
=======
/* ---------------------------------- */
/* SECTION WRAPPER */
/* ---------------------------------- */
function Section({ title, children }) {
  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
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
                 bg-white p-4 transition
                 hover:shadow-md"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
>>>>>>> safa
          {icon}
        </div>

        <div>
<<<<<<< HEAD
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
=======
          <p className="text-sm font-semibold text-slate-800">{title}</p>
          <p className="text-xs text-slate-500">{desc}</p>
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
>>>>>>> safa
