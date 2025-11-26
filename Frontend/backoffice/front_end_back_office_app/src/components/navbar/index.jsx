import React, { useState } from "react";
import { FiAlignJustify, FiSearch } from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import avatar from "assets/img/avatars/avatar4.png";
import Dropdown from "components/dropdown";
import ProfileSidebar from "./ProfileSidebar";

export default function Navbar({ brandText, onOpenSidenav }) {
  // const [darkmode, setDarkmode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <nav>
      <section className="sticky right-0 top-0 z-40 mb-10 flex w-full items-center justify-between bg-white p-4 shadow-lg backdrop-blur-md dark:bg-navy-800/80">
        {/* Title */}
        <h1 className="text-xl font-semibold text-navy-700 dark:text-white">
          {brandText}
        </h1>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="relative hidden items-center md:flex">
            <FiSearch className="absolute left-4 text-lg text-gray-400 dark:text-gray-300" />

            <input
              type="text"
              placeholder="Search..."
              className="w-64 rounded-full border border-gray-200 bg-gray-100 py-2 pl-12 pr-4 text-sm text-navy-700 placeholder-gray-400 shadow-sm transition-all focus:outline-none focus:ring-2 dark:border-white/10 dark:bg-navy-700 dark:text-white dark:placeholder-gray-300"
            />
          </div>

          {/* Mobile Menu */}
          <span
            className="cursor-pointer rounded-full bg-gray-100 p-2 dark:bg-navy-700 xl:hidden"
            onClick={onOpenSidenav}
          >
            <FiAlignJustify className="text-navy-700 dark:text-white" />
          </span>

          {/* Language Dropdown */}
          {/* <Dropdown
          button={
            <div className="icon-btn">
              <MdTranslate />
            </div>
          }
          classNames="top-6 right-0"
          children={
            <div className="dropdown-panel">
              <button className="dropdown-item">🇫🇷 Français</button>
              <button className="dropdown-item">🇦🇪 العربية</button>
              <button className="dropdown-item">🇬🇧 English</button>
            </div>
          }
        /> */}

          {/* Notifications */}
          <Dropdown
            button={
              <div className="icon-btn cursor-pointer">
                <IoMdNotificationsOutline size={28} />
              </div>
            }
            classNames="top-6 right-0"
            children={
              <div className="dropdown-panel w-64 bg-white dark:bg-navy-700">
                <p className="font-bold text-navy-700 dark:text-white">
                  Notifications
                </p>
                <div className="mt-2 text-sm">No new notifications</div>
              </div>
            }
          />

          {/* Dark Mode */}
          {/* <button
          className="icon-btn"
          onClick={() => {
            document.body.classList.toggle("dark");
            setDarkmode(!darkmode);
          }}
        >
          {darkmode ? <RiSunFill /> : <RiMoonFill />}
        </button> */}

          {/* Profile Sidebar Trigger */}
          <img
            src={avatar}
            alt="User"
            className="h-12 w-12 cursor-pointer rounded-full border border-gray-200 dark:border-white/10"
            onClick={() => setSidebarOpen(true)}
          />
        </div>

        {/* 🔥 Tailwind Helpers */}
        <style>{`
        .icon-btn {
          @apply flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 text-gray-600 dark:bg-navy-700 dark:text-white cursor-pointer hover:bg-gray-200 dark:hover:bg-navy-600 transition;
        }
        .dropdown-panel {
          @apply bg-white dark:bg-navy-700 shadow-xl rounded-xl p-4 flex flex-col gap-2;
        }
        .dropdown-item {
          @apply text-sm text-gray-700 dark:text-white hover:text-brand-500 transition;
        }
      `}</style>
      </section>

      {/* Sidebar Panel */}
      <ProfileSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
    </nav>
  );
}
