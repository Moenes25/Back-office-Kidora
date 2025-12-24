"use client";

import { useState, useEffect } from "react";
<<<<<<< HEAD
import { motion } from "framer-motion";
import { FaUserShield, FaUserCog, FaLock, FaBuilding, FaFileAlt } from "react-icons/fa";
import { useAuth } from "context/AuthContext";

=======
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
>>>>>>> safa
const modules = [
  { name: "Dashboard", icon: <FaFileAlt className="text-purple-500" /> },
  { name: "Admins", icon: <FaUserShield className="text-blue-500" /> },
  { name: "Companies", icon: <FaBuilding className="text-green-500" /> },
  { name: "Settings", icon: <FaUserCog className="text-orange-500" /> },
];

<<<<<<< HEAD
=======
const PERMS = ["View", "Create", "Edit", "Delete"];

>>>>>>> safa
export default function RolesPermissions() {
  const { token } = useAuth();
  const [roles, setRoles] = useState([]);
  const [activeRole, setActiveRole] = useState("");
  const [permissions, setPermissions] = useState({});
<<<<<<< HEAD

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
=======
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
>>>>>>> safa
  }, [token]);

  const togglePerm = (role, module, perm) => {
    const id = `${role}-${module}-${perm}`;
    setPermissions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

<<<<<<< HEAD
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
=======
  /* ================== RENDER ================== */
  return (
    <section
      className="rounded-3xl bg-white border border-slate-200
                 shadow-[0_30px_70px_-35px_rgba(0,0,0,0.25)] p-8"
    >
      {/* ================= HEADER ================= */}
   
<div className="flex items-center gap-3 mb-6">
  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100">
    <FaUserShield className="text-purple-600" />
  </div>
  <div>
    <h1 className="text-xl font-bold text-slate-800">Roles & Permissions</h1>
    {/* Sous-titre optionnel pour harmoniser avec les autres sections */}
    <p className="text-sm text-slate-500">Manage access and capabilities</p> 
  </div>
</div>


    {/* ================= ROLES FILTER ================= */}
<div className="relative mb-10">

  {/* LEFT FADE */}
  <div className="pointer-events-none absolute left-0 top-0 h-full w-10
                  bg-gradient-to-r from-white to-transparent z-10" />

  {/* RIGHT FADE */}
  <div className="pointer-events-none absolute right-0 top-0 h-full w-10
                  bg-gradient-to-l from-white to-transparent z-10" />

  {/* LEFT ARROW */}
  <button
    onClick={() => scrollRoles("left")}
    className="absolute left-1 top-1/2 -translate-y-1/2 z-20
               h-8 w-8 rounded-full bg-white shadow
               flex items-center justify-center
               hover:bg-slate-100 transition"
  >
    <FaChevronLeft className="text-slate-600 text-sm" />
  </button>

  {/* RIGHT ARROW */}
  <button
    onClick={() => scrollRoles("right")}
    className="absolute right-1 top-1/2 -translate-y-1/2 z-20
               h-8 w-8 rounded-full bg-white shadow
               flex items-center justify-center
               hover:bg-slate-100 transition"
  >
    <FaChevronRight className="text-slate-600 text-sm" />
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
            <h3 className="flex items-center gap-2 mb-4 text-sm font-bold text-slate-700">
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
                    onClick={() =>
                      togglePerm(activeRole, module.name, perm)
                    }
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
function PermissionRow({ title, desc, checked, onClick }) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="flex items-center justify-between
                 p-3 rounded-xl border border-slate-200
                 hover:bg-slate-50 transition"
    >
      <div>
        <p className="text-sm font-semibold text-slate-700">{title}</p>
        <p className="text-xs text-slate-500">{desc}</p>
>>>>>>> safa
      </div>

      <button
        onClick={onClick}
<<<<<<< HEAD
        className={`relative inline-flex h-5 w-10 items-center rounded-full transition-all ${
          checked ? "bg-purple-600" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
=======
        className={`relative inline-flex h-6 w-11 items-center rounded-full
          transition-all ${
            checked ? "bg-purple-600" : "bg-slate-300"
          }`}
      >
        <span
          className={`inline-block h-5 w-5 rounded-full bg-white shadow
            transform transition-transform ${
              checked ? "translate-x-5" : "translate-x-1"
            }`}
>>>>>>> safa
        />
      </button>
    </motion.div>
  );
}
