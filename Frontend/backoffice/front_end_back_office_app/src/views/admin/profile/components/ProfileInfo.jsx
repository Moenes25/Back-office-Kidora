"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ProfileInfo = () => {
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    fullName: "Nesrine Nasri",
    email: "nesrine@example.com",
    phone: "+216 55 000 111",
    role: "Super Admin",
    createdAt: "12 Janvier 2025",
    lastLogin: "Aujourd’hui à 10:45",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setIsEditing(false);
    // 👉 Later: send updated info to backend via Axios
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Informations personnelles</h3>

        {!isEditing ? (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsEditing(true)}
            className="px-4 py-1.5 text-sm text-white bg-purple-600 rounded-lg shadow"
          >
            Modifier
          </motion.button>
        ) : (
          <div className="flex gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(false)}
              className="px-4 py-1.5 text-sm bg-gray-200 rounded-lg"
            >
              Annuler
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              className="px-4 py-1.5 text-sm text-white bg-green-600 rounded-lg shadow"
            >
              Enregistrer
            </motion.button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {[
          { label: "Nom complet", name: "fullName" },
          { label: "Email", name: "email" },
          { label: "Téléphone", name: "phone" },
          { label: "Rôle", name: "role" },
          { label: "Compte créé le", name: "createdAt" },
          { label: "Dernière connexion", name: "lastLogin" },
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <p className="text-sm text-gray-500">{item.label}</p>

            {/* Show text OR edit input */}
            <AnimatePresence mode="wait">
              {!isEditing ? (
                <motion.p
                  key="view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="font-medium"
                >
                  {form[item.name]}
                </motion.p>
              ) : (
                <motion.input
                  key="edit"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  type="text"
                  name={item.name}
                  value={form[item.name]}
                  onChange={handleChange}
                  className="w-full px-3 py-2 mt-1 text-sm border rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ProfileInfo;
