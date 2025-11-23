// /clients/index.jsx
/* eslint-disable */
import React, { useMemo, useState, useRef, useEffect } from "react";
import Card from "components/card";
import { FiSearch, FiFilter, FiMoreVertical, FiDownload, FiPrinter, FiChevronLeft, FiChevronRight, FiPlus } from "react-icons/fi";

import { MdOutlineAssignmentInd } from "react-icons/md";
import { HiOutlineRefresh } from "react-icons/hi";
import { RiPauseCircleLine, RiDeleteBinLine } from "react-icons/ri";

/* ----------------------------------------------------------------
   Données démo (remplacez plus tard par vos données API)
----------------------------------------------------------------- */
const MOCK = [
  {
    id: "C-001",
    name: "Crèche Les Petits Anges",
    type: "creches",
    city: "Tunis (Grand Tunis)",
    subscriptionDate: "2024-01-10",
    plan: "Standard / Mensuel",
    childrenCount: 80,
    educatorsCount: 6,
    status: "Actif",
    commercial: "Salma B.",
    support: "Amine R.",
    history: [
      { at: "2025-02-11 10:21", text: "Facture payée (#F-2190) — 380 DT" },
      { at: "2025-02-08 15:04", text: "Ticket #T-9102 (facturation) résolu" },
      { at: "2025-01-10 09:10", text: "Renouvellement abonnement (Standard)" },
    ],
  },
  {
    id: "G-014",
    name: "Garderie Soleil",
    type: "garderies",
    city: "Ariana",
    subscriptionDate: "2023-10-05",
    plan: "Premium / Annuel",
    childrenCount: 110,
    educatorsCount: 8,
    status: "En retard de paiement",
    commercial: "Yassine L.",
    support: "—",
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
    subscriptionDate: "2024-09-01",
    plan: "Établissement / Annuel",
    childrenCount: 320,
    educatorsCount: 24,
    status: "Actif",
    commercial: "Salma B.",
    support: "Khaled S.",
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
    subscriptionDate: "2025-02-01",
    plan: "Essai 14 jours",
    childrenCount: 44,
    educatorsCount: 4,
    status: "En période d’essai",
    commercial: "—",
    support: "—",
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
    subscriptionDate: "2024-05-20",
    plan: "Standard / Mensuel",
    childrenCount: 78,
    educatorsCount: 5,
    status: "Suspendu",
    commercial: "Yassine L.",
    support: "—",
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

// ---- Styles UI par statut (ring + border + badge) ----
const STATUS_UI = {
  "Actif": {
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
  "Suspendu": {
    ring: "ring-rose-400/70",
    border: "border-rose-300",
    badge: "bg-rose-50 text-rose-700 border-rose-200",
    dot: "bg-rose-500",
  },
};

// Badge statut plus « glossy »
const StatusBadge = ({ status }) => {
  const ui = STATUS_UI[status] || {
    badge: "bg-gray-50 text-gray-700 border-gray-200",
    dot: "bg-gray-400",
  };

  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        "border shadow-sm",
        ui.badge,
      ].join(" ")}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${ui.dot}`} />
      {status}
    </span>
  );
};


const TypeBadge = ({ type }) => {
  const t = TYPE_META[type] || { label: type, chip: "bg-gray-100 text-gray-700" };
  return <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${t.chip}`}>{t.label}</span>;
};

