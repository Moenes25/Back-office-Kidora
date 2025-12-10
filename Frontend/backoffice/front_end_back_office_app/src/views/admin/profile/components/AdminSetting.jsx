"use client";


import AdminList from "./AdminList";



const SuperAdminSettings = () => {
  

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm space-y-6 overflow-hidden shadow-xl -rounded-2xl">
      

      {/* Admin List */}
      <AdminList  />

      {/* AI Settings */}
      <div className="p-4  border border-gray-200 rounded-xl">
        <h4 className="mb-3 text-lg font-semibold text-gray-700">AI Settings</h4>

        <label className="flex items-center gap-3 mb-2 cursor-pointer">
          <input type="checkbox" defaultChecked className="accent-purple-600" />
          Enable AI Recommendations
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" defaultChecked className="accent-purple-600" />
          Automatic Activity Analysis
        </label>
      </div>

      
    </div>
  );
};

export default SuperAdminSettings;
