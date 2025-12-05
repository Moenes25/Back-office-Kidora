/* eslint-disable */
import React from "react";
import { HiX, HiChevronLeft, HiChevronRight } from "react-icons/hi";
import Links from "./components/Links";
import routes from "routes.js";

const Sidebar = ({ open, collapsed = false, onClose, onToggleCollapsed }) => {
  return (
    <div
      className={[
        "fixed inset-y-0 !z-50 flex h-screen min-h-0 flex-col rounded-r-3xl ",
        collapsed ? "w-28" : "w-64",
        "max-w-full",
        "bg-white dark:!bg-navy-800 dark:text-white",
        "pb-10 shadow-2xl shadow-white/5",
        "transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)]",
        open ? "translate-x-0" : "-translate-x-96 xl:translate-x-0",
      ].join(" ")}
      data-collapsed={collapsed ? "true" : "false"}
    >

      {/* === BOUTON FLOTTANT OUVRIR/FERMER (desktop) === */}
      <button
        type="button"
        onClick={onToggleCollapsed}
        className={[
          "hidden xl:flex items-center justify-center",
          // collé à l’extrémité supérieure droite ; léger débord vers l’extérieur
          "absolute top-3 right-[-16px]",
            "h-7 w-7 rounded-full",
   // clair
   "bg-white text-slate-700 border border-black/10 shadow-lg hover:shadow-xl",
   "focus:outline-none focus:ring-2 focus:ring-indigo-400",
   // sombre
   "dark:bg-slate-800 dark:text-white dark:border-white/15",
   "dark:shadow-black/30 dark:hover:shadow-black/40",
   "dark:focus:ring-indigo-300",
        ].join(" ")}
        aria-label={collapsed ? "Ouvrir le sidebar" : "Réduire le sidebar"}
        aria-pressed={collapsed}
        title={collapsed ? "Ouvrir" : "Réduire"}
      >
        {collapsed ? <HiChevronRight /> : <HiChevronLeft />}
      </button>

      {/* bouton close (mobile) */}
      <span
       className="absolute top-4 right-4 block cursor-pointer xl:hidden  text-slate-700 dark:text-white"
        onClick={onClose}
        aria-label="Close sidebar"
      >
        <HiX />
      </span>

      {/* header brand (ne doit pas grandir) */}
      <div className={["shrink-0", collapsed ? "px-4 pt-5" : "px-6 pt-6"].join(" ")}>
      <div className={["relative rounded-3xl", 
          collapsed ? "p-3.5" : "p-5",
      // clair
      "bg-indigo-50/70 ring-1 ring-indigo-200/70 shadow-[0_10px_40px_rgba(99,102,241,.20)]",
       // sombre
       "dark:bg-white/5 dark:ring-white/10 dark:shadow-[0_10px_40px_rgba(2,6,23,.35)]"
       ].join(" ")}>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-3xl bg-white/30 dark:bg-white/10 mix-blend-overlay"
          />
          <img
            src="http://31.97.54.88:4200/assets/All_Logo.png"
            alt="Kidora Logo"
             className={["relative mx-auto w-full object-contain drop-shadow",collapsed ? "h-12 max-w-[110px]" : "h-18 max-w-[240px]"].join(" ")}/>
        </div>
         <div className="mx-auto mt-3 h-2 w-12 rounded-full bg-indigo-300/50 shadow-[0_2px_12px_rgba(99,102,241,.35)]" />

      </div>

      {/* séparateur */}
      <div className="mt-3 mb-4 h-px bg-indigo-100/80 dark:bg-white/20 shrink-0" />

      {/* zone scrollable */}
      <div className="sidebar-scroll ghost-scroll flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain px-1.5 pr-2 min-w-0 [scrollbar-gutter:stable] group">
        <ul className="mb-auto pt-1">
          <Links routes={routes} collapsed={collapsed} />
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
