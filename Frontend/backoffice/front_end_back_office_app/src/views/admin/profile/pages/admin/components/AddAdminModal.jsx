"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    nom: "",
    email: "",
    tel: "",
    password: "",
    confirmPassword: "",
    role: "",
    region: "",
  });

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
      };

      const res = await api.post("/auth/register", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      onSuccess(res.data);
      onClose();
    } catch (err) {
      alert(err.response?.data || "Failed to add admin");
    }
  };

  if (!open) return null;

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
