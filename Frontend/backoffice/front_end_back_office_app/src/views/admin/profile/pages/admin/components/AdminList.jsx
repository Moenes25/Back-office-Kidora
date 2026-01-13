"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FiEdit,
  FiTrash2,
  FiMessageCircle,
  FiUserPlus,
  FiMoreVertical,
} from "react-icons/fi";
import { FaUsersCog } from "react-icons/fa";
import { LuRefreshCcw } from "react-icons/lu";

import avatar from "assets/img/avatars/avatar4.png";
import avatar4Img from "../../../../../../assets/img/avatars/avatar4.png";
import api from "services/api";

import DeleteAdminModal from "./modals/DeleteAdminModal";
import EditAdminModal from "./modals/EditAdminModal";
import MessageModal from "./modals/MessageModal";
import AddAdminModal from "./AddAdminModal";

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
    </div>
  </div>
);

export default function AdminList() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [actionModal, setActionModal] = useState({ type: null, admin: null });
  const [openActions, setOpenActions] = useState(null);

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  /* ================= HANDLERS ================= */
  const openModal = (type, admin) => {
    setActionModal({ type, admin });
    setOpenActions(null);
  };

  const closeModal = () => setActionModal({ type: null, admin: null });

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
              <h2 className="text-xl font-bold text-slate-800 dark:text-white
              ">Admins</h2>
              <p className="text-sm text-slate-500 dark:text-white
              ">
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
          </button>
        </div>
      </div>

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
                           hover:shadow-md transition dark:bg-navy-700 dark:text-white"
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
                      <p className="font-semibold text-slate-800 dark:text-white">
                        {admin.nom}
                      </p>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 dark:text-white dark:bg-slate-500">
                        {admin.region}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-white">{admin.role}</p>
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
                <div className="relative md:hidden">
                  <button
                    onClick={() =>
                      setOpenActions(
                        openActions === admin.idUser ? null : admin.idUser
                      )
                    }
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
      {openAddModal && (
        <AddAdminModal
          open={openAddModal}
          onClose={() => setOpenAddModal(false)}
          onSuccess={(a) => setAdmins((prev) => [...prev, a])}
        />
      )}
      {actionModal.type === "message" && (
        <MessageModal admin={actionModal.admin} onClose={closeModal} />
      )}
      {actionModal.type === "edit" && (
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
