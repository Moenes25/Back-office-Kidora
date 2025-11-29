/* eslint-disable */
import React, { useMemo, useState, useEffect } from "react";
import Card from "components/card";
import {
  FiSearch, FiFilter, FiPrinter, FiChevronLeft, FiChevronRight, FiPlus,
  FiEdit2, FiTrash2, FiEye, FiEyeOff, FiPhone, FiMail, FiMapPin, FiLink,
  FiUsers, FiCheckCircle, FiAlertTriangle, FiPauseCircle, FiCalendar, FiDownload
} from "react-icons/fi";

import { AnimatePresence, motion } from "framer-motion";

import { HiOutlineRefresh } from "react-icons/hi";
import { RiPauseCircleLine, RiDeleteBinLine } from "react-icons/ri";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

/* ----------------------------------------------------------------
   Données démo (complètes)
----------------------------------------------------------------- */
const MOCK = [
  {
    id: "C-301",
    name: "Crèche Les Petits Anges",
    type: "creches",
    city: "Tunis (Grand Tunis)",
    address: "Rue du Jasmin 12, Lafayette, Tunis",
    phone: "+21624531129",
    email: "contact@petit.tn",
    url_localisation: "https://maps.google.com/?q=36.81897,10.16579",
    password: "Pa$$-Anges24",
    subscriptionDate: "2024-01-10",
    plan: "Standard / Mensuel",
    status: "Actif",
    history: [
      { at: "2025-02-11 10:21", text: "Facture payée (#F-2190) — 380 DT" },
      { at: "2025-02-08 15:04", text: "Ticket #T-9102 (facturation) résolu" },
      { at: "2025-01-10 09:10", text: "Renouvellement abonnement (Standard)" },
    ],
  },
  {
    id: "G-656",
    name: "Garderie Soleil",
    type: "garderies",
    city: "Ariana",
    address: "Av. Hédi Nouira, Ennasr 2, Ariana",
    phone: "+21671223344",
    email: "hello@soleil.tn",
    url_localisation: "https://maps.google.com/?q=36.8665,10.1647",
    password: "Soleil!2025",
    subscriptionDate: "2023-10-05",
    plan: "Premium / Annuel",
    status: "En retard de paiement",
    history: [
      { at: "2025-02-05 11:12", text: "Relance paiement J+10" },
      { at: "2025-01-05 08:30", text: "Facture émise (#F-2134) — 1 200 DT" },
    ],
  },
  {
    id: "E-007",
    name: "École Horizon",
    type: "ecoles",
    city: "Nabeul",
    address: "Route de Hammamet, Nabeul",
    phone: "+21672220011",
    email: "direction@horizon.tn",
    url_localisation: "https://maps.google.com/?q=36.4510,10.7350",
    password: "H0riz0n@2024",
    subscriptionDate: "2024-09-01",
    plan: "Établissement / Annuel",
    status: "Actif",
    history: [
      { at: "2025-02-02 09:40", text: "Nouvel utilisateur créé (Directrice)" },
      { at: "2024-09-01 10:00", text: "Onboarding & formation" },
    ],
  },
  {
    id: "C-032",
    name: "Crèche MiniMonde",
    type: "creches",
    city: "Sousse (Sahel)",
    address: "Rue de la Corniche, Sousse",
    phone: "+21673222111",
    email: "contact@mini.tn",
    url_localisation: "https://maps.google.com/?q=35.8256,10.6360",
    password: "MiniMonde#14",
    subscriptionDate: "2025-02-01",
    plan: "Essai 14 jours",
    status: "En période d’essai",
    history: [
      { at: "2025-02-12 14:31", text: "Appel de découverte" },
      { at: "2025-02-01 08:12", text: "Compte créé (essai)" },
    ],
  },
  {
    id: "G-022",
    name: "Garderie Nounours",
    type: "garderies",
    city: "Sfax",
    address: "Rue de la République, Sfax",
    phone: "+21674220055",
    email: "info@nounours.tn",
    url_localisation: "https://maps.google.com/?q=34.7390,10.7600",
    password: "N0un0urs?",
    subscriptionDate: "2024-05-20",
    plan: "Standard / Mensuel",
    status: "Suspendu",
    history: [
      { at: "2025-01-30 18:00", text: "Compte suspendu (impayé > J+30)" },
      { at: "2024-05-20 11:40", text: "Onboarding" },
    ],
  },
];

/* ----------------------------------------------------------------
   Helpers UI
----------------------------------------------------------------- */
const TYPE_META = {
  creches: { label: "Crèche", chip: "bg-purple-100 text-purple-700" },
  garderies: { label: "Garderie", chip: "bg-amber-100 text-amber-700" },
  ecoles: { label: "École", chip: "bg-emerald-100 text-emerald-700" },
};

