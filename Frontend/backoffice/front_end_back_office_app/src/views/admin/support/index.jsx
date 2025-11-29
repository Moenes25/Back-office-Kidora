/* eslint-disable */
import React, { useMemo, useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import {
  FiSearch, FiFilter, FiDownload, FiPlus, FiMoreVertical,
  FiTrash2, FiCheckCircle, FiClock, FiArchive
} from "react-icons/fi";

/* -------------------- Demo data -------------------- */

const AGENTS = {
  "Jese Leos": "https://i.pravatar.cc/40?img=11",
  "Neil Simms": "https://i.pravatar.cc/40?img=12",
  "Roberta Casas": "https://i.pravatar.cc/40?img=13",
};
const MOCK = [
  { id: "#1846325", demandeur: "Mark Duan",     sujet: "Aide pour mon achat",              priorite: "Moyenne", agent: "Jese Leos",     date: "02 mars 2025", statut: "En attente" },
  { id: "#1846326", demandeur: "Donnie Gree",   sujet: "Support pour Flowbite",            priorite: "Haute",   agent: "Neil Simms",    date: "03 mars 2025", statut: "En attente" },
  { id: "#1846327", demandeur: "User123",       sujet: "Vérifier mon e-mail et mon compte",priorite: "Haute",   agent: "Roberta Casas", date: "03 mars 2025", statut: "En attente" },
  { id: "#1846328", demandeur: "Leslie L.",     sujet: "Nouveaux composants",              priorite: "Basse",   agent: "Roberta Casas", date: "07 mars 2025", statut: "Résolu" },
  { id: "#1846329", demandeur: "User123",       sujet: "Variants Figma manquants",         priorite: "Haute",   agent: "Jese Leos",     date: "07 mars 2025", statut: "En attente" },
  { id: "#1846330", demandeur: "Bergside LLC",  sujet: "Changer les couleurs",             priorite: "Moyenne", agent: "Roberta Casas", date: "08 mars 2025", statut: "Résolu" },
];
     // remplace tout le bloc "Afficher :"
const VUES = ["Tous", "En attente", "Résolu", "Archivé"];
/* -------------------- Tiny tilt hook (3D) -------------------- */
function useTilt(max = 10) {
  const ref = useRef(null);
  const onMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const rx = (py - 0.5) * -max;
    const ry = (px - 0.5) * max;
    el.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
  };
  const reset = () => {
    const el = ref.current;
    if (el) el.style.transform = "perspective(800px) rotateX(0) rotateY(0)";
  };
  return { ref, onMouseMove, onMouseLeave: reset };
}

/* -------------------- UI helpers -------------------- */


/* 2) Icône “ticket” pour le total */
function TicketIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6">
      <path
        d="M4 7a2 2 0 0 1 2-2h8.5a2 2 0 0 1 1.4.6l2.5 2.5a2 2 0 0 1 .6 1.4V11
           a2 2 0 0 0 0 4v1.5a2 2 0 0 1-.6 1.4l-2.5 2.5a2 2 0 0 1-1.4.6H6a2 2 0 0 1-2-2V16
           a2 2 0 0 0 0-4V7Z"
        fill="currentColor"
        opacity=".16"
      />
      <path
        d="M6 5h8.5a2 2 0 0 1 1.4.6l2.5 2.5a2 2 0 0 1 .6 1.4V11a2 2 0 0 0 0 4v1.5
           a2 2 0 0 1-.6 1.4l-2.5 2.5a2 2 0 0 1-1.4.6H6a2 2 0 0 1-2-2V16a2 2 0 0 0 0-4V7
           a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <circle cx="14" cy="9" r="0.9" fill="currentColor" />
      <circle cx="14" cy="12" r="0.9" fill="currentColor" />
      <circle cx="14" cy="15" r="0.9" fill="currentColor" />
    </svg>
  );
}

/* 3) Compteur animé */
function MotionNumber({ value, className }) {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, v => Math.round(v));
  React.useEffect(() => {
    const controls = animate(mv, value, { duration: 0.8, ease: "easeOut" });
    return () => controls.stop();
  }, [value]);
  return <motion.span className={className}>{rounded}</motion.span>;
}

