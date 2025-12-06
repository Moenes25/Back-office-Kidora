"use client";

import React, { useEffect, useState } from "react";
import {
  FiEdit,
  FiTrash2,
  FiMessageCircle,
  FiMoreVertical,
  FiUserPlus,
} from "react-icons/fi";
import avatar from "assets/img/avatars/avatar4.png";
import AddAdminModal from "./AddAdminModal";

const AdminList = () => {
  const [admins, setAdmins] = useState([]);
  const [openActions, setOpenActions] = useState(null);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [openAddModal, setOpenAddModal] = useState(false); // التحكم بمودال الإضافة

  useEffect(() => {
    const fakeAdmins = [
      {
        id: 1,
        image: avatar,
        nom: "Nesrin Nasri",
        email: "nesrin@example.com",
        tel: "22112233",
        status: "ACTIVE",
      },
      {
        id: 2,
        image: avatar,
        nom: "Ahmed Ali",
        email: "ahmed@example.com",
        tel: "99887766",
        status: "INACTIVE",
      },
      {
        id: 3,
        image: avatar,
        nom: "Sara Ben Salah",
        email: "sara@example.com",
        tel: "55443322",
        status: "ACTIVE",
      },
    ];

    setAdmins(fakeAdmins);
  }, []);

  const handleAddAdminSuccess = (newAdmin) => {
    setAdmins([...admins, newAdmin]);
    setOpenAddModal(false);
  };

  return (
    <div className="mt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-700">Admins List</h3>
        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-500">Total: {admins.length}</p>
          <button
            onClick={() => setOpenAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white  rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transition"
          >
            <FiUserPlus /> Add Admin
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {admins.map((admin) => (
          <div
            key={admin.id}
            className="flex items-center justify-between p-4 transition bg-white border rounded-xl shadow-sm hover:shadow-md hover:scale-[1.01] duration-200"
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
            <div className="hidden gap-3 md:flex">
              <button className="flex items-center gap-1 px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
                <FiMessageCircle /> Message
              </button>

              <button className="flex items-center gap-1 px-3 py-1 text-sm font-medium text-yellow-600 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition">
                <FiEdit /> Edit
              </button>

              <button className="flex items-center gap-1 px-3 py-1 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition">
                <FiTrash2 /> Delete
              </button>
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
    </div>
  );
};

export default AdminList;
