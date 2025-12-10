"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaUserShield,
 
  FaCamera,
} from "react-icons/fa";

import api from "services/api";
import { useAuth } from "context/AuthContext";


export default function ProfileInfo() {
  const { user, updateUser } = useAuth();

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
        createdAt: "N/A",
        lastLogin: "N/A",
      });

      if (user.image_url) setProfileImage(user.image_url);
    }
  }, [user]);

 


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setPreviewImage(file);
  };

  const handleSave = async () => {
  try {
    const formData = new FormData();

    formData.append("email", form.email);
    formData.append("nom", form.fullName);
    formData.append("tel", form.phone);

    
    if (previewImage) {
      formData.append("image", previewImage);
    }

    const res = await api.put("/auth/update-profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    console.log("Success:", res.data);

    // update user in context
    updateUser({
      nom: res.data.nom,
      email: res.data.email,
      tel: res.data.tel,
      role: res.data.role, 
      // imageUrl
    });

    // Update profile image also preview
    if (previewImage) {
      setProfileImage(URL.createObjectURL(previewImage));
    }

    setPreviewImage(null);
    setIsEditing(false);

    alert("Profile updated successfully!");
  } catch (err) {
    console.error("Update failed:", err);
    alert("Update failed");
  }
};


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const fields = [
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full p-6 bg-white border border-purple-200 shadow-xl rounded-2xl"
    >
      {/* TOP AREA */}
      <div className="flex items-start justify-between gap-4 md:flex-row">
        <div className="flex items-center gap-6">
          <div className="relative w-20 h-20">
            <img
              src={
                previewImage
                  ? URL.createObjectURL(previewImage)
                  : profileImage
              }
              alt="profile"
              className="object-cover w-20 h-20 border-2 border-purple-300 shadow-inner rounded-xl"
            />

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
      <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2">
        {fields.map((field) => (
          <div
            key={field.name}
            className="p-5 bg-white border border-gray-200 shadow-sm rounded-xl"
          >
            <p className="flex items-center gap-2 mb-1 text-xs text-gray-500">
              {field.icon} {field.label}
            </p>

            {!isEditing || !field.editable ? (
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
          </div>
        ))}
      </div>
    </motion.div>
  );
}