/* ----------------------------------------------------------------
   Exports (CSV + Impression fiche)
----------------------------------------------------------------- */
function exportCSV(rows) {
  const header = [
    "ID", "Nom", "Type", "Ville", "Date abonnement", "Formule",
    "Enfants", "Éducatrices", "Statut", "Commercial", "Support"
  ];
  const lines = rows.map(r => [
    r.id, r.name, TYPE_META[r.type]?.label || r.type, r.city, r.subscriptionDate, r.plan,
    r.childrenCount, r.educatorsCount, r.status, r.commercial, r.support
  ]);
  const csv = [header, ...lines].map(a => a.map(x => `"${String(x ?? "").replace(/"/g, '""')}"`).join(";")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `clients_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}


/* ----------------------------------------------------------------
   Composant principal
----------------------------------------------------------------- */
const ClientsPage = () => {
  // data (à remplacer par un fetch API)
  const [data, setData] = useState(MOCK);

  // UI state
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all"); // all | creches | garderies | ecoles
  const [statusFilter, setStatusFilter] = useState("all"); // all | Actif | En période d’essai | En retard... | Suspendu
  const [sortKey, setSortKey] = useState("name");
  const [sortAsc, setSortAsc] = useState(true);
  // Listes pour les menus déroulants
const TN_GOVS = [
  "Tunis","Ariana","Ben Arous","Manouba","Nabeul","Zaghouan","Bizerte",
  "Béja","Jendouba","Le Kef","Siliana","Sousse","Monastir","Mahdia",
  "Kairouan","Kasserine","Sidi Bouzid","Sfax","Gabès","Médenine",
  "Tataouine","Gafsa","Tozeur","Kebili"
];

const PLAN_OPTIONS = [
  "Essai 14 jours",
  "Standard / Mensuel",
  "Premium / Mensuel",
  "Standard / Annuel",
  "Premium / Annuel",
  "Établissement / Annuel"
];


  // --- MODALE "Ajouter client" ---
const [showAdd, setShowAdd] = useState(false);
const emptyClient = {
  id: "",
  name: "",
  type: "creches",           // creches | garderies | ecoles
  city: "",
  subscriptionDate: new Date().toISOString().slice(0,10),
  plan: "Standard / Mensuel",
  childrenCount: 0,
  educatorsCount: 0,
  status: "Actif",           // Actif | En période d’essai | En retard de paiement | Suspendu
  commercial: "",
  support: "",
  history: []
};
const [newClient, setNewClient] = useState(emptyClient);

const resetNew = () => setNewClient(emptyClient);

const addClient = (e) => {
  e?.preventDefault?.();
  if (!newClient.name.trim() || !newClient.city.trim()) return;

  const prefix = newClient.type === "creches" ? "C" : newClient.type === "garderies" ? "G" : "E";
  const rand   = String(Math.floor(Math.random()*900) + 100).padStart(3,"0");
  const added  = {
    ...newClient,
    id: `${prefix}-${rand}`,
    childrenCount: Number(newClient.childrenCount) || 0,
    educatorsCount: Number(newClient.educatorsCount) || 0,
    history: [
      { at: `${new Date().toISOString().slice(0,10)} 09:00`, text: "Client créé depuis le back-office" },
    ],
  };

  setData((prev) => [added, ...prev]); // ajoute en tête de liste
  setShowAdd(false);
  resetNew();
  // Optionnel: ouvrir directement la fiche
  // setSelected(added);
};


  // pagination
  const PAGE_SIZE = 8;
  const [page, setPage] = useState(1);

  // drawer fiche
  const [selected, setSelected] = useState(null);
  const printableRef = useRef(null);

  // dérivés
  const filtered = useMemo(() => {
    let rows = [...data];
    if (typeFilter !== "all") rows = rows.filter(r => r.type === typeFilter);
    if (statusFilter !== "all") rows = rows.filter(r => r.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.city.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q)
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

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const pageRows = filtered.slice(start, start + PAGE_SIZE);

  useEffect(() => setPage(1), [typeFilter, statusFilter, search]);

  const drawerUI = selected ? (STATUS_UI[selected.status] || {}) : {};

  /* ----------------------- Actions ----------------------- */
  const updateStatus = (id, newStatus) => {
    setData((rows) => rows.map(r => r.id === id ? { ...r, status: newStatus } : r));
    setSelected((s) => s && s.id === id ? { ...s, status: newStatus } : s);
  };
  const setOwner = (id, kind, value) => {
    setData((rows) => rows.map(r => r.id === id ? { ...r, [kind]: value } : r));
    setSelected((s) => s && s.id === id ? { ...s, [kind]: value } : s);
  };

  /* -------------------- Impression PDF ------------------- */
  const printSelected = () => {
    if (!selected) return;
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`
      <html>
        <head>
          <title>Fiche client ${selected.name}</title>
          <style>
            body{font-family: ui-sans-serif,system-ui,Segoe UI,Roboto,Helvetica,Arial; padding:24px}
            h1{font-size:20px;margin:0 0 8px 0}
            h2{font-size:14px;margin:18px 0 8px 0}
            table{width:100%;border-collapse:collapse}
            td{padding:6px 8px;border-bottom:1px solid #eee}
            .muted{color:#667085}
            .chip{display:inline-block;padding:4px 8px;border-radius:999px;background:#f1f5f9;margin-left:8px}
            .right{float:right}
          </style>
        </head>
        <body>
          <h1>${selected.name} <span class="chip">${TYPE_META[selected.type]?.label || selected.type}</span></h1>
          <div class="muted">${selected.id}</div>
          <h2>Informations générales</h2>
          <table>
            <tr><td>Ville</td><td>${selected.city}</td></tr>
            <tr><td>Date d'abonnement</td><td>${selected.subscriptionDate}</td></tr>
            <tr><td>Formule</td><td>${selected.plan}</td></tr>
            <tr><td>Enfants inscrits</td><td>${selected.childrenCount}</td></tr>
            <tr><td>Éducatrices</td><td>${selected.educatorsCount}</td></tr>
            <tr><td>Statut</td><td>${selected.status}</td></tr>
            <tr><td>Commercial</td><td>${selected.commercial}</td></tr>
            <tr><td>Support</td><td>${selected.support}</td></tr>
          </table>

          <h2>Historique</h2>
          <table>${(selected.history||[]).map(h => `<tr><td>${h.at}</td><td>${h.text}</td></tr>`).join("")}</table>
          <script>window.print(); setTimeout(()=>window.close(), 300);</script>
        </body>
      </html>
    `);
    w.document.close();
  };

  /* -------------------- UI Helpers ----------------------- */
  const SortBtn = ({ col, children }) => (
    <button
      onClick={() => {
        if (sortKey === col) setSortAsc(!sortAsc);
        else { setSortKey(col); setSortAsc(true); }
      }}
      className="inline-flex items-center gap-1 hover:text-navy-700"
    >
      {children}
      <span className={`transition-transform ${sortKey === col ? (sortAsc ? "" : "rotate-180") : "opacity-30"}`}>▲</span>
    </button>
  );

  return (
    <div className="space-y-6">
    {/* HEADER */}
<div className="flex flex-wrap items-center justify-between gap-3 mt-2">

  {/* Bouton "Ajouter client" stylé */}
  <button
    onClick={() => setShowAdd(true)}
    className="relative inline-flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm font-bold
               shadow-sm hover:shadow-lg transition-all
               before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-r before:from-indigo-500/20 before:to-sky-400/20
               before:opacity-0 hover:before:opacity-100 before:transition-opacity"
  >
    <span className="grid place-items-center h-6 w-6 rounded-full bg-gradient-to-br from-indigo-500 to-sky-500 text-white shadow">
      <FiPlus />
    </span>
    Ajouter un client
  </button>
</div>


      {/* Filtres */}
      <Card extra="p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Recherche */}
          <div className="flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2 shadow-sm">
            <FiSearch className="opacity-60" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par nom, ville, ID…"
              className="w-72 bg-transparent text-sm outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Type */}
            <div className="inline-flex items-center gap-1 rounded-xl border border-black/10 bg-white px-2 py-1.5 shadow-sm">
              <FiFilter className="opacity-60" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-transparent text-sm outline-none"
              >
                <option value="all">Tous les types</option>
                <option value="creches">Crèches</option>
                <option value="garderies">Garderies</option>
                <option value="ecoles">Écoles</option>
              </select>
            </div>

            {/* Statut */}
            <div className="inline-flex items-center gap-1 rounded-xl border border-black/10 bg-white px-2 py-1.5 shadow-sm">
              <span className="text-xs font-semibold opacity-70">Statut</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-sm outline-none"
              >
                <option value="all">Tous</option>
                {Object.keys(STATUS_UI).map((s) => (
  <option key={s} value={s}>{s}</option>
))}

              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* TABLE */}
    {/* LISTE EN CARTES (remplace tout le bloc TABLE existant) */}
<Card extra="p-4">
  {/* petite zone de tri (réutilise sortKey/sortAsc déjà dans ton state) */}
  <div className="mb-3 flex items-center justify-between gap-2">
    <div className="text-sm text-gray-500">
      {filtered.length} client(s) • page {page} / {Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))}
    </div>

    <div className="flex items-center gap-2">
      <label className="text-xs text-gray-500">Trier par</label>
      <select
        value={sortKey}
        onChange={(e) => setSortKey(e.target.value)}
        className="rounded-lg border border-black/10 bg-white px-2 py-1 text-sm shadow-sm"
      >
        <option value="name">Nom</option>
        <option value="city">Ville</option>
        <option value="type">Type</option>
        <option value="status">Statut</option>
      </select>

      <button
        onClick={() => setSortAsc((s) => !s)}
        className="rounded-lg border border-black/10 bg-white px-2 py-1 text-sm shadow-sm"
        title={sortAsc ? "Ordre croissant" : "Ordre décroissant"}
      >
        {sortAsc ? "▲" : "▼"}
      </button>
    </div>
  </div>

  {/* la grille de cartes */}
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
  {pageRows.map((r, i) => {
 const ui = STATUS_UI[r.status] || {};
  const isLate = r.status === "En retard de paiement";

  return (
    <div
      key={r.id}
      className={[
        "group relative overflow-hidden rounded-2xl bg-white p-4",
        "border shadow-sm transition-all",
        ui.border || "border-gray-200",
        ui.ring ? `ring-1 ${ui.ring}` : "",
        "hover:-translate-y-[2px] hover:shadow-lg",
        isLate ? "animate-[shake_0.5s_ease-in-out_120ms_1]" : "",
        "dark:border-navy-700 dark:bg-navy-800",
      ].join(" ")}
      style={{ animation: `popIn .35s ease-out both`, animationDelay: `${i * 60}ms` }}
    >
      {/* barre d’accent à gauche (dégradé) */}
      <span className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-indigo-500 to-sky-400" />

      {/* header */}
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <h3 className="text-base font-extrabold text-navy-700 dark:text-white">
            {r.name}
          </h3>
          <div className="text-[11px] text-gray-500">{r.id}</div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <TypeBadge type={r.type} />
          <StatusBadge status={r.status} />
        </div>
      </div>

      {/* infos principales */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <div className="text-xs text-gray-500">Localisation</div>
          <div className="font-semibold">{r.city}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Abonnement</div>
          <div className="font-semibold">{r.plan}</div>
          <div className="text-[11px] text-gray-500">depuis {r.subscriptionDate}</div>
        </div>
        <div className="rounded-xl bg-gray-50 px-3 py-2 font-semibold dark:bg-white/5">
          👶 Enfants : {r.childrenCount}
        </div>
        <div className="rounded-xl bg-gray-50 px-3 py-2 font-semibold dark:bg-white/5">
          👩‍🏫 Éducatrices : {r.educatorsCount}
        </div>
      </div>

      {/* actions */}
      <div className="mt-3 flex flex-wrap items-center justify-end gap-2">
        <button
          onClick={() => setSelected(r)}
          className="rounded-lg border border-black/10 bg-white px-3 py-1.5 text-xs font-semibold shadow-sm hover:bg-gray-50"
          title="Ouvrir la fiche"
        >
          Détails
        </button>

        {/* Boutons plus « chips » */}
        <button
          onClick={() => updateStatus(r.id, "Actif")}
          className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 shadow-sm"
          title="Renouveler"
        >
          <HiOutlineRefresh className="inline -mt-[2px]" /> Renouveler
        </button>

        <button
          onClick={() => updateStatus(r.id, "Suspendu")}
          className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-100 shadow-sm"
          title="Suspendre"
        >
          <RiPauseCircleLine className="inline -mt-[2px]" /> Suspendre
        </button>

        <button
          onClick={() => updateStatus(r.id, "Résilié")}
          className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 shadow-sm"
          title="Résilier"
        >
          <RiDeleteBinLine className="inline -mt-[2px]" /> Résilier
        </button>
      </div>
    </div>
  );
})}

  </div>

  {/* pagination identique */}
  <div className="mt-4 flex items-center justify-between gap-3">
    <div className="text-xs text-gray-500">
      Page <span className="font-semibold">{page}</span> / {pageCount} • {filtered.length} clients
    </div>
    <div className="flex items-center gap-1">
      <button
        onClick={() => setPage((p) => Math.max(1, p - 1))}
        disabled={page === 1}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 bg-white text-sm font-semibold shadow-sm disabled:opacity-40"
        aria-label="Précédent"
      >
        <FiChevronLeft />
      </button>
      <button
        onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
        disabled={page === pageCount}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 bg-white text-sm font-semibold shadow-sm disabled:opacity-40"
        aria-label="Suivant"
      >
        <FiChevronRight />
      </button>
    </div>
  </div>
</Card>

{/* DRAWER / FICHE DÉTAILLÉE */}
{selected && (
  <div className="fixed inset-0 z-50 flex">
    {/* overlay */}
    <div
      className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"
      onClick={() => setSelected(null)}
    />

    {/* panneau (scrollable) */}
   <div
  className={[
    "relative ml-auto h-full w-full sm:w-[520px] bg-white dark:bg-navy-800 shadow-2xl",
    "overflow-y-auto max-h-screen overscroll-contain rounded-2xl border",
    drawerUI.border || "border-gray-200",
    drawerUI.ring ? `ring-1 ${drawerUI.ring}` : "",
  ].join(" ")}
>
      {/* entête */}
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

      {/* contenu (scroll) */}
      <div className="space-y-5 p-4 pb-8">
        <Card extra="p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="text-xs text-gray-500">Localisation</div>
              <div className="font-semibold">{selected.city}</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-gray-500">Abonné depuis</div>
              <div className="font-semibold">{selected.subscriptionDate}</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-gray-500">Formule</div>
              <div className="font-semibold">{selected.plan}</div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <div className="rounded-xl bg-gray-50 px-3 py-2 text-sm font-semibold">
              👶 Enfants: {selected.childrenCount}
            </div>
            <div className="rounded-xl bg-gray-50 px-3 py-2 text-sm font-semibold">
              👩‍🏫 Éducatrices: {selected.educatorsCount}
            </div>
            <div className="rounded-xl bg-gray-50 px-3 py-2 text-sm font-semibold">
              <StatusBadge status={selected.status} />
            </div>
          </div>
        </Card>

        <Card extra="p-4">
          <h4 className="mb-3 text-sm font-bold">Assignations</h4>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <label className="text-sm">
              <span className="mb-1 block text-xs text-gray-500">Commercial</span>
              <input
                className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm shadow-sm outline-none"
                value={selected.commercial || ""}
                onChange={(e) => setOwner(selected.id, "commercial", e.target.value)}
                placeholder="Nom du commercial"
              />
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-xs text-gray-500">Support</span>
              <input
                className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm shadow-sm outline-none"
                value={selected.support || ""}
                onChange={(e) => setOwner(selected.id, "support", e.target.value)}
                placeholder="Nom du chargé support"
              />
            </label>
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

        {/* espace de respiration en bas */}
        <div className="h-6" />
      </div>
    </div>
  </div>
)}

{/* MODALE : AJOUTER UN CLIENT (centrée) */}
{showAdd && (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    {/* Overlay */}
    <div
      className="absolute inset-0 bg-black/30 backdrop-blur-sm"
      onClick={() => { setShowAdd(false); resetNew(); }}
    />

    {/* Boîte modale */}
    <form
      onSubmit={addClient}
      className="relative z-10 w-[95%] max-w-xl rounded-2xl bg-white p-5 shadow-2xl dark:bg-navy-800 animate-[fadeIn_.25s_ease-out_both]"
    >
      <div className="mb-4 flex items-start justify-between">
        <h3 className="text-lg font-extrabold text-navy-700 dark:text-white">
          Ajouter un client
        </h3>
        <button
          type="button"
          onClick={() => { setShowAdd(false); resetNew(); }}
          className="rounded-lg border border-black/10 bg-white px-2 py-1 text-xs font-semibold shadow-sm hover:bg-gray-50"
        >
          Fermer
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {/* Nom */}
        <label className="text-sm">
          <span className="mb-1 block text-xs text-gray-500">Nom</span>
          <input
            required
            value={newClient.name}
            onChange={(e)=>setNewClient(v=>({...v,name:e.target.value}))}
            className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm shadow-sm outline-none"
            placeholder="Crèche / Garderie / École…"
          />
        </label>

        {/* Type */}
        <label className="text-sm">
          <span className="mb-1 block text-xs text-gray-500">Type</span>
          <select
            value={newClient.type}
            onChange={(e)=>setNewClient(v=>({...v,type:e.target.value}))}
            className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm shadow-sm outline-none"
          >
            <option value="creches">Crèche</option>
            <option value="garderies">Garderie</option>
            <option value="ecoles">École</option>
          </select>
        </label>

        {/* Localisation (gouvernorat) */}
        <label className="text-sm md:col-span-2">
          <span className="mb-1 block text-xs text-gray-500">Localisation (gouvernorat)</span>
          <select
            required
            value={newClient.city}
            onChange={(e)=>setNewClient(v=>({...v,city:e.target.value}))}
            className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm shadow-sm outline-none"
          >
            <option value="" disabled>— Choisir un gouvernorat —</option>
            {TN_GOVS.map((g)=>(
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </label>

        {/* Date d’abonnement */}
        <label className="text-sm">
          <span className="mb-1 block text-xs text-gray-500">Date d’abonnement</span>
          <input
            type="date"
            value={newClient.subscriptionDate}
            onChange={(e)=>setNewClient(v=>({...v,subscriptionDate:e.target.value}))}
            className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm shadow-sm outline-none"
          />
        </label>

        {/* Formule (plan) */}
        <label className="text-sm">
          <span className="mb-1 block text-xs text-gray-500">Formule</span>
          <select
            required
            value={newClient.plan}
            onChange={(e)=>setNewClient(v=>({...v,plan:e.target.value}))}
            className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm shadow-sm outline-none"
          >
            <option value="" disabled>— Choisir une formule —</option>
            {PLAN_OPTIONS.map((p)=>(
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </label>

        {/* Nb. enfants */}
        <label className="text-sm">
          <span className="mb-1 block text-xs text-gray-500">Nb. enfants</span>
          <input
            type="number" min="0"
            value={newClient.childrenCount}
            onChange={(e)=>setNewClient(v=>({...v,childrenCount:e.target.value}))}
            className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm shadow-sm outline-none"
          />
        </label>

        {/* Nb. éducatrices */}
        <label className="text-sm">
          <span className="mb-1 block text-xs text-gray-500">Nb. éducatrices</span>
          <input
            type="number" min="0"
            value={newClient.educatorsCount}
            onChange={(e)=>setNewClient(v=>({...v,educatorsCount:e.target.value}))}
            className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm shadow-sm outline-none"
          />
        </label>

        {/* Statut */}
        <label className="text-sm">
          <span className="mb-1 block text-xs text-gray-500">Statut</span>
          <select
            value={newClient.status}
            onChange={(e)=>setNewClient(v=>({...v,status:e.target.value}))}
            className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm shadow-sm outline-none"
          >
            <option>Actif</option>
            <option>En période d’essai</option>
            <option>En retard de paiement</option>
            <option>Suspendu</option>
          </select>
        </label>

        {/* Commercial */}
        <label className="text-sm">
          <span className="mb-1 block text-xs text-gray-500">Commercial</span>
          <input
            value={newClient.commercial}
            onChange={(e)=>setNewClient(v=>({...v,commercial:e.target.value}))}
            className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm shadow-sm outline-none"
          />
        </label>

        {/* Support */}
        <label className="text-sm md:col-span-2">
          <span className="mb-1 block text-xs text-gray-500">Support</span>
          <input
            value={newClient.support}
            onChange={(e)=>setNewClient(v=>({...v,support:e.target.value}))}
            className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm shadow-sm outline-none"
          />
        </label>
      </div>

      <div className="mt-4 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => { setShowAdd(false); resetNew(); }}
          className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-semibold shadow-sm hover:bg-gray-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="relative inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-bold text-white
                     bg-gradient-to-r from-indigo-500 to-sky-500 shadow hover:shadow-lg transition-all"
        >
          <FiPlus /> Enregistrer
        </button>
      </div>
    </form>
  </div>
)}




      {/* Keyframes (une fois) */}
      <StyleOnce />
    </div>
  );
};

/* Injecte quelques animations simples une seule fois */
const StyleOnce = () => {
  useEffect(() => {
    if (document.getElementById("clients-kf")) return;
    const s = document.createElement("style");
    s.id = "clients-kf";
    s.innerHTML = `
      @keyframes slideIn {
        from { transform: translateX(20px); opacity: 0 }
        to   { transform: translateX(0);   opacity: 1 }
      }
      @keyframes popIn {
        0%   { transform: translateY(6px) scale(.98); opacity: 0 }
        60%  { transform: translateY(0)   scale(1.01); opacity: 1 }
        100% { transform: translateY(0)   scale(1); }
      }
      @keyframes shake {
        0%,100% { transform: translateX(0) }
        25%     { transform: translateX(-2px) }
        50%     { transform: translateX(2px) }
        75%     { transform: translateX(-1px) }
      }
    `;
    document.head.appendChild(s);
  }, []);
  return null;
};


export default ClientsPage;
