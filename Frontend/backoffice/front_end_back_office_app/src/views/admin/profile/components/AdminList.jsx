"use client";

import React, { useEffect, useState } from "react";
import {
  FiEdit,
  FiTrash2,
  FiMessageCircle,
  FiUserPlus,
  FiMoreVertical,
} from "react-icons/fi";
import avatar from "assets/img/avatars/avatar4.png";
import AddAdminModal from "./AddAdminModal";

// Dummy modals
const MessageModal = ({ admin, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="bg-white p-6 rounded-xl shadow-lg w-80">
      <h3 className="font-bold text-lg mb-4">Message {admin.nom}</h3>
      <textarea className="w-full h-24 border rounded p-2" placeholder="Type your message..."></textarea>
      <div className="mt-4 flex justify-end gap-2">
        <button onClick={onClose} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Cancel</button>
        <button onClick={onClose} className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600">Send</button>
      </div>
    </div>
  </div>
);

const EditModal = ({ admin, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="bg-white p-6 rounded-xl shadow-lg w-80">
      <h3 className="font-bold text-lg mb-4">Edit {admin.nom}</h3>
      <input type="text" defaultValue={admin.nom} className="w-full mb-2 border rounded p-2" />
      <input type="email" defaultValue={admin.email} className="w-full mb-2 border rounded p-2" />
      <div className="mt-4 flex justify-end gap-2">
        <button onClick={onClose} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Cancel</button>
        <button onClick={onClose} className="px-4 py-2 rounded bg-yellow-500 text-white hover:bg-yellow-600">Save</button>
      </div>
    </div>
  </div>
);

const DeleteModal = ({ admin, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="bg-white p-6 rounded-xl shadow-lg w-80">
      <h3 className="font-bold text-lg mb-4">Delete {admin.nom}?</h3>
      <p className="mb-4 text-gray-600">Are you sure you want to delete this admin? This action cannot be undone.</p>
      <div className="flex justify-end gap-2">
        <button onClick={onClose} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Cancel</button>
        <button onClick={onClose} className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600">Delete</button>
      </div>
    </div>
  </div>
);

const AdminList = () => {
  const [admins, setAdmins] = useState([]);
  const [openActions, setOpenActions] = useState(null); // For mobile dropdown
  const [openAddModal, setOpenAddModal] = useState(false);
  const [actionModal, setActionModal] = useState({ type: null, admin: null });

  useEffect(() => {
    const fakeAdmins = [
      { id: 1, image: avatar, nom: "Nesrin Nasri", email: "nesrine@example.com", tel: "22112233", status: "ACTIVE" },
      { id: 2, image: avatar, nom: "Ahmed Ali", email: "ahmed@example.com", tel: "99887766", status: "INACTIVE" },
      { id: 3, image: avatar, nom: "Sara Ben Salah", email: "sara@example.com", tel: "55443322", status: "ACTIVE" },
    ];
    setAdmins(fakeAdmins);
  }, []);

  const handleAddAdminSuccess = (newAdmin) => {
    setAdmins([...admins, newAdmin]);
    setOpenAddModal(false);
  };

  const openModal = (type, admin) => {
    setActionModal({ type, admin });
    setOpenActions(null); // Close mobile actions dropdown
  };

  const closeModal = () => setActionModal({ type: null, admin: null });

  return (
    <div className="mt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
        <h3 className="text-xl font-semibold text-gray-700">Admins List</h3>
        <div className="flex items-center gap-4 flex-wrap">
          <p className="text-sm text-gray-500">Total: {admins.length}</p>
          <button
            onClick={() => setOpenAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transition"
          >
            <FiUserPlus /> Add Admin
          </button>
        </div>
      </div>

      {/* Admins List */}
      <div className="space-y-3">
        {admins.map((admin) => (
          <div
            key={admin.id}
            className="flex  md:flex-row items-start md:items-center justify-between p-4 transition bg-white border rounded-xl shadow-sm hover:shadow-md hover:scale-[1.01] duration-200 gap-4"
          >
            {/* LEFT SIDE */}
            <div className="flex items-center gap-4 cursor-pointer">
              <div className="relative">
                <img
                  src={admin.image}
                  alt="admin"
                  className="object-cover rounded-full h-14 w-14"
                />
                <span
                  className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                    admin.status === "ACTIVE" ? "bg-green-500" : "bg-red-500"
                  }`}
                ></span>
              </div>
              <div className="flex flex-col">
                <h4 className="font-semibold text-gray-800">{admin.nom}</h4>
                <span className="text-sm text-gray-500">{admin.email}</span>
              </div>
            </div>

            {/* DESKTOP ACTIONS */}
            <div className="hidden md:flex gap-3">
              <button
                onClick={() => openModal("message", admin)}
                className="flex items-center gap-1 px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
              >
                <FiMessageCircle /> Message
              </button>
              <button
                onClick={() => openModal("edit", admin)}
                className="flex items-center gap-1 px-3 py-1 text-sm font-medium text-yellow-600 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition"
              >
                <FiEdit /> Edit
              </button>
              <button
                onClick={() => openModal("delete", admin)}
                className="flex items-center gap-1 px-3 py-1 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition"
              >
                <FiTrash2 /> Delete
              </button>
            </div>

            {/* MOBILE ACTIONS */}
            <div className="relative  md:hidden">
              <button
                onClick={() =>
                  setOpenActions(openActions === admin.id ? null : admin.id)
                }
                className="p-2  rounded-lg hover:bg-gray-100"
              >
                <FiMoreVertical size={20} />
              </button>

              {openActions === admin.id && (
                <div className="absolute right-0 z-30 w-36 mt-2 overflow-hidden bg-white border rounded-lg shadow-lg">
                  <button
                    onClick={() => openModal("message", admin)}
                    className="flex items-center w-full gap-2 p-2 text-blue-600 hover:bg-blue-50"
                  >
                    <FiMessageCircle /> Message
                  </button>
                  <button
                    onClick={() => openModal("edit", admin)}
                    className="flex items-center w-full gap-2 p-2 text-yellow-600 hover:bg-yellow-50"
                  >
                    <FiEdit /> Edit
                  </button>
                  <button
                    onClick={() => openModal("delete", admin)}
                    className="flex items-center w-full gap-2 p-2 text-red-600 hover:bg-red-50"
                  >
                    <FiTrash2 /> Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Admin Modal */}
      {openAddModal && (
        <AddAdminModal
          open={openAddModal}
          onClose={() => setOpenAddModal(false)}
          onSuccess={handleAddAdminSuccess}
        />
      )}

      {/* ACTION MODALS */}
      {actionModal.type === "message" && <MessageModal admin={actionModal.admin} onClose={closeModal} />}
      {actionModal.type === "edit" && <EditModal admin={actionModal.admin} onClose={closeModal} />}
      {actionModal.type === "delete" && <DeleteModal admin={actionModal.admin} onClose={closeModal} />}
    </div>
  );
};

export default AdminList;
