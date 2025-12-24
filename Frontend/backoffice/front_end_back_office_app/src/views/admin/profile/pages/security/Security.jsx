"use client";
<<<<<<< HEAD
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaLock, FaMobileAlt, FaDesktop } from "react-icons/fa";
=======

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaLock,
  FaMobileAlt,
  FaDesktop,
  FaShieldAlt,
  FaSignOutAlt,
} from "react-icons/fa";
>>>>>>> safa

import api from "services/api";
import ChangePassword from "./components/ChangePasswordModal";

export default function SecuritySettings() {
  const [isPasswordPopup, setIsPasswordPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  const sessions = [
    {
      device: "Windows – Chrome",
      location: "Tunisia",
      time: "10:45",
      icon: <FaDesktop className="text-blue-500" />,
<<<<<<< HEAD
=======
      current: true,
>>>>>>> safa
    },
    {
      device: "iPhone – Safari",
      location: "Sfax",
      time: "09:12",
      icon: <FaMobileAlt className="text-green-500" />,
<<<<<<< HEAD
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
=======
      current: false,
    },
  ];

  const handleChangePassword = async ({ currentPassword, newPassword }) => {
    try {
      setLoading(true);
      await api.put("/superadmin/update-password", null, {
        params: {
          oldPassword: currentPassword,
          newPassword,
>>>>>>> safa
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
<<<<<<< HEAD
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
=======
    <section
      className="rounded-3xl bg-white border border-slate-200
                 shadow-[0_30px_70px_-35px_rgba(0,0,0,0.25)] p-8"
    >
      {/* ================= HEADER ================= */}
     <div className="flex items-center gap-3 mb-8">
  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100">
    <FaShieldAlt className="text-purple-600" />
  </div>
  <h1 className="text-xl font-bold text-slate-800">Security Settings</h1>
</div>


      {/* ================= SECURITY ACTION ================= */}
      <motion.div
        whileHover={{ y: -4 }}
        className="rounded-2xl border border-slate-200 p-6
                   shadow-sm hover:shadow-md transition mb-10"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-100
                            flex items-center justify-center">
              <FaLock className="text-purple-600" />
            </div>

            <div>
              <p className="font-semibold text-slate-700">
                Change Password
              </p>
              <p className="text-xs text-slate-500">
                Update your account password regularly for better security
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsPasswordPopup(true)}
            className="px-5 py-2 rounded-xl text-sm font-semibold text-white
                       bg-gradient-to-r from-purple-500 to-indigo-500
                       hover:scale-[1.03] transition"
          >
            Update
          </button>
        </div>
      </motion.div>

      {/* ================= ACTIVE SESSIONS ================= */}
      <div>
        <h3 className="text-sm font-semibold text-slate-500 mb-4">
          ACTIVE SESSIONS
        </h3>

        <div className="space-y-4">
          {sessions.map((s, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.01 }}
              className="flex items-center justify-between
                         p-4 rounded-2xl border border-slate-200
                         hover:bg-slate-50 transition"
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-slate-100
                                flex items-center justify-center">
                  {s.icon}
                </div>

                <div>
                  <p className="font-semibold text-slate-700 flex items-center gap-2">
                    {s.device}
                    {s.current && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full
                                       bg-green-100 text-green-600">
                        CURRENT
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-slate-500">
>>>>>>> safa
                    {s.location} • {s.time}
                  </p>
                </div>
              </div>
<<<<<<< HEAD
              <button className="text-red-500 hover:underline">Logout</button>
            </div>
=======

              {!s.current && (
                <button
                  className="flex items-center gap-2 text-xs font-semibold
                             text-red-500 hover:underline"
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              )}
            </motion.div>
>>>>>>> safa
          ))}
        </div>
      </div>

<<<<<<< HEAD
      {/* MODAL */}
=======
      {/* ================= MODAL ================= */}
>>>>>>> safa
      <AnimatePresence>
        {isPasswordPopup && (
          <ChangePassword
            onClose={() => setIsPasswordPopup(false)}
            onSubmit={handleChangePassword}
            loading={loading}
          />
        )}
      </AnimatePresence>
<<<<<<< HEAD
    </div>
=======
    </section>
>>>>>>> safa
  );
}
