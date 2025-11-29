import React from "react";

const Activity = () => {
  const activities = [
    { action: "Ajouté un établissement", date: "Aujourd’hui - 09:30" },
    { action: "Modifié abonnement d’un parent", date: "Hier - 18:10" },
    { action: "Consulté un rapport IA", date: "Hier - 14:22" },
    { action: "Supprimé un éducateur", date: "25 Jan - 11:40" },
  ];

  return (
    <div className="p-6 bg-white border shadow-sm rounded-xl">
      <h3 className="mb-6 text-lg font-semibold">Journal d’activité</h3>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <select className="p-2 border rounded-lg">
          <option>Toutes les actions</option>
          <option>Création</option>
          <option>Modification</option>
          <option>Suppression</option>
        </select>

        <select className="p-2 border rounded-lg">
          <option>Dernières 24h</option>
          <option>7 jours</option>
          <option>30 jours</option>
        </select>

        <button className="px-4 py-2 ml-auto text-white bg-green-600 rounded-lg">
          Export Excel
        </button>
      </div>

      {/* List */}
      <div className="flex flex-col gap-4">
        {activities.map((item, index) => (
          <div key={index} className="flex justify-between p-4 border rounded-lg">
            <p>{item.action}</p>
            <span className="text-sm text-gray-500">{item.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Activity;
