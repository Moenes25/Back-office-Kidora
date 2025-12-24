import React from "react";
import { RiMoonFill, RiSunFill } from "react-icons/ri";

const ThemeToggle = ({ darkmode, toggleTheme }) => {
  return (
<button
  onClick={toggleTheme}
  aria-label={darkmode ? "Light mode" : "Dark mode"}
  className="flex items-center justify-center w-8 h-8 text-gray-700 bg-white rounded-full hover:bg-white/90 active:scale-95 dark:bg-slate-800 dark:text-white"
  style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}
>
  {darkmode ? <RiSunFill className="w-4 h-4" /> : <RiMoonFill className="w-4 h-4" />}
</button>

  );
};

export default ThemeToggle;
