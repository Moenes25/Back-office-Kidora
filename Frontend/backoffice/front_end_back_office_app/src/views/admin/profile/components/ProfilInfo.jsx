"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaUserShield,
  FaCalendarAlt,
  FaSignInAlt,
  FaCamera,
} from "react-icons/fa";

export default function ProfileInfo() {
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    fullName: "Nesrine Nasri",
    email: "nesrine@example.com",
    phone: "+216 55 000 111",
    role: "Super Admin",
    createdAt: "12 Janvier 2025",
    lastLogin: "Aujourd’hui à 10:45",
  });

  const [profileImage, setProfileImage] = useState("/default-avatar.png");
  const [previewImage, setPreviewImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setPreviewImage(URL.createObjectURL(file));
  };

  const saveImage = () => {
    if (previewImage) {
      setProfileImage(previewImage);
      setPreviewImage(null);
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    saveImage();
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const fields = [
    {
      label: "Full Name",
      name: "fullName",
      icon: <FaUser className="text-purple-500" />,
    },
    {
      label: "Email",
      name: "email",
      icon: <FaEnvelope className="text-blue-500" />,
    },
    {
      label: "Phone",
      name: "phone",
      icon: <FaPhone className="text-green-500" />,
    },
    {
      label: "Role",
      name: "role",
      icon: <FaUserShield className="text-orange-500" />,
    },
    {
      label: "Account Created",
      name: "createdAt",
      icon: <FaCalendarAlt className="text-pink-500" />,
    },
    {
      label: "Last Login",
      name: "lastLogin",
      icon: <FaSignInAlt className="text-yellow-500" />,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full p-6 bg-white rounded-2xl shadow-xl border border-purple-200"
    >
      {/* TOP HEADER */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
        {/* LEFT: PHOTO & BASIC INFO */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <img
              src={previewImage ? previewImage : profileImage} alt="profil"
              className="w-28 h-28 rounded-full object-cover shadow-lg border-4 border-purple-200"
            />

            {isEditing && (
              <label className="absolute bottom-1 right-1 bg-purple-600 text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-purple-700">
                <FaCamera size={14} />
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              </label>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-bold text-purple-700">{form.fullName}</h2>
            <p className="text-gray-600">{form.email}</p>
          </div>
        </div>

        {/* EDIT BUTTON */}
        {!isEditing ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setIsEditing(true)}
            className="px-5 py-2 text-sm text-white  rounded-lg shadow bg-gradient-to-br from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
          >
            Edit 
          </motion.button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={() => {
                setIsEditing(false);
                setPreviewImage(null);
              }}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              className="px-4 py-2 bg-gradient-to-br from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-lg  shadow"
            >
              Save
            </button>
          </div>
        )}
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map((field, index) => (
          <motion.div
            key={field.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-xl hover:bg-gray-50 transition cursor-pointer"
          >
            <p className="flex items-center gap-2 text-xs text-gray-500 mb-1">
              {field.icon} {field.label}
            </p>

            <AnimatePresence mode="wait">
              {!isEditing ? (
                <motion.p
                  key="view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm font-semibold text-gray-700"
                >
                  {form[field.name]}
                </motion.p>
              ) : (
                <motion.input
                  key="edit"
                  type="text"
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 text-sm"
                />
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
