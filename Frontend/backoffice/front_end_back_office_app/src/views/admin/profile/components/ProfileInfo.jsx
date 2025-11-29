import React from "react";

const ProfileInfo = () => {
  return (
    <div className="p-6 bg-white border shadow-sm rounded-xl">
      <h3 className="mb-4 text-lg font-semibold">Informations personnelles</h3>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

        {/* Full Name */}
        <div>
          <p className="text-sm text-gray-500">Nom complet</p>
          <p className="font-medium">Nesrine Nasri</p>
        </div>

        {/* Email */}
        <div>
          <p className="text-sm text-gray-500">Email</p>
          <p className="font-medium">nesrine@example.com</p>
        </div>

        {/* Phone */}
        <div>
          <p className="text-sm text-gray-500">Téléphone</p>
          <p className="font-medium">+216 55 000 111</p>
        </div>

        {/* Role */}
        <div>
          <p className="text-sm text-gray-500">Rôle</p>
          <p className="font-medium">Super Admin</p>
        </div>

        {/* Date creation */}
        <div>
          <p className="text-sm text-gray-500">Compte créé le</p>
          <p className="font-medium">12 Janvier 2025</p>
        </div>

        {/* Last login */}
        <div>
          <p className="text-sm text-gray-500">Dernière connexion</p>
          <p className="font-medium">Aujourd’hui à 10:45</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
