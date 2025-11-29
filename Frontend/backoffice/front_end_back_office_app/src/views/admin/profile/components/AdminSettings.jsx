import React from "react";

const SuperAdminSettings = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <h3 className="text-lg font-semibold mb-6">Super Admin – Paramètres avancés</h3>

      {/* Roles & Permissions */}
      <div className="mb-8">
        <h4 className="font-semibold mb-3">Gestion des rôles & permissions</h4>

        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
          Ajouter un Admin
        </button>

        <ul className="mt-3 text-gray-700 text-sm">
          <li>• Admin – Gestion établissements</li>
          <li>• Admin – Gestion éducateurs</li>
          <li>• Admin – Paiements & abonnements</li>
        </ul>
      </div>

      {/* AI Settings */}
      <div className="mb-8">
        <h4 className="font-semibold mb-3">Paramètres IA</h4>

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
        <h4 className="font-semibold mb-3">Paiements & facturation</h4>
        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg">
          Configurer Stripe
        </button>
      </div>

      {/* Backups */}
      <div className="mb-8">
        <h4 className="font-semibold mb-3">Backups</h4>
        <button className="px-4 py-2 bg-gray-700 text-white rounded-lg">
          Télécharger une sauvegarde
        </button>
      </div>

      {/* Branding */}
      <div>
        <h4 className="font-semibold mb-3">Branding de la plateforme</h4>
        <input type="file" className="border p-2 rounded-lg" />
        <p className="text-xs text-gray-500 mt-1">
          Téléchargez le logo de la plateforme
        </p>
      </div>
    </div>
  );
};

export default SuperAdminSettings;
