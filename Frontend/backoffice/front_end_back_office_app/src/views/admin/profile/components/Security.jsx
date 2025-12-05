"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaMobileAlt, FaDesktop } from "react-icons/fa";
import { FaLock } from "react-icons/fa6";

const Security = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // 👉 Later: send password change to backend
    setIsPopupOpen(false);
  };

  return (
    <div className="flex flex-col gap-8 p-6 border border-purple-200 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-navy-700 dark:to-navy-800 dark:border-navy-600 rounded-2xl">
      <h3 className="mb-4 text-xl font-bold text-purple-700 dark:text-white">
        Security Settings
      </h3>

      {/* Change Password Button */}
      <motion.div
        className="p-4 transition bg-white shadow cursor-pointer dark:bg-navy-700 rounded-xl hover:shadow-xl"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <h4 className="flex items-center gap-2 mb-3 font-semibold">
          <FaLock /> Change Password
        </h4>
        <button
          onClick={() => setIsPopupOpen(true)}
          className="px-4 py-2 text-white transition bg-purple-600 rounded-lg shadow hover:bg-purple-700"
        >
          Edit
        </button>
      </motion.div>

      {/* Other sections */}
      <motion.div className="space-y-6">
        {/* 2FA Section */}
        <div className="p-4 transition bg-white shadow dark:bg-navy-700 rounded-xl hover:shadow-xl">
          <h4 className="mb-3 font-semibold">Two-Factor Authentication (2FA)</h4>
          <button className="px-4 py-2 text-white transition bg-gray-800 rounded-lg hover:bg-gray-900">
            Enable 2FA
          </button>
        </div>

        {/* Active Sessions Section */}
        <div className="p-4 transition bg-white shadow dark:bg-navy-700 rounded-xl hover:shadow-xl">
          <h4 className="mb-4 font-semibold">Active Sessions</h4>
          <div className="flex flex-col gap-3">
            {[
              { type: "Desktop", device: "Windows – Chrome", location: "Tunisia", time: "10:45", icon: <FaDesktop /> },
              { type: "Mobile", device: "iPhone – Safari", location: "Sfax", time: "09:12", icon: <FaMobileAlt /> },
            ].map((session, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 transition border rounded-lg hover:bg-purple-50 dark:hover:bg-navy-600"
              >
                <div className="flex items-center gap-3">
                  {React.cloneElement(session.icon, { className: "text-xl text-gray-500" })}
                  <div>
                    <p className="font-medium">{session.device}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-300">
                      {session.location} • Last activity: {session.time}
                    </p>
                  </div>
                </div>
                <button className="text-red-500 transition hover:underline">Logout</button>
              </div>
            ))}
          </div>
          <button className="mt-4 text-blue-600 underline transition hover:text-blue-700">
            Logout All Sessions
          </button>
        </div>

        {/* Login Activity Section */}
        <div className="p-4 transition bg-white shadow dark:bg-navy-700 rounded-xl hover:shadow-xl">
          <h4 className="mb-3 font-semibold">Login Activity</h4>
          <ul className="text-sm text-gray-600 list-disc list-inside dark:text-gray-300">
            <li>Successful login – 10:45 (Tunisia)</li>
            <li>Successful login – 09:10 (Tunisia)</li>
            <li>Failed attempt – 08:50 (IP: 102.xx.xx)</li>
          </ul>
        </div>
      </motion.div>

      {/* Password Popup */}
      <AnimatePresence>
        {isPopupOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-11/12 max-w-lg p-6 bg-white shadow-xl dark:bg-navy-700 rounded-2xl"
            >
              <h4 className="flex items-center gap-2 mb-4 text-lg font-semibold">
                <FaLock /> Edit
              </h4>
              <div className="space-y-3">
                <input
                  type="password"
                  placeholder="Current Password"
                  name="currentPassword"
                  value={form.currentPassword}
                  onChange={handleChange}
                  className="w-full px-3 py-2 transition border rounded-lg focus:ring-2 focus:ring-purple-400 dark:focus:ring-purple-500"
                />
                <input
                  type="password"
                  placeholder="New Password"
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                  className="w-full px-3 py-2 transition border rounded-lg focus:ring-2 focus:ring-purple-400 dark:focus:ring-purple-500"
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-3 py-2 transition border rounded-lg focus:ring-2 focus:ring-purple-400 dark:focus:ring-purple-500"
                />
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setIsPopupOpen(false)}
                  className="px-4 py-2 transition bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 text-white transition bg-purple-600 rounded-lg hover:bg-purple-700"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Security;
