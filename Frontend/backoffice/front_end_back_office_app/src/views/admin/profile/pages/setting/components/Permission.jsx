"use client";

import { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useRef } from "react";
import { motion } from "framer-motion";
import {
  FaUserShield,
  FaUserCog,
  FaBuilding,
  FaFileAlt,
} from "react-icons/fa";
import { useAuth } from "context/AuthContext";

/* ================== MODULES (inchangé) ================== */
const modules = [
  { name: "Dashboard", icon: <FaFileAlt className="text-purple-500" /> },
  { name: "Admins", icon: <FaUserShield className="text-blue-500" /> },
  { name: "Companies", icon: <FaBuilding className="text-green-500" /> },
  { name: "Settings", icon: <FaUserCog className="text-orange-500" /> },
];

const PERMS = ["View", "Create", "Edit", "Delete"];

/* ================== FRONT RBAC CONFIG ================== */
const ROLE_PERMISSIONS = {
  SUPER_ADMIN: {
    Dashboard: ["View", "Create", "Edit", "Delete"],
    Admins: ["View", "Create", "Edit", "Delete"],
    Companies: ["View", "Create", "Edit", "Delete"],
    Settings: ["View", "Edit"],
  },

  ADMIN_GENERAL: {
    Dashboard: ["View"],
    Admins: ["View", "Edit"],
    Companies: ["View", "Create"],
    Settings: ["View"],
  },

  SUPPORT_TECH: {
    Dashboard: ["View"],
    Admins: ["View"],
    Companies: [],
    Settings: [],
  },
};
  const hasPermission = (role, module, perm) => {
  if (role === "SUPER_ADMIN") return true;

  return (
    ROLE_PERMISSIONS[role]?.[module]?.includes(perm) || false
  );
};

export default function RolesPermissions() {
  const { token } = useAuth();
  const [roles, setRoles] = useState([]);
  const [activeRole, setActiveRole] = useState("");
  const [permissions, setPermissions] = useState({});
const rolesRef = useRef(null);

const scrollRoles = (dir) => {
  if (!rolesRef.current) return;
  const amount = dir === "left" ? -220 : 220;
  rolesRef.current.scrollBy({ left: amount, behavior: "smooth" });
};

  /* ================== FETCH ROLES (inchangé) ================== */
  useEffect(() => {
    if (!token) return;

    fetch(`${process.env.REACT_APP_API_URL}/auth/roles`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setRoles(data);
        setActiveRole(data[0]?.name || data[0]);
      })
      .catch(console.error);
  }, [token]);

const togglePerm = (role, module, perm) => {
  if (role === "SUPER_ADMIN") return; // 🔒 verrouillé

  const id = `${role}-${module}-${perm}`;
  setPermissions((prev) => ({ ...prev, [id]: !prev[id] }));
};


