"use client";
import React, { useState } from "react";
import { FiPlus } from "react-icons/fi";

const AgendaModal = ({ onClose, onSave }) => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");

  const handleSave = () => {
    if (!title || !date) return;
    const newNote = { id: Date.now(), title, date };
    onSave(newNote);
    setTitle("");
    setDate("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="flex flex-col gap-4 p-6 bg-white shadow-lg rounded-xl w-80">
        <h3 className="text-lg font-semibold text-gray-700">Add New Note</h3>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-400"
        />
        <input
          type="text"
          placeholder="Description..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-400"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-3 py-1 text-white bg-purple-400 rounded-lg hover:bg-purple-500"
          >
            <FiPlus /> Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgendaModal;
