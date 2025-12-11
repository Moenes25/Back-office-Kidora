import React from "react";
import RolePermissionPage from "./Permission";

const Settings = () => {
  return (
    <div className="">
      <div className=" mx-auto space-y-8">

        {/* Roles & Permissions */}
        
          <RolePermissionPage />
        

        {/* General Preferences */}
        <div className="p-6 bg-white shadow-lg rounded-2xl">
          <h4 className="mb-4 text-xl font-semibold text-gray-800">
            General Preferences
          </h4>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Language */}
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-gray-500">
                Language
              </label>
              <select className="w-full p-3 transition border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent">
                <option>Français</option>
                <option>العربية</option>
                <option>English</option>
              </select>
            </div>

            {/* Theme */}
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-gray-500">
                Theme
              </label>
              <select className="w-full p-3 transition border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent">
                <option>Light</option>
                <option>Dark</option>
                <option>Auto</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="p-6 bg-white shadow-lg rounded-2xl">
          <h4 className="mb-4 text-xl font-semibold text-gray-800">
            Notifications
          </h4>

          <div className="flex flex-col gap-4">
            {[
              "Account modifications",
              "AI Alerts",
              "Payments & Subscriptions",
              "Customer Support",
              "Weekly Report",
            ].map((item, index) => (
              <label
                key={index}
                className="flex items-center gap-3 p-3 transition border border-gray-200 rounded-lg cursor-pointer hover:bg-purple-50"
              >
                <input type="checkbox" defaultChecked className="w-5 h-5 text-purple-500 transition rounded focus:ring-2 focus:ring-purple-400" />
                <span className="font-medium text-gray-700">{item}</span>
              </label>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;