useEffect(() => {
  if (!activeRole) return;

  const newPerms = {};

  modules.forEach((module) => {
    PERMS.forEach((perm) => {
      const id = `${activeRole}-${module.name}-${perm}`;
      newPerms[id] = hasPermission(activeRole, module.name, perm);
    });
  });

  setPermissions(newPerms);
}, [activeRole]);

  /* ================== RENDER ================== */
  return (
    <section
      className="rounded-3xl bg-white border border-slate-200 dark:bg-navy-700 dark:text-white
                 shadow-[0_30px_70px_-35px_rgba(0,0,0,0.25)] p-8"
    >
      {/* ================= HEADER ================= */}
   
<div className="flex items-center gap-3 mb-6">
  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100">
    <FaUserShield className="text-purple-600" />
  </div>
  <div>
    <h1 className="text-xl font-bold text-slate-800 dark:text-white
    ">Roles & Permissions</h1>
    {/* Sous-titre optionnel pour harmoniser avec les autres sections */}
    <p className="text-sm text-slate-500 dark:text-white
    ">Manage access and capabilities</p> 
  </div>
</div>


    {/* ================= ROLES FILTER ================= */}
<div className="relative mb-10">

  {/* LEFT FADE */}
  <div className="pointer-events-none absolute left-0 top-0 h-full w-10
                  bg-gradient-to-r from-white to-transparent z-10 dark:bg-transparent" />

  {/* RIGHT FADE */}
  <div className="pointer-events-none absolute right-0 top-0 h-full w-10
                  bg-gradient-to-l from-white to-transparent z-10 dark:bg-transparent" />

  {/* LEFT ARROW */}
  <button
    onClick={() => scrollRoles("left")}
    className="absolute left-1 top-1/2 -translate-y-1/2 z-20
               h-8 w-8 rounded-full bg-white shadow
               flex items-center justify-center
               hover:bg-slate-100 transition dark:bg-slate-500"
  >
    <FaChevronLeft className="text-slate-600 text-sm dark:text-white" />
  </button>

  {/* RIGHT ARROW */}
  <button
    onClick={() => scrollRoles("right")}
    className="absolute right-1 top-1/2 -translate-y-1/2 z-20
               h-8 w-8 rounded-full bg-white shadow
               flex items-center justify-center
               hover:bg-slate-100 transition dark:bg-slate-500"
  >
    <FaChevronRight className="text-slate-600 text-sm dark:text-white" />
  </button>

  {/* ROLES */}
  <div
    ref={rolesRef}
    className="flex gap-3 overflow-x-auto scrollbar-none px-12"
  >
    {roles.map((role) => {
      const name = role.name || role;
      const active = name === activeRole;

      return (
        <button
          key={name}
          onClick={() => setActiveRole(name)}
          className={`relative px-5 py-2.5 rounded-full text-sm font-semibold
            whitespace-nowrap transition-all
            ${
              active
                ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
        >
          {active && (
            <motion.span
              layoutId="role-pill"
              className="absolute inset-0 rounded-full bg-gradient-to-r
                         from-purple-500 to-indigo-500"
              transition={{ type: "spring", stiffness: 500, damping: 35 }}
            />
          )}
          <span className="relative z-10">{name}</span>
        </button>
      );
    })}
  </div>
</div>


      {/* ================= PERMISSIONS ================= */}
      <div className="grid md:grid-cols-2 gap-6">
        {modules.map((module) => (
          <motion.div
            key={module.name}
            whileHover={{ y: -4 }}
            className="rounded-2xl border border-slate-200 p-6
                       shadow-sm hover:shadow-md transition"
          >
            <h3 className="flex items-center gap-2 mb-4 text-sm font-bold text-slate-700  dark:text-white
            ">
              {module.icon}
              {module.name.toUpperCase()}
            </h3>

            <div className="space-y-3">
              {PERMS.map((perm) => {
                const id = `${activeRole}-${module.name}-${perm}`;
                return (
                 <PermissionRow
  key={id}
  title={`${perm} ${module.name}`}
  desc={`Allow role to ${perm.toLowerCase()} ${module.name}.`}
  checked={permissions[id] || false}
  disabled={activeRole === "SUPER_ADMIN"}
  onClick={() => togglePerm(activeRole, module.name, perm)}
/>

                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ================== PERMISSION ROW ================== */
function PermissionRow({ title, desc, checked, disabled, onClick }) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="flex items-center justify-between
                 p-3 rounded-xl border border-slate-200
                 hover:bg-slate-50 transition dark:hover:bg-slate-500
                 "
    >
      <div>
        <p className="text-sm font-semibold text-slate-700 dark:text-white
        ">{title}</p>
        <p className="text-xs text-slate-500 dark:text-white
        ">{desc}</p>
      </div>

      <button
        disabled={disabled}
        onClick={onClick}
        className={`relative inline-flex h-6 w-11 items-center rounded-full
          transition-all
          ${checked ? "bg-purple-600" : "bg-slate-300"}
          ${disabled ? "opacity-60 cursor-not-allowed" : ""}
        `}
      >
        <span
          className={`inline-block h-5 w-5 rounded-full bg-white shadow
            transform transition-transform
            ${checked ? "translate-x-5" : "translate-x-1"}
          `}
        />
      </button>
    </motion.div>
  );
}

