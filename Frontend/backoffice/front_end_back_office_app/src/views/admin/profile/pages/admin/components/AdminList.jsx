import React, { useEffect, useState } from "react";
import {
  FiEdit,
  FiTrash2,
  FiMessageCircle,
  FiUserPlus,
  FiMoreVertical,
} from "react-icons/fi";
import { FaUsersCog } from "react-icons/fa";
import avatar from "assets/img/avatars/avatar4.png";
import api from "services/api";
import DeleteAdminModal from "./modals/DeleteAdminModal";
import EditAdminModal from "./modals/EditAdminModal";
import MessageModal from "./modals/MessageModal";
import AddAdminModal from "./AddAdminModal";
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
    </div>
  </div>
);

const AdminList = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [actionModal, setActionModal] = useState({ type: null, admin: null });
  const [openActions, setOpenActions] = useState(null);

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
    } finally {
      setLoading(false);
    }
  };

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

  const openModal = (type, admin) => {
    setActionModal({ type, admin });
    setOpenActions(null);
  };

  const closeModal = () => setActionModal({ type: null, admin: null });

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
          </button>
        </div>
      </div>

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
                <div className="relative md:hidden">
                  <button
                    onClick={() =>
                      setOpenActions(
                        openActions === admin.idUser ? null : admin.idUser
                      )
                    }
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
      {openAddModal && (
        <AddAdminModal
          open={openAddModal}
          onClose={() => setOpenAddModal(false)}
          onSuccess={handleAddAdminSuccess}
        />
      )}
      {actionModal.type === "message" && (
        <MessageModal admin={actionModal.admin} onClose={closeModal} />
      )}
      {actionModal.type === "edit" && (
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
