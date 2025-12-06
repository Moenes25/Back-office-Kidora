import React from "react";
import { FiAlignJustify } from "react-icons/fi";
import { Link } from "react-router-dom";
import SearchBar from "./components/SearchBar";
import ThemeToggle from "./components/ThemeToggel";
import NotificationsDropdown from "./components/NotificationsDropdown";
import ProfileDropdown from "./components/ProfileDropdown";

const Navbar = ({ onOpenSidenav, brandText }) => {
  const [darkmode, setDarkmode] = React.useState(false);

  React.useEffect(() => {
    const root = document.documentElement;
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    const wantDark = stored ? stored === "dark" : prefersDark;
    setDarkmode(wantDark);
    root.classList.toggle("dark", wantDark);
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const next = !darkmode;
    setDarkmode(next);
    root.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <nav
      className="nav-animated sticky top-2 z-40 mb-2 flex min-h-[52px] w-full
      items-center justify-between rounded-xl
      bg-[linear-gradient(115deg,#6d28d9_0%,#7c3aed_30%,#8b5cf6_60%,#a78bfa_100%)]
      px-2 py-1.5 text-white shadow-xl md:px-3 md:py-2"
    >
      {/* BRAND */}
      <div className="ml-2">
        <p className="text-xl font-semibold capitalize md:text-2xl">
          <Link to="#" className="font-bold hover:opacity-90">
            {brandText}
          </Link>
        </p>
      </div>

      {/* SEARCH + ACTIONS */}
      <div
        className="ring-black/5 relative flex justify-between max-w-[330px] items-center
        rounded-full px-2 shadow-xl 
        dark:bg-navy-800/70 dark:ring-white/10 md:w-[340px]"
      >

        {/* MOBILE SIDENAV */}
        <span
          className="mr-2 text-xl text-gray-600 cursor-pointer xl:hidden"
          onClick={onOpenSidenav}
        >
          <FiAlignJustify className="w-5 h-5" />
        </span>

        <SearchBar />
        {/* DARK MODE TOGGLE */}
        <ThemeToggle darkmode={darkmode} toggleTheme={toggleTheme} />

        {/* NOTIFICATIONS + PROFILE */}
        <div className="flex items-center gap-3 ml-auto">
          <NotificationsDropdown />
          <ProfileDropdown />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
