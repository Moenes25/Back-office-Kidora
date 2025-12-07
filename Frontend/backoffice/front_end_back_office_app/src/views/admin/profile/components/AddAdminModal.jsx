"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import api from "services/api";
import {
  IoPersonAdd,
  IoPersonOutline,
  IoCallOutline,
  IoMailOutline,
  IoEyeOffOutline,
  IoEyeOutline,
  IoKeyOutline,
  IoShieldCheckmarkOutline,
  IoSettingsOutline,
  IoCheckmarkCircleOutline,
} from "react-icons/io5";

const roles = [
  {
    name: "Super Admin",
    icon: <IoShieldCheckmarkOutline className="text-purple-500" />,
  },
  { name: "Admin", icon: <IoSettingsOutline className="text-blue-500" /> },
  {
    name: "Moderator",
    icon: <IoCheckmarkCircleOutline className="text-green-500" />,
  },
];

const AddAdminModal = ({ open, onClose, onSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [shake, setShake] = useState(false);
  const [errors, setErrors] = useState({});
  const [focusField, setFocusField] = useState(""); // Track focused input

  const [newAdmin, setNewAdmin] = useState({
    nom: "",
    email: "",
    tel: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const validate = () => {
    let err = {};
    if (!newAdmin.role) err.role = "Role is required";
    if (!newAdmin.email) err.email = "Email is required";
    if (!newAdmin.password) err.password = "Password is required";
    if (newAdmin.password !== newAdmin.confirmPassword)
      err.confirmPassword = "Passwords do not match";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleAddAdmin = async () => {
    if (!validate()) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }

    try {
      const res = await api.post("/auth/register", newAdmin);
      onSuccess(res.data);
      onClose();
      setNewAdmin({
        nom: "",
        email: "",
        tel: "",
        password: "",
        confirmPassword: "",
        role: "",
      });
    } catch (error) {
      console.error("Error adding admin:", error);
      alert("Failed to add admin");
    }
  };

  if (!open) return null;

  const getRoleIcon = (roleName) => {
    const roleObj = roles.find((r) => r.name === roleName);
    return roleObj ? (
      roleObj.icon
    ) : (
      <IoShieldCheckmarkOutline className="text-purple-500" />
    );
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="relative w-full max-w-lg p-6 mx-4 bg-white border border-purple-100 shadow-xl rounded-2xl"
        initial={{ scale: 0.8, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute text-2xl text-gray-500 right-4 top-3 hover:text-gray-800"
        >
          ×
        </button>

        {/* Title */}
        <h3 className="mb-6 text-3xl font-bold text-center gradient-text ">
          Register
        </h3>

        <div className={`flex flex-col gap-4 ${shake ? "animate-shake" : ""}`}>
          {/* Role */}
          <motion.div
            className="relative"
            whileFocus={{
              scale: 1.02,
              boxShadow: "0 0 10px rgba(128,0,128,0.3)",
            }}
          >
            <span className="absolute text-lg left-3 top-4">
              {getRoleIcon(newAdmin.role)}
            </span>
            <select
              value={newAdmin.role}
              onChange={(e) =>
                setNewAdmin({ ...newAdmin, role: e.target.value })
              }
              onFocus={() => setFocusField("role")}
              onBlur={() => setFocusField("")}
              className={`w-full appearance-none rounded-xl border bg-gradient-to-r from-purple-50 to-blue-50 p-3 pl-10 focus:ring-2 focus:ring-purple-400 
                ${errors.role ? "border-red-400" : "border-gray-300"}`}
            >
              <option value="">Select Role</option>
              {roles.map((role, idx) => (
                <option
                  key={idx}
                  value={role.name}
                  className="hover:bg-purple-100"
                >
                  {role.name}
                </option>
              ))}
            </select>
            {errors.role && (
              <p className="mt-1 text-sm text-red-500">{errors.role}</p>
            )}
          </motion.div>

          {/* Name + Phone */}
          <div className="flex flex-col gap-4 md:flex-row">
            <motion.div
              className="relative flex-1"
              whileFocus={{
                scale: 1.02,
                boxShadow: "0 0 8px rgba(0,0,255,0.2)",
              }}
            >
              <IoPersonOutline className="absolute text-lg text-blue-500 left-3 top-4" />
              <input
                type="text"
                placeholder="Full Name"
                value={newAdmin.nom}
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, nom: e.target.value })
                }
                className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400"
              />
            </motion.div>

            <motion.div
              className="relative flex-1"
              whileFocus={{
                scale: 1.02,
                boxShadow: "0 0 8px rgba(0,128,0,0.2)",
              }}
            >
              <IoCallOutline className="absolute text-lg text-green-500 left-3 top-4" />
              <input
                type="text"
                placeholder="Phone"
                value={newAdmin.tel}
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, tel: e.target.value })
                }
                className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400"
              />
            </motion.div>
          </div>

          {/* Email */}
          <motion.div
            className="relative"
            whileFocus={{
              scale: 1.02,
              boxShadow: "0 0 8px rgba(255,0,128,0.2)",
            }}
          >
            <IoMailOutline className="absolute text-lg text-pink-500 left-3 top-4" />
            <input
              type="email"
              placeholder="Email"
              value={newAdmin.email}
              onChange={(e) =>
                setNewAdmin({ ...newAdmin, email: e.target.value })
              }
              className={`w-full rounded-xl border p-3 pl-10 focus:ring-2 focus:ring-purple-400 
                ${errors.email ? "border-red-400" : "border-gray-300"}`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </motion.div>

          {/* Password + Confirm */}
          <div className="flex flex-col gap-4 md:flex-row">
            {/* Password */}
            <motion.div
              className="relative flex-1"
              whileFocus={{
                scale: 1.02,
                boxShadow: "0 0 8px rgba(255,165,0,0.3)",
              }}
            >
              <IoKeyOutline className="absolute text-lg text-yellow-500 left-3 top-4" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={newAdmin.password}
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, password: e.target.value })
                }
                className={`w-full rounded-xl border p-3 pl-10 pr-10 focus:ring-2 focus:ring-purple-400
                  ${errors.password ? "border-red-400" : "border-gray-300"}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute text-gray-500 right-3 top-4"
              >
                {showPassword ? (
                  <IoEyeOffOutline className="text-red-500" />
                ) : (
                  <IoEyeOutline className="text-gray-600" />
                )}
              </button>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </motion.div>

            {/* Confirm */}
            <motion.div
              className="relative flex-1"
              whileFocus={{
                scale: 1.02,
                boxShadow: "0 0 8px rgba(255,165,0,0.3)",
              }}
            >
              <IoKeyOutline className="absolute text-lg text-yellow-500 left-3 top-4" />
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm Password"
                value={newAdmin.confirmPassword}
                onChange={(e) =>
                  setNewAdmin({
                    ...newAdmin,
                    confirmPassword: e.target.value,
                  })
                }
                className={`w-full rounded-xl border p-3 pl-10 pr-10 focus:ring-2 focus:ring-purple-400
                  ${
                    errors.confirmPassword
                      ? "border-red-400"
                      : "border-gray-300"
                  }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute text-gray-500 right-3 top-4"
              >
                {showConfirm ? (
                  <IoEyeOffOutline className="text-red-500" />
                ) : (
                  <IoEyeOutline className="text-gray-600" />
                )}
              </button>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.confirmPassword}
                </p>
              )}
            </motion.div>
          </div>

          {/* Save Button */}
          <motion.button
            onClick={handleAddAdmin}
            className="flex items-center justify-center gap-2 py-3 mt-2 font-medium text-white shadow-lg rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <IoPersonAdd size={20} />
            Save
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AddAdminModal;
