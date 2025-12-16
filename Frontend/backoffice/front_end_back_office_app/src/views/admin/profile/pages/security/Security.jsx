"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaLock, FaMobileAlt, FaDesktop } from "react-icons/fa";

import ChangePasswordModal from "./components/ChangePasswordModal";
import api from "services/api";


export default function SecuritySettings() {
  const [isPasswordPopup, setIsPasswordPopup] = useState(false);
  const [loading, setLoading] = useState(false);
   

  const sessions = [
    {
      device: "Windows – Chrome",
      location: "Tunisia",
      time: "10:45",
      icon: <FaDesktop className="text-blue-500" />,
    },
    {
      device: "iPhone – Safari",
      location: "Sfax",
      time: "09:12",
      icon: <FaMobileAlt className="text-green-500" />,
    },
  ];

  //  API CALL HERE (BEST PRACTICE)
  const handleChangePassword = async ({ currentPassword, newPassword }) => {
    try {
      setLoading(true);

      await api.put("/superadmin/update-password", null, {
        params: {
          oldPassword: currentPassword,
          newPassword: newPassword,
        },
        
      });

      alert("Password updated successfully ✅");
      setIsPasswordPopup(false);
    } catch (error) {
      alert(error?.response?.data || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full p-6 bg-white shadow-md rounded-xl">
      {/* TITLE */}
      <div className="flex items-center gap-2 mb-6">
        <FaLock className="text-purple-600" />
        <h1 className="text-xl font-semibold text-gray-700">
          Security Settings
        </h1>
      </div>

      {/* CHANGE PASSWORD */}
      <motion.div className="flex items-center justify-between px-4 py-3 border rounded-lg hover:bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
            <FaLock className="text-purple-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700">
              Change Password
            </p>
            <p className="text-xs text-gray-500">
              Update your account password
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsPasswordPopup(true)}
          className="px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700"
        >
          Edit
        </button>
      </motion.div>

      {/* ACTIVE SESSIONS */}
      <div className="mt-8">
        <h2 className="mb-3 text-sm font-semibold text-gray-500">
          ACTIVE SESSIONS
        </h2>

        <div className="space-y-4">
          {sessions.map((s, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-4 py-3 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
                  {s.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">
                    {s.device}
                  </p>
                  <p className="text-xs text-gray-500">
                    {s.location} • {s.time}
                  </p>
                </div>
              </div>
              <button className="text-red-500 hover:underline">Logout</button>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {isPasswordPopup && (
          <ChangePasswordModal
            onClose={() => setIsPasswordPopup(false)}
            onSubmit={handleChangePassword}
            loading={loading}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
