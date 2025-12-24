"use client";

import React, { useState, useEffect } from "react";
<<<<<<< HEAD
import { motion } from "framer-motion";
=======
import { motion, AnimatePresence } from "framer-motion";
>>>>>>> safa
import api from "services/api";
import { useAuth } from "context/AuthContext";
import {
  IoPersonAdd,
  IoPersonOutline,
  IoCallOutline,
  IoMailOutline,
  IoEyeOffOutline,
  IoEyeOutline,
  IoKeyOutline,
  IoShieldCheckmarkOutline,
<<<<<<< HEAD
  IoSettingsOutline,
  IoCheckmarkCircleOutline,
} from "react-icons/io5";

const AddAdminModal = ({ open, onClose, onSuccess }) => {
  const { token } = useAuth();
  const [roles, setRoles] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [shake, setShake] = useState(false);
  const [errors, setErrors] = useState({});
  const [newAdmin, setNewAdmin] = useState({
=======
  IoLocationOutline,
  IoClose,
} from "react-icons/io5";

/* ------------------ Helpers ------------------ */
const tunisianRegions = [
  "Tunis","Ariana","Ben Arous","Manouba","Nabeul","Zaghouan","Bizerte",
  "Beja","Jendouba","Kef","Siliana","Sousse","Monastir","Mahdia","Sfax",
  "Kairouan","Kasserine","Sidi Bouzid","Gabes","Mednine","Tataouine",
  "Gafsa","Tozeur","Kebili",
];

const inputBase =
  "w-full rounded-xl border bg-slate-50 px-4 py-3 text-sm text-slate-700 " +
  "focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white transition";

/* ------------------ Component ------------------ */
export default function AddAdminModal({ open, onClose, onSuccess }) {
  const { token } = useAuth();
  const [roles, setRoles] = useState([]);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [form, setForm] = useState({
>>>>>>> safa
    nom: "",
    email: "",
    tel: "",
    password: "",
    confirmPassword: "",
    role: "",
    region: "",
  });

<<<<<<< HEAD
  // ===========================
  // Fetch roles from backend
  // ===========================
  useEffect(() => {
    const fetchRoles = async () => {
      if (!token) return;

      try {
        const res = await api.get("/auth/roles", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status !== 200) throw new Error("Failed to fetch roles");

        setRoles(res.data);
      } catch (err) {
        console.error("Error fetching roles:", err);
      }
    };

    fetchRoles();
  }, [token]);

  // ===========================
  // Validate form
  // ===========================
  const validate = () => {
    let err = {};
    if (!newAdmin.role) err.role = "Role is required";
    if (!newAdmin.email) err.email = "Email is required";
    if (!newAdmin.password) err.password = "Password is required";
    if (newAdmin.password !== newAdmin.confirmPassword)
      err.confirmPassword = "Passwords do not match";
    if (!newAdmin.region) err.region = "Region is required";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // ===========================
  // Handle Add Admin
  // ===========================
  const handleAddAdmin = async () => {
    if (!validate()) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }

    try {
      const selectedRole =
        roles.find((r) => r.name === newAdmin.role)?.backendValue ||
        newAdmin.role;

      const payload = {
        nom: newAdmin.nom,
        email: newAdmin.email,
        tel: newAdmin.tel,
        password: newAdmin.password,
        role: selectedRole,
        region: newAdmin.region,
=======
  /* ------------------ Fetch Roles ------------------ */
  useEffect(() => {
    if (!token) return;
    api
      .get("/auth/roles", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setRoles(res.data))
      .catch(console.error);
  }, [token]);

  /* ------------------ Validation ------------------ */
  const validate = () => {
    const e = {};
    if (!form.role) e.role = "Role required";
    if (!form.region) e.region = "Region required";
    if (!form.email) e.email = "Email required";
    if (!form.password) e.password = "Password required";
    if (form.password !== form.confirmPassword)
      e.confirmPassword = "Passwords do not match";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ------------------ Submit ------------------ */
  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const selectedRole =
        roles.find((r) => r.name === form.role)?.backendValue || form.role;

      const payload = {
        nom: form.nom,
        email: form.email,
        tel: form.tel,
        password: form.password,
        role: selectedRole,
        region: form.region,
>>>>>>> safa
      };

      const res = await api.post("/auth/register", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      onSuccess(res.data);
      onClose();
<<<<<<< HEAD

      setNewAdmin({
        nom: "",
        email: "",
        tel: "",
        password: "",
        confirmPassword: "",
        role: "",
        region: "",
      });
    } catch (error) {
      console.error("Error adding admin:", error);
      const message = error.response?.data || error.message;
      alert("Failed to add admin: " + message);
=======
    } catch (err) {
      alert(err.response?.data || "Failed to add admin");
>>>>>>> safa
    }
  };

  if (!open) return null;

<<<<<<< HEAD
  const getRoleIcon = (roleName) => {
    const roleObj = roles.find((r) => r.name === roleName);
    return (
      roleObj?.icon || <IoShieldCheckmarkOutline className="text-purple-500" />
    );
  };

  const tunisianRegions = [
    "Tunis",
    "Ariana",
    "Ben Arous",
    "Manouba",
    "Nabeul",
    "Zaghouan",
    "Bizerte",
    "Beja",
    "Jendouba",
    "Kef",
    "Siliana",
    "Sousse",
    "Monastir",
    "Mahdia",
    "Sfax",
    "Kairouan",
    "Kasserine",
    "Sidi Bouzid",
    "Gabes",
    "Mednine",
    "Tataouine",
    "Gafsa",
    "Tozeur",
    "Kebili",
  ];

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
        <h3 className="mb-6 text-3xl font-bold text-center gradient-text">
          Register Admin
        </h3>

        <div className={`flex flex-col gap-4 ${shake ? "animate-shake" : ""}`}>
          {/* Role */}
          <motion.div className="relative">
            <span className="absolute text-lg left-3 top-4">
              {getRoleIcon(newAdmin.role)}
            </span>
            <select
              value={newAdmin.role}
              onChange={(e) =>
                setNewAdmin({ ...newAdmin, role: e.target.value })
              }
              className={`w-full appearance-none rounded-xl border bg-gradient-to-r from-purple-50 to-blue-50 p-3 pl-10 focus:ring-2 focus:ring-purple-400 ${
                errors.role ? "border-red-400" : "border-gray-300"
              }`}
            >
              <option value="">Select Role</option>
              {roles.map((role, idx) => (
                <option key={idx} value={role.name || role}>
                  {role.name || role}
                </option>
              ))}
            </select>
            {errors.role && (
              <p className="mt-1 text-sm text-red-500">{errors.role}</p>
            )}
          </motion.div>

          {/* Region */}
          <div>
            <select
              value={newAdmin.region}
              onChange={(e) =>
                setNewAdmin({ ...newAdmin, region: e.target.value })
              }
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-purple-400"
            >
              <option value="">Select Region</option>
              {tunisianRegions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
            {errors.region && (
              <p className="mt-1 text-sm text-red-500">{errors.region}</p>
            )}
          </div>

          {/* Name + Phone */}
          <div className="flex flex-col gap-4 md:flex-row">
            <motion.div className="relative flex-1">
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

            <motion.div className="relative flex-1">
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
          <motion.div className="relative">
            <IoMailOutline className="absolute text-lg text-pink-500 left-3 top-4" />
            <input
              type="email"
              placeholder="Email"
              value={newAdmin.email}
              onChange={(e) =>
                setNewAdmin({ ...newAdmin, email: e.target.value })
              }
              className={`w-full rounded-xl border p-3 pl-10 focus:ring-2 focus:ring-purple-400 ${
                errors.email ? "border-red-400" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </motion.div>

          {/* Password + Confirm */}
          <div className="flex flex-col gap-4 md:flex-row">
            <motion.div className="relative flex-1">
              <IoKeyOutline className="absolute text-lg text-yellow-500 left-3 top-4" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={newAdmin.password}
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, password: e.target.value })
                }
                className={`w-full rounded-xl border p-3 pl-10 pr-10 focus:ring-2 focus:ring-purple-400 ${
                  errors.password ? "border-red-400" : "border-gray-300"
                }`}
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

            <motion.div className="relative flex-1">
              <IoKeyOutline className="absolute text-lg text-yellow-500 left-3 top-4" />
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm Password"
                value={newAdmin.confirmPassword}
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, confirmPassword: e.target.value })
                }
                className={`w-full rounded-xl border p-3 pl-10 pr-10 focus:ring-2 focus:ring-purple-400 ${
                  errors.confirmPassword ? "border-red-400" : "border-gray-300"
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
            <IoPersonAdd size={20} /> Save
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AddAdminModal;
=======
  /* ------------------ UI ------------------ */
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.9, y: 30, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 30, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 25 }}
          className="relative w-[95%] max-w-xl rounded-2xl bg-white p-6 shadow-2xl"
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 rounded-lg
                       text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <IoClose size={20} />
          </button>

          {/* Header */}
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold gradient-text">
              Register New Admin
            </h2>
            <p className="text-sm text-slate-500">
              Create administrator account & permissions
            </p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* Role */}
            <div>
              <div className="relative">
                <IoShieldCheckmarkOutline className="absolute left-4 top-4 text-purple-500" />
                <select
                  className={`${inputBase} pl-10`}
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option value="">Select Role</option>
                  {roles.map((r, i) => (
                    <option key={i} value={r.name || r}>
                      {r.name || r}
                    </option>
                  ))}
                </select>
              </div>
              {errors.role && <p className="text-xs text-red-500">{errors.role}</p>}
            </div>

            {/* Region */}
            <div className="relative">
              <IoLocationOutline className="absolute left-4 top-4 text-blue-500" />
              <select
                className={`${inputBase} pl-10`}
                value={form.region}
                onChange={(e) => setForm({ ...form, region: e.target.value })}
              >
                <option value="">Select Region</option>
                {tunisianRegions.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              {errors.region && <p className="text-xs text-red-500">{errors.region}</p>}
            </div>

            {/* Name + Phone */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="relative">
                <IoPersonOutline className="absolute left-4 top-4 text-indigo-500" />
                <input
                  className={`${inputBase} pl-10`}
                  placeholder="Full name"
                  value={form.nom}
                  onChange={(e) => setForm({ ...form, nom: e.target.value })}
                />
              </div>

              <div className="relative">
                <IoCallOutline className="absolute left-4 top-4 text-green-500" />
                <input
                  className={`${inputBase} pl-10`}
                  placeholder="Phone"
                  value={form.tel}
                  onChange={(e) => setForm({ ...form, tel: e.target.value })}
                />
              </div>
            </div>

            {/* Email */}
            <div className="relative">
              <IoMailOutline className="absolute left-4 top-4 text-pink-500" />
              <input
                className={`${inputBase} pl-10`}
                placeholder="Email address"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
            </div>

            {/* Passwords */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="relative">
                <IoKeyOutline className="absolute left-4 top-4 text-yellow-500" />
                <input
                  className={`${inputBase} pl-10 pr-10`}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4 text-slate-400"
                >
                  {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                </button>
              </div>

              <div className="relative">
                <IoKeyOutline className="absolute left-4 top-4 text-yellow-500" />
                <input
                  className={`${inputBase} pl-10 pr-10`}
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm password"
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm({ ...form, confirmPassword: e.target.value })
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-4 text-slate-400"
                >
                  {showConfirm ? <IoEyeOffOutline /> : <IoEyeOutline />}
                </button>
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            {/* Submit */}
            <motion.button
              onClick={handleSubmit}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="mt-4 flex items-center justify-center gap-2
                         rounded-xl py-3 text-sm font-semibold text-white
                         bg-gradient-to-r from-purple-500 to-indigo-500
                         shadow-lg hover:shadow-xl p-3"
            >
              <IoPersonAdd size={18} />
              Create Admin
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
>>>>>>> safa
