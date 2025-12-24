<<<<<<< HEAD
import React, { useState } from "react";
=======
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSend, FiX } from "react-icons/fi";
import avatarFallback from "assets/img/avatars/avatar4.png";

const MAX_CHARS = 300;
>>>>>>> safa

const MessageModal = ({ admin, onClose }) => {
  const [message, setMessage] = useState("");

<<<<<<< HEAD
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="p-6 bg-white shadow-lg w-80 rounded-xl">
        <h3 className="mb-4 text-lg font-bold">Message {admin.nom}</h3>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full h-24 p-2 border rounded"
          placeholder="Type your message..."
        ></textarea>

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>

          <button
            onClick={() => { console.log(message); onClose(); }}
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
=======
  const handleSend = () => {
    if (!message.trim()) return;
    console.log("Message to", admin.nom, ":", message);
    onClose();
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
        {/* MODAL */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative w-[92%] max-w-md
                     rounded-2xl bg-white
                     shadow-[0_30px_70px_-30px_rgba(0,0,0,0.4)]
                     p-6"
        >
          {/* CLOSE */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg
                       text-slate-400 hover:text-slate-700
                       hover:bg-slate-100 transition"
          >
            <FiX size={18} />
          </button>

          {/* HEADER */}
          <div className="flex items-center gap-4 mb-5">
            <img
              src={admin.imageUrl || avatarFallback}
              alt={admin.nom}
              onError={(e) => (e.currentTarget.src = avatarFallback)}
              className="h-12 w-12 rounded-full object-cover
                         ring-2 ring-purple-200"
            />

            <div>
              <h3 className="text-lg font-bold text-slate-800">
                Message {admin.nom}
              </h3>
              <p className="text-sm text-slate-500">
                Send a private message
              </p>
            </div>
          </div>

          {/* TEXTAREA */}
          <div className="relative">
            <textarea
              value={message}
              onChange={(e) =>
                setMessage(e.target.value.slice(0, MAX_CHARS))
              }
              rows={5}
              placeholder="Type your message here…"
              className="w-full resize-none rounded-xl border border-slate-200
                         bg-slate-50 px-4 py-3 text-sm text-slate-700
                         focus:outline-none focus:ring-2 focus:ring-purple-400
                         focus:bg-white transition"
            />

            <span
              className={`absolute bottom-2 right-3 text-xs
                ${
                  message.length >= MAX_CHARS
                    ? "text-red-500"
                    : "text-slate-400"
                }`}
            >
              {message.length}/{MAX_CHARS}
            </span>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm
                         text-slate-600 bg-slate-100
                         hover:bg-slate-200 transition"
            >
              Cancel
            </button>

            <button
              onClick={handleSend}
              disabled={!message.trim()}
              className="flex items-center gap-2 px-5 py-2
                         rounded-xl text-sm font-semibold text-white
                         bg-gradient-to-r from-purple-500 to-indigo-500
                         hover:scale-[1.03] transition
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiSend />
              Send
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
>>>>>>> safa
  );
};

export default MessageModal;
