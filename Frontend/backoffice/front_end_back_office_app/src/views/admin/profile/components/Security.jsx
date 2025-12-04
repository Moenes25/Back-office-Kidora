import { SoftMagicCircle } from "components/MagicIcons";
import React from "react";
import { FaMobileAlt, FaDesktop } from "react-icons/fa";
import { FaLock } from "react-icons/fa6";

const Security = () => {
  return (
    <div className="p-6 bg-white border shadow-sm rounded-xl">
      <h3 className="mb-6 text-lg font-semibold">Sécurité</h3>
      <div className="flex items-center gap-3">
        <SoftMagicCircle icon={FaLock} size={60} iconSize={28} />
        <h4 className="text-lg font-semibold text-gray-700">
          Changer le mot de passe
        </h4>
      </div>

      {/* Password */}
      <div className="mb-8">
        <h4 className="mb-2 font-semibold">Changer le mot de passe</h4>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <input
            type="password"
            placeholder="Mot de passe actuel"
            className="p-2 border rounded-lg"
          />
          <input
            type="password"
            placeholder="Nouveau mot de passe"
            className="p-2 border rounded-lg"
          />
          <input
            type="password"
            placeholder="Confirmer mot de passe"
            className="p-2 border rounded-lg"
          />
        </div>

        <button className="px-4 py-2 mt-3 text-white bg-blue-600 rounded-lg">
          Enregistrer
        </button>
      </div>

      {/* 2FA */}
      <div className="mb-8">
        <h4 className="mb-2 font-semibold">
          Authentification à deux facteurs (2FA)
        </h4>

        <button className="px-4 py-2 text-white bg-gray-800 rounded-lg">
          Activer 2FA
        </button>
      </div>

      {/* Active Sessions */}
      <div className="mb-8">
        <h4 className="mb-3 font-semibold">Sessions actives</h4>

        <div className="flex flex-col gap-4">
          {/* Session example */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <FaDesktop className="text-xl text-gray-500" />
              <div>
                <p>Windows – Chrome</p>
                <p className="text-xs text-gray-500">
                  Tunisia • Dernière activité: 10:45
                </p>
              </div>
            </div>
            <button className="text-red-500">Déconnecter</button>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <FaMobileAlt className="text-xl text-gray-500" />
              <div>
                <p>iPhone – Safari</p>
                <p className="text-xs text-gray-500">
                  Sfax • Dernière activité: 09:12
                </p>
              </div>
            </div>
            <button className="text-red-500">Déconnecter</button>
          </div>
        </div>

        <button className="mt-4 text-blue-600 underline">
          Déconnecter toutes les sessions
        </button>
      </div>

      {/* Login Activity */}
      <div>
        <h4 className="mb-3 font-semibold">Activité de connexion</h4>

        <ul className="text-sm text-gray-600">
          <li>• Connexion réussie – 10:45 (Tunisia)</li>
          <li>• Connexion réussie – 09:10 (Tunisia)</li>
          <li>• Tentative échouée – 08:50 (IP: 102.xx.xx)</li>
        </ul>
      </div>
    </div>
  );
};

export default Security;
