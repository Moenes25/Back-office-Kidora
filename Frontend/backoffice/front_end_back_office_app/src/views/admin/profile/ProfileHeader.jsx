import React from "react";
import { FaUserCircle } from "react-icons/fa";

const ProfileHeader = () => {
  return (
    <div className="flex items-center gap-4 p-6 bg-white border shadow-sm rounded-xl">
      {/* Avatar */}
      <div className="text-6xl text-gray-400">
        <FaUserCircle />
      </div>

      {/* Info */}
      <div>
        <h2 className="text-xl font-semibold">Nesrine Nasri</h2>
        <p className="text-sm text-gray-600">Super Admin</p>
        <p className="text-sm text-gray-500">nesrine@example.com</p>
      </div>
    </div>
  );
};

export default ProfileHeader;
