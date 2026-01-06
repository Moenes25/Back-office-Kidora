// src/components/navbar/components/SearchBar.jsx
import React, { useMemo, useRef, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { useGlobalSearch } from "search/useGlobalSearch";



import {
  MdHome,
  MdBusiness,
  MdCalendarToday,
  MdPayments,
  MdSupportAgent,
  MdPsychology,
  MdPerson,
} from "react-icons/md";

// Mappe tes URLs (href) du SEARCH_INDEX aux icônes utilisées dans routes
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
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-transparent text-indigo-600 font-semibold">
        {text.slice(idx, idx + q.length)}
      </mark>
      {text.slice(idx + q.length)}
    </>
  );
};

const SuggestList = ({ results, onPick, q }) => {
  if (!results?.length) return null;

  return (
    <div className="
      absolute left-0 right-0 top-[110%] z-50 overflow-hidden
      rounded-2xl border border-slate-200 bg-white backdrop-blur
      shadow-[0_20px_60px_rgba(2,6,23,.15)]
    ">
      <div className="max-h-[56vh] overflow-auto py-1">
        {results.map((r, i) => {
          const Icon = ICONS_BY_HREF[r.href];
          return (
            <button
              key={r.href + i}
              onClick={() => onPick(r.href)}
              className="
                w-full px-3 py-2.5 text-sm text-left
                hover:bg-slate-50 focus:bg-slate-50
                transition-colors flex items-center gap-3
              "
            >
              {/* Icône dans une pastille */}
              <span className="
                grid place-items-center shrink-0
                w-8 h-8 rounded-full border border-slate-200
                bg-white shadow-sm
              ">
                {Icon ? <Icon className="w-4.5 h-4.5 text-slate-600" /> : <FiSearch className="w-4.5 h-4.5 text-slate-500" />}
              </span>

              {/* Libellé + sous-ligne */}
              <span className="flex-1 min-w-0">
                <div className="font-medium text-slate-800 truncate">
                  {highlight(r.label, q)}
                </div>
                <div className="text-xs text-slate-500 truncate">{r.href}</div>
              </span>

              {/* “↵” pour indiquer entrer */}
              <span className="
                hidden sm:inline-flex items-center rounded-md border
                border-slate-200 bg-white px-1.5 py-0.5 text-[10px]
                text-slate-500 shadow-sm
              ">
                ↵
              </span>
            </button>
          );
        })}
      </div>

      {/* Footer du dropdown */}
      <div className="
        flex items-center justify-between gap-2 border-t border-slate-200
        bg-gradient-to-b from-white to-slate-50/60 px-3 py-2 text-[11px]
        text-slate-500
      ">
        <span>{results.length} résultat(s)</span>
        <span className="inline-flex items-center gap-1">
          <kbd className="rounded border border-slate-300 bg-white px-1">⌘</kbd>
          <kbd className="rounded border border-slate-300 bg-white px-1">K</kbd>
          <span>pour ouvrir</span>
        </span>
      </div>
    </div>
  );
};


const SearchBar = () => {
  const { search, go, open, setOpen } = useGlobalSearch();
  const [q, setQ] = useState("");
  const [focus, setFocus] = useState(false);
  const results = useMemo(() => (q ? search(q, 6) : []), [q, search]);
  const inputRef = useRef(null);

  // ENTER => aller au 1er résultat
  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      if (results[0]) go(results[0].href);
    } else if (e.key === "Escape") {
      setQ(""); inputRef.current?.blur();
    }
  };

  /* ===== Desktop ===== */
  return (
    <>
<div className=" xl:flex hidden items-center flex-1 h-full px-3 max-w-[400px] mr-2 overflow-hidden rounded-full bg-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_4px_14px_rgba(0,0,0,0.08)] dark:bg-slate-900 bg-slate-200 " > <FiSearch className="w-5 h-5 mr-2 text-slate-400 dark:text-slate-300" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search or type command… (⌘K)"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setTimeout(() => setFocus(false), 120)} // laisse le temps de cliquer une suggestion
          onKeyDown={onKeyDown}
        className=" w-full h-7 text-sm font-medium rounded-full bg-slate-200 dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-400 border-0 outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 focus-visible:ring-0 focus:border-transparent shadow-[inset_0_0_0_0_rgba(0,0,0,0)] "
        />
        {/* suggestions dessous */}
       {focus && q && <SuggestList results={results} onPick={go} q={q} />}

      </div>

      {/* ===== Mobile/⌘K Overlay ===== */}
      {open && (
        <div className="fixed inset-0 z-[1999] bg-black/40 backdrop-blur-sm flex items-start pt-20 px-4">
          <div className="relative w-full max-w-xl mx-auto rounded-2xl bg-white shadow-2xl border border-slate-200 p-4">
            <button className="absolute -right-3 -top-3 bg-slate-900 text-white rounded-full p-1.5 shadow"
                    onClick={() => setOpen(false)} aria-label="Fermer">
              <IoClose className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2">
              <FiSearch className="w-5 h-5 text-slate-400" />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Search pages…"
                className="flex-1 bg-transparent outline-none text-slate-800"
              />
            </div>

            <div className="mt-3 rounded-xl border border-slate-200 overflow-hidden">
              {(q ? results : []).map((r, i) => (
                <button
                  key={r.href + i}
                  onClick={() => go(r.href)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50"
                >
                  <div className="font-medium">{r.label}</div>
                  <div className="text-xs text-slate-500">{r.href}</div>
                </button>
              ))}
              {!results.length && q && (
                <div className="px-3 py-6 text-center text-sm text-slate-500">Aucun résultat</div>
              )}
            </div>
          </div>

          {/* clique dehors => fermer */}
          <div className="absolute inset-0" onClick={() => setOpen(false)} />
        </div>
      )}
    </>
  );
};

export default SearchBar;
