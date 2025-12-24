"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "context/AuthContext";
import { FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";
import avatarFallback from "../../../assets/img/avatars/avatar4.png";

// Shadows
const SHADOW_MENU = "rgba(0, 0, 0, 0.56) 0px 22px 70px 4px";
const SHADOW_ITEM =
  "rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 56px";

// Récupère une base URL publique sans crasher selon l'env (CRA/Vite/Next)
const PUBLIC_BASE =
  (typeof window !== "undefined" && (
    import.meta?.env?.VITE_API_URL ||
    process.env?.REACT_APP_API_URL ||
    process.env?.NEXT_PUBLIC_API_URL
  )) || "";

const BASE_UPLOAD = PUBLIC_BASE && typeof PUBLIC_BASE.replace === "function"
  ? PUBLIC_BASE.replace("/api", "")
  : PUBLIC_BASE || "";

const ProfileDropdown = ({ className = "w-12 h-12" }) => {
  const { logout, user, token, updateUser } = useAuth();
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const popRef = useRef(null);

  const getImageUrl = () => {
    const raw = user?.imageUrl;
    const url = String(raw ?? ""); // cast string sûr
    if (url.startsWith("http")) return url;
    if (url && BASE_UPLOAD) return `${BASE_UPLOAD}/uploads/${url}`;
    return avatarFallback;
  };

  // Fetch user frais (évite la dépendance sur updateUser si non-stable)
  useEffect(() => {
    const fetchUser = async () => {
      if (!user?.id || !token) return;
      try {
        const res = await fetch(`${PUBLIC_BASE}/auth/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        // appel ok; si updateUser n'est pas stable, c'est pas grave ici
        updateUser?.(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
    // ❗️Ne pas inclure updateUser si sa ref n'est pas stable (évite re-fetch loop)
  }, [user?.id, token]);

  // click-outside + ESC
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e) => {
      if (
        popRef.current &&
        !popRef.current.contains(e.target) &&
        btnRef.current &&
        !btnRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    const onEsc = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  const menuVariants = {
    initial: { opacity: 0, y: -10, scale: 0.96, rotateX: -8, transformOrigin: "top right" },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: { duration: 0.2, type: "spring", stiffness: 260, damping: 20 },
    },
    exit: { opacity: 0, y: -8, scale: 0.98, transition: { duration: 0.12 } },
  };

  const listVariants = { animate: { transition: { staggerChildren: 0.05, delayChildren: 0.02 } } };
  const itemVariants = { initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 } };

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {/* Bouton avatar */}
      <button
        ref={btnRef}
        onClick={() => setOpen((v) => !v)}
        className="group w-full h-full overflow-hidden rounded-full ring-2 ring-white/70 dark:ring-white/10 shadow-md hover:shadow-xl transition-all focus:outline-none active:scale-[0.98]"
        style={{
          boxShadow:
            "rgba(0,0,0,0.2) 0px 8px 20px -6px, rgba(10,37,64,0.2) 0px 0px 0px 1px inset",
        }}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <motion.img
          src={getImageUrl()}
          alt={user?.nom || "User Avatar"}
          onError={(e) => {
            e.currentTarget.src = avatarFallback;
          }}
          className="h-full w-full object-cover"
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.2 }}
        />
        <span className="pointer-events-none absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-navy-800" />
      </button>

      {/* Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={popRef}
            role="menu"
            tabIndex={-1}
            variants={menuVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute right-0 top-11 z-50 w-72"
          >
            <div
              className="relative rounded-2xl p-[1px] bg-gradient-to-br from-white/40 via-violet-200/50 to-white/40 dark:bg-navy-800  dark:from-transparent dark:via-transparent dark:to-transparent
              backdrop-blur-xl dark:backdrop-blur-0"
              style={{ boxShadow: SHADOW_MENU }}
            >
              {/* caret */}
              <span className="absolute -top-2 right-6 h-4 w-4 rotate-45 rounded-sm bg-white/80 dark:bg-navy-700/80 backdrop-blur-md ring-1 ring-black/5 dark:ring-white/10" />

              {/* card */}
              <div className="overflow-hidden rounded-[15px] bg-white/90 dark:bg-navy-700/80 ring-1 ring-black/5 dark:ring-white/10">
                {/* header */}
                <div className="flex items-center gap-3 px-4 py-3 bg-white/80 dark:bg-navy-700/70 backdrop-blur-md">
                  <div className="h-9 w-9 overflow-hidden rounded-full ring-1 ring-black/5 dark:ring-white/10">
                    <img
                      src={getImageUrl()}
                      alt="avatar"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = avatarFallback;
                      }}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-gray-900 dark:text-white">
                      Hey, {user?.nom || "Guest"}
                    </p>
                    <p className="truncate text-xs text-gray-500 dark:text-gray-300">
                      {user?.email || "—"}
                    </p>
                  </div>
                </div>

                {/* actions */}
                <motion.ul variants={listVariants} animate="animate" className="px-2 py-2">
                  <motion.li variants={itemVariants} whileHover={{ y: -1 }} className="relative">
                    <a
                      href="/admin/profile"
                      className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] text-gray-800 dark:text-gray-100 transition"
                      style={{ boxShadow: "inset 0 0 0 0 rgba(0,0,0,0)" }}
                    >
                      <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300 ring-1 ring-indigo-200/60 dark:ring-white/10">
                        <FaUser />
                      </span>
                      <div className="flex-1">
                        <p className="font-semibold">Profile</p>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400">View and edit your info</p>
                      </div>
                      <span
                        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition group-hover:opacity-100"
                        style={{ background: "linear-gradient(120deg, transparent 0%, rgba(99,102,241,.07) 30%, transparent 60%)" }}
                      />
                    </a>
                  </motion.li>

                  <motion.li variants={itemVariants} whileHover={{ y: -1 }} className="relative">
                    <a
                      href="/admin/profile#settings"
                      className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] text-gray-800 dark:text-gray-100 transition"
                    >
                      <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300 ring-1 ring-emerald-200/60 dark:ring-white/10">
                        <FaCog />
                      </span>
                      <div className="flex-1">
                        <p className="font-semibold">Settings</p>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400">Preferences & security</p>
                      </div>
                      <span
                        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition group-hover:opacity-100"
                        style={{ background: "linear-gradient(120deg, transparent 0%, rgba(16,185,129,.08) 30%, transparent 60%)" }}
                      />
                    </a>
                  </motion.li>

                  <div className="my-1 mx-2 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent dark:via-white/10" />

                  <motion.li variants={itemVariants} whileHover={{ y: -1 }} className="relative">
                    <button
                      onClick={logout}
                      className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold text-red-600 dark:text-red-400 transition"
                      style={{ boxShadow: SHADOW_ITEM }}
                    >
                      <span className="grid h-8 w-8 place-items-center rounded-lg bg-red-50 text-red-500 dark:bg-red-500/15 dark:text-red-300 ring-1 ring-red-200/60 dark:ring-white/10">
                        <FaSignOutAlt />
                      </span>
                      Log out
                      <span
                        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition group-hover:opacity-100"
                        style={{ background: "linear-gradient(120deg, transparent 0%, rgba(239,68,68,.08) 30%, transparent 60%)" }}
                      />
                    </button>
                  </motion.li>
                </motion.ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileDropdown;
