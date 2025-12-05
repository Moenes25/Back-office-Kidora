"use client";
import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { FaRegCircleUser } from "react-icons/fa6";
import { BiLogOut } from "react-icons/bi";
import { FaAngleRight } from "react-icons/fa";
import { AiOutlineTeam } from "react-icons/ai";
import { RiMoonFill, RiSunFill } from "react-icons/ri";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import avatar from "assets/img/avatars/avatar4.png";
import SwitchField from "components/fields/SwitchField";
import { useAuth } from "context/AuthContext";

const tabs = [
  { id: "profile", label: "Profil", icon: <FaRegCircleUser size={20} /> },
  { id: "settings", label: "Settings", icon: <FaRegCircleUser size={20} /> },
  { id: "security", label: "Security", icon: <FaRegCircleUser size={20} /> },
  { id: "activity", label: "Activities", icon: <FaRegCircleUser size={20} /> },
  { id: "admin", label: "Admin", icon: <FaRegCircleUser size={20} /> },
  { id: "teams", label: "Kidora Teams", icon: <AiOutlineTeam size={20} /> },
];

export default function ProfileSidebar({ isOpen, onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [darkmode, setDarkmode] = useState(
    typeof document !== "undefined" && document.body.classList.contains("dark")
  );

  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    if (isOpen && typeof document !== "undefined") {
      setDarkmode(document.body.classList.contains("dark"));
    }
  }, [isOpen]);

  const toggleDark = (e) => {
    const newVal =
      typeof e === "boolean"
        ? e
        : e && e.target && typeof e.target.checked === "boolean"
        ? e.target.checked
        : !darkmode;

    if (typeof document !== "undefined") {
      if (newVal) document.body.classList.add("dark");
      else document.body.classList.remove("dark");
    }
    setDarkmode(newVal);
  };

  // Handle tab click: update hash to scroll to section in ProfilePage
  const handleTabClick = (tab) => {
    setActiveTab(tab.id);
    navigate(`/admin/profile#${tab.id}`, { replace: false });

    // Optional: scroll smoothly after small delay
    setTimeout(() => {
      const section = document.getElementById(tab.id);
      if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);

    if (onClose) onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed right-0 top-0 z-[1000] h-full w-72 bg-white shadow-xl dark:bg-navy-800 flex flex-col"
        >
          {/* Header */}
          <div className="relative flex items-center gap-4 p-4">
            <img
              src={avatar}
              alt="avatar"
              className="w-12 h-12 border-2 border-white rounded-full"
            />
            <div>
              <h3 className="font-semibold text-md dark:text-white">User Name</h3>
              <p className="text-sm text-gray-500 dark:text-white/70">Admin</p>
            </div>
            <button
              onClick={onClose}
              className="absolute text-gray-600 top-4 right-4 dark:text-white"
            >
              <IoClose size={24} />
            </button>
          </div>

          <div className="w-full h-px bg-gray-200 dark:bg-white/10" />

          {/* Menu */}
          <div className="flex flex-col flex-1 gap-3 p-4 overflow-y-auto text-gray-700 dark:text-white">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => handleTabClick(tab)}
                whileHover={{ scale: 1.03, backgroundColor: "#E9D5FF" }}
                className={`flex items-center justify-between w-full p-2 rounded-xl transition-colors ${
                  activeTab === tab.id
                    ? "bg-violet-200 text-violet-800 dark:bg-violet-700 dark:text-white"
                    : "hover:bg-violet-100 dark:hover:bg-violet-600"
                }`}
              >
                <div className="flex items-center gap-2">{tab.icon} {tab.label}</div>
                <FaAngleRight />
              </motion.button>
            ))}

            {/* Dark mode toggle */}
            <div className="flex items-center justify-between w-full p-2 cursor-pointer rounded-xl hover:bg-violet-100 dark:hover:bg-violet-600">
              <div className="flex items-center gap-2">
                <RiMoonFill size={20} />
                Dark Mode
              </div>
              <SwitchField
                checked={darkmode}
                onChange={toggleDark}
                iconOn={<RiSunFill className="text-yellow-400" />}
                iconOff={<RiMoonFill className="text-gray-700" />}
              />
            </div>
          </div>

          {/* Logout */}
          <div className="w-full p-4 border-t border-gray-200 dark:border-white/10">
            <button
              onClick={logout}
              className="flex items-center justify-center w-full gap-2 py-2 text-white transition-colors bg-purple-600 rounded-xl hover:bg-red-500"
            >
              <BiLogOut />
              Log Out
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