const STATUS_UI = {
  Actif: {
    ring: "ring-emerald-400/60",
    border: "border-emerald-200",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  "En période d’essai": {
    ring: "ring-indigo-400/60",
    border: "border-indigo-200",
    badge: "bg-indigo-50 text-indigo-700 border-indigo-200",
    dot: "bg-indigo-500",
  },
  "En retard de paiement": {
    ring: "ring-amber-400/70",
    border: "border-amber-200",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
  Suspendu: {
    ring: "ring-rose-400/70",
    border: "border-rose-300",
    badge: "bg-rose-50 text-rose-700 border-rose-200",
    dot: "bg-rose-500",
  },
};

const StatusBadge = ({ status }) => {
  const ui = STATUS_UI[status] || { badge: "bg-gray-50 text-gray-700 border-gray-200", dot: "bg-gray-400" };
  return (
    <span className={["inline-flex items-center gap-1.5 rounded-full px-2.5 py-2 text-xs font-semibold","border shadow-xl",ui.badge].join(" ")}>
      <span className={`h-1.5 w-1.5 rounded-full ${ui.dot}`} />
      {status}
    </span>
  );
};

const TypeBadge = ({ type }) => {
  const t = TYPE_META[type] || { label: type, chip: "bg-gray-100 text-gray-700" };
  return <span className={`px-3 py-2 rounded-full text-[11px] shadow-xl font-semibold ${t.chip}`}>{t.label}</span>;
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

function AnimatedNumber({ value, duration = 800, format = (n)=>n.toLocaleString(), startOnView = true }) {
  const spanRef = React.useRef(null);
  const inView = useInView(spanRef, "0px");
  const [display, setDisplay] = React.useState(0);
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  React.useEffect(() => {
    // si on veut attendre la visibilité
    if (startOnView && !inView) return;
    // si motion réduit : pas d'animation
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
      {/* film de couleur sous le contenu */}
      <div className="absolute inset-0 opacity-25" style={{ background: gradient }} />
      {/* petits effets */}
      <div className="pointer-events-none absolute -top-6 -right-6 h-24 w-24 rounded-full bg-white/60 blur-2xl kpi-float" />
      <div className="pointer-events-none absolute -left-1/3 -top-1/2 h-[220%] w-1/3 rotate-[14deg] bg-white/40 blur-md kpi-shine" />
      {/* contenu */}
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

/* ===== Toolbar (style Support) ===== */
function SupportToolbar({
  q, setQ,
  onToggleFilters,
  onPrimary, primaryLabel = "Ajouter",
  onExport, // optionnel
}) {
  return (
    <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        {/* Recherche */}
        <div className="group flex items-center gap-2 rounded-2xl border border-white/20 bg-white/70 px-3 py-2 text-sm shadow-[0_10px_30px_rgba(2,6,23,.10)] backdrop-blur-xl">
          <FiSearch className="opacity-60" />
          <input
            value={q}
            onChange={(e)=>setQ(e.target.value)}
            placeholder="Rechercher un client…"
            className="w-72 bg-transparent outline-none placeholder:text-gray-400"
          />
        </div>

        {/* Filtres */}
        <button
          onClick={onToggleFilters}
          className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-gradient-to-r from-indigo-500/10 to-sky-400/10 px-3 py-2 text-sm font-semibold text-indigo-700 shadow-[0_10px_24px_rgba(2,6,23,.1)] backdrop-blur hover:from-indigo-500/20 hover:to-sky-400/20"
        >
          <FiFilter /> Filtres
        </button>

        {/* Export CSV (facultatif) */}
        {onExport && (
          <button
            onClick={onExport}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-gradient-to-r from-emerald-500/10 to-teal-400/10 px-3 py-2 text-sm font-semibold text-emerald-700 shadow-[0_10px_24px_rgba(2,6,23,.1)] backdrop-blur hover:from-emerald-500/20 hover:to-teal-400/20"
          >
            <FiDownload /> Export CSV
          </button>
        )}
      </div>

      {/* CTA principal */}
      <button
        onClick={onPrimary}
        className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-sky-600 px-4 py-2 text-sm font-extrabold text-white shadow-[0_16px_40px_rgba(37,99,235,.35)] hover:brightness-110"
      >
        <FiPlus /> {primaryLabel}
      </button>
    </div>
  );
}

/* ===== Drawer de filtres (style Support) ===== */
function SupportFilterDrawer({
  open, onClose,
  typeFilter, setTypeFilter,
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
            {/* Type */}
            <label className="text-sm">
              <div className="mb-1 text-xs text-gray-500">Type</div>
              <select
                className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm"
                value={typeFilter}
                onChange={(e)=>setTypeFilter(e.target.value)}
              >
                <option value="all">Tous</option>
                <option value="creches">Crèches</option>
                <option value="garderies">Garderies</option>
                <option value="ecoles">Écoles</option>
              </select>
            </label>

            {/* Statut */}
            <label className="text-sm">
              <div className="mb-1 text-xs text-gray-500">Statut</div>
              <select
                className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm"
                value={statusFilter}
                onChange={(e)=>setStatusFilter(e.target.value)}
              >
                <option value="all">Tous</option>
                {Object.keys(STATUS_UI).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>

            {/* Tri */}
            <label className="text-sm sm:col-span-2">
              <div className="mb-1 text-xs text-gray-500">Trier par</div>
              <div className="flex items-center gap-2">
                <select
                  className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm"
                  value={sortKey}
                  onChange={(e)=>setSortKey(e.target.value)}
                >
                  <option value="name">Nom</option>
                  <option value="city">Ville</option>
                  <option value="type">Type</option>
                  <option value="status">Statut</option>
                  <option value="subscriptionDate">Date d’abonnement</option>
                </select>
                <button
                  type="button"
                  onClick={()=>setSortAsc(v=>!v)}
                  className="h-10 w-10 rounded-xl border border-black/10 bg-white text-sm shadow-sm"
                  title={sortAsc ? "Ordre croissant" : "Ordre décroissant"}
                >
                  {sortAsc ? "▲" : "▼"}
                </button>
              </div>
            </label>
          </div>

          <div className="mt-3 flex items-center justify-end gap-2">
            <button
              onClick={()=>{
                setTypeFilter("all");
                setStatusFilter("all");
                setSortKey("name");
                setSortAsc(true);
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
function makePageWindow(curr, total, span = 1) {
  // ex: 1 … 3 4 [5] 6 7 … 20
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
        Page <span className="font-semibold">{page}</span> / {pageCount} • {total} clients
      </div>

      <div className="ukp-actions">
        <button
          className="pg-btn"
          onClick={() => onPage(1)}
          disabled={page === 1}
          aria-label="Première"
        >
          «
        </button>
        <button
          className="pg-btn"
          onClick={() => onPage(Math.max(1, page - 1))}
          disabled={page === 1}
          aria-label="Précédent"
        >
          <FiChevronLeft />
        </button>

        {items.map((it, i) =>
          it === "…"
            ? (
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

        <button
          className="pg-btn"
          onClick={() => onPage(Math.min(pageCount, page + 1))}
          disabled={page === pageCount}
          aria-label="Suivant"
        >
          <FiChevronRight />
        </button>
        <button
          className="pg-btn"
          onClick={() => onPage(pageCount)}
          disabled={page === pageCount}
          aria-label="Dernière"
        >
          »
        </button>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------
   Composant principal
----------------------------------------------------------------- */
const ClientsPage = () => {
  const [data, setData] = useState(MOCK);

  // UI
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortKey, setSortKey] = useState("name");
  const [sortAsc, setSortAsc] = useState(true);

  // Modale + œil (mot de passe)
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showPwd, setShowPwd] = useState(false);
  const [showPwdDetail, setShowPwdDetail] = useState(false);

  const TN_GOVS = [
    "Tunis","Ariana","Ben Arous","Manouba","Nabeul","Zaghouan","Bizerte","Béja","Jendouba","Le Kef","Siliana","Sousse","Monastir","Mahdia","Kairouan","Kasserine","Sidi Bouzid","Sfax","Gabès","Médenine","Tataouine","Gafsa","Tozeur","Kebili"
  ];
  const PLAN_OPTIONS = [
    "Essai 14 jours","Standard / Mensuel","Premium / Mensuel","Standard / Annuel","Premium / Annuel","Établissement / Annuel"
  ];

  const emptyClient = {
    id: "",
    name: "",
    type: "creches",
    city: "",
    address: "",
    phone: "",
    email: "",
    url_localisation: "",
    password: "",
    subscriptionDate: new Date().toISOString().slice(0, 10),
    plan: "Standard / Mensuel",
    status: "Actif",
    history: [],
  };
  const [newClient, setNewClient] = useState(emptyClient);
  const resetNew = () => { setNewClient(emptyClient); setShowPwd(false); };

  const saveClient = (e) => {
    e?.preventDefault?.();
    if (!newClient.name.trim() || !newClient.city.trim()) return;

    const emailOk = !newClient.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newClient.email);
    const urlOk = !newClient.url_localisation || /^https?:\/\/.+/.test(newClient.url_localisation);
    if (!emailOk) { alert("Email invalide"); return; }
    if (!urlOk) { alert("URL de localisation invalide"); return; }

    if (editId) {
      setData((prev) => prev.map((r) => (r.id === editId ? { ...r, ...newClient, id: editId } : r)));
    } else {
      const prefix = newClient.type === "creches" ? "C" : newClient.type === "garderies" ? "G" : "E";
      const rand = String(Math.floor(Math.random() * 900) + 100).padStart(3, "0");
      const added = {
        ...newClient,
        id: `${prefix}-${rand}`,
        history: [{ at: `${new Date().toISOString().slice(0, 10)} 09:00`, text: "Client créé depuis le back-office" }],
      };
      setData((prev) => [added, ...prev]);
    }
    setShowAdd(false);
    setEditId(null);
    resetNew();
  };
  const [openFilters, setOpenFilters] = useState(false);

// (facultatif) export CSV des clients filtrés
const exportCSV = () => {
  const headers = ["ID","Nom","Type","Ville","Adresse","Téléphone","Email","URL","Date","Formule","Statut"];
  const csv = [headers, ...filtered.map(r => [
    r.id, r.name, r.type, r.city, r.address || "", r.phone || "",
    r.email || "", r.url_localisation || "", r.subscriptionDate || "",
    r.plan || "", r.status || ""
  ])]
  .map(line => line.map(v => `"${String(v).replace(/"/g,'""')}"`).join(";"))
  .join("\n");

  const blob = new Blob([`\uFEFF${csv}`], {type:"text/csv;charset=utf-8"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "clients.csv";
  a.click();
  URL.revokeObjectURL(a.href);
};

  // liste/pagination
  const PAGE_SIZE = 4;
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  useEffect(() => setPage(1), [typeFilter, statusFilter, search]);

  const filtered = useMemo(() => {
    let rows = [...data];
    if (typeFilter !== "all") rows = rows.filter((r) => r.type === typeFilter);
    if (statusFilter !== "all") rows = rows.filter((r) => r.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (r) => r.name.toLowerCase().includes(q) || r.city.toLowerCase().includes(q) || r.id.toLowerCase().includes(q)
      );
    }
    rows.sort((a, b) => {
      const A = (a[sortKey] ?? "").toString().toLowerCase();
      const B = (b[sortKey] ?? "").toString().toLowerCase();
      if (A < B) return sortAsc ? -1 : 1;
      if (A > B) return sortAsc ? 1 : -1;
      return 0;
    });
    return rows;
  }, [data, typeFilter, statusFilter, search, sortKey, sortAsc]);
  // Compteurs (globaux)
const stats = useMemo(() => {
  const byStatus = (s) => data.filter(r => r.status === s).length;
  const byType   = (t) => data.filter(r => r.type === t).length;

  // nouveaux ce mois
  const now = new Date();
  const y = now.getFullYear(), m = now.getMonth() + 1;
  const ym = `${y}-${String(m).padStart(2,'0')}`;
  const newThisMonth = data.filter(r => (r.subscriptionDate || "").startsWith(ym)).length;

  return {
    total: data.length,
    actifs: byStatus("Actif"),
    essais: byStatus("En période d’essai"),
    retards: byStatus("En retard de paiement"),
    suspendus: byStatus("Suspendu"),
    creches: byType("creches"),
    garderies: byType("garderies"),
    ecoles: byType("ecoles"),
    newThisMonth,
  };
}, [data]);

// Option : compte filtré pour refléter la vue actuelle
const visibleCount = filtered.length;

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const pageRows = filtered.slice(start, start + PAGE_SIZE);
  const drawerUI = selected ? STATUS_UI[selected.status] || {} : {};

  /* ----------------------- Actions ----------------------- */
  const updateStatus = (id, newStatus) => {
    setData((rows) => rows.map((r) => (r.id === id ? { ...r, status: newStatus } : r)));
    setSelected((s) => (s && s.id === id ? { ...s, status: newStatus } : s));
  };

  const printSelected = () => {
    if (!selected) return;
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`
      <html><head><title>Fiche client ${selected.name}</title>
      <style>
        body{font-family: ui-sans-serif,system-ui,Segoe UI,Roboto,Helvetica,Arial; padding:24px}
        h1{font-size:20px;margin:0 0 8px 0}
        h2{font-size:14px;margin:18px 0 8px 0}
        table{width:100%;border-collapse:collapse}
        td{padding:6px 8px;border-bottom:1px solid #eee}
        .muted{color:#667085}.chip{display:inline-block;padding:4px 8px;border-radius:999px;background:#f1f5f9;margin-left:8px}
      </style></head>
      <body>
        <h1>${selected.name} <span class="chip">${TYPE_META[selected.type]?.label || selected.type}</span></h1>
        <div class="muted">${selected.id}</div>
        <h2>Informations générales</h2>
        <table>
          <tr><td>Ville</td><td>${selected.city}</td></tr>
          <tr><td>Adresse</td><td>${selected.address || ""}</td></tr>
          <tr><td>Téléphone</td><td>${selected.phone || ""}</td></tr>
          <tr><td>Email</td><td>${selected.email || ""}</td></tr>
          <tr><td>URL localisation</td><td>${selected.url_localisation || ""}</td></tr>
          <tr><td>Date d'abonnement</td><td>${selected.subscriptionDate}</td></tr>
          <tr><td>Formule</td><td>${selected.plan}</td></tr>
          <tr><td>Statut</td><td>${selected.status}</td></tr>
        </table>
        <h2>Historique</h2>
        <table>${(selected.history||[]).map(h => `<tr><td>${h.at}</td><td>${h.text}</td></tr>`).join("")}</table>
        <script>window.print(); setTimeout(()=>window.close(), 300);</script>
      </body></html>
    `);
    w.document.close();
  };

  const startEdit = (row) => {
    setEditId(row.id);
    setNewClient({
      ...row,
      subscriptionDate: row.subscriptionDate || new Date().toISOString().slice(0, 10),
    });
    setShowPwd(false);
    setShowAdd(true);
  };

  const deleteClient = async (row) => {
    const res = await Swal.fire({
      title: "Supprimer ?",
      text: `Confirmer la suppression de ${row.name} (${row.id})`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
      confirmButtonColor: "#e11d48",
    });
    if (res.isConfirmed) {
      setData((prev) => prev.filter((r) => r.id !== row.id));
      if (selected?.id === row.id) setSelected(null);
      await Swal.fire({ title: "Supprimé", text: "Le client a été supprimé.", icon: "success", timer: 1400, showConfirmButton: false });
    }
  };

  // helper: tri via clic sur en-tête
  const toggleSort = (key) => {
    setSortKey((prev) => (prev === key ? prev : key));
    setSortAsc((prev) => (sortKey === key ? !prev : true));
  };

  const headerSortIcon = (key) =>
    sortKey !== key ? "↕" : sortAsc ? "▲" : "▼";

  return (
    <div className="space-y-6">

      <KPIStyles />

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  <KPI
    title="Clients (total)"
    value={stats.total}
    startOnView={false}
    icon={<FiUsers className="text-2xl" />}
    gradient="linear-gradient(135deg,#6366f1,#06b6d4)"
  />
  <KPI
    title="Actifs"
    value={stats.actifs}
    startOnView={false}
    icon={<FiCheckCircle className="text-2xl" />}
    gradient="linear-gradient(135deg,#10b981,#22d3ee)"
  />
  <KPI
    title="En essai"
    value={stats.essais}
    startOnView={false}
    icon={<FiCalendar className="text-2xl" />}
    gradient="linear-gradient(135deg,#a78bfa,#06b6d4)"
  />
  <KPI
    title="En retard de paiement"
    value={stats.retards}
    startOnView={false}
    icon={<FiAlertTriangle className="text-2xl" />}
    gradient="linear-gradient(135deg,#f59e0b,#ef4444)"
  />
</div>




      {/* HEADER */}
    {/* Toolbar style Support */}
<SupportToolbar
  q={search}
  setQ={setSearch}
  onToggleFilters={()=>setOpenFilters(v=>!v)}
  onPrimary={() => { setShowAdd(true); setEditId(null); resetNew(); }}
  primaryLabel="Ajouter un client"
  onExport={exportCSV}      // enlève cette prop si tu ne veux pas l’export
/>

{/* Drawer de filtres */}
<SupportFilterDrawer
  open={openFilters}
  onClose={()=>setOpenFilters(false)}
  typeFilter={typeFilter} setTypeFilter={setTypeFilter}
  statusFilter={statusFilter} setStatusFilter={setStatusFilter}
  sortKey={sortKey} setSortKey={setSortKey}
  sortAsc={sortAsc} setSortAsc={setSortAsc}
/>



      {/* LISTE EN TABLEAU (REMPLACE les cards) */}
      <Card extra="p-0 overflow-hidden">
        <div className="px-4 pt-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {filtered.length} client(s) • page {page} / {Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))}
          </div>
        </div>

        <div className="mt-3 overflow-x-auto">
          <table className="min-w-[980px] w-full border-separate [border-spacing:0_10px] p-2 mb-4 rounded-xl shadow-xl">

          <thead className="sticky top-0 z-10 bg-gray-200/80 backdrop-blur text-xs uppercase rounded-xl text-gray-700 [&_th]:py-5 shadow-xl">

              <tr>
                <Th onClick={() => toggleSort("id")} label="ID" sortIcon={headerSortIcon("id")} />
                <Th onClick={() => toggleSort("name")} label="Nom" sortIcon={headerSortIcon("name")} />
                <Th onClick={() => toggleSort("type")} label="Type" sortIcon={headerSortIcon("type")} />
                <Th onClick={() => toggleSort("city")} label="Ville" sortIcon={headerSortIcon("city")} />
               {/*<Th onClick={() => toggleSort("plan")} label="Formule" sortIcon={headerSortIcon("plan")}/>*/}

                 {/*<Th onClick={() => toggleSort("subscriptionDate")} label="Abonné depuis" sortIcon={headerSortIcon("subscriptionDate")} />*/}
                <Th onClick={() => toggleSort("status")} label="Statut" sortIcon={headerSortIcon("status")} />
                <th className="px-3 py-2 text-left hidden">Contact</th>
                <th className="">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm [&_td]:py-5 [&_th]:py-3 rounded-xl shadow-xl">

              {pageRows.map((r, i) => (
                <tr
                  key={r.id}
                  className="border-b last:border-0 hover:bg-gray-50 transition-colors"
                  style={{ animation: `fadeIn .25s ease-out both`, animationDelay: `${i * 40}ms` }}
                >
                  <td className="px-3 py-4 whitespace-nowrap text-xs font-mono text-gray-600">{r.id}</td>
                  <td className="px-3 py-4 font-semibold text-navy-700">
                    <button
                      onClick={() => setSelected(r)}
                      className="hover:underline"
                      title="Voir les détails"
                    >
                      {r.name}
                    </button>
                  </td>
                  <td className="px-3 py-5 whitespace-nowrap"><TypeBadge type={r.type} /></td>
                  <td className="px-3 py-5">{r.city}</td>
                  <td className="px-3 py-5 hidden">{r.plan}</td>
                  <td className="px-3 py-5 whitespace-nowrap hidden">{r.subscriptionDate}</td>
                  <td className="px-3 py-5 whitespace-nowrap"><StatusBadge status={r.status} /></td>
                  <td className="px-3 py-5 hidden">
                    <div className="flex flex-wrap items-center gap-2">
                      {r.phone && (
                        <a className="inline-flex items-center gap-1 hover:underline" href={`tel:${r.phone}`}>
                          <FiPhone /> {r.phone}
                        </a>
                      )}
                      {r.email && (
                        <a className="inline-flex items-center gap-1 hover:underline" href={`mailto:${r.email}`}>
                          <FiMail /> {r.email}
                        </a>
                      )}
                      {r.url_localisation && (
                        <a className="inline-flex items-center gap-1 hover:underline" href={r.url_localisation} target="_blank" rel="noreferrer">
                          <FiMapPin /> Maps
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-5">
                    <div className="flex items-center gap-1 justify-end">
                      <button
                        onClick={() => setSelected(r)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 bg-white text-xs shadow-xl"
                        title="Détails"
                      >
                        👁️
                      </button>
                      <button
                        onClick={() => startEdit(r)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 bg-white text-xs shadow-xl"
                        title="Modifier"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        onClick={() => deleteClient(r)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 bg-white text-xs shadow-xl"
                        title="Supprimer"
                      >
                        <FiTrash2 />
                      </button>
                      {/* actions statut rapides */}
                      <button
                        onClick={() => updateStatus(r.id, "Actif")}
                        className="hidden sm:inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-2 text-xs font-semibold text-emerald-700 shadow-xl"
                        title="Marquer Actif"
                      >
                        <HiOutlineRefresh /> Actif
                      </button>
                      <button
                        onClick={() => updateStatus(r.id, "Suspendu")}
                        className="hidden sm:inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-2 text-xs font-semibold text-amber-700 shadow-xl"
                        title="Suspendre"
                      >
                        <RiPauseCircleLine /> Suspendre
                      </button>
                      <button
                        onClick={() => updateStatus(r.id, "Résilié")}
                        className="hidden sm:inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-2 text-xs font-semibold text-rose-700 shadow-xl"
                        title="Résilier"
                      >
                        <RiDeleteBinLine /> Résilier
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {pageRows.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-3 py-10 text-center text-sm text-gray-500">
                    Aucun résultat. Ajustez vos filtres.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* pagination */}
       <SupportPagination
  page={page}
  pageCount={pageCount}
  total={filtered.length}
  onPage={(n) => setPage(n)}
/>

      </Card>

      {/* DRAWER / FICHE */}
      {selected && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" onClick={() => setSelected(null)} />
          <div
            className={[
              "relative ml-auto h-full w-full sm:w-[560px] bg-white dark:bg-navy-800 shadow-2xl",
              "overflow-y-auto max-h-screen overscroll-contain rounded-2xl border",
              drawerUI.border || "border-gray-200",
              drawerUI.ring ? `ring-1 ${drawerUI.ring}` : "",
            ].join(" ")}
          >
            <div className="sticky top-0 z-10 bg-white/80 dark:bg-navy-800/80 backdrop-blur border-b p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-extrabold text-navy-700 dark:text-white">
                    {selected.name} <span className="ml-2"><TypeBadge type={selected.type} /></span>
                  </h3>
                  <div className="text-xs text-gray-500">{selected.id}</div>
                </div>
                <button
                  className="rounded-lg border border-black/10 bg-white px-2 py-1 text-xs font-semibold shadow-sm hover:bg-gray-50"
                  onClick={() => setSelected(null)}
                >
                  Fermer
                </button>
              </div>
            </div>

            <div className="space-y-5 p-4 pb-8">
              <Card extra="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-xs text-gray-500">Ville</div>
                    <div className="font-semibold">{selected.city}</div>

                    {selected.address && (
                      <>
                        <div className="text-xs text-gray-500">Adresse</div>
                        <div className="font-medium">{selected.address}</div>
                      </>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs text-gray-500">Abonné depuis</div>
                    <div className="font-semibold">{selected.subscriptionDate}</div>
                    <div className="text-xs text-gray-500">Formule</div>
                    <div className="font-semibold">{selected.plan}</div>
                  </div>

                  {selected.phone && (
                    <div className="rounded-xl bg-gray-50 px-3 py-2 text-sm font-medium flex items-center gap-2">
                      <FiPhone /> <a className="hover:underline" href={`tel:${selected.phone}`}>{selected.phone}</a>
                    </div>
                  )}

                  {selected.email && (
                    <div className="rounded-xl bg-gray-50 px-3 py-2 text-sm font-medium flex items-center gap-2">
                      <FiMail /> <a className="hover:underline" href={`mailto:${selected.email}`}>{selected.email}</a>
                    </div>
                  )}

                  <div className="md:col-span-2 flex items-center gap-3">
                    <StatusBadge status={selected.status} />
                    {selected.url_localisation && (
                      <a
                        href={selected.url_localisation}
                        target="_blank" rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg border border-black/10 bg-white px-3 py-2 text-sm font-semibold shadow-sm hover:bg-gray-50"
                      >
                        <FiMapPin /> Ouvrir la localisation
                      </a>
                    )}
                    {selected.url_localisation && (
                      <a
                        href={selected.url_localisation}
                        target="_blank" rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-gray-500 hover:underline"
                      >
                        <FiLink /> {selected.url_localisation.split("?")[0]}
                      </a>
                    )}
                  </div>

                  {/* Mot de passe avec œil */}
                  {selected.password && (
                    <div className="md:col-span-2">
                      <div className="text-xs text-gray-500 mb-1">Mot de passe</div>
                      <div className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2 text-sm shadow-sm">
                        <span className="font-mono">
                          {showPwdDetail ? selected.password : "•".repeat(Math.max(8, selected.password.length))}
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowPwdDetail(s => !s)}
                          className="ml-1 rounded-md border border-black/10 p-1 hover:bg-gray-50"
                          title={showPwdDetail ? "Masquer" : "Afficher"}
                        >
                          {showPwdDetail ? <FiEyeOff /> : <FiEye />}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              <Card extra="p-4">
                <h4 className="mb-3 text-sm font-bold">Actions</h4>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => updateStatus(selected.id, "Actif")}
                    className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100"
                  >
                    <HiOutlineRefresh /> Renouveler
                  </button>
                  <button
                    onClick={() => updateStatus(selected.id, "En période d’essai")}
                    className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100"
                  >
                    🧪 Passer en essai
                  </button>
                  <button
                    onClick={() => updateStatus(selected.id, "En retard de paiement")}
                    className="inline-flex items-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-3 py-2 text-sm font-semibold text-orange-700 hover:bg-orange-100"
                  >
                    ⏰ Marquer en retard
                  </button>
                  <button
                    onClick={() => updateStatus(selected.id, "Suspendu")}
                    className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100"
                  >
                    <RiPauseCircleLine /> Suspendre
                  </button>
                  <button
                    onClick={() => updateStatus(selected.id, "Résilié")}
                    className="inline-flex items-center gap-2 rounded-xl border border-rose-300 bg-rose-100 px-3 py-2 text-sm font-semibold text-rose-800 hover:bg-rose-200"
                  >
                    <RiDeleteBinLine /> Résilier
                  </button>
                  <button
                    onClick={printSelected}
                    className="ml-auto inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold shadow-sm hover:bg-gray-50"
                  >
                    <FiPrinter /> Export PDF
                  </button>
                </div>
              </Card>

              <Card extra="p-4">
                <h4 className="mb-3 text-sm font-bold">Historique d’activités</h4>
                <div className="space-y-2">
                  {(selected.history || []).map((h, i) => (
                    <div key={i} className="rounded-xl border border-black/5 bg-white px-3 py-2 text-sm shadow-sm">
                      <div className="text-xs text-gray-500">{h.at}</div>
                      <div className="font-medium">{h.text}</div>
                    </div>
                  ))}
                  {(!selected.history || selected.history.length === 0) && (
                    <div className="text-sm text-gray-500">Aucune activité pour le moment.</div>
                  )}
                </div>
              </Card>

              <div className="h-6" />
            </div>
          </div>
        </div>
      )}

      {/* MODALE Ajouter/Éditer */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => { setShowAdd(false); setEditId(null); resetNew(); }} />
          <form onSubmit={saveClient} className="relative z-10 w-[95%] max-w-xl rounded-2xl bg-white p-5 shadow-2xl dark:bg-navy-800 animate-[fadeIn_.25s_ease-out_both]">
            <div className="mb-4 flex items-start justify-between">
              <h3 className="text-lg font-extrabold text-navy-700 dark:text-white">
                {editId ? "Modifier le client" : "Ajouter un client"}
              </h3>
              <button
                type="button"
                onClick={() => { setShowAdd(false); setEditId(null); resetNew(); }}
                className="rounded-lg border border-black/10 bg-white px-2 py-1 text-xs font-semibold shadow-sm hover:bg-gray-50"
              >
                Fermer
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <label className="text-sm">
                <span className="mb-1 block text-xs text-gray-500">Nom</span>
                <input
                  required
                  value={newClient.name}
                  onChange={(e) => setNewClient((v) => ({ ...v, name: e.target.value }))}
                  className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm shadow-sm outline-none"
                  placeholder="Crèche / Garderie / École…"
                />
              </label>

              <label className="text-sm">
                <span className="mb-1 block text-xs text-gray-500">Type</span>
                <select
                  value={newClient.type}
                  onChange={(e) => setNewClient((v) => ({ ...v, type: e.target.value }))}
                  className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm shadow-sm outline-none"
                >
                  <option value="creches">Crèche</option>
                  <option value="garderies">Garderie</option>
                  <option value="ecoles">École</option>
                </select>
              </label>

              <label className="text-sm md:col-span-2">
                <span className="mb-1 block text-xs text-gray-500">Localisation (gouvernorat)</span>
                <select
                  required
                  value={newClient.city}
                  onChange={(e) => setNewClient((v) => ({ ...v, city: e.target.value }))}
                  className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm shadow-sm outline-none"
                >
                  <option value="" disabled>— Choisir un gouvernorat —</option>
                  {TN_GOVS.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </label>

              {/* Adresse complète */}
              <label className="text-sm md:col-span-2">
                <span className="mb-1 block text-xs text-gray-500">Adresse complète</span>
                <input
                  value={newClient.address}
                  onChange={(e) => setNewClient((v) => ({ ...v, address: e.target.value }))}
                  className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm shadow-sm outline-none"
                  placeholder="Rue, numéro, ville…"
                />
              </label>

              {/* URL localisation */}
              <label className="text-sm">
                <span className="mb-1 block text-xs text-gray-500">URL localisation (Google Maps)</span>
                <input
                  type="url"
                  value={newClient.url_localisation}
                  onChange={(e) => setNewClient((v) => ({ ...v, url_localisation: e.target.value }))}
                  className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm shadow-sm outline-none"
                  placeholder="https://maps.google.com/…"
                />
              </label>

              {/* Téléphone */}
              <label className="text-sm">
                <span className="mb-1 block text-xs text-gray-500">Téléphone</span>
                <input
                  type="tel"
                  value={newClient.phone}
                  onChange={(e) => setNewClient((v) => ({ ...v, phone: e.target.value }))}
                  className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm shadow-sm outline-none"
                  placeholder="+216 …"
                />
              </label>

              {/* Email */}
              <label className="text-sm">
                <span className="mb-1 block text-xs text-gray-500">Email</span>
                <input
                  type="email"
                  name="clientEmail"
                  autoComplete="new-email"
                  required
                  value={newClient.email}
                  onChange={(e) => setNewClient((v) => ({ ...v, email: e.target.value }))}
                  className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm shadow-sm outline-none"
                  placeholder="contact@exemple.tn"
                />
              </label>

              <label className="text-sm">
                <span className="mb-1 block text-xs text-gray-500">Mot de passe</span>
                <div className="relative">
                  <input
                    type={showPwd ? "text" : "password"}
                    name="clientPassword"
                    autoComplete="new-password"
                    value={newClient.password}
                    onChange={(e) => setNewClient(v => ({ ...v, password: e.target.value }))}
                    className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm shadow-sm outline-none pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(s => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md border border-black/10 bg-white px-2 py-1 text-xs shadow-sm"
                    aria-label={showPwd ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  >
                    {showPwd ? "🙈" : "👁️"}
                  </button>
                </div>
              </label>

              <label className="text-sm">
                <span className="mb-1 block text-xs text-gray-500">Date d’abonnement</span>
                <input
                  type="date"
                  value={newClient.subscriptionDate}
                  onChange={(e) => setNewClient((v) => ({ ...v, subscriptionDate: e.target.value }))}
                  className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm shadow-sm outline-none"
                />
              </label>

              <label className="text-sm">
                <span className="mb-1 block text-xs text-gray-500">Formule</span>
                <select
                  required
                  value={newClient.plan}
                  onChange={(e) => setNewClient((v) => ({ ...v, plan: e.target.value }))}
                  className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm shadow-sm outline-none"
                >
                  <option value="" disabled>— Choisir une formule —</option>
                  {PLAN_OPTIONS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </label>

              <label className="text-sm">
                <span className="mb-1 block text-xs text-gray-500">Statut</span>
                <select
                  value={newClient.status}
                  onChange={(e) => setNewClient((v) => ({ ...v, status: e.target.value }))}
                  className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm shadow-sm outline-none"
                >
                  <option>Actif</option>
                  <option>En période d’essai</option>
                  <option>En retard de paiement</option>
                  <option>Suspendu</option>
                </select>
              </label>
            </div>

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => { setShowAdd(false); setEditId(null); resetNew(); }}
                className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold shadow-sm hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="relative inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-indigo-500 to-sky-500 shadow hover:shadow-lg transition-all"
              >
                <FiPlus /> {editId ? "Enregistrer les modifications" : "Enregistrer"}
              </button>
            </div>
          </form>
        </div>
      )}

      <StyleOnce />
    </div>
  );
};

/* Cellule d'en-tête cliquable pour tri */
const Th = ({ label, sortIcon, onClick }) => (
  <th
    className="px-3 py-2 text-left font-semibold select-none cursor-pointer"
    onClick={onClick}
    title="Cliquer pour trier"
  >
    <span className="inline-flex items-center gap-1">{label} <span className="text-[10px] opacity-60">{sortIcon}</span></span>
  </th>
);

/* animations */
/* animations & styles créatifs — MAX DROP-IN */
const StyleOnce = () => {
  useEffect(() => {
    const ID = "clients-kf";
    const old = document.getElementById(ID);
    if (old) old.remove();

    const s = document.createElement("style");
    s.id = ID;
    s.innerHTML = `
      :root{
        --ease-pop: cubic-bezier(.2,.8,.2,1);
        --shadow-1: 0 1px 2px rgba(2,6,23,.06);
        --shadow-2: 0 8px 24px rgba(2,6,23,.12);
        --shadow-3: 0 20px 60px rgba(2,6,23,.18);
        --ring-edu: 0 0 0 4px rgba(99,102,241,.18);
      }

      /* ===== KEYFRAMES ===== */
      @keyframes fadeIn { from{opacity:0; transform: translateY(6px)} to{opacity:1; transform: translateY(0)} }
      @keyframes eduRow {
        0% { opacity: 0; transform: translateY(8px) rotateX(2deg) scale(.985); }
        60% { opacity: 1; transform: translateY(0) rotateX(0) scale(1.006); }
        100% { opacity: 1; transform: translateY(0) rotateX(0) scale(1); }
      }
      @keyframes shake { 0%,100% { transform: translateX(0) } 25% { transform: translateX(-2px) } 50% { transform: translateX(2px) } 75% { transform: translateX(-1px) } }
      @keyframes softTilt {
        0% { transform: perspective(1200px) rotateX(0) }
        100%{ transform: perspective(1200px) rotateX(2deg) }
      }
      @keyframes ripple {
        from { transform: scale(0); opacity:.35; }
        to   { transform: scale(2.6); opacity:0; }
      }

      /* ===== WRAPPER : feuille 3D + motif cahier + halo ===== */


      /* ===== TABLE ===== */
    


      /* ===== ZEBRA + LIFT ===== */
   
   
      tbody tr:hover::before{ opacity:.9; }

    
  

      /* ===== COULEUR PAR TYPE via :has() (si supporté) ===== */
      /* Crèche */
      tbody tr:has(td:nth-child(3) .bg-purple-100){
        border-left: 4px solid rgba(168,85,247,.35);
      }
      tbody tr:has(td:nth-child(3) .bg-purple-100):hover{
        box-shadow: var(--shadow-2), 0 0 0 3px rgba(168,85,247,.15) inset;
      }
      /* Garderie */
      tbody tr:has(td:nth-child(3) .bg-amber-100){
        border-left: 4px solid rgba(245,158,11,.35);
      }
      tbody tr:has(td:nth-child(3) .bg-amber-100):hover{
        box-shadow: var(--shadow-2), 0 0 0 3px rgba(245,158,11,.15) inset;
      }
      /* École */
      tbody tr:has(td:nth-child(3) .bg-emerald-100){
        border-left: 4px solid rgba(16,185,129,.35);
        
      }
      tbody tr:has(td:nth-child(3) .bg-emerald-100):hover{
        box-shadow: var(--shadow-2), 0 0 0 3px rgba(16,185,129,.15) inset;
      }

      /* ===== BADGES ===== */
      td .rounded-full.border.shadow-sm{
        transition: transform .16s var(--ease-pop), box-shadow .2s var(--ease-pop), background .2s;
      }
      td .rounded-full.border.shadow-sm:hover{
        transform: translateZ(2px) scale(1.04);
        box-shadow: 0 6px 18px rgba(2,6,23,.12);
    
      }

      /* ===== BOUTONS (icônes) : relief + ripple ===== */
      .inline-flex.h-8.w-8.items-center.justify-center.rounded-lg{
        position: relative;
        overflow: hidden;
        background: linear-gradient(180deg, #fff, #f6f7fb);
        box-shadow: 0 1px 0 rgba(0,0,0,.05), 0 6px 16px rgba(2,6,23,.10);
        transition: transform .15s var(--ease-pop), box-shadow .2s var(--ease-pop), background .2s;
        will-change: transform;
      }
      .inline-flex.h-8.w-8.items-center.justify-center.rounded-lg:hover{
        transform: translateY(-1px);
        box-shadow: var(--shadow-2);
        background: linear-gradient(180deg, #fff, #eef0ff);
      }
      .inline-flex.h-8.w-8.items-center.justify-center.rounded-lg:active{
        transform: translateY(0);
        box-shadow: var(--shadow-1);
      }
      .inline-flex.h-8.w-8.items-center.justify-center.rounded-lg::after{
        content:""; position:absolute; inset:auto; left:50%; top:50%;
        width:120%; aspect-ratio:1; border-radius:9999px;
        background: radial-gradient(circle, rgba(99,102,241,.22), transparent 60%);
        transform: translate(-50%,-50%) scale(0);
      }
      .inline-flex.h-8.w-8.items-center.justify-center.rounded-lg:active::after{
        animation: ripple .4s ease-out;
      }

      /* Supprimer : glow de sécurité */
      button[title="Supprimer"]{ box-shadow: 0 2px 12px rgba(244,63,94,.35); }
      button[title="Supprimer"]:hover{ box-shadow: 0 10px 28px rgba(244,63,94,.45); }

      /* ===== CHIPS ACTIONS ===== */
      .hidden.sm\\:inline-flex.items-center.gap-1.rounded-full{
        box-shadow: 0 2px 10px rgba(2,6,23,.08);
        transition: transform .15s var(--ease-pop), box-shadow .2s var(--ease-pop);
      }
      .hidden.sm\\:inline-flex.items-center.gap-1.rounded-full:hover{
        transform: translateY(-1px);
        box-shadow: var(--shadow-2);
      }

      /* ===== PAGINATION ===== */
      button[aria-label="Précédent"], button[aria-label="Suivant"]{
        background: linear-gradient(180deg, #fff, #f6f7fb);
        box-shadow: 0 1px 0 rgba(0,0,0,.05), 0 6px 16px rgba(2,6,23,.10);
        transition: transform .15s var(--ease-pop), box-shadow .2s var(--ease-pop);
      }
      button[aria-label="Précédent"]:hover, button[aria-label="Suivant"]:hover{
        transform: translateY(-1px);
        box-shadow: var(--shadow-2);
      }

      /* ===== BARRE DE RECHERCHE : halo focus ===== */
      .flex.items-center.gap-2.rounded-xl.border.bg-white.px-3.py-2.shadow-sm:has(input:focus){
        box-shadow: var(--shadow-2), var(--ring-edu);
        animation: softTilt .25s ease both;
      }

      /* Cadre spécial pour les lignes de type Garderie */
tbody tr:has(td:nth-child(3) .bg-amber-100){
  --accent: rgba(245,158,11,.55);
  --accent-soft: rgba(245,158,11,.12);
  isolation: isolate;               /* pour que ::after reste au-dessus du fond */
}
tbody tr:has(td:nth-child(3) .bg-amber-100)::after{
  content:"";
  position:absolute;
  inset: 4px 6px;                   /* marge intérieure du cadre */
  border-radius: 14px;
  pointer-events: none;
  box-shadow:
    0 0 0 2px var(--accent) inset,  /* bord coloré */
    0 12px 26px var(--accent-soft); /* glow */
}

/* (Option) fais pareil pour Crèche / École si tu veux une cohérence visuelle : */
tbody tr:has(td:nth-child(3) .bg-purple-100)::after{
  content:""; position:absolute; inset:4px 6px; border-radius:14px; pointer-events:none;
  box-shadow: 0 0 0 2px rgba(168,85,247,.50) inset, 0 12px 26px rgba(168,85,247,.12);
}
tbody tr:has(td:nth-child(3) .bg-emerald-100)::after{
  content:""; position:absolute; inset:4px 6px; border-radius:14px; pointer-events:none;
  box-shadow: 0 0 0 2px rgba(16,185,129,.50) inset, 0 12px 26px rgba(16,185,129,.12);
}
  /* === Taille des lignes (padding vertical) === */

/* === Effet "carte 3D" pour chaque ligne === */
tbody tr{
  position: relative;              /* nécessaire pour ::after */
  transition: transform .22s var(--ease-pop), box-shadow .22s var(--ease-pop);
}
tbody tr > *{ 
  position: relative; z-index: 1;  /* le contenu reste au-dessus du décor */
}

/* Ombre + léger fond arrondi à l’intérieur de la ligne */
tbody tr::after{
  content:"";
  position: absolute;
  inset: 2px 8px;                  /* marges internes pour le cadre/ombre */
  border-radius: 14px;
  pointer-events: none;
  background: rgba(255,255,255,.55);
  box-shadow: 0 6px 18px rgba(2,6,23,.10);   /* ombre de base */
  z-index: 0;
  transition: transform .22s var(--ease-pop), box-shadow .22s var(--ease-pop);
}

/* Survol : lève la ligne et accentue l’ombre */
tbody tr:hover{
  transform: translateY(-2px);
}
tbody tr:hover::after{
  box-shadow: 0 14px 36px rgba(2,6,23,.18), inset 0 0 0 1px rgba(2,6,23,.06);
}

/* (Option) Appuie visuel quand on clique */
tbody tr:active{ transform: translateY(0); }
tbody tr:active::after{ box-shadow: 0 6px 18px rgba(2,6,23,.12); }

/* Ombre permanente pour CHAQUE LIGNE */
tbody tr{
  position: relative;
}

tbody tr::before{
  content: "";
  position: absolute;
  /* un peu de marge horizontale pour que l'ombre respire */
  left: 2px; right: 2px; top: 0; bottom: 0;
  border-radius: 14px;
  background: #fff;                 /* fond de la “carte” */
  box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px,
              rgba(0, 0, 0, 0.3)    0px 30px 60px -30px,
              rgba(10, 37, 64, .35) 0px -2px 6px 0px inset;
  z-index: 0;                       /* derrière le contenu */
}

/* le contenu reste au-dessus de la carte */
tbody tr > *{
  position: relative;
  z-index: 1;
  background: transparent;
  border: 0;                        /* évite un contour parasite */
}

/* (option) même style pour l'en-tête */
thead tr{
  position: relative;
}
thead tr::before{
  content: "";
  position: absolute;
  left: 0px; right: 0px; top: 0; bottom: 0;
  border-radius: 12px;
  background: rgba(248,249,251,.9);
  box-shadow: rgba(50, 50, 93, 0.18) 0px 30px 60px -20px,
              rgba(0, 0, 0, 0.25)   0px 18px 36px -22px,
              rgba(10, 37, 64, .25) 0px -1px 4px 0px inset;
  z-index: 0;
}
thead th{ position: relative; z-index: 1; }
/* ===== Support-like Pagination ===== */
.ukp-wrap{
  display:flex; align-items:center; justify-content:space-between;
  gap:12px; padding:12px 16px; margin-top:4px;
}
.ukp-info{ font:700 12px/1.2 ui-sans-serif; color:#64748b; }

.ukp-actions{ display:flex; align-items:center; gap:6px; }

/* bouton générique */
.pg-btn{
  min-width:36px; height:36px; padding:0 10px;
  display:inline-flex; align-items:center; justify-content:center;
  border-radius:12px; border:1px solid rgba(2,6,23,.10);
  background:linear-gradient(180deg,#fff,#f6f7fb);
  font:800 13px ui-sans-serif;
  box-shadow:0 1px 0 rgba(0,0,0,.05), 0 10px 18px rgba(2,6,23,.10);
  transition:transform .15s var(--ease-pop), box-shadow .2s var(--ease-pop), background .2s;
}
.pg-btn:hover{ transform:translateY(-1px); box-shadow:var(--shadow-2); }
.pg-btn:disabled{ opacity:.45; transform:none; box-shadow:none; cursor:not-allowed; }

/* numéro actif = gradient support */
.pg-btn.num.active{
  color:#fff; border-color:transparent;
  background:linear-gradient(135deg,#4f46e5,#06b6d4);
  box-shadow:0 10px 24px rgba(79,70,229,.35);
}

/* ellipses (… ) */
.pg-ellipsis{
  min-width:36px; height:36px; display:inline-grid; place-items:center;
  font:800 13px ui-sans-serif; color:#94a3b8;
}

/* accessibilité focus */
.pg-btn:focus-visible{
  outline:none;
  box-shadow:var(--shadow-2), 0 0 0 4px rgba(99,102,241,.18);
}


    `;
    document.head.appendChild(s);
  }, []);
  return null;
};


export default ClientsPage;
