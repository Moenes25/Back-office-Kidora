/* eslint-disable */

import { HiX } from "react-icons/hi";
import Links from "./components/Links";
import routes from "routes.js";

const Sidebar = ({ open, onClose }) => {
  return (
    <div
      className={[
        // 1) hauteur bornée + layout
        "fixed inset-y-0 !z-50 flex h-screen min-h-0 flex-col rounded-r-3xl",
        // largeur (corrige w-65)
        "w-64 max-w-full",
        // thèmes + transitions
        "bg-white dark:!bg-navy-800 dark:text-white",
        "pb-10 shadow-2xl shadow-white/5",
        "transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)]",
        open ? "translate-x-0" : "-translate-x-96",
      ].join(" ")}
    >
      {/* bouton close (mobile) */}
      <span
        className="absolute right-4 top-4 block cursor-pointer xl:hidden"
        onClick={onClose}
        aria-label="Close sidebar"
      >
        <HiX />
      </span>

      {/* header brand (ne doit pas grandir) */}
      <div className="shrink-0 px-6 pt-6">
        <div className="relative rounded-3xl bg-indigo-50/70 p-4 shadow-[0_10px_40px_rgba(99,102,241,.20)] ring-1 ring-indigo-200/70">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-3xl bg-white/30 mix-blend-overlay"
          />
          <img
            src="http://31.97.54.88:4200/assets/All_Logo.png"
            alt="Kidora Logo"
            className="relative mx-auto h-28 w-auto object-contain drop-shadow"
          />
        </div>
        <div className="mx-auto mt-3 h-2 w-14 rounded-full bg-indigo-300/50 shadow-[0_2px_12px_rgba(99,102,241,.35)]" />
      </div>

      {/* séparateur (ne doit pas grandir) */}
      <div className="mb-4 mt-3 h-px shrink-0 bg-indigo-100/80 dark:bg-white/20" />

      {/* 2) zone scrollable : flex-1 + min-h-0 + overflow-y-auto */}
      <div className="sidebar-scroll mx-4 min-h-0 flex-1 overflow-y-auto overscroll-contain pr-2">
        <ul className="mb-auto pt-1">
          <Links routes={routes} />
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
