import React, { useState } from "react";
import api from "services/api";


const AddAdminModal = ({ open, onClose, onSuccess }) => {
  const [newAdmin, setNewAdmin] = useState({
    nom: "",
    email: "",
    tel: "",
    password: "",
  });

  const handleAddAdmin = async () => {
    try {
      const res = await api.post("/auth/register", newAdmin);

      onSuccess(res.data);  
      onClose();            

    
      setNewAdmin({ nom: "", email: "", tel: "", password: "" });

    } catch (error) {
      console.error("Error adding admin:", error);
      alert("Failed to add admin");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative p-6 bg-white shadow-lg w-96 rounded-xl">
        <button
          onClick={onClose}
          className="absolute text-xl top-2 right-3"
        >
          ×
        </button>

        <h3 className="mb-4 text-lg font-bold">Add New Admin</h3>

        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Full Name"
            className="p-2 border rounded-lg"
            value={newAdmin.nom}
            onChange={(e) =>
              setNewAdmin({ ...newAdmin, nom: e.target.value })
            }
          />

          <input
            type="email"
            placeholder="Email"
            className="p-2 border rounded-lg"
            value={newAdmin.email}
            onChange={(e) =>
              setNewAdmin({ ...newAdmin, email: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Phone"
            className="p-2 border rounded-lg"
            value={newAdmin.tel}
            onChange={(e) =>
              setNewAdmin({ ...newAdmin, tel: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="p-2 border rounded-lg"
            value={newAdmin.password}
            onChange={(e) =>
              setNewAdmin({ ...newAdmin, password: e.target.value })
            }
          />

          <button
            onClick={handleAddAdmin}
            className="py-2 mt-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
          >
            Save Admin
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAdminModal;
