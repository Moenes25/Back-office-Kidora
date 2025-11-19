/* eslint-disable */

import { HiX } from "react-icons/hi";
import Links from "./components/Links";
import logo from "assets/img/logo/logo.jpg";

import SidebarCard from "components/sidebar/componentsrtl/SidebarCard";
import routes from "routes.js";

const Sidebar = ({ open, onClose }) => {
  return (
 <div
  className={`
    fixed !z-50 flex min-h-full flex-col
    bg-white dark:!bg-navy-800 dark:text-white
    pb-10 shadow-2xl shadow-white/5
    transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)]
    ${open ? "translate-x-0" : "-translate-x-96"}
  `}
>

      <span
        className="absolute top-4 right-4 block cursor-pointer xl:hidden"
        onClick={onClose}
      >
        <HiX />
      </span>
<div className="mx-[30px] mt-[10px] flex items-center gap-3">
  <img
    src="http://31.97.54.88:4200/assets/All_Logo.png"
    alt="Kidora Logo"
    className="w-20 h-20 object-contain"
  />

  <div className="font-poppins text-[22px] font-bold uppercase text-navy-700 leading-tight dark:text-white">
    KIDORA
    <br />
    <span className="text-[13px] font-medium">BACK OFFICE</span>
  </div>
</div>


      <div class="mt-[10px] mb-7 h-px bg-gray-300 dark:bg-white/30" />
      {/* Nav item */}

      <ul className="mb-auto pt-1">
        <Links routes={routes} />
      </ul>

      {/* Free Horizon Card */}
      <div className="flex justify-center">
        <SidebarCard />
      </div>

      {/* Nav item end */}
    </div>
  );
};

export default Sidebar;
