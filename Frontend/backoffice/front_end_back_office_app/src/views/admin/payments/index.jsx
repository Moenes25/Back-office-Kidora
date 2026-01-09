/* eslint-disable */
import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiTrendingUp, FiCheckCircle, FiAlertTriangle, FiEye, FiSend, FiEdit2, FiTrash2  } from "react-icons/fi";
import { FiSearch, FiDownload } from "react-icons/fi";
import {
  FiDownloadCloud,
  FiFilter,
  FiMoreVertical,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";


import { FiUsers, FiActivity, FiStar } from "react-icons/fi"; 
import WidgetKids from "components/widget/Widget";
const CARD_BG = {
  total:  "#4f46e5", // indigo
  paid:   "#10b981", // emerald
  unpaid: "#f59e0b", // amber
  sent:   "#8b5cf6", // purple
};

const fmtMoney = (n) =>
  (Number(n) || 0).toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DT";

function computeTotals(lines = []) {
  const rows = lines.map(l => {
    const qty  = Number(l.qty)  || 0;
    const pu   = Number(l.puHT) || 0;
    const tvaP = Number(l.tva)  || 0;
    const ht   = qty * pu;
    const tva  = ht * (tvaP / 100);
    const ttc  = ht + tva;
    return { ...l, ht, tva, ttc };
  });
  const subHT = rows.reduce((s, r) => s + r.ht, 0);
  const subTVA= rows.reduce((s, r) => s + r.tva, 0);
  const total = subHT + subTVA;
  return { rows, subHT, subTVA, total };
}

/* --------------------------- Données démo --------------------------- */

const STATS = [
  { id: "total",  label: "Total des factures",   value: 582, icon: <FiTrendingUp className="text-2xl" /> },
  { id: "paid",   label: "Factures payées",      value: 346, icon: <FiCheckCircle className="text-2xl" /> },
  { id: "unpaid", label: "Factures impayées",    value: 236, icon: <FiAlertTriangle className="text-2xl" /> },
  { id: "sent",   label: "Factures envoyées",    value: 126, icon: <FiSend className="text-2xl" /> },
];


const PAYMENTS = [
  { id:"#F202401", date:"1 juin 2025, 08:22", avatarColor:"from-fuchsia-500 to-orange-400", client:"Crèche XYZ", type:"creche",  region:"Tunis",     email:"xyzstore@mail.com",    status:"Payée" },
  { id:"#F202402", date:"1 juin 2025, 09:10", avatarColor:"from-sky-500 to-cyan-400",       client:"Garderie Soleil", type:"garderie", region:"Ariana",   email:"davidocon@mail.com",    status:"impayée" },
  { id:"#F202403", date:"1 juin 2025, 10:05", avatarColor:"from-amber-400 to-red-400",      client:"École Horizon",   type:"ecole",   region:"Nabeul",   email:"juliaesteh@mail.com", status:"impayée" },
  { id:"#F202404", date:"2 juin 2025, 11:30", avatarColor:"from-emerald-400 to-teal-500",   client:"Garderie Power Kids", type:"garderie", region:"Sfax",  email:"powerkids@mail.com",  status:"Payée" },
  { id:"#F202405", date:"2 juin 2025, 14:12", avatarColor:"from-indigo-500 to-violet-500",  client:"Crèche Arc-en-ciel", type:"creche", region:"Sousse",  email:"jamesknown@mail.com", status:"impayée" },
  { id:"#F202406", date:"3 juin 2025, 09:18", avatarColor:"from-rose-500 to-orange-400",    client:"Kids Academy",    type:"ecole",   region:"Monastir",email:"rocklee@mail.com" ,   status :"impayée" },
  { id:"#F202407", date:"3 juin 2025, 11:00", avatarColor:"from-cyan-400 to-emerald-400",   client:"MiniMonde",       type:"creche",  region :"Ben Arous" ,email :"geovannyjr@mail.com" , status :"Payée" },
  { id:"#F202408", date:"4 juin 2025, 08:05", avatarColor:"from-amber-400 to-lime-400",     client:"Happy Kids",      type:"garderie",region:"Kairouan", email:"bellakids@mail.com", status:"impayée",
    lines: [
      { desc: "Nettoyage mensuel – bâtiment A", qty: 2, puHT: 120, tva: 19 },
      { desc: "Audit sécurité / RGPD",          qty: 1, puHT: 350, tva: 19 },
      { desc: "Remise commerciale",             qty: 1, puHT: -50,  tva: 0  },
    ]
  },
];


/* Badges visuels pour le type d’établissement */
const TYPE_META = {
  creche:   { label: "Crèche",   chip: "bg-purple-100 text-purple-700" },
  garderie: { label: "Garderie", chip: "bg-amber-100 text-amber-700" },
  ecole:    { label: "École",    chip: "bg-emerald-100 text-emerald-700" },
};
const TypeBadge = ({ type }) => {
  const t = TYPE_META[type] || { label: "—", chip: "bg-gray-100 text-gray-700" };
  return <span className={`px-2.5 py-1.5 rounded-full text-[11px] font-semibold shadow ${t.chip}`}>{t.label}</span>;
};


const STATUS_STYLES = {
  Payée: "bg-emerald-100 text-emerald-700",
  impayée: "bg-rose-100 text-rose-700", // meilleure visibilité
};



// "1 juin 2025, 08:22" -> Date
const FR_MONTHS = {
  janvier:0, février:1, fevrier:1, mars:2, avril:3, mai:4, juin:5,
  juillet:6, août:7, aout:7, septembre:8, octobre:9, novembre:10, décembre:11, decembre:11
};
function parseFrDate(s) {
  // ex: "1 juin 2025, 08:22"
  if (!s) return new Date(0);
  const m = s.toLowerCase().match(/(\d{1,2})\s+([a-zéèêûôîïàùç]+)\s+(\d{4}),\s*(\d{1,2}):(\d{2})/i);
  if (!m) return new Date(0);
  const [, d, mo, y, hh, mm] = m;
  const month = FR_MONTHS[mo] ?? 0;
  return new Date(Number(y), month, Number(d), Number(hh), Number(mm));
}
function PaymentsToolbar({ q, setQ, onToggleFilters, onExportCSV, onExportPDF, setEditRow }) {
  return (
   <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <label className="group flex items-center gap-2 rounded-2xl border border-white/20 bg-white/70 px-3 py-2 text-sm shadow-[0_10px_30px_rgba(2,6,23,.10)] backdrop-blur-xl dark:bg-navy-800 dark:text-white">
          <FiSearch className="opacity-60" />
          <input
            value={q}
            onChange={(e)=>setQ(e.target.value)}
            placeholder="Rechercher (id, établissement, email, abonnement, gouvernorat)…"
            className="w-72 bg-transparent outline-none placeholder:text-gray-400 dark:bg-navy-800 dark:text-white"
          />
        </label>

        {/* Filtres */}
        <button
          onClick={onToggleFilters}
          className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-gradient-to-r from-indigo-500/10 to-sky-400/10 px-3 py-2 text-sm font-semibold text-indigo-700 shadow-[0_10px_24px_rgba(2,6,23,.1)] backdrop-blur hover:from-indigo-500/20 hover:to-sky-400/20"
        >
          <FiFilter /> Filtres
        </button>

        {/* Exports */}
        <button
          onClick={onExportPDF}
          className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-gradient-to-r from-[#a78bfa]/10 to-[#8b5cf6]/10 px-3 py-2 text-sm font-semibold text-[#6d28d9] shadow-[0_10px_24px_rgba(2,6,23,.1)] backdrop-blur hover:from-[#a78bfa]/20 hover:to-[#8b5cf6]/20"
        >
          <FiDownload /> Export PDF
        </button>
        <button
          onClick={onExportCSV}
          className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-gradient-to-r from-emerald-500/10 to-teal-400/10 px-3 py-2 text-sm font-semibold text-emerald-700 shadow-[0_10px_24px_rgba(2,6,23,.1)] backdrop-blur hover:from-emerald-500/20 hover:to-teal-400/20"
        >
          <FiDownload /> Export CSV
        </button>
      </div>
      {/* 👉 Ajoute ce bouton ici pour qu’il s’aligne */}
  <div className="flex justify-end">
    <button
      onClick={() => setEditRow({})}
      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 px-4 py-2 text-sm font-bold text-white shadow hover:brightness-110"
    >
     Ajouter facture
    </button>
  </div>
    </div>
  );
}
function PaymentsFilterDrawer({
  open, onClose,
  statusFilter, setStatusFilter,
  sortKey, setSortKey,
  sortAsc, setSortAsc,
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{opacity:0, y:-6, scale:0.98}}
          animate={{opacity:1, y:0, scale:1}}
          exit={{opacity:0, y:-6, scale:0.98}}
          className="mt-3 w-full max-w-xl rounded-2xl border border-white/30 bg-white/80 p-4 shadow-2xl backdrop-blur-xl"
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {/* Statut */}
            <label className="text-sm">
              <div className="mb-1 text-xs text-gray-500">Statut</div>
              <select
                className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm"
                value={statusFilter}
                onChange={(e)=>setStatusFilter(e.target.value)}
              >
                <option value="Tous">Tous</option>
                <option value="Payée">Payée</option>
                <option value="impayée">impayée</option>
              </select>
            </label>

            {/* Tri */}
          <label className="text-sm">
  <div className="mb-1 text-xs text-gray-500">Trier par</div>
  <select
    className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm"
    value={sortKey}
    onChange={(e)=>setSortKey(e.target.value)}
  >
    <option value="id">ID</option>
    <option value="date">Date</option>
    <option value="client">Établissement</option> {/* ex-Client */}
    <option value="status">Statut</option>
    <option value="type">Type</option>
    <option value="region">Gouvernorat</option>

  </select>
</label>


            {/* Sens */}
            <label className="text-sm sm:col-span-2">
              <div className="mb-1 text-xs text-gray-500">Ordre</div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={()=>setSortAsc(true)}
                  className={`h-10 w-full rounded-xl border px-3 py-2 text-sm ${sortAsc ? "bg-indigo-600 text-white border-indigo-600" : "bg-white border-black/10"}`}
                >
                  Croissant ▲
                </button>
                <button
                  type="button"
                  onClick={()=>setSortAsc(false)}
                  className={`h-10 w-full rounded-xl border px-3 py-2 text-sm ${!sortAsc ? "bg-indigo-600 text-white border-indigo-600" : "bg-white border-black/10"}`}
                >
                  Décroissant ▼
                </button>
              </div>
            </label>
          </div>

          <div className="mt-3 flex items-center justify-end gap-2">
            <button
              onClick={()=>{
                setStatusFilter("Tous");
                setSortKey("date");
                setSortAsc(false);
              }}
              className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold shadow-sm"
            >
              Réinitialiser
            </button>
            <button
              onClick={onClose}
              className="rounded-xl bg-indigo-600 px-3 py-2 text-sm font-bold text-white shadow"
            >
              Appliquer
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


/* ------------------------------ UI ------------------------------ */
const StatCard = ({ stat, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.08 * index, type: "spring", stiffness: 120 }}
    >
      <WidgetKids
        variant="solid"
        size="sm"
        fx={false}                              // même sobriété que ta 1ère carte
        bg={CARD_BG[stat.id] || "#4f46e5"}      // fond plein
        icon={stat.icon /* ou ton meta.icon */}
        title={stat.label}
        value={stat.value}
        // format={(n)=>n.toLocaleString('fr-FR')} // si tu veux formatter
      />
    </motion.div>
  );
};




const StatusPill = ({ status }) => {
  const isPaid = String(status).toLowerCase() === "payée".toLowerCase();
  const cls = isPaid ? STATUS_STYLES["Payée"] : STATUS_STYLES["impayée"];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${cls}`}>
      {isPaid ? <FiCheckCircle /> : <FiAlertTriangle />}
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
};

const AvatarBubble = ({ name, color }) => {
  const initial = name?.[0] ?? "?";
  return (
    <div className="flex items-center gap-3">
      <div className={`h-9 w-9 rounded-full bg-gradient-to-br ${color} shadow-[0_10px_22px_rgba(15,23,42,.25)] grid place-items-center text-sm font-bold text-white`}>
        {initial}
      </div>
      <div className="leading-tight">
        <p className="text-sm font-semibold text-slate-800 dark:text-white">{name}</p>
      </div>
    </div>
  );
};
function useInView(ref, rootMargin = "0px") {
  const [inView, setInView] = React.useState(false);
  React.useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [ref, rootMargin]);
  return inView;
}
function IconBtnStylesOnce() {
  React.useEffect(() => {
    const id = "payments-icon-btn-css";
    if (document.getElementById(id)) return;
    const s = document.createElement("style");
    s.id = id;
    s.textContent = `
.icon-btn{
  display:inline-flex;align-items:center;justify-content:center;
  width:34px;height:34px;border-radius:8px;border:1px solid transparent;
  background:transparent;color:#334155;transition:background .15s,border-color .15s,color .15s,transform .15s;
}
.icon-btn:hover{ background:#f1f5f9; border-color:#e2e8f0; }
.icon-btn:active{ transform:translateY(1px); }
.icon-btn.danger{ color:#b91c1c; }
.icon-btn.danger:hover{ background:#fee2e2; border-color:#fecaca; }
`;
    document.head.appendChild(s);
  }, []);
  return null;
}

function AnimatedNumber({ value, duration = 800, format = (n)=>n.toLocaleString(), startOnView = true }) {
  const spanRef = React.useRef(null);
  const inView = useInView(spanRef, "0px");
  const [display, setDisplay] = React.useState(0);
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  React.useEffect(() => {
    if (startOnView && !inView) return;
    if (prefersReduced) { setDisplay(value); return; }

    let raf, start;
    const from = 0;
    const to = Number(value) || 0;
    const ease = (t) => 1 - Math.pow(1 - t, 3); // easeOutCubic

    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min(1, (ts - start) / duration);
      const curr = Math.round(from + (to - from) * ease(p));
      setDisplay(curr);
      if (p < 1) raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, duration, startOnView, inView, prefersReduced]);

  return <span ref={spanRef}>{format(display)}</span>;
}

function KPI({ title, value, icon, gradient }) {
  return (
    <div className="
      relative overflow-hidden rounded-2xl border border-white/50 bg-white/70 backdrop-blur-md
      shadow-[0_14px_48px_rgba(2,6,23,.12)] min-h-[110px]
    ">
      <div className="absolute inset-0 opacity-25" style={{ background: gradient }} />
      <div className="pointer-events-none absolute -top-6 -right-6 h-24 w-24 rounded-full bg-white/60 blur-2xl kpi-float" />
      <div className="pointer-events-none absolute -left-1/3 -top-1/2 h-[220%] w-1/3 rotate-[14deg] bg-white/40 blur-md kpi-shine" />
      <div className="relative z-10 flex items-center gap-3 p-4">
        <div
          className="grid h-12 w-12 place-items-center rounded-xl text-white shadow-lg ring-1 ring-white/50"
          style={{ background: gradient }}
        >
          {icon}
        </div>
        <div>
          <div className="text-3xl font-extrabold tracking-tight text-slate-900">
            <AnimatedNumber value={Number.isFinite(value) ? value : 0} />
          </div>
          <div className="mt-0.5 text-xs font-medium text-slate-600">{title}</div>
        </div>
      </div>
    </div>
  );
}

function KPIStyles() {
  return (
    <style>{`
      @keyframes kpiFloat { 0%{transform:translateY(0)} 50%{transform:translateY(6px)} 100%{transform:translateY(0)} }
      @keyframes kpiShine { 0%{transform:translateX(-40%)} 100%{transform:translateX(180%)} }
      .kpi-float{ animation: kpiFloat 4s ease-in-out infinite; }
      .kpi-shine{ animation: kpiShine 2.2s ease-in-out infinite; }
    `}</style>
  );
}

const STAT_META = {
  total:  { gradient: "linear-gradient(135deg,#6366f1,#06b6d4)", icon: <FiTrendingUp className="text-2xl" /> },
  paid:   { gradient: "linear-gradient(135deg,#10b981,#22d3ee)", icon: <FiCheckCircle className="text-2xl" /> },
  unpaid: { gradient: "linear-gradient(135deg,#f59e0b,#ef4444)", icon: <FiAlertTriangle className="text-2xl" /> },
  sent:   { gradient: "linear-gradient(135deg,#a78bfa,#06b6d4)", icon: <FiSend className="text-2xl" /> },
};
// --- Pagination helpers (style "Support") ---
function makePageWindow(curr, total, span = 1) {
  const pages = new Set([1, total]);
  for (let i = curr - span; i <= curr + span; i++) if (i >= 1 && i <= total) pages.add(i);
  const arr = [...pages].sort((a,b)=>a-b);
  const out = [];
  for (let i = 0; i < arr.length; i++) {
    out.push(arr[i]);
    if (i < arr.length - 1 && arr[i+1] !== arr[i] + 1) out.push("…");
  }
  return out;
}

function SupportPagination({ page, pageCount, total, onPage }) {
  const items = makePageWindow(page, pageCount, 1);
  return (
    <div className="ukp-wrap">
      <div className="ukp-info">
        Page <span className="font-semibold">{page}</span> / {pageCount} • {total} paiements
      </div>

      <div className="ukp-actions">
        <button className="pg-btn" onClick={() => onPage(1)} disabled={page === 1} aria-label="Première">
          «
        </button>
        <button className="pg-btn" onClick={() => onPage(Math.max(1, page - 1))} disabled={page === 1} aria-label="Précédent">
          <FiChevronLeft />
        </button>

        {items.map((it, i) =>
          it === "…" ? (
            <span key={`e${i}`} className="pg-ellipsis">…</span>
          ) : (
            <button
              key={it}
              onClick={() => onPage(it)}
              className={`pg-btn num ${it === page ? "active" : ""}`}
              aria-current={it === page ? "page" : undefined}
            >
              {it}
            </button>
          )
        )}

        <button className="pg-btn" onClick={() => onPage(Math.min(pageCount, page + 1))} disabled={page === pageCount} aria-label="Suivant">
          <FiChevronRight />
        </button>
        <button className="pg-btn" onClick={() => onPage(pageCount)} disabled={page === pageCount} aria-label="Dernière">
          »
        </button>
      </div>
    </div>
  );
}
const FactureModal = ({ row = {}, onClose, onSave }) => {

  const STATIC_CLIENTS = [
  {
    id: 1,
    nom: "Crèche XYZ",
    email: "xyz@mail.com",
    region: "Tunis",
    type: "creche",
  },
  {
    id: 2,
    nom: "École Horizon",
    email: "ecolehorizon@mail.com",
    region: "Nabeul",
    type: "ecole",
  },
  {
    id: 3,
    nom: "Garderie Soleil",
    email: "soleil@garderie.com",
    region: "Ariana",
    type: "garderie",
  },
];

  const [form, setForm] = useState({
    id: row.id || `#F${Date.now()}`,
    date: row.date || new Date().toLocaleString("fr-FR"),
    client: row.client || "",
    email: row.email || "",
    region: row.region || "",
    type: row.type || "creche",
    status: row.status || "impayée",
    abonnement: row.abonnement || "",
    avatarColor: row.avatarColor || "from-emerald-400 to-teal-500"
  });


const [clients] = useState(STATIC_CLIENTS);



const handleChange = (e) => {
  const { name, value } = e.target;

  if (name === "client") {
    const selectedClient = clients.find((c) => c.nom === value);
    if (selectedClient) {
      setForm((prev) => ({
        ...prev,
        client: selectedClient.nom,
        email: selectedClient.email,
        region: selectedClient.region,
        type: selectedClient.type,
      }));
    }
  } else {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
};


  const handleSubmit = () => {
    if (!form.client || !form.email) return alert("Champs obligatoires !");
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl border">
        <h3 className="text-lg font-bold mb-4">{row?.id ? "Modifier" : "Nouvelle"} facture</h3>

        <div className="space-y-3 text-sm">
     <select
  name="client"
  value={form.client}
  onChange={handleChange}
  className="w-full rounded-xl border p-2"
>
  <option value="">-- Sélectionnez un établissement --</option>
  {clients.map((c) => (
    <option key={c.id} value={c.nom}>
      {c.nom}
    </option>
  ))}
</select>

   <div className="flex gap-2">
         
            <select name="status" value={form.status} onChange={handleChange} className="w-full rounded-xl border p-2">
              <option value="Payée">Payée</option>
              <option value="impayée">Impayée</option>
            </select>
          </div>

        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-xl border px-3 py-1.5 text-sm">Annuler</button>
          <button onClick={handleSubmit} className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">Enregistrer</button>
        </div>
      </div>
    </div>
  );
};

/* ============================ Page ============================ */
export default function PaymentsPage() {
  /* --- états --- */
  const [viewRow, setViewRow] = useState(null);

  const [rows, setRows] = useState(PAYMENTS);
 const [search, setSearch] = useState("");
const [statusFilter, setStatusFilter] = useState("Tous");
const [openFilters, setOpenFilters] = useState(false);
const [sortKey, setSortKey] = useState("date");  // id | date | client | status
const [sortAsc, setSortAsc] = useState(false);   // par défaut: date récente en premier
  const [openRowMenu, setOpenRowMenu] = useState(null); // id de la ligne
  const [selected, setSelected] = useState(new Set());
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 4;
  const [editRow, setEditRow] = useState(null); // ajout ou édition

  /* --- refs pour fermer les menus au click extérieur --- */
  const filterRef = useRef(null);
  const menuRef = useRef(null);
  useEffect(() => {
       const onDocClick = (e) => {
      if (!filterRef.current?.contains(e.target)) setOpenFilters(false);
      // ferme les menus si on clique en dehors de tout élément marqué data-row-menu
      const insideRowMenu = e.target?.closest?.("[data-row-menu]");
      if (!insideRowMenu) setOpenRowMenu(null);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  /* --- dérivées --- */
 const filtered = useMemo(() => {
  const s = search.trim().toLowerCase();
  let arr = rows.filter((r) => {
    const okStatus = statusFilter === "Tous" ? true : r.status === statusFilter;
   const okSearch =
  !s ||
  r.id.toLowerCase().includes(s) ||
  r.client.toLowerCase().includes(s) ||
  r.email.toLowerCase().includes(s) ;

    return okStatus && okSearch;
  });

  // tri
  arr.sort((a, b) => {
    let A, B;
    switch (sortKey) {
      case "date":
        A = parseFrDate(a.date).getTime();
        B = parseFrDate(b.date).getTime();
        break;
      case "client":
        A = (a.client||"").toString().toLowerCase();
        B = (b.client||"").toString().toLowerCase();
        break;
      case "status":
        A = (a.status||"").toString().toLowerCase();
        B = (b.status||"").toString().toLowerCase();
        break;
     case "type":
        A = (a.type||"").toString().toLowerCase();
        B = (b.type||"").toString().toLowerCase();
        break;
    case "region":
        A = (a.region||"").toString().toLowerCase();
        B = (b.region||"").toString().toLowerCase();
        break;

      case "id":
      default:
        A = (a.id||"").toString().toLowerCase();
        B = (b.id||"").toString().toLowerCase();
    }
    if (A < B) return sortAsc ? -1 : 1;
    if (A > B) return sortAsc ? 1 : -1;
    return 0;
  });

  return arr;
}, [rows, statusFilter, search, sortKey, sortAsc]);


  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const pageRows = filtered.slice(start, start + PAGE_SIZE);

  /* --- handlers --- */
  const toggleSelect = (id) => {
    setSelected((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };
  const toggleSelectAll = (checked) => {
    if (checked) setSelected(new Set(pageRows.map((r) => r.id)));
    else setSelected(new Set());
  };

const exportCSV = () => {
 const header = ["id", "date", "etablissement", "type", "gouvernorat", "email",  "status"];
  const lines = [header.join(",")].concat(
    filtered.map((r) =>
      [r.id, r.date, `"${r.client}"`, TYPE_META[r.type]?.label || "", r.region || "", r.email, r.status]
        .map((v) => String(v ?? "").replace(/[\n\r]/g, " "))
        .join(",")
    )
  );
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "paiements.csv";
  a.click();
  URL.revokeObjectURL(url);
};


 const exportPDF = async (row, items = []) => {
  try {
    const { default: jsPDF } = await import("jspdf");
    const doc = new jsPDF({ unit: "pt", format: "a4" });

    const W = 595.28; // A4 width (pt)
    const H = 841.89; // A4 height (pt)
    const M = 56;     // margin
    let y = M;

    const line = (x1, y1, x2, y2) => { doc.setDrawColor(226); doc.line(x1,y1,x2,y2); };
    const title = (t, x, y) => { doc.setFontSize(18); doc.setFont(undefined, "bold"); doc.text(t, x, y); doc.setFont(undefined, "normal"); };

    // Header
    doc.setFillColor(99,102,241);
    doc.roundedRect(M, y-8, 36, 36, 8, 8, "F");
    title("Facture / Détails du paiement", M+48, y+8);
    doc.setFontSize(10); doc.setTextColor(100);
    doc.text(`Généré le ${new Date().toLocaleString("fr-FR")}`, M+48, y+24);
    doc.setTextColor(0);
    doc.setFontSize(10); doc.text("ID facture", W - M - 120, y);
    doc.setFontSize(14); doc.setFont(undefined, "bold");
    doc.text(row.id, W - M - 120, y+16);
    doc.setFont(undefined, "normal");
    y += 40;

    // Two cards
    const card = (x, w, titleText, kv) => {
      const h = 120;
      doc.setDrawColor(226);
      doc.roundedRect(x, y, w, h, 10, 10);
      doc.setFontSize(10); doc.setTextColor(100);
      doc.text(titleText.toUpperCase(), x+12, y+16);
      doc.setTextColor(0); doc.setFontSize(12);
      let yy = y+34;
      kv.forEach(s => { doc.text(s, x+12, yy); yy += 18; });
      return h;
    };
    const colW = (W - 2*M - 16) / 2;
    const h1 = card(M, colW, "Établissement", [
      row.client || "—",
      row.email || "—",
      `Gouvernorat : ${row.region || "—"}`,
      `Type : ${TYPE_META[row.type]?.label || "—"}`
    ]);
    const h2 = card(M+colW+16, colW, "Détails", [
      `Date : ${row.date}`,
      `Statut : ${row.status}`
    ]);
    y += Math.max(h1,h2) + 24;

    // Table (items simulés si vide)
    const col = [180, 60, 70, 60, 60]; // Désignation, Qté, PU HT, TVA, Total HT
    const x = [M, M+col[0], M+col[0]+col[1], M+col[0]+col[1]+col[2], M+col[0]+col[1]+col[2]+col[3]];
    doc.setFontSize(10); doc.setTextColor(100);
    doc.text("Désignation", x[0], y);
    doc.text("Qté",         x[1], y);
    doc.text("PU HT",       x[2], y);
    doc.text("TVA",         x[3], y);
    doc.text("Total HT",    x[4], y);
    doc.setTextColor(0);
    line(M, y+6, W-M, y+6);
    y += 22;

    const rows = items.length ? items : [{
      designation: row.abonnement, qte: 1, pu: 0, tva: 0
    }];

    let sub = 0, vat = 0;
    doc.setFontSize(11);
    rows.forEach((it) => {
      const ht = it.qte * it.pu;
      const tv = ht * (it.tva/100);
      sub += ht; vat += tv;

      doc.text(String(it.designation || "—"), x[0], y);
      doc.text(String(it.qte ?? 0),           x[1], y);
      doc.text((it.pu   ?? 0).toFixed(2)+" DT", x[2], y, { align:"left" });
      doc.text((it.tva  ?? 0)+"%",              x[3], y, { align:"left" });
      doc.text(ht.toFixed(2)+" DT",             x[4], y, { align:"left" });
      y += 18;
    });

    // Totaux
    y += 8; line(M, y, W-M, y); y += 18;
    const right = W - M;
    const txt = (label, value) => { doc.setFontSize(11); doc.text(label, right-160, y); doc.text(value, right, y, { align:"right" }); y += 18; };
    txt("Sous-total HT", sub.toFixed(2)+" DT");
    txt("TVA",            vat.toFixed(2)+" DT");
    doc.setFont(undefined,"bold");
    txt("Total TTC",     (sub+vat).toFixed(2)+" DT");
    doc.setFont(undefined,"normal");

    // Footer
    doc.setFontSize(9); doc.setTextColor(120);
    doc.text("Kidora • Paiements", M, H-M);
    doc.text(`ID: ${row.id}`, right, H-M, { align:"right" });

    doc.save(`${row.id}.pdf`);
  } catch {
    alert("jspdf n'est pas installé. Ajoute-le avec: npm i jspdf");
  }
};


const onRowAction = (id, action) => {
  setOpenRowMenu(null);
  if (action === "view") {
    const row = rows.find(r => r.id === id);
    setViewRow(row || null);
    return;
  }
  if (action === "Envoyer") alert(`Envoyer ${id}`);
  if (action === "delete") {
    setRows((r) => r.filter((x) => x.id !== id));
    setSelected((s) => {
      const n = new Set(s);
      n.delete(id);
      return n;
    });
  }
};


  /* ------------------------------ RENDER ------------------------------ */
  return (
    <div className="space-y-6">
              {/* Stat cards */}
              <IconBtnStylesOnce />

<KPIStyles />
<PaginationStylesOnce /> 
<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
  {STATS.map((s, i) => <StatCard key={s.id} stat={s} index={i} />)}
</div>


      {/* Header */}
      {/* TOOLBAR */}

<div ref={filterRef} className="relative">
  <PaymentsToolbar
    q={search}
    setQ={(v)=>{ setSearch(v); setPage(1); }}
    onToggleFilters={()=>setOpenFilters(v=>!v)}
    onExportCSV={exportCSV}
    onExportPDF={exportPDF}
    setEditRow={setEditRow}
  />

  <PaymentsFilterDrawer
    open={openFilters}
    onClose={()=>setOpenFilters(false)}
    statusFilter={statusFilter} setStatusFilter={setStatusFilter}
    sortKey={sortKey} setSortKey={setSortKey}
    sortAsc={sortAsc} setSortAsc={setSortAsc}
  />

</div>



      {/* Stat cards */}


      {/* Liste paiements */}
      <div className="rounded-3xl border border-slate-100 bg-white shadow-[0_18px_48px_rgba(15,23,42,.10)] overflow-visible dark:text-white dark:bg-navy-800 ">

        {/* Top bar */}
        <div className="flex items-center rounded-3xl justify-between gap-4 border-b border-slate-100
  px-5 py-4
  bg-gradient-to-r from-slate-50 via-white to-slate-50
  dark:border-white/10
  dark:bg-none dark:bg-navy-800
  dark:text-white">
         <div className="px-5 ">
  <p className="text-sm font-semibold text-slate-800 dark:text-white">Historique des paiements</p>
  <p className="text-[11px] text-slate-400 dark:text-white">Liste des factures clients, services rendus, statut & tri avancé.</p>
</div>


         
        </div>

        {/* Tableau */}
        <div className="relative overflow-x-auto overflow-visible dark:text-white dark:bg-navy-800 ">

          <table className="no-ukp min-w-full text-sm border-separate [border-spacing:0_8px]  dark:text-white dark:bg-navy-800 dark:shadow-none">
          <thead>
  <tr className="bg-slate-50/60 text-xs uppercase text-slate-400 dark:text-white dark:bg-navy-700/90 ">
   
    <th className="px-3 py-3 text-left font-semibold hidden dark:text-white dark:bg-navy-700/90 ">ID facture</th>
    <th className="px-3 py-3 text-left font-semibold dark:text-white dark:bg-navy-700/90 ">Date</th>
    <th className="px-3 py-3 text-left font-semibold dark:text-white dark:bg-navy-700/90 ">Établissement</th> {/* ex-Client */}
    <th className="px-3 py-3 text-left font-semibold dark:text-white dark:bg-navy-700/90 ">Type</th>
    <th className="px-3 py-3 text-left font-semibold dark:text-white dark:bg-navy-700/90 ">Gouvernorat</th>
    <th className="px-3 py-3 text-left font-semibold dark:text-white dark:bg-navy-700/90 ">Email</th>
    <th className="px-3 py-3 text-left font-semibold dark:text-white dark:bg-navy-700/90 ">Statut</th>
    <th className="px-3 py-3 text-right font-semibold dark:text-white dark:bg-navy-700/90 ">Actions</th>
  </tr>
</thead>

<tbody >
  {pageRows.map((row, idx) => (
    <motion.tr
      key={row.id}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.03 * idx }}
      transitionEnd={{ transform: "none" }}
      className={`transition hover:bg-slate-50/70 dark:text-white dark:bg-navy-800  relative ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/40"} ${openRowMenu === row.id ? "z-[60]" : ""}`}
      style={openRowMenu === row.id ? { transform: "none" } : undefined}
    >
   

      <td className="px-3 py-3 text-xs font-mono text-slate-500 hidden dark:text-white dark:bg-navy-800">{row.id}</td>
      <td className="px-3 py-3 text-xs text-slate-500 dark:text-white dark:bg-navy-800">{row.date}</td>

      {/* Établissement (avatar + sous-ligne “Responsable facturation” peut rester) */}
      <td className="px-3 py-3 dark:text-white dark:bg-navy-800 ">
        <AvatarBubble name={row.client} color={row.avatarColor} />
      </td>

      {/* Type d’établissement */}
      <td className="px-3 py-3 dark:text-white dark:bg-navy-800 ">
        <TypeBadge type={row.type} />
      </td>

      {/* Gouvernorat */}
      <td className="px-3 py-3 text-xs text-slate-600 dark:text-white dark:bg-navy-800 ">{row.region}</td>

      <td className="px-3 py-3 text-xs text-slate-500 dark:text-white dark:bg-navy-800 ">{row.email}</td>

      <td className="px-3 py-3 dark:text-white dark:bg-navy-800 "><StatusPill status={row.status} /></td>

    <td className="px-3 py-3 text-right dark:text-white dark:bg-navy-800 ">
  <div className="inline-flex items-center gap-1.5">
    <button
      className="icon-btn dark:text-white"
      title="Voir"
      onClick={() => onRowAction(row.id, "view")}
      aria-label="Voir"
    >
      <FiEye />
    </button>

    <button
      className="icon-btn dark:text-white"
      title="Modifier"
      onClick={() => setEditRow(row)}
      aria-label="Modifier"
    >
      <FiEdit2 />
    </button>

    <button
      className="icon-btn dark:text-white"
      title="Envoyer"
      onClick={() => onRowAction(row.id, "send")}
      aria-label="Envoyer"
    >
      <FiSend />
    </button>

    <button
      className="icon-btn dark:text-white"
      title="Exporter PDF"
      onClick={() => exportPDF(row)}
      aria-label="Exporter PDF"
    >
      <FiDownload />
    </button>

    <button
      className="icon-btn danger dark:text-white"
      title="Supprimer"
      onClick={() => onRowAction(row.id, "delete")}
      aria-label="Supprimer"
    >
      <FiTrash2 />
    </button>
  </div>
</td>

    </motion.tr>
  ))}

  {pageRows.length === 0 && (
    <tr>
      <td colSpan={10} className="px-5 py-8 text-center text-[12px] text-slate-400">Aucun résultat.</td>
    </tr>
  )}
</tbody>

          </table>
        </div>

      {/* Footer pagination (style Support) */}
<SupportPagination
  page={page}
  pageCount={pageCount}
  total={filtered.length}
  onPage={(n) => setPage(n)}
/>

      </div>


      {viewRow && (
  <PaymentDetailModal
    row={viewRow}
    onClose={() => setViewRow(null)}
  />
  
)}
{editRow && (
  <FactureModal
    row={editRow}
    onClose={() => setEditRow(null)}
    onSave={(newRow) => {
      setRows((prev) => {
        const exists = prev.find((r) => r.id === newRow.id);
        return exists
          ? prev.map((r) => (r.id === newRow.id ? newRow : r))
          : [...prev, newRow];
      });
    }}
  />
)}


    </div>
  );
}
function PaginationStylesOnce() {
  React.useEffect(() => {
    const ID = "support-pagination-css";
    if (document.getElementById(ID)) return;
    const s = document.createElement("style");
    s.id = ID;
    s.textContent = `
.ukp-wrap{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 16px;margin-top:4px}
.ukp-info{font:700 12px/1.2 ui-sans-serif;color:#64748b}
.ukp-actions{display:flex;align-items:center;gap:6px}
.pg-btn{
  min-width:36px;height:36px;padding:0 10px;display:inline-flex;align-items:center;justify-content:center;
  border-radius:12px;border:1px solid rgba(2,6,23,.10);
  background:linear-gradient(180deg,#fff,#f6f7fb);
  font:800 13px ui-sans-serif;box-shadow:0 1px 0 rgba(0,0,0,.05),0 10px 18px rgba(2,6,23,.10);
  transition:transform .15s cubic-bezier(.2,.8,.2,1),box-shadow .2s,background .2s
}
.pg-btn:hover{transform:translateY(-1px);box-shadow:0 8px 24px rgba(2,6,23,.12)}
.pg-btn:disabled{opacity:.45;transform:none;box-shadow:none;cursor:not-allowed}
.pg-btn.num.active{
  color:#fff;border-color:transparent;background:linear-gradient(135deg,#4f46e5,#06b6d4);
  box-shadow:0 10px 24px rgba(79,70,229,.35)
}
.pg-ellipsis{min-width:36px;height:36px;display:inline-grid;place-items:center;font:800 13px ui-sans-serif;color:#94a3b8}
.pg-btn:focus-visible{outline:none;box-shadow:0 8px 24px rgba(2,6,23,.12),0 0 0 4px rgba(99,102,241,.18)}

/* ------- DARK MODE ------- */
.dark .ukp-info{color:#cbd5e1}
.dark .pg-btn{
  color:#e2e8f0;
  border-color:rgba(255,255,255,.08);
  background:linear-gradient(180deg,#0b1220,#0f1b2d); /* navy */
  box-shadow:0 1px 0 rgba(0,0,0,.6),0 10px 18px rgba(0,0,0,.45);
}
.dark .pg-btn:hover{transform:translateY(-1px);box-shadow:0 8px 24px rgba(0,0,0,.6)}
.dark .pg-btn.num.active{
  color:#fff;border-color:transparent;
  background:linear-gradient(135deg,#2563eb,#06b6d4);
  box-shadow:0 10px 24px rgba(2,132,199,.35)
}
.dark .pg-ellipsis{color:#64748b}
`;
    document.head.appendChild(s);
  }, []);
  return null;
}

function PaymentDetailModal({ row, onClose }) {
  // fallback si pas de lignes
  const lines = Array.isArray(row?.lines) && row.lines.length
    ? row.lines
    : [{ desc: row.abonnement || "Abonnement", qty: 1, puHT: 0, tva: 0 }];

  const { rows: calcRows, subHT, subTVA, total } = computeTotals(lines);

  // --- Impression HTML propre ---
  const printInvoice = () => {
    const w = window.open("", "_blank");
    if (!w) return;

    const styles = `
      <style>
        *{box-sizing:border-box}
        body{font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;color:#0f172a;margin:0;background:#f8fafc}
        .sheet{max-width:820px;margin:24px auto;background:#fff;border-radius:16px;padding:28px;box-shadow:0 18px 48px rgba(15,23,42,.12)}
        .header{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px}
        .brand{display:flex;align-items:center;gap:12px}
        .logo{width:42px;height:42px;border-radius:10px;background:linear-gradient(135deg,#6366f1,#06b6d4)}
        h1{font-size:18px;margin:0}
        .muted{color:#64748b;font-size:12px}
        .grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:10px}
        .card{border:1px solid #e2e8f0;border-radius:12px;padding:12px}
        .card h3{font-size:12px;color:#64748b;margin:0 0 8px 0;text-transform:uppercase;letter-spacing:.04em}
        .kv{font-size:14px;margin:4px 0}
        table{width:100%;border-collapse:collapse;margin-top:16px}
        th,td{padding:10px;border-bottom:1px solid #e2e8f0;font-size:13px;text-align:left}
        tfoot td{font-weight:800}
        .right{text-align:right}
        .totals{margin-top:10px}
      </style>
    `;

    const rowsHtml = calcRows.map(r => `
      <tr>
        <td>${r.desc}</td>
        <td class="right">${r.qty}</td>
        <td class="right">${fmtMoney(r.puHT)}</td>
        <td class="right">${r.tva}%</td>
        <td class="right">${fmtMoney(r.ht)}</td>
        <td class="right">${fmtMoney(r.ttc)}</td>
      </tr>
    `).join("");

    const html = `
      <div class="sheet">
        <div class="header">
          <div class="brand">
            <div class="logo"></div>
            <div>
              <h1>Facture / Détails du paiement</h1>
              <div class="muted">Généré le ${new Date().toLocaleString("fr-FR")}</div>
            </div>
          </div>
          <div style="text-align:right">
            <div class="muted">ID facture</div>
            <div style="font-weight:800">${row.id}</div>
          </div>
        </div>

        <div class="grid">
          <div class="card">
            <h3>Établissement</h3>
            <div class="kv"><strong>${row.client}</strong></div>
            <div class="kv">${row.email || ""}</div>
            <div class="kv">Gouvernorat : ${row.region || "—"}</div>
            <div class="kv">Type : ${TYPE_META[row.type]?.label || "—"}</div>
          </div>
          <div class="card">
            <h3>Détails</h3>
            <div class="kv">Date : ${row.date}</div>
            <div class="kv">Statut : ${row.status}</div>
          </div>
        </div>

        <table class="lines">
          <thead>
            <tr>
              <th>Désignation</th>
              <th class="right">Qté</th>
              <th class="right">PU HT</th>
              <th class="right">TVA</th>
              <th class="right">Total HT</th>
              <th class="right">Total TTC</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="4" class="right">Sous-total HT</td>
              <td class="right">${fmtMoney(subHT)}</td>
              <td></td>
            </tr>
            <tr>
              <td colspan="4" class="right">TVA</td>
              <td class="right">${fmtMoney(subTVA)}</td>
              <td></td>
            </tr>
            <tr>
              <td colspan="4" class="right">Total TTC</td>
              <td class="right">${fmtMoney(total)}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
      <script>window.print(); setTimeout(()=>window.close(), 400);<\/script>
    `;

    w.document.write(`<html><head><title>${row.id}</title>${styles}</head><body>${html}</body></html>`);
    w.document.close();
  };

  // --- Export PDF (jsPDF) ---
  const exportPDF = async () => {
    try {
      const { default: jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const left = 40, right = 555;
      let y = 56;

      // Logo + titre
      doc.setFillColor(99,102,241);
      doc.roundedRect(left, 40, 36, 36, 6, 6, "F");
      doc.setFontSize(16);
      doc.text("Facture / Détails du paiement", left + 56, y);
      doc.setFontSize(10); doc.setTextColor(100);
      doc.text(`Généré le ${new Date().toLocaleString("fr-FR")}`, left + 56, y += 16);
      doc.setTextColor(0);
      doc.setFontSize(10); doc.text("ID facture", right - 80, 50);
      doc.setFontSize(14); doc.setFont(undefined, "bold"); doc.text(row.id, right - 80, 66);
      doc.setFont(undefined, "normal");

      // Cartes
      const card = (x, y, w, h, title) => {
        doc.setDrawColor(226); doc.roundedRect(x, y, w, h, 10, 10);
        doc.setFontSize(10); doc.setTextColor(100); doc.text(title.toUpperCase(), x + 12, y + 16);
        doc.setTextColor(0);
      };
      card(left, 96, 250, 120, "Établissement");
      doc.setFontSize(12); doc.setFont(undefined, "bold"); doc.text(row.client || "", left + 12, 118);
      doc.setFont(undefined, "normal"); doc.setFontSize(11);
      doc.text(row.email || "", left + 12, 136);
      doc.text(`Gouvernorat : ${row.region || "—"}`, left + 12, 154);
      doc.text(`Type : ${TYPE_META[row.type]?.label || "—"}`, left + 12, 172);

      card(left + 270, 96, 250, 120, "Détails");
      doc.setFontSize(11);
      doc.text(`Date : ${row.date}`, left + 282, 118);
      doc.text(`Abonnement : ${row.abonnement || "—"}`, left + 282, 136);
      doc.text(`Statut : ${row.status}`, left + 282, 154);

      // Table lignes
      y = 240;
      const cols = [
        { key: "desc", x: left,      w: 240, align: "left"  , label: "Désignation" },
        { key: "qty",  x: left + 250,w: 40,  align: "right" , label: "Qté"        , fmt: v => String(v) },
        { key: "puHT", x: left + 300,w: 70,  align: "right" , label: "PU HT"      , fmt: fmtMoney },
        { key: "tva",  x: left + 380,w: 40,  align: "right" , label: "TVA"        , fmt: v => `${v}%` },
        { key: "ht",   x: left + 430,w: 80,  align: "right" , label: "Total HT"   , fmt: fmtMoney },
        { key: "ttc",  x: left + 520,w: 80,  align: "right" , label: "Total TTC"  , fmt: fmtMoney },
      ];

      doc.setFontSize(10); doc.setTextColor(100);
      cols.forEach(c => doc.text(c.label, c.x + (c.align==="right"?c.w:0), y, { align: c.align }));
      doc.setDrawColor(226); doc.line(left, y + 6, right, y + 6);
      doc.setTextColor(0);
      y += 26;

      const lineH = 18, bottom = 780;
      for (const r of calcRows) {
        if (y > bottom) { doc.addPage(); y = 60; }
        cols.forEach(c => {
          const raw = r[c.key];
          const val = c.fmt ? c.fmt(raw) : String(raw ?? "");
          doc.text(val, c.x + (c.align==="right"?c.w:0), y, { align: c.align, maxWidth: c.w });
        });
        y += lineH;
      }

      // Totaux
      y += 8;
      const put = (label, val) => {
        doc.setFontSize(10); doc.setTextColor(100); doc.text(label, left + 300, y);
        doc.setFontSize(12); doc.setTextColor(0); doc.text(fmtMoney(val), right, y, { align: "right" });
        y += 18;
      };
      put("Sous-total HT", subHT);
      put("TVA",          subTVA);
      doc.setFont(undefined, "bold");
      put("Total TTC",    total);
      doc.setFont(undefined, "normal");

      doc.save(`${row.id}.pdf`);
    } catch {
      alert("jspdf n'est pas installé. Ajoute-le avec : npm i jspdf");
    }
  };

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
        <motion.div
          initial={{ y: 12, scale: 0.98, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          exit={{ y: 8, scale: 0.98, opacity: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="relative z-10 w-full max-w-3xl rounded-2xl border border-white/30 bg-white p-5 shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-sky-400" />
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">{row.client}</h3>
                <div className="text-[11px] text-slate-500">{row.id} • {row.date}</div>
              </div>
            </div>
            <button onClick={onClose}
              className="rounded-lg border border-black/10 bg-white px-2 py-1 text-xs font-semibold shadow-sm hover:bg-gray-50">
              Fermer
            </button>
          </div>

          {/* Deux cartes */}
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 p-3">
              <div className="text-xs uppercase tracking-wide text-slate-500">Établissement</div>
              <div className="mt-2 text-sm space-y-1">
                <div><span className="font-semibold">Nom : </span>{row.client}</div>
                <div><span className="font-semibold">Email : </span>{row.email || "—"}</div>
                <div><span className="font-semibold">Gouvernorat : </span>{row.region || "—"}</div>
                <div><span className="font-semibold">Type : </span>{TYPE_META[row.type]?.label || "—"}</div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 p-3">
              <div className="text-xs uppercase tracking-wide text-slate-500">Détails</div>
              <div className="mt-2 text-sm space-y-1">
                <div><span className="font-semibold">Date : </span>{row.date}</div>
                <div><span className="font-semibold">Abonnement : </span>{row.abonnement || "—"}</div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Statut :</span>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${STATUS_STYLES[row.status]}`}>
                    {row.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Lignes de facture */}
          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-3 py-2 text-left">Désignation</th>
                  <th className="px-3 py-2 text-right">Qté</th>
                  <th className="px-3 py-2 text-right">PU HT</th>
                  <th className="px-3 py-2 text-right">TVA</th>
                  <th className="px-3 py-2 text-right">Total HT</th>
                  <th className="px-3 py-2 text-right">Total TTC</th>
                </tr>
              </thead>
              <tbody>
                {calcRows.map((r, i) => (
                  <tr key={i} className="odd:bg-white even:bg-slate-50">
                    <td className="px-3 py-2">{r.desc}</td>
                    <td className="px-3 py-2 text-right">{r.qty}</td>
                    <td className="px-3 py-2 text-right">{fmtMoney(r.puHT)}</td>
                    <td className="px-3 py-2 text-right">{r.tva}%</td>
                    <td className="px-3 py-2 text-right">{fmtMoney(r.ht)}</td>
                    <td className="px-3 py-2 text-right">{fmtMoney(r.ttc)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={4} className="px-3 py-2 text-right font-semibold">Sous-total HT</td>
                  <td className="px-3 py-2 text-right font-bold">{fmtMoney(subHT)}</td>
                  <td />
                </tr>
                <tr>
                  <td colSpan={4} className="px-3 py-2 text-right font-semibold">TVA</td>
                  <td className="px-3 py-2 text-right font-bold">{fmtMoney(subTVA)}</td>
                  <td />
                </tr>
                <tr>
                  <td colSpan={4} className="px-3 py-2 text-right font-semibold">Total TTC</td>
                  <td className="px-3 py-2 text-right font-extrabold">{fmtMoney(total)}</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Actions */}
          <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
            <button onClick={printInvoice}
              className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold shadow-sm hover:bg-gray-50">
              🖨️ Imprimer
            </button>
            <button
  onClick={() =>
    exportPDF(
      row,
      calcRows.map(r => ({
        designation: r.desc,
        qte: r.qty,
        pu: r.puHT,
        tva: r.tva,
      }))
    )
  }
  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 px-4 py-2 text-sm font-bold text-white shadow-[0_16px_40px_rgba(37,99,235,.35)] hover:brightness-110"
>
  <FiDownload /> Export PDF
</button>

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

