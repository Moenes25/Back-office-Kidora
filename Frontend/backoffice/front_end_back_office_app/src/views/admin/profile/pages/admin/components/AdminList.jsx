<<<<<<< HEAD
import React, { useEffect, useState } from "react";
=======
"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
>>>>>>> safa
import {
  FiEdit,
  FiTrash2,
  FiMessageCircle,
  FiUserPlus,
  FiMoreVertical,
} from "react-icons/fi";
import { FaUsersCog } from "react-icons/fa";
<<<<<<< HEAD
import avatar from "assets/img/avatars/avatar4.png";
import api from "services/api";
=======
import { LuRefreshCcw } from "react-icons/lu";

import avatar from "assets/img/avatars/avatar4.png";
import avatar4Img from "../../../../../../assets/img/avatars/avatar4.png";
import api from "services/api";

>>>>>>> safa
import DeleteAdminModal from "./modals/DeleteAdminModal";
import EditAdminModal from "./modals/EditAdminModal";
import MessageModal from "./modals/MessageModal";
import AddAdminModal from "./AddAdminModal";
<<<<<<< HEAD
import { LuRefreshCcw } from "react-icons/lu";
import avatar4Img from "../../../../../../assets/img/avatars/avatar4.png";

const SkeletonCard = () => (
  <div className="flex items-start justify-between gap-4 p-4 bg-white border shadow-sm animate-pulse rounded-xl md:flex-row md:items-center">
    <div className="flex items-center gap-4">
      <div className="bg-gray-300 rounded-full h-14 w-14" />
      <div className="flex flex-col gap-2">
        <div className="w-32 h-4 bg-gray-300 rounded"></div>
        <div className="w-48 h-3 bg-gray-200 rounded"></div>
      </div>
    </div>
    <div className="hidden gap-3 md:flex">
      <div className="w-20 h-8 bg-gray-300 rounded"></div>
      <div className="w-20 h-8 bg-gray-300 rounded"></div>
      <div className="w-20 h-8 bg-gray-300 rounded"></div>
=======

/* ===================== SKELETON ===================== */
const SkeletonCard = () => (
  <div className="flex items-center justify-between p-5 border rounded-2xl animate-pulse">
    <div className="flex items-center gap-4">
      <div className="h-14 w-14 rounded-full bg-slate-300" />
      <div className="space-y-2">
        <div className="h-4 w-32 rounded bg-slate-300" />
        <div className="h-3 w-48 rounded bg-slate-200" />
      </div>
    </div>
    <div className="hidden md:flex gap-3">
      <div className="h-8 w-20 bg-slate-300 rounded-lg" />
      <div className="h-8 w-20 bg-slate-300 rounded-lg" />
>>>>>>> safa
    </div>
  </div>
);

<<<<<<< HEAD
const AdminList = () => {
=======
export default function AdminList() {
>>>>>>> safa
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [actionModal, setActionModal] = useState({ type: null, admin: null });
  const [openActions, setOpenActions] = useState(null);

<<<<<<< HEAD
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchAdmins = async () => {
      setLoading(true);
      try {
        const res = await api.get("/auth/all");
        const adminsData = res.data.map((admin) => ({
          ...admin,
          image: admin.imageUrl || avatar,
          status: admin.status || "ACTIVE",
        }));
        setAdmins(adminsData);
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          alert("Session expired. Please login again.");
          localStorage.removeItem("token");
          window.location.href = "/auth/login";
        } else {
          console.error("Failed to fetch admins:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  // For manual refresh
  const fetchAdmins = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await api.get("/auth/all");
      const adminsData = res.data.map((admin) => ({
        ...admin,
        image: admin.imageUrl || avatar,
        status: admin.status || "ACTIVE",
      }));
      setAdmins(adminsData);
    } catch (err) {
      console.error("Failed to fetch admins:", err);
      if (err.response?.status === 401) {
        alert("Session expired. Please login again.");
      }
=======
  /* ================= FETCH ================= */
  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await api.get("/auth/all");
      setAdmins(
        res.data.map((a) => ({
          ...a,
          image: a.imageUrl || avatar,
          status: a.status || "ACTIVE",
        }))
      );
    } catch (err) {
      console.error(err);
>>>>>>> safa
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  const handleAddAdminSuccess = (newAdmin) => {
    setAdmins([...admins, { ...newAdmin, image: newAdmin.imageUrl || avatar }]);
    setOpenAddModal(false);
  };

  const handleEditSuccess = (updatedAdmin) => {
    setAdmins(
      admins.map((a) =>
        a.idUser === updatedAdmin.idUser ? { ...a, ...updatedAdmin } : a
      )
    );
  };

  const handleDeleteSuccess = (id) => {
    setAdmins(admins.filter((a) => a.idUser !== id));
  };

=======
  useEffect(() => {
    fetchAdmins();
  }, []);

  /* ================= HANDLERS ================= */
>>>>>>> safa
  const openModal = (type, admin) => {
    setActionModal({ type, admin });
    setOpenActions(null);
  };

  const closeModal = () => setActionModal({ type: null, admin: null });

<<<<<<< HEAD
  return (
    <div>
      {/* Header */}
      <div className="flex flex-col flex-wrap items-center justify-between gap-6 mb-4">
        <div className="flex items-center justify-between w-full ">
          <div className="flex items-center gap-2 py-4 mb-6 ">
            <FaUsersCog size={22} className="text-purple-600"/>
        <h3 className="text-xl font-semibold text-gray-700">Admins </h3>
        </div>
          <p className="text-sm text-gray-500">Total: {admins.length}</p>
        </div>
        <div className="flex items-center justify-between w-full px-2">
          <button
            onClick={() => setOpenAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition rounded-lg r bg-gradient-to-b from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
          >
            <FiUserPlus /> Add Admin
          </button>
          <button
            onClick={fetchAdmins}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white transition-all rounded-lg gradient-text group"
          >
            <LuRefreshCcw
              size={18}
              className="text-purple-600 transition-transform duration-500 group-hover:rotate-180"
            />
            <span className="transition-all duration-300 underline-offset-2 group-hover:underline">
              Refresh
            </span>
=======
  /* ================= RENDER ================= */
  return (
    <section className="space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-purple-100 flex items-center justify-center">
              <FaUsersCog className="text-purple-600 text-lg" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Admins</h2>
              <p className="text-sm text-slate-500">
                Manage administrators & permissions
              </p>
            </div>
          </div>

          <span className="px-3 py-1 text-sm rounded-full bg-slate-100 text-slate-600">
            {admins.length} total
          </span>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => setOpenAddModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl
                       text-sm font-semibold text-white
                       bg-gradient-to-r from-purple-500 to-indigo-500
                       hover:scale-[1.04] transition"
          >
            <FiUserPlus /> Add Admin
          </button>

          <button
            onClick={fetchAdmins}
            className="flex items-center gap-2 px-4 py-2 rounded-xl
                       text-sm font-medium text-purple-600
                       bg-purple-50 hover:bg-purple-100 transition"
          >
            <LuRefreshCcw className="transition-transform group-hover:rotate-180" />
            Refresh
>>>>>>> safa
          </button>
        </div>
      </div>

<<<<<<< HEAD
      {/* List */}
      <div className="space-y-3">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
          : admins.map((admin) => (
              <div
                key={admin.idUser}
                className="animate-fadeIn flex items-start justify-between gap-4 rounded-xl border bg-white p-4  opacity-0 shadow-sm transition-opacity duration-500 hover:scale-[1.01] hover:shadow-md md:flex-row md:items-center"
                style={{ animationFillMode: "forwards" }}
              >
                {/* Info */}
                <div className="flex items-center gap-4 cursor-pointer">
                  <div className="relative">
                    <img
                      src={admin.image}
                      alt="admin"
                      onError={(e) => { e.currentTarget.src = avatar4Img; }}
                      className="object-cover rounded-full h-14 w-14"
                    />
                    <span
                      className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                        admin.status === "ACTIF" ? "bg-green-500" : "bg-red-500"
                      }`}
                    ></span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-800">{admin.nom}</h4>
                      <p className="px-1 text-sm bg-gray-300 rounded-full">{admin.region} </p>
                    </div>
                    <span className="text-sm text-gray-500">{admin.role}</span>
                  </div>
                </div>

                {/* Actions Desktop */}
                <div className="hidden gap-3 md:flex">
                  <button
                    onClick={() => openModal("message", admin)}
                    className="flex items-center gap-1 px-3 py-1 text-sm font-medium text-blue-600 transition rounded-lg bg-blue-50 hover:bg-blue-100"
                  >
                    <FiMessageCircle /> Message
                  </button>
                  <button
                    onClick={() => openModal("edit", admin)}
                    className="flex items-center gap-1 px-3 py-1 text-sm font-medium text-yellow-600 transition rounded-lg bg-yellow-50 hover:bg-yellow-100"
                  >
                    <FiEdit /> Edit
                  </button>
                  <button
                    onClick={() => openModal("delete", admin)}
                    className="flex items-center gap-1 px-3 py-1 text-sm font-medium text-red-600 transition rounded-lg bg-red-50 hover:bg-red-100"
                  >
                    <FiTrash2 /> Delete
                  </button>
                </div>

                {/* Actions Mobile */}
=======
      {/* ================= LIST ================= */}
      <div className="space-y-3">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : admins.map((admin) => (
              <motion.div
                key={admin.idUser}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.015 }}
                className="flex items-center justify-between gap-4
                           rounded-2xl border border-slate-200
                           bg-white p-5 shadow-sm
                           hover:shadow-md transition"
              >
                {/* INFO */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={admin.image}
                      onError={(e) => (e.currentTarget.src = avatar4Img)}
                      className="h-14 w-14 rounded-full object-cover ring-2 ring-purple-200"
                    />
                    <span
                      className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white
                        ${
                          admin.status === "ACTIF"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-slate-800">
                        {admin.nom}
                      </p>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                        {admin.region}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500">{admin.role}</p>
                  </div>
                </div>

                {/* ACTIONS DESKTOP */}
                <div className="hidden md:flex gap-2">
                  <ActionBtn
                    color="blue"
                    icon={<FiMessageCircle />}
                    onClick={() => openModal("message", admin)}
                  />
                  <ActionBtn
                    color="amber"
                    icon={<FiEdit />}
                    onClick={() => openModal("edit", admin)}
                  />
                  <ActionBtn
                    color="red"
                    icon={<FiTrash2 />}
                    onClick={() => openModal("delete", admin)}
                  />
                </div>

                {/* ACTIONS MOBILE */}
>>>>>>> safa
                <div className="relative md:hidden">
                  <button
                    onClick={() =>
                      setOpenActions(
                        openActions === admin.idUser ? null : admin.idUser
                      )
                    }
<<<<<<< HEAD
                    className="p-2 rounded-lg hover:bg-gray-100"
                  >
                    <FiMoreVertical size={20} />
                  </button>
                  {openActions === admin.idUser && (
                    <div className="absolute right-0 z-30 mt-2 overflow-hidden bg-white border rounded-lg shadow-lg w-36">
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

      {/* Modals */}
=======
                    className="p-2 rounded-lg hover:bg-slate-100"
                  >
                    <FiMoreVertical />
                  </button>

                  {openActions === admin.idUser && (
                    <div className="absolute right-0 z-30 mt-2 w-36
                                    rounded-xl border bg-white shadow-lg overflow-hidden">
                      <MobileAction
                        label="Message"
                        icon={<FiMessageCircle />}
                        onClick={() => openModal("message", admin)}
                      />
                      <MobileAction
                        label="Edit"
                        icon={<FiEdit />}
                        onClick={() => openModal("edit", admin)}
                      />
                      <MobileAction
                        label="Delete"
                        icon={<FiTrash2 />}
                        danger
                        onClick={() => openModal("delete", admin)}
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
      </div>

      {/* ================= MODALS ================= */}
>>>>>>> safa
      {openAddModal && (
        <AddAdminModal
          open={openAddModal}
          onClose={() => setOpenAddModal(false)}
<<<<<<< HEAD
          onSuccess={handleAddAdminSuccess}
=======
          onSuccess={(a) => setAdmins((prev) => [...prev, a])}
>>>>>>> safa
        />
      )}
      {actionModal.type === "message" && (
        <MessageModal admin={actionModal.admin} onClose={closeModal} />
      )}
      {actionModal.type === "edit" && (
<<<<<<< HEAD
        <EditAdminModal
          admin={actionModal.admin}
          onClose={closeModal}
          onEditSuccess={handleEditSuccess}
        />
      )}
      {actionModal.type === "delete" && (
        <DeleteAdminModal
          admin={actionModal.admin}
          onClose={closeModal}
          onDeleteSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  );
};

export default AdminList;
=======
        <EditAdminModal admin={actionModal.admin} onClose={closeModal} />
      )}
      {actionModal.type === "delete" && (
        <DeleteAdminModal admin={actionModal.admin} onClose={closeModal} />
      )}
    </section>
  );
}

/* ================= BUTTONS ================= */
const ActionBtn = ({ icon, color, onClick }) => (
  <button
    onClick={onClick}
    className={`p-2 rounded-lg bg-${color}-50 text-${color}-600
                hover:bg-${color}-100 transition`}
  >
    {icon}
  </button>
);

const MobileAction = ({ icon, label, onClick, danger }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 w-full p-2 text-sm
      ${danger ? "text-red-600 hover:bg-red-50" : "hover:bg-slate-50"}`}
  >
    {icon} {label}
  </button>
);
>>>>>>> safa
