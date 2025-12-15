"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaUserShield,
  FaCamera,
  FaCalendar,
} from "react-icons/fa";
import { RiUserSettingsFill } from "react-icons/ri";
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

    setForm({
      fullName: user.nom || "",
      email: user.email || "",
      phone: user.tel || "",
      role: user.role || "",
    });

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

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-5 py-2 text-sm text-white rounded-lg bg-gradient-to-br from-purple-500 to-blue-500"
          >
            Edit
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={() => {
                setIsEditing(false);
                setPreviewImage(null);
              }}
              className="px-4 py-2 bg-gray-200 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-white rounded-lg bg-gradient-to-br from-purple-500 to-blue-500"
            >
              Save
            </button>
          </div>
        )}
      </div>

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