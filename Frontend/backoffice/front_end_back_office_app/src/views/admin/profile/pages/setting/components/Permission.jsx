"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaUserShield, FaUserCog, FaLock, FaBuilding, FaFileAlt } from "react-icons/fa";
import { useAuth } from "context/AuthContext";

const modules = [
  { name: "Dashboard", icon: <FaFileAlt className="text-purple-500" /> },
  { name: "Admins", icon: <FaUserShield className="text-blue-500" /> },
  { name: "Companies", icon: <FaBuilding className="text-green-500" /> },
  { name: "Settings", icon: <FaUserCog className="text-orange-500" /> },
];

export default function RolesPermissions() {
  const { token } = useAuth();
  const [roles, setRoles] = useState([]);
  const [activeRole, setActiveRole] = useState("");
  const [permissions, setPermissions] = useState({});

  // Fetch roles from backend
  useEffect(() => {
    const fetchRoles = async () => {
      if (!token) return;

      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/roles`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch roles");

        const data = await res.json(); // assuming backend returns array of roles
        setRoles(data);
        if (data.length > 0) setActiveRole(data[0].name || data[0]); // set first role as active
      } catch (err) {
        console.error(err);
      }
    };

    fetchRoles();
  }, [token]);

  const togglePerm = (role, module, perm) => {
    const id = `${role}-${module}-${perm}`;
    setPermissions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="w-full p-4 sm:p-6 bg-white shadow-md rounded-xl">
      {/* PAGE TITLE */}
      <div className="flex items-center mb-6 gap-2 py-4">
        <FaUserShield size={20} className="text-purple-600" />
        <h1 className="text-lg sm:text-xl font-semibold text-gray-700">
          Roles & Permissions
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4">
        {/* LEFT: ROLES LIST */}
        <div className="flex justify-center col-span-1 overflow-x-auto lg:overflow-visible flex lg:block gap-4 lg:gap-0 scrollbar-none">
          {roles.map((role) => (
            <div
              key={role.name || role}
              onClick={() => setActiveRole(role.name || role)}
              className={`py-4 px-2 cursor-pointer flex items-center gap-3 border-b-2 transition ${
                activeRole === (role.name || role) ? "border-purple-500 shadow-lg" : ""
              }`}
            >
              <div className="text-lg">
                {role.icon || <FaUserShield className="text-purple-500" />}
              </div>
              <p className="font-semibold text-gray-700 text-xs sm:text-base">
                {role.name || role}
              </p>
            </div>
          ))}
        </div>

        {/* RIGHT: PERMISSIONS */}
        <div className="col-span-1 lg:col-span-3 space-y-10 lg:border-l-2 border-t-2 py-6 px-4">
          {modules.map((module) => (
            <div key={module.name}>
              <h2 className="mb-3 text-sm font-semibold text-gray-500 flex items-center gap-2">
                {module.icon} {module.name.toUpperCase()}
              </h2>

              <motion.div
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                className="space-y-4"
              >
                {["View", "Create", "Edit", "Delete"].map((perm) => {
                  const id = `${activeRole}-${module.name}-${perm}`;
                  return (
                    <PermissionRow
                      key={perm}
                      title={`${perm} ${module.name}`}
                      desc={`Allow role to ${perm.toLowerCase()} ${module.name} data.`}
                      checked={permissions[id] || false}
                      onClick={() => togglePerm(activeRole, module.name, perm)}
                      variants={rowVariants}
                    />
                  );
                })}
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* PERMISSION ROW */
function PermissionRow({ title, desc, checked, onClick, variants }) {
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      className="flex items-center justify-between px-3 sm:px-4 py-3 transition border border-gray-200 rounded-lg hover:bg-gray-50"
    >
      <div className="pr-4">
        <p className="text-xs sm:text-sm font-semibold text-gray-700">{title}</p>
        <p className="text-[10px] sm:text-xs text-gray-500">{desc}</p>
      </div>

      <button
        onClick={onClick}
        className={`relative inline-flex h-5 w-10 items-center rounded-full transition-all ${
          checked ? "bg-purple-600" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </motion.div>
  );
}
