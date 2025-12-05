import React, { useState } from "react";
import AdminList from "./AdminList";
import { FaPlus } from "react-icons/fa6";
import AddAdminModal from "./AddAdminModal";

const SuperAdminSettings = () => {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState(null);

  return (
    <div className="p-6 border shadow-sm rounded-xl">
      {/* Roles & Permissions */}
      <div className="mb-8">
        {/* <h4 className="mb-3 font-semibold">Gestion des rôles & permissions</h4> */}

        <button
          className="flex items-center justify-center gap-2 px-4 py-2 font-medium text-black translate-x-3 bg-white shadow-lg hover: rounded-2xl"
          onClick={() => setOpenAddModal(true)}
        >
          <div className="flex items-center justify-center w-6 h-6 rounded-full shadow-lg bg-gradient-to-br from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
            <FaPlus color="white" />
          </div>
          Add Admin
        </button>

        <AdminList newAdmin={newAdmin} />
      </div>

      {/* AI Settings */}
      <div className="mb-8">
        <h4 className="mb-3 font-semibold">Paramètres IA</h4>

        <label className="flex items-center gap-3">
          <input type="checkbox" defaultChecked />
          Activer les recommandations IA
        </label>

        <label className="flex items-center gap-3 mt-2">
          <input type="checkbox" defaultChecked />
          Analyse automatique des activités
        </label>
      </div>
      <AddAdminModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onSuccess={(admin) => {
          setNewAdmin(admin);
          setOpenAddModal(false);
        }}
      />
    </div>
  );
};

export default SuperAdminSettings;
