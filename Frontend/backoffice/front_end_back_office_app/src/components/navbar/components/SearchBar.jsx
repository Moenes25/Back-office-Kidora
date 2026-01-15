// src/components/navbar/components/SearchBar.jsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { useGlobalSearch } from "search/useGlobalSearch";
import {
  MdHome, MdBusiness, MdCalendarToday, MdPayments,
  MdSupportAgent, MdPsychology, MdPerson,
} from "react-icons/md";

const ICONS_BY_HREF = {
  "/admin/default": MdHome,
  "/admin/Entreprises": MdBusiness,
  "/admin/calendrier": MdCalendarToday,
  "/admin/paiements": MdPayments,
  "/admin/support": MdSupportAgent,
  "/admin/ia": MdPsychology,
  "/admin/profile": MdPerson,
};

const highlight = (text, q) => {
  if (!q) return text;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i === -1) return text;
  return (
    <>
      {text.slice(0, i)}
      <mark className="bg-transparent text-indigo-600 font-semibold">
        {text.slice(i, i + q.length)}
      </mark>
      {text.slice(i + q.length)}
    </>
  );
};

const SuggestList = ({ results, onPick, q }) => {
  if (!results?.length) return null;
  return (
    <div
      className="
        absolute left-0 right-0 top-[112%] z-50 overflow-hidden
        rounded-2xl border border-slate-200/70 bg-white/90 backdrop-blur-xl
        shadow-[0_24px_70px_rgba(2,6,23,.22)]
        dark:bg-slate-900/90 dark:border-white/10
      "
    >
      <div className="max-h-[58vh] overflow-auto py-1">
        {results.map((r, i) => {
          const Icon = ICONS_BY_HREF[r.href];
          return (
            <button
              key={r.href + i}
              onClick={() => onPick(r.href)}
              className="
                w-full px-3 py-2.5 text-sm text-left
                hover:bg-slate-50/80 dark:hover:bg-white/5
                transition-colors flex items-center gap-3
              "
            >
              <span className="grid place-items-center shrink-0 w-9 h-9 rounded-lg ring-1 ring-slate-200 dark:ring-white/10 bg-white dark:bg-slate-800 shadow-sm">
                {Icon ? (
                  <Icon className="w-4.5 h-4.5 text-slate-600 dark:text-slate-300" />
                ) : (
                  <FiSearch className="w-4.5 h-4.5 text-slate-500" />
                )}
              </span>

              <span className="flex-1 min-w-0">
                <div className="font-medium text-slate-800 dark:text-slate-100 truncate">
                  {highlight(r.label, q)}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {r.href}
                </div>
              </span>

              <span className="hidden sm:inline-flex items-center rounded-md border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-800/60 px-1.5 py-0.5 text-[10px] text-slate-500 dark:text-slate-300 shadow-sm">
                ↵
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-slate-200 dark:border-white/10 bg-gradient-to-b from-white/90 to-slate-50/60 dark:from-slate-900/90 dark:to-slate-900/70 px-3 py-2 text-[11px] text-slate-500 dark:text-slate-400">
        <span>{results.length} résultat(s)</span>
        <span className="inline-flex items-center gap-1">
          <kbd className="rounded border border-slate-300 dark:border-white/20 bg-white/80 dark:bg-slate-800 px-1">⌘</kbd>
          <kbd className="rounded border border-slate-300 dark:border-white/20 bg-white/80 dark:bg-slate-800 px-1">K</kbd>
          <span>pour ouvrir</span>
        </span>
      </div>
    </div>
  );
};

const shimmer =
  "linear-gradient(110deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.7) 25%, rgba(255,255,255,0) 60%)";

const SearchBar = () => {
  const { search, go, open, setOpen } = useGlobalSearch();
  const [q, setQ] = useState("");
  const [focus, setFocus] = useState(false);
  const inputRef = useRef(null);

  const results = useMemo(() => (q ? search(q, 8) : []), [q, search]);

  // ⌘K / Ctrl+K : open palette
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        setTimeout(() => inputRef.current?.focus(), 0);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setOpen]);

  const onKeyDown = (e) => {
    if (e.key === "Enter" && results[0]) go(results[0].href);
    if (e.key === "Escape") {
      setQ("");
      inputRef.current?.blur();
    }
  };

  return (
    <>
      {/* 1) BOUTON MOBILE (ouvre la palette) */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="
          xl:hidden inline-grid h-9 w-9 place-items-center
          rounded-lg ring-1 ring-slate-200 dark:ring-white/10
          bg-white/70 dark:bg-slate-900/70
          text-slate-600 dark:text-slate-300
        "
        aria-label="Recherche"
      >
        <FiSearch className="w-5 h-5" />
      </button>

          {/* Desktop search pill (expand au focus) */}
      <div
        className="
          hidden xl:flex items-center h-9
          rounded-full bg-slate-100/70 dark:bg-slate-900/70
          dark:ring-white/10
          px-3 gap-2 transition-all duration-300
          w-full max-w-[460px] focus-within:max-w-[620px]
          focus-within:ring-indigo-300/60 focus-within:shadow-[0_10px_30px_rgba(79,70,229,.25)]
          relative
           dark:[color-scheme:dark]
        "
      >
        <FiSearch className="w-5 h-5 text-slate-400 dark:text-slate-300" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search or type command… (⌘K)"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setTimeout(() => setFocus(false), 120)}
          onKeyDown={onKeyDown}
          className="
            w-full h-7 text-sm font-medium rounded-full bg-slate-200 dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-400 border-0 outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 focus-visible:ring-0 focus:border-transparent shadow-[inset_0_0_0_0_rgba(0,0,0,0)]
         appearance-none dark:[color-scheme:dark] "
        />

        {/* Shimmer léger au focus */}
        <span
          aria-hidden
           className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-[opacity] duration-300 dark:hidden"
          style={{ background: shimmer, opacity: focus ? 1 : 0 }}
        />

        {focus && q && <SuggestList results={results} onPick={go} q={q} />}
      </div>

      {/* 3) OVERLAY MOBILE (palette) */}
      {open && (
        <div className="fixed inset-0 z-[1999] bg-black/40 backdrop-blur-sm flex items-start pt-24 px-4">
          <div className="relative w-full max-w-xl mx-auto rounded-2xl bg-white dark:bg-slate-900 shadow-2xl ring-1 ring-slate-200 dark:ring-white/10 p-4">
            <button
              className="absolute -right-3 -top-3 bg-slate-900 text-white rounded-full p-1.5 shadow"
              onClick={() => setOpen(false)}
              aria-label="Fermer"
            >
              <IoClose className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 rounded-xl ring-1 ring-slate-200 dark:ring-white/10 px-3 py-2 bg-white/90 dark:bg-slate-900/80 backdrop-blur">
              <FiSearch className="w-5 h-5 text-slate-400" />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Search pages…"
                className="flex-1 bg-transparent outline-none text-slate-800 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="mt-3 rounded-xl ring-1 ring-slate-200 dark:ring-white/10 overflow-hidden">
              {(q ? results : []).map((r, i) => (
                <button
                  key={r.href + i}
                  onClick={() => go(r.href)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-white/5"
                >
                  <div className="font-medium text-slate-800 dark:text-slate-100">
                    {r.label}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {r.href}
                  </div>
                </button>
              ))}
              {!results.length && q && (
                <div className="px-3 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                  Aucun résultat
                </div>
              )}
            </div>
          </div>

          <div className="absolute inset-0" onClick={() => setOpen(false)} />
        </div>
      )}
    </>
  );
};

export default SearchBar;
