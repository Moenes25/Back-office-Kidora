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
<nav className="nav-animated sticky top-2 z-40 mb-2 flex h-12 md:h-14 w-full
  items-center justify-between rounded-xl
  bg-[linear-gradient(115deg,#6d28d9_0%,#7c3aed_30%,#8b5cf6_60%,#a78bfa_100%)]
  px-3 py-1 md:px-4 md:py-1.5 text-white shadow-xl">

  <div className="ml-2">
    <p className="text-base  text-lg md:text-xl lg:text-2xl font-semibold leading-tight capitalizeb text-white  dark:text-black ">
      <Link to="#" className="font-bold hover:opacity-90">{brandText}</Link>
    </p>
  </div>

  <div
    className="relative flex items-center rounded-full bg-white pl-4 pr-2 py-1
               lg:max-w-[380px] h-10 backdrop-blur-sm dark:bg-navy-800/70
               overflow-visible"
    style={{
      boxShadow:
        'rgba(50,50,93,.25) 0px 50px 100px -20px, rgba(0,0,0,.3) 0px 30px 60px -30px, rgba(10,37,64,.35) 0px -2px 6px 0px inset'
    }}
  >
    <span className="cursor-pointer text-gray-600 xl:hidden" onClick={onOpenSidenav}>
      <FiAlignJustify className="h-5 w-5" />
    </span>

    <div className="flex-1">
      <SearchBar />
    </div>

    {/* espacements égaux */}
    <div className="flex items-center gap-3">
      <ThemeToggle darkmode={darkmode} toggleTheme={toggleTheme} className="shrink-0" />
      <NotificationsDropdown className="h-8 w-8 shrink-0" />
      {/* tire l’avatar vers le bord */}
      <ProfileDropdown className="h-9 w-9 -mr-1 md:-mr-2 shrink-0" />
    </div>
  </div>
</nav>





  );
};

export default Navbar;
