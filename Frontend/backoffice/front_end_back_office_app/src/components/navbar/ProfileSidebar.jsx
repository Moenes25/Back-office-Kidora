import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { FaRegCircleUser } from "react-icons/fa6";
import { BiLogOut } from "react-icons/bi";
import { useAuth } from "context/AuthContext";
import avatar from "assets/img/avatars/avatar4.png";
import { FaAngleRight } from "react-icons/fa";
import { AiOutlineTeam } from "react-icons/ai";
import SwitchField from "components/fields/SwitchField";
import { RiMoonFill, RiSunFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

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
          className="h-12 w-12 rounded-full border-2 border-white"
          alt="avatar"
        />
        <div className="ml-4">
          <h3 className="text-md font-semibold dark:text-white">User Name</h3>
          <p className="text-sm text-gray-200 dark:text-white/70">Admin</p>
        </div>
        <button onClick={onClose}>
          <IoClose className="absolute right-4 top-8 text-2xl text-gray-600 dark:text-white" />
        </button>
      </div>

      <div className="h-px w-full bg-gray-200 dark:bg-white/10" />

      {/* Menu */}
      <div className="flex flex-col gap-4 p-4 text-gray-700 dark:text-white">
        <button
          className="hover:bg-violet-500 flex w-full items-center justify-between rounded-xl p-1 "
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
          className="hover:bg-violet-500 flex w-full items-center justify-between rounded-xl p-1 "
          onClick={goToProfile}
        >
          <div className="flex items-center gap-2">
            <FaRegCircleUser size={20} />
            Profile Settings
          </div>
          <FaAngleRight />
        </div>

        <button
          className="hover:bg-violet-200 flex w-full items-center justify-between rounded-xl p-1 "
          onClick={goToProfile}
        >
          <div className="flex items-center gap-2">
            <FaRegCircleUser size={20} />
            Profile Settings
          </div>
          <FaAngleRight />
        </button>

        <button className="hover:bg-violet-200 flex w-full items-center justify-between rounded-xl p-1 ">
          <div className="flex items-center gap-2">
            <AiOutlineTeam size={20} />
            Kidora Teams
          </div>
          <FaAngleRight />
        </button>

        {/* Dark mode row: single switch, correct initial state and toggle */}
        <div className="hover:bg-violet-200 flex w-full cursor-pointer items-center justify-between rounded-xl p-1">
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
      <div className="h-px w-full bg-gray-200 dark:bg-white/10" />
      {/* Logout */}
      <div className="flex items-center justify-center p-4">
        <button
          onClick={logout}
          className="flex items-center justify-center gap-1 rounded-xl bg-purple-600 px-4 py-2 text-sm text-white hover:bg-red-500"
        >
          <BiLogOut />
          Log Out
        </button>
      </div>
    </div>
  );
}
