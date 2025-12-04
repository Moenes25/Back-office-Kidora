import React from "react";


const SuperAdminSettings = () => {
  return (
    <div className="p-6 border shadow-sm rounded-xl">

      {/* Roles & Permissions */}
      <div className="mb-8">
        {/* <h4 className="mb-3 font-semibold">Gestion des rôles & permissions</h4> */}

        <button className="px-4 py-2 text-white bg-blue-600 rounded-lg">
          Ajouter un Admin
        </button>
      
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

      {/* Billing */}
      <div className="mb-8">
        <h4 className="mb-3 font-semibold">Paiements & facturation</h4>
        <button className="px-4 py-2 text-white bg-purple-600 rounded-lg">
          Configurer Stripe
        </button>
      </div>

      {/* Backups */}
      <div className="mb-8">
        <h4 className="mb-3 font-semibold">Backups</h4>
        <button className="px-4 py-2 text-white bg-gray-700 rounded-lg">
          Télécharger une sauvegarde
        </button>
      </div>

      {/* Branding */}
      <div>
        <h4 className="mb-3 font-semibold">Branding de la plateforme</h4>
        <input type="file" className="p-2 border rounded-lg" />
        <p className="mt-1 text-xs text-gray-500">
          Téléchargez le logo de la plateforme
        </p>
      </div>
    </div>
  );
};

export default SuperAdminSettings;
