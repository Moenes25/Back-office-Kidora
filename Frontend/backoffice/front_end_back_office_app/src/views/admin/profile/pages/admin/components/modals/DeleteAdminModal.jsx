import React from "react";
import api from "services/api";

const DeleteAdminModal = ({ admin, onClose, onDeleteSuccess }) => {
  const handleDelete = async () => {
    try {
      await api.delete(`/auth/delete-user/${admin.idUser}`);
      onDeleteSuccess(admin.idUser);
      onClose();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="p-6 bg-white shadow-xl w-80 rounded-xl">
        <h3 className="mb-4 text-lg font-bold gradient-text">Delete {admin.nom}?</h3>
        <p className="mb-4 text-gray-600">
          This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 rounded underline-offset-2 hover:underline"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 text-white bg-gradient-to-r from-purple-600 to-red-600 hover:bg-red-700 rounded-xl"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAdminModal;
