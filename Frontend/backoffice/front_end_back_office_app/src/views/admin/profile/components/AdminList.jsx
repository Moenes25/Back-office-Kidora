import React, { useEffect, useState } from "react";
import {
  FiEdit,
  FiTrash2,
  FiMessageCircle,
  FiMoreVertical,
} from "react-icons/fi";
import avatar from "assets/img/avatars/avatar4.png";


const AdminList = () => {
  const [admins, setAdmins] = useState([]);
  const [openActions, setOpenActions] = useState(null);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

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

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">Liste des Admins</h3>
        <p className="text-sm text-gray-500">Total: {admins.length}</p>
      </div>
      

      <div className="space-y-1 ">
        {admins.map((admin) => (
          <div
            key={admin.id}
            className="flex items-center justify-between p-2 transition bg-white border shadow-sm rounded-xl hover:shadow-md"
          >
            {/* LEFT SIDE */}
            <div
              className="flex items-center gap-4"
              onClick={() => setSelectedAdmin(admin)}
            >
              {/* IMAGE + STATUS DOT */}
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

              {/* NAME + EMAIL */}
              <div className="flex flex-col">
                <h4 className="font-semibold text-gray-700">{admin.nom}</h4>
                <span className="text-sm text-gray-500">{admin.email}</span>
              </div>
            </div>

            {/* DESKTOP ACTIONS */}
            <div className="hidden gap-3 md:flex">
              {/* MESSAGE */}
              <div className="relative group">
                <button className="p-2 rounded-lg hover:bg-gray-100">
                  <FiMessageCircle size={18} className="text-blue-500" />
                </button>
                <span className="absolute px-2 py-1 mb-2 text-xs text-white transition-opacity -translate-x-1/2 rounded-md opacity-0 bg-black/80 bottom-full left-1/2 group-hover:opacity-100">
                  Message
                </span>
              </div>

              {/* EDIT */}
              <div className="relative group">
                <button className="p-2 rounded-lg hover:bg-gray-100">
                  <FiEdit size={18} className="text-yellow-500" />
                </button>
                <span className="absolute px-2 py-1 mb-2 text-xs text-white transition-opacity -translate-x-1/2 rounded-md opacity-0 bg-black/80 bottom-full left-1/2 group-hover:opacity-100">
                  Edit
                </span>
              </div>

              {/* DELETE */}
              <div className="relative group">
                <button className="p-2 rounded-lg hover:bg-gray-100">
                  <FiTrash2 size={18} className="text-red-500" />
                </button>
                <span className="absolute px-2 py-1 mb-2 text-xs text-white transition-opacity -translate-x-1/2 rounded-md opacity-0 bg-black/80 bottom-full left-1/2 group-hover:opacity-100">
                  Delete
                </span>
              </div>
            </div>

            {/* MOBILE ACTIONS */}
            <div className="relative md:hidden">
              <button
                onClick={() =>
                  setOpenActions(openActions === admin.id ? null : admin.id)
                }
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <FiMoreVertical size={20} />
              </button>

              {openActions === admin.id && (
                <div className="absolute right-0 z-30 w-32 mt-2 overflow-hidden bg-white border rounded-lg shadow-lg">
                  <button className="flex items-center w-full gap-2 p-2 hover:bg-gray-50">
                    <FiMessageCircle /> Message
                  </button>
                  <button className="flex items-center w-full gap-2 p-2 hover:bg-gray-50">
                    <FiEdit /> Edit
                  </button>
                  <button className="flex items-center w-full gap-2 p-2 text-red-600 hover:bg-gray-50">
                    <FiTrash2 /> Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* MODAL DETAILS */}
      {selectedAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="relative p-6 bg-white shadow-lg w-80 rounded-xl">
            <button
              onClick={() => setSelectedAdmin(null)}
              className="absolute text-xl right-3 top-2"
            >
              ×
            </button>

            <h3 className="mb-3 text-lg font-bold">Admin Details</h3>

            <img
              src={selectedAdmin.image}
              alt="imager"
              className="w-20 h-20 mx-auto mb-3 rounded-full"
            />

            <p>
              <strong>Name:</strong> {selectedAdmin.nom}
            </p>
            <p>
              <strong>Email:</strong> {selectedAdmin.email}
            </p>
            <p>
              <strong>Tel:</strong> {selectedAdmin.tel}
            </p>

            <p className="mt-3 text-xs text-red-500">
              ⚠️ Cannot display password for security reasons.
            </p>
          </div>
        </div>
      )}

    
    </div>
  );
};

export default AdminList;
