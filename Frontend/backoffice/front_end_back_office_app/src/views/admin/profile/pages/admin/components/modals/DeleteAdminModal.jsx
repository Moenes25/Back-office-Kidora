"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoWarningOutline,
  IoClose,
  IoTrashOutline,
} from "react-icons/io5";
import api from "services/api";

const DeleteAdminModal = ({ admin, onClose, onDeleteSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await api.delete(`/auth/delete-user/${admin.id}`);
      onDeleteSuccess(admin.id);
      onClose();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete admin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center
                   bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 260, damping: 25 }}
          className="relative w-[95%] max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
        >
          {/* Close */}
          <button
            onClick={onClose}
            disabled={loading}
            className="absolute right-4 top-4 p-2 rounded-lg
                       text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <IoClose size={20} />
          </button>

          {/* Icon */}
          <div className="flex items-center justify-center w-14 h-14 mx-auto mb-4
                          rounded-full bg-red-100">
            <IoWarningOutline size={28} className="text-red-600" />
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-center text-slate-800">
            Delete Admin
          </h3>

          {/* Message */}
          <p className="mt-2 text-sm text-center text-slate-500">
            You are about to permanently delete
          </p>

          <p className="mt-1 text-sm font-semibold text-center text-slate-700">
            {admin.nom}
          </p>

          <p className="mt-3 text-xs text-center text-red-500">
            This action is irreversible and cannot be undone.
          </p>

          {/* Actions */}
          <div className="flex justify-center gap-3 mt-6">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-slate-600
                         rounded-xl hover:bg-slate-100
                         disabled:opacity-50"
            >
              Cancel
            </button>

            <motion.button
              onClick={handleDelete}
              disabled={loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold
                         text-white rounded-xl
                         bg-gradient-to-r from-red-500 to-red-500
                         shadow-md hover:shadow-lg
                         disabled:opacity-50"
            >
              <IoTrashOutline size={16} />
              {loading ? "Deleting..." : "Delete"}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DeleteAdminModal;
