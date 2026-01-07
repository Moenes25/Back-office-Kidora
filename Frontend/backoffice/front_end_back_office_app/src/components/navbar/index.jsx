// src/components/navbar/Navbar.jsx
"use client";

import React from "react";
import { Link } from "react-router-dom";
import { FiAlignJustify } from "react-icons/fi";
import SearchBar from "./components/SearchBar";
import ThemeToggle from "./components/ThemeToggel";
import NotificationsDropdown from "./components/NotificationsDropdown";
import ProfileDropdown from "./components/ProfileDropdown";

const Navbar = ({ onOpenSidenav, brandText }) => {
  const [darkmode, setDarkmode] = React.useState(false);

  React.useEffect(() => {
    const root = document.documentElement;
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
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
      className="
        sticky top-2 z-40 mb-3 flex h-14 w-full items-center justify-between
        rounded-2xl px-3 md:px-4 text-white
        shadow-[0_12px_40px_rgba(79,70,229,.35)]
        bg-[radial-gradient(1100px_140px_at_-5%_-40%,#7c3aed_0%,transparent_55%),radial-gradient(900px_140px_at_120%_-40%,#10b981_0%,transparent_55%),linear-gradient(115deg,#6d28d9_0%,#7c3aed_30%,#8b5cf6_60%,#a78bfa_100%)]
        dark:shadow-[0_12px_40px_rgba(0,0,0,.5)]
      "
    >
      {/* Burger + Brand */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenSidenav}
          className="grid h-9 w-9 place-items-center rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 active:scale-95 transition md:hidden"
          title="Menu"
          aria-label="Ouvrir le menu"
        >
          <FiAlignJustify className="h-5 w-5" />
        </button>

        <div className="hidden sm:block">
          <p className="text-lg md:text-xl font-semibold tracking-tight">
            <Link to="#" className="hover:opacity-90">
              {brandText}
            </Link>
          </p>
        </div>
      </div>

      {/* Pod “glass” : Search + actions */}
      <div
        className="
          group relative flex items-center gap-3
          w-full max-w-[500px] h-11
          rounded-full pl-3 pr-2
          bg-white/70 text-slate-800 backdrop-blur-xl
          dark:bg-slate-900/70 dark:text-slate-100 dark:ring-white/10
          shadow-[inset_0_1px_0_rgba(255,255,255,.6),0_8px_26px_rgba(2,6,23,.18)]
        "
      >
        <div className="flex-1 min-w-0">
          <SearchBar />
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle darkmode={darkmode} toggleTheme={toggleTheme} />
          <NotificationsDropdown />
          <ProfileDropdown className="h-9 w-9" />
        </div>

        {/* halo subtil au survol */}
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-px rounded-full opacity-0 group-hover:opacity-100 transition"
          style={{ boxShadow: "0 0 0 2px rgba(99,102,241,.15), 0 16px 48px rgba(2,6,23,.18)" }}
        />
      </div>
    </nav>
  );
};

export default Navbar;
