import React from "react";
import { IoClose } from "react-icons/io5";
import { FaRegCircleUser } from "react-icons/fa6";
import { useAuth } from "context/AuthContext";
import avatar from "assets/img/avatars/avatar4.png";
import { FaAngleRight } from "react-icons/fa";

export default function ProfileSidebar({ isOpen, onClose }) {
  const { logout } = useAuth();

  return (
    <div
      className={`fixed right-0 top-0 z-[1000] h-full w-72 transform bg-white shadow-xl transition-transform duration-300 dark:bg-navy-800 
      ${isOpen ? "translate-x-0" : "translate-x-full"}`}
    >
      {/* User Info */}
      <div className="flex items-center gap-1 p-4">
        <img
          src={avatar}
          className="h-12 w-12 rounded-full border"
          alt="avatar"
        />
        <div className="ml-4">
          <h3 className="text-md font-semibold text-navy-700 dark:text-white">
            User Name
          </h3>
          <p className="text-sm text-gray-500 dark:text-white/70">Admin</p>
        </div>
        <button onClick={onClose}>
          <IoClose className="absolute right-4 top-8 text-2xl text-gray-600 dark:text-white" />
        </button>
      </div>

      <div className="h-px w-full bg-gray-200 dark:bg-white/10" />

      {/* Menu */}
      <div className="flex flex-col gap-4 p-4">
        <button className="hover:bg-violet-500 flex w-full items-center justify-between rounded-xl p-1 text-gray-700 dark:text-white">
          <div className="flex items-center gap-2">
            <FaRegCircleUser size={20} />
            Profile Settings
          </div>
          <FaAngleRight />
        </button>

        <button className="hover:bg-violet-200 flex w-full items-center justify-between rounded-xl p-1 text-gray-700 dark:text-white">
          <div className="flex items-center gap-2">
            <FaRegCircleUser size={20} />
            Profile Settings
          </div>
          <FaAngleRight />
        </button>

        <button className="hover:bg-violet-200 flex w-full items-center justify-between rounded-xl p-1 text-gray-700 dark:text-white">
          <div className="flex items-center gap-2">
            <FaRegCircleUser size={20} />
            Profile Settings
          </div>
          <FaAngleRight />
        </button>
      </div>
      <div className="h-px w-full bg-gray-200 dark:bg-white/10" />
      {/* Logout */}
      <div className="flex items-center justify-center p-4">
        <button
          onClick={logout}
          className="rounded-xl bg-purple-600 px-4 py-2 text-sm text-white hover:bg-red-500"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
