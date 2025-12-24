"use client";

import React, { useState, useEffect } from "react";
<<<<<<< HEAD
import { motion } from "framer-motion";
=======
import { motion, AnimatePresence } from "framer-motion";
>>>>>>> safa
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaUserShield,
  FaCamera,
<<<<<<< HEAD
  FaCalendar,
} from "react-icons/fa";
import { RiUserSettingsFill } from "react-icons/ri";
import api from "services/api";
import { useAuth } from "context/AuthContext";
import avatar4Img from "../../../../assets/img/avatars/avatar4.png";
=======
  FaCalendarAlt,
  FaCheckCircle,
} from "react-icons/fa";
import { RiShieldUserFill } from "react-icons/ri";
import api from "services/api";
import { useAuth } from "context/AuthContext";
>>>>>>> safa

export default function ProfileInfo() {
  const { user, token, updateUser } = useAuth();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "",
  });

<<<<<<< HEAD
  const [readOnlyData, setReadOnlyData] = useState({
    createdAt: "",
    updatedAt: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState("/default-avatar.png");
  const [previewImage, setPreviewImage] = useState(null);


  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };


  useEffect(() => {
    if (!user) return;

=======
  const [meta, setMeta] = useState({ createdAt: "", updatedAt: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [profileImage, setProfileImage] = useState("/default-avatar.png");

  /* ---------------- init ---------------- */
  useEffect(() => {
    if (!user) return;
>>>>>>> safa
    setForm({
      fullName: user.nom || "",
      email: user.email || "",
      phone: user.tel || "",
      role: user.role || "",
    });
<<<<<<< HEAD

    setReadOnlyData({
      createdAt: user.createdAt || "",
      updatedAt: user.updatedAt || "",
    });

    setProfileImage(user.imageUrl || "/default-avatar.png");
  }, [user]);


  useEffect(() => {
  if (!token || !user?.id) return;

  const fetchUser = async () => {
    try {
      const res = await api.get(`/auth/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // only update if data has changed
      const newUserData = res.data;
      if (
        newUserData.nom !== user.nom ||
        newUserData.email !== user.email ||
        newUserData.tel !== user.tel ||
        newUserData.imageUrl !== user.imageUrl
      ) {
        updateUser(newUserData);
      }
    } catch (err) {
      console.error("Failed to refresh user:", err);
    }
  };

  fetchUser();
}, [token, user?.id, user, updateUser]);


  // ==================================================
  // Handlers
  // ==================================================
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setPreviewImage(file);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("email", form.email);
      formData.append("nom", form.fullName);
      formData.append("tel", form.phone);

      if (previewImage) {
        formData.append("imageFile", previewImage);
      }

      const res = await api.put("/auth/update-profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      updateUser(res.data);

      if (previewImage) {
        setProfileImage(URL.createObjectURL(previewImage));
      } else if (res.data.imageUrl) {
        setProfileImage(res.data.imageUrl);
      }

      setPreviewImage(null);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Update failed");
    }
  };

  const editableFields = [
    {
      label: "Full Name",
      name: "fullName",
      icon: <FaUser className="text-purple-500" />,
      editable: true,
    },
    {
      label: "Email",
      name: "email",
      icon: <FaEnvelope className="text-blue-500" />,
      editable: false,
    },
    {
      label: "Phone",
      name: "phone",
      icon: <FaPhone className="text-green-500" />,
      editable: true,
    },
    {
      label: "Role",
      name: "role",
      icon: <FaUserShield className="text-orange-500" />,
      editable: false,
    },
  ];

  const readOnlyFields = [
    {
      label: "Created At",
      value: readOnlyData.createdAt,
      icon: <FaCalendar className="text-yellow-500" />,
    },
    {
      label: "Updated At",
      value: readOnlyData.updatedAt,
      icon: <FaCalendar className="text-red-500" />,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full p-6 bg-white border border-purple-200 shadow-xl rounded-2xl"
    >
      {/* Header */}
      <div className="flex items-center gap-2 py-4 mb-6">
        <RiUserSettingsFill size={20} className="text-purple-600" />
        <h1 className="text-xl font-semibold text-gray-700">
          Security Settings
        </h1>
      </div>

      {/* Top Area */}
      <div className="flex items-start justify-between gap-4">
        <div className="relative w-20 h-20">
          <img
            src={
              previewImage
                ? URL.createObjectURL(previewImage)
                : profileImage
            }
          
            alt="profile"
            className="object-cover w-20 h-20 border-2 border-purple-300 rounded-xl"
          />

          {isEditing && (
            <label className="absolute flex items-center justify-center w-6 h-6 text-white transform translate-x-1/2 -translate-y-1/2 bg-purple-600 rounded-full cursor-pointer top-1/2 right-1/2">
              <FaCamera size={14} />
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          )}
        </div>
=======
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
                 shadow-[0_40px_80px_-35px_rgba(139,92,246,0.45)]
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
    <h1 className="text-xl font-bold text-slate-800">Security Settings</h1>
    <p className="text-sm text-slate-500">Manage identity & account security</p>
  </div>
</div>

>>>>>>> safa

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
<<<<<<< HEAD
            className="px-5 py-2 text-sm text-white rounded-lg bg-gradient-to-br from-purple-500 to-blue-500"
          >
            Edit
=======
            className="rounded-full px-6 py-2 text-sm font-semibold text-white
                       bg-gradient-to-r from-purple-500 to-indigo-500
                       shadow-lg hover:scale-105 transition"
          >
            Edit Profile
>>>>>>> safa
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={() => {
                setIsEditing(false);
                setPreviewImage(null);
              }}
<<<<<<< HEAD
              className="px-4 py-2 bg-gray-200 rounded-lg"
=======
              className="px-4 py-2 rounded-full bg-slate-100 text-sm"
>>>>>>> safa
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
<<<<<<< HEAD
              className="px-4 py-2 text-white rounded-lg bg-gradient-to-br from-purple-500 to-blue-500"
            >
              Save
=======
              className="px-5 py-2 rounded-full text-sm font-semibold text-white
                         bg-gradient-to-r from-purple-500 to-indigo-500"
            >
              Save Changes
>>>>>>> safa
            </button>
          </div>
        )}
      </div>

<<<<<<< HEAD
      {/* Fields */}
      <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2">
        {editableFields.map((field) => (
          <div
            key={field.name}
            className="p-5 bg-white border rounded-xl"
          >
            <p className="flex items-center gap-2 text-xs text-gray-500">
              {field.icon} {field.label}
            </p>

            {isEditing && field.editable ? (
              <input
                type="text"
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                className="w-full px-3 py-2 mt-1 border rounded-lg"
              />
            ) : (
              <p className="text-sm font-semibold text-gray-700">
                {form[field.name]}
              </p>
            )}
          </div>
        ))}

        {readOnlyFields.map((field, i) => (
          <div
            key={i}
            className="p-5 border bg-gray-50 rounded-xl"
          >
            <p className="flex items-center gap-2 text-xs text-gray-500">
              {field.icon} {field.label}
            </p>
            <p className="text-sm font-semibold text-gray-700">
              {formatDate(field.value)}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
=======
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
              <input type="file" hidden accept="image/*" onChange={handleImageChange} />
            </label>
          )}
        </motion.div>

        <div>
          <h3 className="text-2xl font-extrabold text-slate-800">
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
    className="rounded-2xl bg-white border border-slate-200
               p-5 shadow-sm hover:shadow-md transition"
  >
    <p className="flex items-center gap-2 text-xs text-slate-500 mb-1">
      <span className="text-purple-500">{icon}</span> {label}
    </p>

    {editable ? (
      <input
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border px-3 py-2
                   focus:ring-2 focus:ring-purple-400 outline-none"
      />
    ) : (
      <p className="font-bold text-slate-800">{value}</p>
    )}
  </motion.div>
);

const MetaCard = ({ icon, label, value }) => (
  <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5">
    <p className="flex items-center gap-2 text-xs text-slate-500 mb-1">
      <span className="text-indigo-500">{icon}</span> {label}
    </p>
    <p className="font-semibold text-slate-700">{value}</p>
  </div>
);
>>>>>>> safa
