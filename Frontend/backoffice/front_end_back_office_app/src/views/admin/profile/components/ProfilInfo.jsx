"use client";
import React, { useState, useEffect } from "react";
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
import { useAuth } from "context/AuthContext";

export default function ProfileInfo() {
  const { user } = useAuth();

  // Load initial user data into form
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "",
    createdAt: "N/A",
    lastLogin: "N/A",
  });

  const [isEditing, setIsEditing] = useState(false);

  const [profileImage, setProfileImage] = useState("/default-avatar.png");
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.nom || "",
        email: user.email || "",
        phone: user.tel || "",
        role: user.role || "",
        createdAt: "N/A", // هذه قادمة لاحقاً من الباك
        lastLogin: "N/A",
      });
    }
  }, [user]);

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

  // Since editing is only UI → we just exit Edit mode
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
      className="w-full p-6 bg-white border border-purple-200 shadow-xl rounded-2xl"
    >
      {/* TOP AREA */}
      <div className="flex flex-col items-center justify-between gap-6 mb-10 md:flex-row">
        <div className="flex items-center gap-6">
          <div className="relative w-20 h-20">
            {previewImage || profileImage ? (
              <img
                src={previewImage || profileImage}
                alt="profil"
                className="object-cover w-full h-full border-2 border-purple-300 rounded-full shadow-inner"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-purple-400 bg-gray-100 border-2 border-purple-300 rounded-full">
                <FaUser size={24} />
              </div>
            )}

            {isEditing && (
              <label className="absolute bottom-0 right-0 flex items-center justify-center w-6 h-6 text-white bg-purple-600 rounded-full shadow-md cursor-pointer hover:bg-purple-700">
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
        </div>

        {/* EDIT BUTTON */}
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-5 py-2 text-sm text-white rounded-lg shadow bg-gradient-to-br from-purple-500 to-blue-500"
          >
            Edit
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={() => {
                setIsEditing(false);
                setPreviewImage(null);
                setForm({
                  fullName: user?.nom || "",
                  email: user?.email || "",
                  phone: user?.tel || "",
                  role: user?.role || "",
                  createdAt: "N/A",
                  lastLogin: "N/A",
                });
              }}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              className="px-4 py-2 text-white rounded-lg shadow bg-gradient-to-br from-purple-500 to-blue-500"
            >
              Save
            </button>
          </div>
        )}
      </div>

      {/* FIELDS GRID */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {fields.map((field, index) => (
          <div
            key={field.name}
            className="p-5 bg-white border border-gray-200 shadow-sm rounded-xl"
          >
            <p className="flex items-center gap-2 mb-1 text-xs text-gray-500">
              {field.icon} {field.label}
            </p>

            <AnimatePresence mode="wait">
              {!isEditing ? (
                <p className="text-sm font-semibold text-gray-700">
                  {form[field.name]}
                </p>
              ) : (
                <input
                  type="text"
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  className="w-full px-3 py-2 mt-1 text-sm border border-gray-300 rounded-lg"
                />
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
