import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { IoClose } from "react-icons/io5";

const SearchBar = () => {
  const [openMobile, setOpenMobile] = useState(false);

  return (
    <>
      {/* ===== Desktop Search ===== */}
      <div
        className="items-center flex-1 hidden h-full px-3 mr-2 overflow-hidden rounded-full xl:flex bg-slate-100 ring-1 ring-black/5 dark:bg-slate-800 dark:ring-white/10"
      >
        <FiSearch className="w-6 h-6 mr-2 text-slate-400 dark:text-slate-300" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full text-sm font-medium border-0 rounded-full outline-none h-7 bg-slate-100 dark:bg-slate-900 text-slate-800 placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-400 focus:ring-0"
        />
      </div>

      {/* ===== Mobile Icon ===== */}
      <button
        className="flex items-center justify-center rounded-full xl:hidden w-9 h-9 bg-white/80 dark:bg-slate-700"
        onClick={() => setOpenMobile(true)}
      >
        <FiSearch className="w-6 h-6 text-gray-700 dark:text-white" />
      </button>

      {/* ===== Mobile Fullscreen Search Overlay ===== */}
      {openMobile && (
        <div className="fixed inset-0 z-[1999] backdrop-blur-sm bg-black/40 flex items-start pt-20 px-4 transition-all duration-300">
          <div className="relative flex items-center w-full max-w-lg px-4 py-2 mx-auto bg-white rounded-full shadow-xl dark:bg-slate-800">
            {/* Search Icon */}
            <FiSearch className="w-6 h-6 text-gray-400 dark:text-gray-200" />

            {/* Input */}
            <input
              autoFocus
              type="text"
              placeholder="Search..."
              className="flex-1 ml-3 text-gray-700 bg-transparent outline-none dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-300"
            />

            {/* Close Button */}
            <button
              className="absolute p-2 text-white -right-2 -top-12"
              onClick={() => setOpenMobile(false)}
            >
              <IoClose className="w-8 h-8" />
            </button>
          </div>

          {/* Click outside to close */}
          <div
            className="absolute inset-0"
            onClick={() => setOpenMobile(false)}
          ></div>
        </div>
      )}
    </>
  );
};

export default SearchBar;