/* 4) Nouveau KPI (plus haut, animations, shine & blob) */
const KPI = ({ title, value, icon, gradient }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -3, scale: 1.01 }}
    transition={{ type: "spring", stiffness: 260, damping: 20 }}
    className="relative overflow-hidden rounded-2xl border border-white/35 bg-white/65 shadow-[0_14px_48px_rgba(2,6,23,.12)] backdrop-blur-xl"
    style={{ minHeight: 120 }} // ↗️ plus haut
  >
    {/* gradient doux du fond */}
    <div className="absolute inset-0" style={{ background: gradient, opacity: 0.25 }} />

    {/* blob doux haut/droite */}
    <motion.div
      className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white"
      style={{ filter: "blur(20px)", opacity: 0.35 }}
      animate={{ y: [0, 6, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    />

    {/* ligne de shine qui balaye */}
    <motion.div
      className="pointer-events-none absolute -inset-y-10 -left-10 w-1/3 rotate-12 bg-white/30"
      style={{ filter: "blur(10px)" }}
      animate={{ x: ["-120%", "130%"] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
    />

    {/* contenu */}
    <div className="relative flex items-center gap-4 px-5 py-4">
      {/* pastille icône */}
      <motion.div
        whileHover={{ rotate: -6 }}
        className="grid h-12 w-12 place-items-center rounded-xl text-white shadow-lg ring-1 ring-white/40"
        style={{ background: gradient }}
      >
        {icon}
      </motion.div>

      <div className="min-w-0">
        <div className="flex items-baseline gap-2">
          <MotionNumber value={value} className="text-3xl font-extrabold tracking-tight text-slate-800" />
        </div>
        <div className="mt-0.5 text-xs font-medium text-slate-500">{title}</div>
      </div>
    </div>

    {/* bord lumineux subtil */}
    <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/55" />
  </motion.div>
);


const BadgePriorite = ({ p }) => {
  const map = {
    Haute:   "from-rose-400 to-rose-500 text-rose-900/90",
    Moyenne: "from-amber-300 to-amber-400 text-amber-900/90",
    Basse:   "from-sky-300 to-sky-400 text-sky-900/90",
  };
  return (
    <span className={[
      "relative inline-flex items-center rounded-full px-3 py-2 text-xs font-bold",
      "bg-gradient-to-br", map[p] || "from-gray-200 to-gray-300 text-gray-800",
      "shadow-xl"
    ].join(" ")}>
      <span className="absolute inset-0 rounded-full ring-1 ring-black/10" />
      {p}
    </span>
  );
};

const BadgeStatut = ({ s }) => {
  const map = {
    "En attente": { grad: "from-amber-200 to-amber-300", txt: "text-amber-900/90", icon: <FiClock/> },
    "Résolu":     { grad: "from-emerald-200 to-emerald-300", txt: "text-emerald-900/90", icon: <FiCheckCircle/> },
    "Archivé":    { grad: "from-slate-200 to-slate-300", txt: "text-slate-800/90", icon: <FiArchive/> },
  };
  const ui = map[s] || map["En attente"];
  return (
    <span className={[
      "relative inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold",
      "bg-gradient-to-br", ui.grad, ui.txt,
      "shadow-[inset_0_-1px_4px_rgba(255,255,255,.7),0_8px_18px_rgba(0,0,0,.08)]"
    ].join(" ")}>
      <span className="absolute -inset-px rounded-full ring-1 ring-black/10" />
      {ui.icon} {s}
    </span>
  );
};

/* -------------------- Page -------------------- */
export default function TicketsSupportFR_3D() {
  const [rows, setRows] = useState(MOCK);

  // tools
  const [q, setQ] = useState("");
  const [vue, setVue] = useState("Tous");
  const [openFilters, setOpenFilters] = useState(false);
  const [filters, setFilters] = useState({ priorite: "Tous", agent: "Tous" });

  const kpi = useMemo(() => {
    const total = rows.length;
    const pending = rows.filter(r => r.statut === "En attente").length;
    const solved = rows.filter(r => r.statut === "Résolu").length;
    const archived = rows.filter(r => r.statut === "Archivé").length;
    return { total, pending, solved, archived };
  }, [rows]);

  const filtered = useMemo(() => {
    let data = [...rows];
    if (vue !== "Tous") data = data.filter(r => r.statut === vue);
    if (filters.priorite !== "Tous") data = data.filter(r => r.priorite === filters.priorite);
    if (filters.agent !== "Tous") data = data.filter(r => r.agent === filters.agent);
    if (q.trim()) {
      const t = q.toLowerCase();
      data = data.filter(r =>
        r.id.toLowerCase().includes(t) ||
        r.demandeur.toLowerCase().includes(t) ||
        r.sujet.toLowerCase().includes(t) ||
        r.agent.toLowerCase().includes(t)
      );
    }
    return data;
  }, [rows, q, vue, filters]);
const PAGE_SIZE = 4;
const [page, setPage] = useState(1);

React.useEffect(() => { setPage(1); }, [q, vue, filters]); // reset quand on filtre/cherche

const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
const start = (page - 1) * PAGE_SIZE;
const pageRows = filtered.slice(start, start + PAGE_SIZE);

  /* ------- CSV ------- */
  const exportCSV = () => {
    const headers = ["ID","Demandeur","Sujet","Priorité","Agent","Date","Statut"];
    const csv = [headers, ...filtered.map(r => [r.id,r.demandeur,r.sujet,r.priorite,r.agent,r.date,r.statut])]
      .map(line => line.map(v => `"${String(v).replace(/"/g,'""')}"`).join(";")).join("\n");
    const blob = new Blob([`\uFEFF${csv}`], {type:"text/csv;charset=utf-8"});
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "tickets.csv"; a.click();
    URL.revokeObjectURL(a.href);
  };

  /* ------- Add ticket modal ------- */
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({demandeur:"", sujet:"", priorite:"Moyenne", agent:"Jese Leos", statut:"En attente"});
  const addTicket = (e) => {
    e.preventDefault();
    const next = {
      id: `#${Math.floor(100000 + Math.random()*900000)}`,
      date: new Date().toLocaleDateString("fr-FR", { day:"2-digit", month:"long", year:"numeric" }),
      ...form,
    };
    setRows(r => [next, ...r]); setShowAdd(false);
  };

  const setStatut = (i, s) => setRows(rs => rs.map((r,idx)=> idx===i ? {...r, statut:s} : r));
  const supprimer = (i) => setRows(rs => rs.filter((_,idx)=> idx!==i));

  return (
    <div className="relative overflow-x-hidden p-5">
    

      {/* KPIs */}
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
  <KPI
    title="Tickets au total"
    value={kpi.total}
    icon={<TicketIcon />}                             // ← icône remplacée
    gradient="linear-gradient(135deg,#6366f1,#06b6d4)" // bleu → cyan
  />
  <KPI
    title="En attente"
    value={kpi.pending}
    icon={<FiClock className="text-2xl" />}
    gradient="linear-gradient(135deg,#fb923c,#ef4444)" // orange → rose
  />
  <KPI
    title="Résolus"
    value={kpi.solved}
    icon={<FiCheckCircle className="text-2xl" />}
    gradient="linear-gradient(135deg,#10b981,#22d3ee)" // vert → cyan
  />
  <KPI
    title="Archivés"
    value={kpi.archived}
    icon={<FiArchive className="text-2xl" />}
    gradient="linear-gradient(135deg,#64748b,#94a3b8)" // gris bleuté
  />
</div>


      {/* Toolbar */}
      <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <div className="group flex items-center gap-2 rounded-2xl border border-white/20 bg-white/70 px-3 py-2 text-sm shadow-[0_10px_30px_rgba(2,6,23,.10)] backdrop-blur-xl">
            <FiSearch className="opacity-60" />
            <input
              value={q} onChange={(e)=>setQ(e.target.value)}
              placeholder="Rechercher un ticket"
              className="w-72 bg-transparent outline-none placeholder:text-gray-400"
            />
          </div>
          <button
            onClick={()=>setOpenFilters((v)=>!v)}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-gradient-to-r from-indigo-500/10 to-sky-400/10 px-3 py-2 text-sm font-semibold text-indigo-700 shadow-[0_10px_24px_rgba(2,6,23,.1)] backdrop-blur hover:from-indigo-500/20 hover:to-sky-400/20"
          >
            <FiFilter /> Filtres
          </button>
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-gradient-to-r from-emerald-500/10 to-teal-400/10 px-3 py-2 text-sm font-semibold text-emerald-700 shadow-[0_10px_24px_rgba(2,6,23,.1)] backdrop-blur hover:from-emerald-500/20 hover:to-teal-400/20"
          >
            <FiDownload /> Export CSV
          </button>
        </div>

        <button
          onClick={()=>setShowAdd(true)}
          className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-sky-600 px-4 py-2 text-sm font-extrabold text-white shadow-[0_16px_40px_rgba(37,99,235,.35)] hover:brightness-110"
        >
          <FiPlus /> Créer un ticket
        </button>
      </div>

      {/* Afficher: */}


<div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
  <span className="text-gray-600">Afficher&nbsp;:</span>
  {VUES.map((v) => (
    <label key={v} className="inline-flex cursor-pointer items-center gap-2">
      <input
        type="radio"
        name="vue"
        checked={vue === v}
        onChange={() => setVue(v)}
      />
      {v}
    </label>
  ))}
</div>


      {/* Drawer Filtres */}
      <AnimatePresence>
        {openFilters && (
          <motion.div
            initial={{opacity:0, y:-6, scale:0.98}}
            animate={{opacity:1, y:0, scale:1}}
            exit={{opacity:0, y:-6, scale:0.98}}
            className="mt-3 w-full max-w-xl rounded-2xl border border-white/30 bg-white/80 p-4 shadow-2xl backdrop-blur-xl"
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="text-sm">
                <div className="mb-1 text-xs text-gray-500">Priorité</div>
                <select className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm"
                        value={filters.priorite}
                        onChange={(e)=>setFilters(f=>({...f, priorite: e.target.value}))}>
                  {["Tous","Haute","Moyenne","Basse"].map((p)=> <option key={p}>{p}</option>)}
                </select>
              </label>
              <label className="text-sm">
                <div className="mb-1 text-xs text-gray-500">Agent</div>
                <select className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm"
                        value={filters.agent}
                        onChange={(e)=>setFilters(f=>({...f, agent: e.target.value}))}>
                  {["Tous", ...Object.keys(AGENTS)].map(a=> <option key={a}>{a}</option>)}
                </select>
              </label>
            </div>
            <div className="mt-3 flex items-center justify-end gap-2">
              <button onClick={()=>setFilters({priorite:"Tous", agent:"Tous"})}
                      className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold shadow-sm">Réinitialiser</button>
              <button onClick={()=>setOpenFilters(false)}
                      className="rounded-xl bg-indigo-600 px-3 py-2 text-sm font-bold text-white shadow">Appliquer</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tableau (cartes 3D par ligne) */}
      <div className="mt-4 overflow-x-auto rounded-2xl border border-white/30 bg-white/70 p-2 shadow-[0_30px_80px_rgba(2,6,23,.12)] backdrop-blur-xl">

  {/* -------- TABLE -------- */}
  <table className="uk-table w-full min-w-[980px] border-separate [border-spacing:0_12px] text-left">
          <thead  className="
      sticky top-0 z-10 bg-gray-100/90 backdrop-blur
      text-[11px] uppercase tracking-wide text-gray-700
      [&_th]:px-4 [&_th]:py-3 [&_th]:font-semibold
      [&_th:first-child]:rounded-l-xl [&_th:last-child]:rounded-r-xl
    ">
            <tr>
              {["ID","Demandeur","Sujet","Priorité","Agent","Date","Statut","Actions"].map((h)=>(
                <th key={h} className="px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="relative z-0 text-sm">
          {pageRows.map((r, idx) => {
  const absoluteIndex = start + idx; // index global dans rows
  return (
    <Row3D key={`${r.id}-${absoluteIndex}`}>
      <td className="px-4 py-4 font-mono text-xs text-gray-600">{r.id}</td>
      <td className="px-4 py-4">{r.demandeur}</td>
      <td className="px-4 py-4 text-slate-800">{r.sujet}</td>
      <td className="px-4 py-4"><BadgePriorite p={r.priorite} /></td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <img className="h-7 w-7 rounded-full shadow" src={AGENTS[r.agent]} alt={r.agent} />
          {r.agent}
        </div>
      </td>
      <td className="px-4 py-4 whitespace-nowrap">{r.date}</td>
      <td className="px-4 py-4"><BadgeStatut s={r.statut} /></td>
      <td className="px-4 py-4">
        <div className="flex items-center justify-end gap-1">
          <MenuActions
            onResolve={() => setStatut(absoluteIndex, "Résolu")}
            onArchive={() => setStatut(absoluteIndex, "Archivé")}
            onDelete={() => supprimer(absoluteIndex)}
          />
        </div>
      </td>
    </Row3D>
  );
})}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-sm text-gray-500">
                  Aucun ticket ne correspond aux filtres.
                </td>
              </tr>
            )}
          </tbody>
        </table>
         {/* -------- PAGINATION (frère du <table>) -------- */}
  <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-2 pb-2">
    <div className="text-xs text-gray-600">
      {filtered.length === 0
        ? "0 résultat"
        : `${start + 1}–${Math.min(start + PAGE_SIZE, filtered.length)} sur ${filtered.length} ticket(s)`}
    </div>

    <div className="flex items-center gap-1">
      <button onClick={()=>setPage(1)} disabled={page===1}
              className="h-9 w-9 rounded-lg border border-black/10 bg-white text-sm shadow-sm disabled:opacity-40">«</button>
      <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}
              className="h-9 w-9 rounded-lg border border-black/10 bg-white text-sm shadow-sm disabled:opacity-40">‹</button>

      {Array.from({length: Math.min(5, pageCount)}, (_,i) => {
        let startWin = Math.max(1, Math.min(page-2, pageCount-4));
        if (pageCount <= 5) startWin = 1;
        const n = startWin + i;
        return (
          <button key={n} onClick={()=>setPage(n)}
            className={[
              "h-9 w-9 rounded-lg border text-sm font-semibold shadow-sm",
              n===page ? "bg-indigo-600 text-white border-indigo-600" : "bg-white border-black/10"
            ].join(" ")}
          >{n}</button>
        );
      })}

      <button onClick={()=>setPage(p=>Math.min(pageCount,p+1))} disabled={page===pageCount}
              className="h-9 w-9 rounded-lg border border-black/10 bg-white text-sm shadow-sm disabled:opacity-40">›</button>
      <button onClick={()=>setPage(pageCount)} disabled={page===pageCount}
              className="h-9 w-9 rounded-lg border border-black/10 bg-white text-sm shadow-sm disabled:opacity-40">»</button>
    </div>
  </div>

      </div>

      {/* Modal Ajouter */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="fixed inset-0 z-50 grid place-items-center bg-black/35 p-4"
          >
            <motion.form
              initial={{y:20, scale:.98, opacity:0}}
              animate={{y:0, scale:1, opacity:1}}
              exit={{y:20, scale:.98, opacity:0}}
              onSubmit={addTicket}
              className="w-full max-w-3xl rounded-2xl border border-white/30 bg-white/90 p-5 shadow-[0_40px_120px_rgba(2,6,23,.35)] backdrop-blur-xl"
            >
              <div className="mb-4 text-lg font-extrabold text-slate-800">Ajouter un ticket</div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Demandeur">
                  <input required className="ukf" value={form.demandeur} onChange={e=>setForm(f=>({...f,demandeur:e.target.value}))}/>
                </Field>
                <Field label="Agent">
                  <select className="ukf" value={form.agent} onChange={e=>setForm(f=>({...f,agent:e.target.value}))}>
                    {Object.keys(AGENTS).map(a=> <option key={a}>{a}</option>)}
                  </select>
                </Field>
                <Field label="Sujet" span2>
                  <input required className="ukf" value={form.sujet} onChange={e=>setForm(f=>({...f,sujet:e.target.value}))}/>
                </Field>
                <Field label="Priorité">
                  <select className="ukf" value={form.priorite} onChange={e=>setForm(f=>({...f,priorite:e.target.value}))}>
                    {["Haute","Moyenne","Basse"].map(p=> <option key={p}>{p}</option>)}
                  </select>
                </Field>
                <Field label="Statut">
                  <select className="ukf" value={form.statut} onChange={e=>setForm(f=>({...f,statut:e.target.value}))}>
                    {["En attente","Résolu","Archivé"].map(s=> <option key={s}>{s}</option>)}
                  </select>
                </Field>
              </div>
              <div className="mt-4 flex items-center justify-end gap-2">
                <button type="button" onClick={()=>setShowAdd(false)}
                        className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold shadow-sm">Annuler</button>
                <button type="submit"
                        className="rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 px-4 py-2 text-sm font-bold text-white shadow">Ajouter</button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* style helpers */}
      <StyleOnce />
    </div>
  );
}

/* ---------- Row card with 3D tilt ---------- */
function Row3D({ children }) {
  const tilt = useTilt(6);
  return (
    <tr {...tilt} className="uk-row3d">
      {children}
    </tr>
  );
}



/* ---------- Simple field wrapper ---------- */
function Field({ label, span2, children }) {
  return (
    <label className={`text-sm ${span2 ? "sm:col-span-2" : ""}`}>
      <div className="mb-1 text-xs text-gray-500">{label}</div>
      {children}
    </label>
  );
}

/* ---------- Actions menu ---------- */
function MenuActions({ onResolve, onArchive, onDelete }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={()=>setOpen(o=>!o)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-black/10 bg-white text-slate-700 shadow-sm"
        title="Actions"
      >
        <FiMoreVertical />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{opacity:0, y:6, scale:.98}}
            animate={{opacity:1, y:0, scale:1}}
            exit={{opacity:0, y:6, scale:.98}}
            className="absolute right-0 mt-2 w-48 overflow-hidden rounded-2xl border border-white/30 bg-white/95 shadow-2xl backdrop-blur"
          >
            <button onClick={()=>{setOpen(false); onResolve?.();}}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50">
              <FiCheckCircle className="text-emerald-600" /> Marquer “résolu”
            </button>
            <button onClick={()=>{setOpen(false); onArchive?.();}}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50">
              <FiArchive className="text-slate-600" /> Archiver
            </button>
            <button onClick={()=>{setOpen(false); onDelete?.();}}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-rose-700 hover:bg-rose-50">
              <FiTrash2 /> Supprimer
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- tiny style injector for inputs ---------- */
function StyleOnce() {
  return (
    <style>{`
      .ukf { border-radius: 12px; border: 1px solid rgba(2,6,23,.1); padding: 10px 12px; background: #fff; box-shadow: 0 2px 8px rgba(2,6,23,.04) inset; width: 100%; }
      .ukf:focus { outline: none; box-shadow: 0 0 0 4px rgba(37,99,235,.18); }
      tbody tr > * { background: transparent; } /* évite le fond table par cellule */

      /* Ligne en carte : fond, ombre et coins arrondis */
.uk-row3d{ position: relative; transform-style: preserve-3d; }
.uk-row3d::before{

  content:"";
  position:absolute; inset:0 8px;           /* marge latérale entre les lignes */
  border-radius:16px;                        /* <-- le border-radius de TOUTE la ligne */
  background: linear-gradient(135deg,#fff,#f8fafc);
  border: 1px solid rgba(15,23,42,.06);
  box-shadow: 0 10px 26px rgba(2,6,23,.10);
  z-index:0;
  transition: transform .2s ease, box-shadow .2s ease;
}
.uk-row3d:hover::before{
  transform: translateY(-2px);
  box-shadow: 0 16px 38px rgba(2,6,23,.18);
}
/* Que le contenu reste au-dessus du décor */
.uk-row3d > *{ position: relative; z-index: 1; }
/* Laisse les cellules transparentes pour voir le fond de la ligne */
tbody tr > * { background: transparent; }
.uk-row3d{ position:relative; z-index:0; transform-style:preserve-3d; }
.uk-row3d.menu-open,
.uk-row3d:hover{ z-index:40; }           /* la ligne passe au-dessus des autres */
.uk-row3d::before{ pointer-events:none; } /* évite de bloquer les clics */


    `}</style>
  );
}
