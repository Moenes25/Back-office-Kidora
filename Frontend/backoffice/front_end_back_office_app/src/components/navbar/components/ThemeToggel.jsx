import React from "react";
import { RiMoonFill, RiSunFill } from "react-icons/ri";

const ThemeToggle = ({ darkmode, toggleTheme }) => {
  return (
    <button
      onClick={toggleTheme}
      aria-label={darkmode ? "Light mode" : "Dark mode"}
      className="flex items-center justify-center w-8 h-8 mr-2 text-gray-700 bg-white rounded-full shadow ring-1 ring-black/5 hover:bg-white/90 active:scale-95 dark:bg-slate-800 dark:text-white dark:ring-white/10"
    >
      {darkmode ? <RiSunFill className="w-4 h-4" /> : <RiMoonFill className="w-4 h-4" />}
    </button>
  );
};

export default ThemeToggle;
