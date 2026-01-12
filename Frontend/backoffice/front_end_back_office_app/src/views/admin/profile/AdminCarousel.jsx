"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { FiUsers, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import api from "services/api";
import { useAuth } from "context/AuthContext";
import avatarFallback from "assets/img/avatars/avatar4.png";

export default function AdminCarousel() {
  const { user, loading: authLoading } = useAuth();
  const containerRef = useRef(null);
  const [admins, setAdmins] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchAdmins = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    const res =
      user.role === "SUPER_ADMIN"
        ? await api.get("/auth/all")
        : await api.get(`/auth/byRegion?region=${user.region}`);

    const list = res.data.map((a) => ({
      id: String(a.id),
      name: a.nom,
      role: a.role,
      avatar: a.imageUrl || avatarFallback,
      active: a.isActive,
    }));

    setAdmins(list);
    setActiveIndex(0);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const scrollToIndex = (index) => {
    const el = containerRef.current;
    if (!el) return;
    const target = el.children.item(index);
    if (!target) return;

    const scrollerStyle = getComputedStyle(el);
    const padLeft = parseInt(scrollerStyle.paddingLeft || "0", 10);

    el.scrollTo({
      left: target.offsetLeft - padLeft,
      behavior: "smooth",
    });
    setActiveIndex(index);
  };

  const canPrev = activeIndex > 0;
  const canNext = activeIndex < admins.length - 1;
  const centerFew = admins.length <= 2; // centrer quand peu d’items

  if (authLoading || loading) {
    return <div className="h-36 rounded-xl bg-slate-200 animate-pulse" />;
  }

  return (
    <section className="relative rounded-3xl bg-white p-4 border border-slate-200 shadow-sm overflow-visible dark:text-white dark:bg-navy-800 dark:border-navy-700">
      {/* HEADER */}
      <div className="mb-2 flex items-center gap-2">
        <FiUsers className="text-indigo-600" />
        <h4 className="text-sm font-extrabold text-slate-800 dark:text-white">Team Admins</h4>
        <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-700">
          {user.role === "SUPER_ADMIN" ? "All regions" : user.region}
        </span>
      </div>

      {/* CAROUSEL WRAPPER */}
      <div className="relative">
        {canPrev && (
          <button
            onClick={() => scrollToIndex(activeIndex - 1)}
            aria-label="Previous admin"
            className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white p-1.5 shadow ring-1 ring-slate-200 hover:ring-indigo-300 dark:text-white dark:bg-navy-600"
          >
            <FiChevronLeft />
          </button>
        )}
        {canNext && (
          <button
            onClick={() => scrollToIndex(activeIndex + 1)}
            aria-label="Next admin"
            className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white p-1.5 shadow ring-1 ring-slate-200 hover:ring-indigo-300 dark:text-white dark:bg-navy-600"
          >
            <FiChevronRight />
          </button>
        )}

        {/* anti-rognage: pas de marges négatives; on garde un vrai padding interner */}
        <div>
          <div
            ref={containerRef}
              className={`flex gap-3 overflow-x-auto overflow-y-visible scrollbar-none
              px-6 py-2 pb-3 snap-x snap-mandatory scroll-smooth overscroll-x-contain
             ${centerFew ? "justify-center" : "justify-start"}`}
            style={{ WebkitOverflowScrolling: "touch" }}
          >
                       {/* spacers optionnels pour que la 1re/dernière card aient de l'air */}
            <div className="shrink-0 w-1" aria-hidden />
            {admins.map((admin, i) => {
              const active = i === activeIndex;
              return (
                <motion.button
                  key={admin.id}
                  whileHover={{ scale: 1.02 }}  // <-- plus de y:-4
                  onClick={() => scrollToIndex(i)}
                  className={`w-32 flex-shrink-0 rounded-2xl p-3 cursor-pointer text-left transition-all duration-300 snap-start dark:text-white dark:bg-navy-800 bg-white ${
                    active
                      ? "ring-2 ring-indigo-500 shadow-lg"
                      : "ring-1 ring-slate-200 hover:ring-indigo-300"
                  }`}
                  aria-pressed={active}
                >
                  {/* avatar */}
                  <div className="relative mx-auto w-fit">
                    <img
                      src={admin.avatar}
                      alt={admin.name}
                      onError={(e) => {
                        e.currentTarget.src = avatarFallback;
                      }}
                      className="h-12 w-12 rounded-full object-cover ring-2 ring-white shadow"
                    />
                    <span
                      className={`absolute bottom-0 right-0 h-3 w-3 rounded-full ring-2 ring-white ${
                        admin.active ? "bg-emerald-500" : "bg-rose-500"
                      }`}
                      aria-label={admin.active ? "Online" : "Offline"}
                    />
                  </div>

                  {/* text */}
                  <div className="mt-3 text-center">
                    <p className="truncate text-sm font-semibold text-slate-800 dark:text-white">
                      {admin.name}
                    </p>
                    <span className="inline-block mt-1 rounded-full bg-slate-100 px-2 py-[2px] text-[10px] font-medium text-slate-600 dark:text-white dark:bg-navy-600 dark:border-navy-500">
                      {admin.role.replace("_", " ")}
                    </span>
                  </div>

                  {active && (
                    <div className="mx-auto mt-3 h-[3px] w-8 rounded-full bg-indigo-500" />
                  )}
                </motion.button>
              );
            })}
             <div className="shrink-0 w-1" aria-hidden />
          </div>
        </div>
      </div>

      {/* DOTS */}
      <div className="mt-1 flex justify-center gap-1.5">
        {admins.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToIndex(i)}
            aria-label={`Go to admin ${i + 1}`}
            className={`h-2 w-2 rounded-full transition ${
              i === activeIndex ? "bg-indigo-500" : "bg-slate-300"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
