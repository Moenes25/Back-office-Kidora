"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaLock, FaMobileAlt, FaDesktop } from "react-icons/fa";

export default function SecuritySettings() {
  const [isPasswordPopup, setIsPasswordPopup] = useState(false);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);

  const sessions = [
    { device: "Windows – Chrome", location: "Tunisia", time: "10:45", icon: <FaDesktop className="text-blue-500" /> },
    { device: "iPhone – Safari", location: "Sfax", time: "09:12", icon: <FaMobileAlt className="text-green-500" /> },
  ];

  return (
    <div className="w-full p-6 bg-white shadow-md rounded-xl">
      {/* PAGE TITLE */}
      <div className="flex items-center gap-2 mb-6">
        <FaLock size={20} className="text-purple-600" />
        <h1 className="text-xl font-semibold text-gray-700">
          Security Settings
        </h1>
      </div>

      <div className="space-y-8">
        {/* ACCOUNT */}
        <div>
          <h2 className="mb-3 text-sm font-semibold text-gray-500">ACCOUNT</h2>
          <motion.div className="space-y-4">
            {/* Change Password */}
            <motion.div className="flex items-center justify-between px-4 py-3 transition border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
                  <FaLock className="text-purple-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">Change Password</p>
                  <p className="text-xs text-gray-500">Update your account password.</p>
                </div>
              </div>
              <button
                onClick={() => setIsPasswordPopup(true)}
                className="px-4 py-2 text-white bg-purple-600 rounded-lg shadow hover:bg-purple-700 transition"
              >
                Edit
              </button>
            </motion.div>

            {/* Two-Factor Authentication */}
            <motion.div className="flex items-center justify-between px-4 py-3 transition border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
                  <FaLock className="text-orange-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">Two-Factor Authentication</p>
                  <p className="text-xs text-gray-500">Enable or disable 2FA for your account.</p>
                </div>
              </div>
              <button
                onClick={() => setTwoFAEnabled(!twoFAEnabled)}
                className={`px-4 py-2 text-white rounded-lg shadow transition ${
                  twoFAEnabled ? "bg-green-500 hover:bg-green-600" : "bg-gray-500 hover:bg-gray-600"
                }`}
              >
                {twoFAEnabled ? "Enabled" : "Enable"}
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* ACTIVE SESSIONS */}
        <div>
          <h2 className="mb-3 text-sm font-semibold text-gray-500">ACTIVE SESSIONS</h2>
          <motion.div className="space-y-4">
            {sessions.map((session, idx) => (
              <motion.div
                key={idx}
                className="flex items-center justify-between px-4 py-3 transition border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
                    {session.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">{session.device}</p>
                    <p className="text-xs text-gray-500">{session.location} • Last activity: {session.time}</p>
                  </div>
                </div>
                <button className="text-red-500 transition hover:underline">Logout</button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Password Popup */}
      <AnimatePresence>
        {isPasswordPopup && (
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
              className="w-11/12 max-w-lg p-6 bg-white shadow-xl rounded-2xl"
            >
              <h4 className="flex items-center gap-2 mb-4 text-lg font-semibold">
                <FaLock /> Change Password
              </h4>
              <div className="space-y-3">
                <input
                  type="password"
                  placeholder="Current Password"
                  className="w-full px-3 py-2 transition border rounded-lg focus:ring-2 focus:ring-purple-400"
                />
                <input
                  type="password"
                  placeholder="New Password"
                  className="w-full px-3 py-2 transition border rounded-lg focus:ring-2 focus:ring-purple-400"
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="w-full px-3 py-2 transition border rounded-lg focus:ring-2 focus:ring-purple-400"
                />
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setIsPasswordPopup(false)}
                  className="px-4 py-2 transition bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 text-white transition bg-purple-600 rounded-lg hover:bg-purple-700">
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
