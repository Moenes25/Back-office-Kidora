import React from "react";
import Dropdown from "components/dropdown";
import { FiAlignJustify } from "react-icons/fi";
import { Link } from "react-router-dom";
import navbarimage from "assets/img/layout/Navbar.png";
import { BsArrowBarUp } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";
import { RiMoonFill, RiSunFill } from "react-icons/ri";
import { MdTranslate } from "react-icons/md";
import { HiMenu } from "react-icons/hi";

import {
  IoMdNotificationsOutline,
  IoMdInformationCircleOutline,
} from "react-icons/io";
import avatar from "assets/img/avatars/avatar4.png";

const Navbar = (props) => {
  const { onOpenSidenav, brandText } = props;
  const [darkmode, setDarkmode] = React.useState(false);
  // initialise à partir du localStorage ou de la préférence système
  React.useEffect(() => {
    const root = document.documentElement;
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;

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
  <nav className="nav-animated sticky top-2 z-40 mb-2 md:mb-2 xl:mb-3 w-full
  flex items-center justify-between rounded-xl
  bg-[linear-gradient(115deg,_#6d28d9_0%,_#7c3aed_30%,_#8b5cf6_60%,_#a78bfa_100%)]
  text-white px-2 py-1.5 md:px-3 md:py-2 shadow-xl min-h-[52px]">

      <div className="ml-[6px]">

       <p className="shrink text-xl md:text-2xl font-semibold capitalize text-white leading-none">
          <Link
            to="#"
           className="font-bold capitalize hover:opacity-90"
          >
            {brandText}
          </Link>
        </p>
      </div>

       <div
 className="relative mt-0 flex h-10 w-[330px] items-center rounded-full
 pl-0 pr-3 shadow-xl md:w-[340px]
 bg-white/90 ring-1 ring-black/5
  dark:bg-navy-800/70 dark:ring-white/10"
>
  <div
  className="flex h-full flex-1 items-center px-3 xl:w-[210px]
             rounded-full overflow-hidden
             bg-slate-100 ring-1 ring-black/5
             dark:bg-slate-800 dark:ring-white/10 mr-2" 
>
  <FiSearch className="mr-2 h-6 w-6 text-slate-400 dark:text-slate-300" />
  <input
    type="text"
    placeholder="Search..."
    className="h-7 w-full border-0 rounded-full
               bg-slate-100 text-sm font-medium text-slate-800
               placeholder:text-slate-400 outline-none focus:ring-0
               dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-400
               appearance-none shadow-none"
  />
</div>

       <span className="flex cursor-pointer text-xl text-gray-600 xl:hidden leading-none mr-2"
          onClick={onOpenSidenav}
        >
          <FiAlignJustify className="h-5 w-5" />
        </span>
   <button
  type="button"
  onClick={toggleTheme}
  aria-label={darkmode ? "Passer en mode clair" : "Passer en mode sombre"}
  title={darkmode ? "Mode clair" : "Mode sombre"}
 className="flex h-8 w-8 items-center justify-center rounded-full
            bg-white text-gray-700 ring-1 ring-black/5 shadow
            hover:bg-white/90 transition active:scale-95
            dark:bg-slate-800 dark:text-white dark:ring-white/10 mr-2"
>
  {darkmode ? (
    <RiSunFill className="h-4 w-4" />
  ) : (
    <RiMoonFill className="h-4 w-4" />
  )}
</button>

<div className="ml-auto flex items-center gap-3">
        {/* start Notification */}
        <Dropdown
          button={
            <p className="cursor-pointer">
              <IoMdNotificationsOutline className="h-5 w-5 text-gray-600 dark:text-white" />
            </p>
          }
          animation="origin-[65%_0%] md:origin-top-right transition-all duration-300 ease-in-out"
          children={
            <div className="flex w-[360px] flex-col gap-3 rounded-[20px] bg-white p-4 shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none sm:w-[460px]">
              <div className="flex items-center justify-between">
                <p className="text-base font-bold text-navy-700 dark:text-white">
                  Notification
                </p>
                <p className="text-sm font-bold text-navy-700 dark:text-white">
                  Mark all read
                </p>
              </div>

              <button className="flex w-full items-center">
                <div className="flex h-full w-[85px] items-center justify-center rounded-xl bg-gradient-to-b from-brandLinear to-brand-500 py-4 text-2xl text-white">
                  <BsArrowBarUp />
                </div>
                <div className="ml-2 flex h-full w-full flex-col justify-center rounded-lg px-1 text-sm">
                  <p className="mb-1 text-left text-base font-bold text-gray-900 dark:text-white">
                    New Update: Horizon UI Dashboard PRO
                  </p>
                  <p className="font-base text-left text-xs text-gray-900 dark:text-white">
                    A new update for your downloaded item is available!
                  </p>
                </div>
              </button>

              <button className="flex w-full items-center">
                <div className="flex h-full w-[85px] items-center justify-center rounded-xl bg-gradient-to-b from-brandLinear to-brand-500 py-4 text-2xl text-white">
                  <BsArrowBarUp />
                </div>
                <div className="ml-2 flex h-full w-full flex-col justify-center rounded-lg px-1 text-sm">
                  <p className="mb-1 text-left text-base font-bold text-gray-900 dark:text-white">
                    New Update: Horizon UI Dashboard PRO
                  </p>
                  <p className="font-base text-left text-xs text-gray-900 dark:text-white">
                    A new update for your downloaded item is available!
                  </p>
                </div>
              </button>
            </div>
          }
          classNames={"py-2 top-4 -left-[230px] md:-left-[440px] w-max"}
        />
    
        <div
          className="cursor-pointer text-gray-600"
          onClick={() => {
            if (darkmode) {
              document.body.classList.remove("dark");
              setDarkmode(false);
            } else {
              document.body.classList.add("dark");
              setDarkmode(true);
            }
          }}
        >
        
        </div>
        {/* Profile & Dropdown */}
        <Dropdown
          button={
            <img
              className="h-9 w-9 rounded-full "
              src={avatar}
              alt="Elon Musk"
            />
          }
          children={
            <div className="flex w-56 flex-col justify-start rounded-[20px] bg-white bg-cover bg-no-repeat shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none">
              <div className="p-4">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-navy-700 dark:text-white">
                    👋 Hey, Adela
                  </p>{" "}
                </div>
              </div>
              <div className="h-px w-full bg-gray-200 dark:bg-white/20 " />

              <div className="flex flex-col p-4">
                <a
                  href=" "
                  className="text-sm text-gray-800 dark:text-white hover:dark:text-white"
                >
                  Profile Settings
                </a>
                <a
                  href=" "
                  className="mt-3 text-sm text-gray-800 dark:text-white hover:dark:text-white"
                >
                  Newsletter Settings
                </a>
                <a
                  href=" "
                  className="mt-3 text-sm font-medium text-red-500 hover:text-red-500 transition duration-150 ease-out hover:ease-in"
                >
                  Log Out
                </a>
              </div>
            </div>
          }
          classNames={"py-2 top-8 -left-[180px] w-max"}
        />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
