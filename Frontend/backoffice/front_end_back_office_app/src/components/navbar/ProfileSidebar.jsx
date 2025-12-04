import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { FaRegCircleUser } from "react-icons/fa6";
import { BiLogOut } from "react-icons/bi";

import avatar from "assets/img/avatars/avatar4.png";
import { FaAngleRight } from "react-icons/fa";
import { AiOutlineTeam } from "react-icons/ai";
import SwitchField from "components/fields/SwitchField";
import { RiMoonFill, RiSunFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { useAuth } from "context/AuthContext";

export default function ProfileSidebar({ isOpen, onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  // navigate to profile page and close sidebar
  const goToProfile = () => {
    if (typeof onClose === "function") onClose();
    navigate("/admin/profile");
  };

  // init from document and resync when sidebar opens
  const [darkmode, setDarkmode] = useState(
    () =>
      typeof document !== "undefined" &&
      document.body.classList.contains("dark")
  );

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

  return (
    <div
      className={`fixed right-0 top-0 z-[1000] h-full w-72 transform bg-white shadow-xl transition-transform duration-300 dark:bg-navy-800 
      ${isOpen ? "translate-x-0" : "translate-x-full"}`}
    >
      {/* User Info */}
      <div className="flex items-center gap-1 p-4">
        <img
          src={avatar}
          className="w-12 h-12 border-2 border-white rounded-full"
          alt="avatar"
        />
        <div className="ml-4">
          <h3 className="font-semibold text-md dark:text-white">User Name</h3>
          <p className="text-sm text-gray-200 dark:text-white/70">Admin</p>
        </div>
        <button onClick={onClose}>
          <IoClose className="absolute text-2xl text-gray-600 right-4 top-8 dark:text-white" />
        </button>
      </div>

      <div className="w-full h-px bg-gray-200 dark:bg-white/10" />

      {/* Menu */}
      <div className="flex flex-col gap-4 p-4 text-gray-700 dark:text-white">
        <button
          className="flex items-center justify-between w-full p-1 hover:bg-violet-500 rounded-xl "
          onClick={goToProfile}
        >
          <div className="flex items-center gap-2">
            <FaRegCircleUser size={20} />
            Profile Settings
          </div>
          <FaAngleRight />
        </button>

        {/* language */}
        <div
          className="flex items-center justify-between w-full p-1 hover:bg-violet-500 rounded-xl "
          onClick={goToProfile}
        >
          <div className="flex items-center gap-2">
            <FaRegCircleUser size={20} />
            Profile Settings
          </div>
          <FaAngleRight />
        </div>

        <button
          className="flex items-center justify-between w-full p-1 hover:bg-violet-200 rounded-xl "
          onClick={goToProfile}
        >
          <div className="flex items-center gap-2">
            <FaRegCircleUser size={20} />
            Profile Settings
          </div>
          <FaAngleRight />
        </button>

        <button className="flex items-center justify-between w-full p-1 hover:bg-violet-200 rounded-xl ">
          <div className="flex items-center gap-2">
            <AiOutlineTeam size={20} />
            Kidora Teams
          </div>
          <FaAngleRight />
        </button>

        {/* Dark mode row: single switch, correct initial state and toggle */}
        <div className="flex items-center justify-between w-full p-1 cursor-pointer hover:bg-violet-200 rounded-xl">
          <div className="flex items-center gap-2">
            <RiMoonFill size={20} />
            Dark Mode
          </div>

          <div className="flex items-center gap-2">
            <SwitchField
              checked={darkmode}
              onChange={toggleDark}
              iconOn={<RiSunFill className="text-yellow-400" />}
              iconOff={<RiMoonFill className="text-gray-700" />}
            />
          </div>
        </div>
      </div>
      <div className="w-full h-px bg-gray-200 dark:bg-white/10" />
      {/* Logout */}
      <div className="flex items-center justify-center p-4">
        <button
          onClick={logout}
          className="flex items-center justify-center gap-1 px-4 py-2 text-sm text-white bg-purple-600 rounded-xl hover:bg-red-500"
        >
          <BiLogOut />
          Log Out
        </button>
      </div>
    </div>
  );
}
