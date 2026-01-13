"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaUserShield,
  FaCamera,
  FaCalendarAlt,
  FaCheckCircle,
} from "react-icons/fa";
import { RiShieldUserFill } from "react-icons/ri";
import api from "services/api";
import { useAuth } from "context/AuthContext";

export default function ProfileInfo() {
  const { user, token, updateUser } = useAuth();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "",
  });

  const [meta, setMeta] = useState({ createdAt: "", updatedAt: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [profileImage, setProfileImage] = useState("/default-avatar.png");

  /* ---------------- init ---------------- */
  useEffect(() => {
    if (!user) return;
    setForm({
      fullName: user.nom || "",
      email: user.email || "",
      phone: user.tel || "",
      role: user.role || "",
    });
    setMeta({ createdAt: user.createdAt, updatedAt: user.updatedAt });
    setProfileImage(user.imageUrl || "/default-avatar.png");
  }, [user]);

  /* ---------------- utils ---------------- */
  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "N/A";

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) =>
    e.target.files?.[0] && setPreviewImage(e.target.files[0]);

  const handleSave = async () => {
    const fd = new FormData();
    fd.append("nom", form.fullName);
    fd.append("tel", form.phone);
    if (previewImage) fd.append("imageFile", previewImage);

    const res = await api.put("/auth/update-profile", fd, {
      headers: { Authorization: `Bearer ${token}` },
    });

    updateUser(res.data);
    setProfileImage(res.data.imageUrl || profileImage);
    setIsEditing(false);
    setPreviewImage(null);
  };

  /* ================= RENDER ================= */
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-[28px]
                 bg-white border border-purple-200
                 shadow-[0_40px_80px_-35px_rgba(139,92,246,0.45)]   dark:text-white dark:bg-navy-800 
                 p-8"
    >
      {/* ===== Background Glow ===== */}
      <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full
                      bg-purple-400/20 blur-3xl" />

      {/* ===== HEADER ===== */}
      <div className="relative z-10 flex justify-between items-center mb-10">
   <div className="flex items-center gap-3">
  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100">
    <RiShieldUserFill className="text-purple-600" />
  </div>
  <div>
    <h1 className="text-xl font-bold text-slate-800 dark:text-white
    ">Profil Settings</h1>
    <p className="text-sm text-slate-500 dark:text-white
    ">Manage identity & account security</p>
  </div>
</div>


        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="rounded-full px-6 py-2 text-sm font-semibold text-white
                       bg-gradient-to-r from-purple-500 to-indigo-500
                       shadow-lg hover:scale-105 transition"
          >
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={() => {
                setIsEditing(false);
                setPreviewImage(null);
              }}
              className="px-4 py-2 rounded-full bg-slate-100 text-sm dark:bg-slate-600"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-full text-sm font-semibold text-white
                         bg-gradient-to-r from-purple-500 to-indigo-500"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>

      {/* ===== IDENTITY CARD ===== */}
      <div className="relative z-10 flex items-center gap-6 mb-12">
        <motion.div
          whileHover={{ scale: 1.06 }}
          className="relative h-28 w-28 rounded-3xl
                     ring-4 ring-purple-300/40
                     shadow-xl overflow-hidden"
        >
          <img
            src={previewImage ? URL.createObjectURL(previewImage) : profileImage}
            className="h-full w-full object-cover"
          />

          {isEditing && (
            <label className="absolute inset-0 bg-black/40 flex items-center
                              justify-center cursor-pointer">
              <FaCamera className="text-white text-xl" />
              <input type="file" hidden accept="image/*" onChange={handleImageChange}  />
            </label>
          )}
        </motion.div>

        <div>
          <h3 className="text-md
           font-extrabold text-slate-800 dark:text-white
          ">
            {form.fullName}
          </h3>

          <div className="mt-1 flex items-center gap-2">
            <span className="rounded-full bg-purple-100 px-3 py-1
                             text-xs font-semibold text-purple-700">
              {form.role}
            </span>

            <span className="flex items-center gap-1 text-xs text-emerald-600">
              <FaCheckCircle /> Verified
            </span>
          </div>
        </div>
      </div>

      {/* ===== INFO GRID ===== */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoCard icon={<FaUser />} label="Full Name" value={form.fullName}
          editable={isEditing} name="fullName" onChange={handleChange} />

        <InfoCard icon={<FaEnvelope />} label="Email" value={form.email} />

        <InfoCard icon={<FaPhone />} label="Phone" value={form.phone}
          editable={isEditing} name="phone" onChange={handleChange} />

        <InfoCard icon={<FaUserShield />} label="Role" value={form.role} />

        <MetaCard icon={<FaCalendarAlt />} label="Created At" value={formatDate(meta.createdAt)} />
        <MetaCard icon={<FaCalendarAlt />} label="Updated At" value={formatDate(meta.updatedAt)} />
      </div>
    </motion.section>
  );
}

/* ================= SUB COMPONENTS ================= */

const InfoCard = ({ icon, label, value, editable, name, onChange }) => (
  <motion.div
    whileHover={{ y: -6 }}
    className="rounded-2xl bg-white border border-slate-200 dark:border-navy-800
               p-5 shadow-sm hover:shadow-md transition  dark:text-white dark:bg-navy-700
               "
  >
    <p className="flex items-center gap-2 text-xs text-slate-500 mb-1 dark:text-white
    ">
      <span className="text-purple-500">{icon}</span> {label}
    </p>

    {editable ? (
      <input
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border px-3 py-2 
                   focus:ring-2 focus:ring-purple-400 outline-none dark:bg-navy-800"
      />
    ) : (
      <p className="font-bold text-slate-800 dark:text-white text-sm
      ">{value}</p>
    )}
  </motion.div>
);

const MetaCard = ({ icon, label, value }) => (
  <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5 dark:bg-navy-700
  ">
    <p className="flex items-center gap-2 text-xs text-slate-500 mb-1">
      <span className="text-indigo-500">{icon}</span> {label}
    </p>
    <p className="font-semibold text-slate-700 text-sm dark:text-white
    ">{value}</p>
  </div>
);
