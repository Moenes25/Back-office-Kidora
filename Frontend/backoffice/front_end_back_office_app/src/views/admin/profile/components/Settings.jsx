import React from "react";

const Settings = () => {
  return (
    <div className="p-6 bg-white border shadow-sm rounded-xl">
      <h3 className="mb-6 text-lg font-semibold">Paramètres du compte</h3>

      {/* General Preferences */}
      <div className="mb-8">
        <h4 className="mb-3 font-semibold text-md">Préférences générales</h4>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Language */}
          <div>
            <label className="text-sm text-gray-500">Langue</label>
            <select className="w-full p-2 mt-1 border rounded-lg">
              <option>Français</option>
              <option>العربية</option>
              <option>English</option>
            </select>
          </div>

          {/* Theme */}
          <div>
            <label className="text-sm text-gray-500">Thème</label>
            <select className="w-full p-2 mt-1 border rounded-lg">
              <option>Light</option>
              <option>Dark</option>
              <option>Auto</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div>
        <h4 className="mb-3 font-semibold text-md">Notifications</h4>

        <div className="flex flex-col gap-3">
          {[
            "Modifications du compte",
            "Alertes IA",
            "Paiements & abonnements",
            "Support client",
            "Rapport hebdomadaire"
          ].map((item, index) => (
            <label key={index} className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <span>{item}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Settings;
