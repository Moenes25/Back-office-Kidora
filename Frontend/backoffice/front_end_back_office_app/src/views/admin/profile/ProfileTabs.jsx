import React from "react";

const ProfileTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "profile", label: "Profil" },
    { id: "settings", label: "Paramètres" },
    { id: "security", label: "Sécurité" },
    { id: "activity", label: "Activité" },
    { id: "superAdmin", label: "Super Admin" },
  ];

  return (
    <div className="flex gap-6 mt-6 border-b">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`pb-3 font-medium ${
            activeTab === tab.id
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-800"
          }`}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default ProfileTabs;
