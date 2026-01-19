/* eslint-disable */
import React, { useMemo, useState, useEffect } from "react";
import Card from "components/card";
import {
  FiSearch, FiFilter, FiPrinter, FiChevronLeft, FiChevronRight, FiPlus,
  FiEdit2, FiTrash2, FiEye, FiEyeOff, FiPhone, FiMail, FiMapPin, FiLink,
  FiCheckCircle, FiDownload
} from "react-icons/fi";

import WidgetKids from "components/widget/Widget";
import { FiUsers, FiCalendar, FiAlertTriangle, FiHome, FiLayers } from "react-icons/fi";


import { AnimatePresence, motion } from "framer-motion";

import { HiOutlineRefresh } from "react-icons/hi";
import { RiPauseCircleLine, RiDeleteBinLine } from "react-icons/ri";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import api from "services/api"; 
import { getEntreprisesStats , getAllEtablissements, saveEtablissement, updateEtablissement, deleteEtablissement , getUserFromToken , saveAbonnement , updateAbonnement , registerClientAdmin} from "services/entreprisesService";


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
    educateurs: 12, 
   parents: 230,     
    enfants: 405,     
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
    educateurs: 10, 
   parents: 180,     
    enfants: 305, 
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
       educateurs: 14, 
   parents: 260,     
    enfants: 485, 
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
       educateurs: 23, 
   parents: 130,     
    enfants: 305, 
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
       educateurs: 15, 
   parents: 225,     
    enfants: 444, 
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
    Inactif: {
    ring: "ring-slate-300/60",
    border: "border-slate-200",
    badge: "bg-slate-100 text-slate-600 border-slate-300",
    dot: "bg-slate-400",
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

const STATUS_ABONNEMENT_UI = {
  Actif: {
    badge: "bg-cyan-50 text-cyan-700 border-cyan-200",
    dot: "bg-cyan-500",
  },
  "En période d’essai": {
    badge: "bg-violet-50 text-violet-700 border-violet-200",
    dot: "bg-violet-500",
  },
  "En retard de paiement": {
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
  Suspendu: {
    badge: "bg-rose-50 text-rose-700 border-rose-200",
    dot: "bg-rose-500",
  },
  Résilié: {
    badge: "bg-gray-100 text-gray-500 border-gray-300",
    dot: "bg-gray-400",
  },
  "Sans abonnement": {
    badge: "bg-gray-50 text-gray-400 border-gray-200",
    dot: "bg-gray-400",
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

const AbonnementBadge = ({ status }) => {
  const ui = STATUS_ABONNEMENT_UI[status] || {
    badge: "bg-gray-50 text-gray-700 border-gray-200",
    dot: "bg-gray-400"
  };

  return (
    <span className={["inline-flex items-center gap-1.5 rounded-full px-2.5 py-2 text-xs font-semibold", "border shadow-xl", ui.badge].join(" ")}>
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
        <div className="group flex items-center gap-2 rounded-2xl border border-white/20 bg-white/70 px-3 py-2 text-sm shadow-[0_10px_30px_rgba(2,6,23,.10)] backdrop-blur-xl dark:bg-navy-800 dark:text-white">
          <FiSearch className="opacity-60" />
          <input
            value={q}
            onChange={(e)=>setQ(e.target.value)}
            placeholder="Rechercher un client…"
            className="w-72 bg-transparent outline-none placeholder:text-gray-400 dark:bg-navy-800 dark:text-white"
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
          className="mt-3 w-full max-w-xl rounded-2xl border border-white/30 bg-white/80 p-4 shadow-2xl backdrop-blur-xl dark:bg-navy-800"
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
          className="pg-btn "
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
function determinePrice(plan) {
  // Adapte les tarifs à ta logique
  switch (plan) {
    case "Essai 14 jours": return 0;
    case "Standard / Mensuel": return 100;
    case "Premium / Mensuel": return 200;
    case "Standard / Annuel": return 1000;
    case "Premium / Annuel": return 2000;
    case "Établissement / Annuel": return 3000;
    default: return 0;
  }
}

function determineInitialStatus(status) {
  if (status === "En période d’essai") return "ESSAYE";
  if (status === "En retard de paiement") return "RETARD";
  if (status === "Actif") return "PAYEE";
  return "EN_ATTENTE"; // fallback
}

function calculateEndDate(plan) {
  const start = new Date();
  switch (plan) {
    case "Essai 14 jours":
      return new Date(start.setDate(start.getDate() + 14)).toISOString().slice(0, 10);
    case "Standard / Mensuel":
    case "Premium / Mensuel":
      return new Date(start.setMonth(start.getMonth() + 1)).toISOString().slice(0, 10);
    default:
      return new Date(start.setFullYear(start.getFullYear() + 1)).toISOString().slice(0, 10);
  }
}

/* ----------------------------------------------------------------
   Composant principal
----------------------------------------------------------------- */
function convertStatutToLabel(code) {
  switch (code) {
    case "PAYEE": return "Actif";
    case "ESSAYE": return "En période d’essai";
    case "RETARD": return "En retard de paiement";
    case "SUSPENDU": return "Suspendu";
    case "RESILE": return "Résilié";
    default: return "Inconnu";
  }
}



const ClientsPage = () => {
  const [data, setData] = useState([]);
useEffect(() => {
  async function fetchData() {
    try {
      const [etabRes, abnRes] = await Promise.all([
        getAllEtablissements(),
        api.get("/abonnement/all"),
      ]);

      const etablissements = etabRes || [];
      const abonnements = abnRes.data || [];

      // Associer le dernier abonnement à chaque établissement
      const abnMap = {};
      for (const abn of abonnements) {
        const id = abn.etablissement?.idEtablissment;
        if (!id) continue;

        // On garde le plus récent
        if (
          !abnMap[id] ||
          new Date(abn.dateFinAbonnement) > new Date(abnMap[id].dateFinAbonnement)
        ) {
          abnMap[id] = abn;
        }
      }

      // Mapper les données avec l'abonnement
      const mapped = etablissements.map(etab => {
        const abn = abnMap[etab.idEtablissment];
        const usersId = etab.users?.id || etab.usersId || null;

        return {
          id: etab.idEtablissment,
          usersId,
          name: etab.nomEtablissement,
          city: etab.region,
          address: etab.adresse_complet || "",
          phone: etab.telephone || "",
          email: etab.email || "",
          url_localisation: etab.url_localisation || "",
          type:
            etab.type === "CRECHE" ? "creches" :
            etab.type === "GARDERIE" ? "garderies" :
            etab.type === "ECOLE" ? "ecoles" : "autre",
          //status: abn ? convertStatutToLabel(abn?.statut) : "Sans abonnement",
          status: etab.isActive ? "Actif" : "Inactif",
          statusAbonnement: abn ? convertStatutToLabel(abn?.statut) : "Sans abonnement",

          subscriptionDate: abn?.dateDebutAbonnement || "",
          //plan: abn?.formule || "",
          password: etab.password, 
          enfants: etab.nombreEnfants ?? 0,
          parents: etab.nombreParents ?? 0,
          educateurs: etab.nombreEducateurs ?? 0,
          history: [],
        };
      });

      setData(mapped);
    } catch (err) {
      console.error("Erreur chargement établissements + abonnements :", err);
    }
  }

  fetchData();
}, []);



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
    educateurs: 0,   
   parents: 0,     
   enfants: 0,     
    history: [],
  };


  
  const [newClient, setNewClient] = useState(emptyClient);
  const resetNew = () => { setNewClient(emptyClient); setShowPwd(false); };



const [backendStats, setBackendStats] = useState({
  total: 0,
  actifs: 0,
  essais: 0,
  retards: 0,
});

useEffect(() => {
  getEntreprisesStats().then(setBackendStats);
}, []);




async function toBackendPayload(client) {
  const user = getUserFromToken();
  const userId = user?.id;
  if (!userId) throw new Error("ID utilisateur introuvable dans le token");

  const typeMap = {
    creches: "CRECHE",
    garderies: "GARDERIE",
    ecoles: "ECOLE",
  };

  const backendType = typeMap[client.type] || "CRECHE"; // valeur par défaut

  if (!client.name || !client.address || !client.city || !client.phone || !client.email ) {
    throw new Error("Un ou plusieurs champs obligatoires sont manquants.");
  }

  return {
    nomEtablissement: client.name,
    adresse_complet: client.address.trim(),
    region: client.city.trim(),
    telephone: client.phone.trim(),
    url_localisation: client.url_localisation?.trim() || "",
    type: backendType, // ✅ valeur fixée
    email: client.email.trim().toLowerCase(),
    isActive: client.status === "Actif",
    userId,
    userNom: user?.username || "",
    userEmail: user?.sub || "",
    password: client.password || undefined,                // superadmin (collection User)
    usersId: client.usersId,  // admin de l’établissement (collection users)
    nombreEducateurs: client.educateurs ?? 0,
    nombreParents: client.parents ?? 0,
    nombreEnfants: client.enfants ?? 0,
  };
}



const saveClient = async (e) => {
  e.preventDefault();
  const payload = await toBackendPayload(newClient);

  try {
    let added;

    if (editId) {
      await updateEtablissement(editId, payload);   // payload CONTIENT usersId + userId

      setData((prev) =>
        prev.map((r) => (r.id === editId ? { ...r, ...newClient } : r))
      );

      // ✅ Afficher une alerte de succès pour modification
      Swal.fire({
        icon: "success",
        title: "Succès",
        text: "L'établissement a été modifié avec succès.",
        timer: 2000,
        showConfirmButton: false,
      });

    } else {
      // 1. Créer l’établissement
      added = await saveEtablissement(payload);


           // 2) Créer le Users (ADMIN) associé côté "auth"
   /*  if (!newClient.email || !newClient.password) {
       throw new Error("Email et mot de passe sont requis pour créer le compte administrateur.");
     }
     try {
       await registerClientAdmin({
         nom: newClient.name,             // tu peux mettre le nom du responsable si tu l’as
         prenom: "",
         email: newClient.email.trim(),
         password: newClient.password,
         numTel: newClient.phone || "",
         adresse: newClient.address || "",
         imageFile: null,
       });
     } catch (e) {
       console.error("Création du compte ADMIN échouée :", e);
       // au choix : bloquer toute l’opération
       // throw e;
       // ou juste notifier (et continuer l’abonnement)
     }*/

      // 2. Créer l’abonnement lié
      const abnPayload = {
        etablissementId: added.idEtablissment,
        dateDebutAbonnement: newClient.subscriptionDate || new Date().toISOString().slice(0, 10),
        dateFinAbonnement: calculateEndDate(newClient.plan),
        montantPaye: 0,
        montantDu: determinePrice(newClient.plan),
        //formule: newClient.plan,
        statut: determineInitialStatus(newClient.status),
      };

      console.log("Abonnement payload envoyé :", abnPayload);
      await saveAbonnement(abnPayload);

      // 3. Ajouter dans l'état local
      setData((prev) => [{ ...newClient, id: added.idEtablissment }, ...prev]);

      // ✅ Afficher une alerte de succès pour ajout
      Swal.fire({
        icon: "success",
        title: "Succès",
        text: "Établissement + compte ADMIN créés avec succès.",
        timer: 2000,
        showConfirmButton: false,
      });
    }

    // Fermer le formulaire
    setShowAdd(false);
    resetNew();
    setEditId(null);

  } catch (err) {
    const message = err.response?.data?.message || err.message;
    console.error("Backend Error:", message);

    // ❌ Afficher une alerte d'erreur
    Swal.fire({
      icon: "error",
      title: "Erreur",
      text: message || "Une erreur est survenue lors de l'enregistrement.",
    });
  }
};




  const [openFilters, setOpenFilters] = useState(false);

// utils CSV (JS/JSX)
function csvEscape(v) {
  const s = (v ?? "").toString().replace(/\r?\n/g, " ").replace(/"/g, '""');
  return `"${s}"`;
}

function numToExcelText(n) {
  // évite le format scientifique & conserve les zéros initiaux dans Excel
  const s = (n ?? "").toString().trim();
  if (!s) return "";
  return `="${s}"`;
}

function hyperlink(label, url) {
  if (!url) return "";
  // Excel HYPERLINK; dans Sheets/LibreOffice ça s'affichera comme texte
  const safeLabel = label || "Ouvrir";
  return `=HYPERLINK("${url.replace(/"/g, '""')}","${safeLabel.replace(/"/g, '""')}")`;
}

// ---------- CSV universel (UTF-8, ;) ----------
const exportCSV = () => {
  const headers = [
    "ID",
    "Nom",
    "Type (clé)",
    "Type (libellé)",
    "Gouvernorat",
    "Adresse",
    "Téléphone",
    "Email",
    "Localisation (URL)",
    "Abonné depuis",
    "Statut établissement",
    "Statut abonnement",
    "Éducateurs",
    "Parents",
    "Enfants",
  ];

  const rows = filtered.map((r) => {
    const typeLabel = (TYPE_META[r.type] && TYPE_META[r.type].label) || r.type || "";
    return [
      r.id,
      r.name,
      r.type,
      typeLabel,
      r.city || "",
      r.address || "",
      r.phone || "",
      r.email || "",
      r.url_localisation || "",
      r.subscriptionDate || "",
      r.status || "",
      r.statusAbonnement || "",
      r.educateurs ?? 0,
      r.parents ?? 0,
      r.enfants ?? 0,
    ]
      .map(csvEscape)
      .join(";");
  });

  const file = [headers.map(csvEscape).join(";"), ...rows].join("\r\n");
  const blob = new Blob([`\uFEFF${file}`], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `clients_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
};

// ---------- Variante “friendly Excel” (tél. en texte, lien clicable) ----------
const exportCSVForExcel = () => {
  const headers = [
    "ID",
    "Nom",
    "Type (clé)",
    "Type (libellé)",
    "Gouvernorat",
    "Adresse",
    "Téléphone (texte)",
    "Email",
    "Localisation (clic)",
    "Abonné depuis",
    "Statut établissement",
    "Statut abonnement",
    "Éducateurs",
    "Parents",
    "Enfants",
  ];

  const rows = filtered.map((r) => {
    const typeLabel = (TYPE_META[r.type] && TYPE_META[r.type].label) || r.type || "";
    return [
      csvEscape(r.id),
      csvEscape(r.name),
      csvEscape(r.type),
      csvEscape(typeLabel),
      csvEscape(r.city || ""),
      csvEscape(r.address || ""),
      csvEscape(numToExcelText(r.phone || "")),                          // 👈 forcer texte
      csvEscape(r.email || ""),
      csvEscape(hyperlink("Ouvrir la carte", r.url_localisation || "")), // 👈 HYPERLINK
      csvEscape(r.subscriptionDate || ""),
      csvEscape(r.status || ""),
      csvEscape(r.statusAbonnement || ""),
      csvEscape(r.educateurs ?? 0),
      csvEscape(r.parents ?? 0),
      csvEscape(r.enfants ?? 0),
    ].join(";");
  });

  const file = [headers.map(csvEscape).join(";"), ...rows].join("\r\n");
  const blob = new Blob([`\uFEFF${file}`], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `clients_excel_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.csv`;
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
const updateStatus = async (etabId, newStatus) => {
  try {
    const statutMap = {
      "Actif": "PAYEE",
      "En période d’essai": "ESSAYE",
      "En retard de paiement": "RETARD",
      "Suspendu": "SUSPENDU",
      "Résilié": "RESILE",
    };

    const mappedStatut = statutMap[newStatus];
    if (!mappedStatut) throw new Error("Statut non reconnu");

    // 1. Récupérer les abonnements de l’établissement
    const res = await api.get(`/abonnement/byetablissement/${etabId}`);
    const abonnements = res.data;

    if (!abonnements || abonnements.length === 0) {
      throw new Error("Aucun abonnement trouvé pour cet établissement");
    }

    // 2. Prendre le plus récent (par dateFinAbonnement)
    const latest = abonnements.sort((a, b) => new Date(b.dateFinAbonnement) - new Date(a.dateFinAbonnement))[0];

    // 3. Construire le payload
    const client = data.find(c => c.id === etabId);
    if (!client) throw new Error("Client non trouvé");

    const abonnementPayload = {
      etablissementId: etabId,
      dateDebutAbonnement: client.subscriptionDate || new Date().toISOString().slice(0, 10),
      dateFinAbonnement: calculateEndDate(client.plan),
      montantPaye: 0,
      montantDu: determinePrice(client.plan),
      statut: mappedStatut,
      //formule: client.plan,
    };

    // 4. Appel à update avec le vrai ID d’abonnement
    await updateAbonnement(latest.idAbonnement, abonnementPayload);

    // 5. Mise à jour UI
    setData((rows) => rows.map((r) =>
  r.id === etabId ? { ...r, statusAbonnement: newStatus } : r
));
setSelected((s) => s && s.id === etabId ? { ...s, statusAbonnement: newStatus } : s);


    Swal.fire({
      icon: "success",
      title: "Statut mis à jour",
      text: `Nouveau statut : ${newStatus}`,
      timer: 1400,
      showConfirmButton: false,
    });

  } catch (err) {
    console.error("Erreur updateStatus:", err);
    Swal.fire({
      icon: "error",
      title: "Erreur",
      text: err.response?.data?.message || err.message || "Une erreur est survenue.",
    });
  }
};


const printSelected = () => {
  if (!selected) return;

  // Libellés & couleurs (simples) pour les badges
  const typeLabel = (TYPE_META[selected.type]?.label || selected.type || "—");
  const status = selected.status || "—";
  const statusAbn = selected.statusAbonnement || "Sans abonnement";

  const statusPalette = {
    "Actif":                 { bg: "#d1fae5", color: "#065f46" }, // emerald
    "En période d’essai":    { bg: "#e0e7ff", color: "#3730a3" }, // indigo
    "En retard de paiement": { bg: "#fef3c7", color: "#92400e" }, // amber
    "Suspendu":              { bg: "#ffe4e6", color: "#9f1239" }, // rose
    "Inactif":               { bg: "#f1f5f9", color: "#475569" }, // slate
    "Sans abonnement":       { bg: "#f8fafc", color: "#64748b" }, // slate
  };
  const st  = statusPalette[status]     || statusPalette["Inactif"];
  const abn = statusPalette[statusAbn]  || statusPalette["Sans abonnement"];

  const w = window.open("", "_blank");
  if (!w) return;

  w.document.write(`
<!doctype html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Fiche établissement — ${selected.name || ""}</title>
  <style>
    :root{
      --indigo:#4f46e5; --sky:#06b6d4; --cyan:#22d3ee;
      --line:#e5e7eb; --text:#0f172a; --muted:#64748b;
    }
    *{box-sizing:border-box}
    body{
      margin:0; background:#fff; color:var(--text);
      font:14px/1.45 ui-sans-serif,system-ui,Segoe UI,Roboto,Helvetica,Arial;
      padding:24px;
    }
    section{
      max-width:980px; margin:0 auto;
      background:#fff; border:1px solid #e2e8f0; border-radius:16px;
      box-shadow:0 18px 48px rgba(15,23,42,.12); overflow:hidden; position:relative;
    }
    .ribbon{position:absolute; inset:0 0 auto 0; height:120px;
      background:linear-gradient(90deg,#4f46e5,#0ea5e9,#22d3ee); opacity:.92;}
    .wm{position:absolute; right:20px; bottom:24px;
      font-weight:900; font-size:72px; letter-spacing:.02em; color:rgba(15,23,42,.05); user-select:none;}
    header{position:relative; z-index:1; display:grid; gap:16px; grid-template-columns:auto 1fr auto; align-items:center; padding:20px; color:#fff;}
    .logo{height:48px;width:48px;border-radius:12px;display:grid;place-items:center;background:rgba(255,255,255,.2);border:1px solid rgba(255,255,255,.6);font-weight:800;}
    .t-sub{font-size:11px;color:rgba(255,255,255,.85)}
    .t-id{font-size:12px;color:rgba(255,255,255,.85)}
    .t-id b{display:block;font-size:16px;color:#fff}

    .cardbar{
      position:relative; z-index:1; margin:0 16px 16px; border:1px solid var(--line);
      background:#fff; border-radius:12px; display:grid; grid-template-columns:1fr; overflow:hidden;
    }
    @media (min-width:768px){ .cardbar{ grid-template-columns:1fr 1fr; } }
    .card{padding:16px}
    .card + .card{border-top:1px solid var(--line)}
    @media (min-width:768px){ .card + .card{border-top:none; border-left:1px solid var(--line)} }
    .sec{margin:0 16px 16px; border:1px solid var(--line); border-radius:12px; background:#fff;}
    .sec .inner{padding:16px}
    .label{font-size:11px; letter-spacing:.08em; color:#64748b; text-transform:uppercase}
    .kv{margin-top:6px; font-size:14px}
    .row{display:grid; grid-template-columns:1fr 1fr; gap:8px}
    .pill{display:inline-flex;align-items:center;gap:.35rem;padding:.25rem .6rem;border-radius:999px;font-weight:700;font-size:11px}
    .chip{display:inline-flex;align-items:center;background:#eef2ff;color:#3730a3;padding:.25rem .6rem;border-radius:999px;font-weight:700;font-size:11px}
    .muted{color:var(--muted); font-size:12px}
    .ks{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}
    .ks .k{display:inline-flex;align-items:center;gap:6px;padding:.5rem .75rem;border-radius:999px;font-weight:700;font-size:12px}
    .k.indigo{background:#eef2ff;color:#3730a3}
    .k.emerald{background:#d1fae5;color:#065f46}
    .k.sky{background:#e0f2fe;color:#075985}

    table{width:100%;border-collapse:separate;border-spacing:0}
    .hist thead th{font-size:11px;color:#64748b;text-transform:uppercase;text-align:left;padding:10px 12px;border-bottom:1px solid var(--line)}
    .hist td{padding:10px 12px;border-bottom:1px solid var(--line)}
    .footer{display:flex;flex-wrap:wrap;gap:8px;justify-content:space-between; padding:0 16px 16px; color:#64748b; font-size:11px}

    @page { size: A4; margin: 14mm; }
    @media print{
      body{padding:0}
      section{border:none; box-shadow:none; border-radius:0}
      .ribbon{opacity:1}
    }
  </style>
</head>
<body>
  <section>
    <div class="ribbon"></div>
    <div class="wm">ÉTABLISSEMENT</div>

    <header>
      <div class="logo">K</div>
      <div>
        <div style="font-weight:800;font-size:18px;letter-spacing:.01em">Kidora — Fiche établissement</div>
        <div class="t-sub">Généré le ${new Date().toLocaleString("fr-FR")}</div>
      </div>
      <div class="t-id">Identifiant<b>${selected.id || "—"}</b></div>
    </header>

    <!-- Cartes infos -->
    <div class="cardbar">
      <div class="card">
        <div class="label">Établissement</div>
        <div class="kv" style="margin-top:8px">
          <div style="font-weight:700;font-size:16px">${selected.name || "—"} <span class="chip" title="Type">${typeLabel}</span></div>
          ${selected.email ? `<div class="muted" style="margin-top:4px">Email : ${selected.email}</div>` : ``}
          ${selected.phone ? `<div class="muted">Téléphone : ${selected.phone}</div>` : ``}
          <div class="muted">Ville : ${selected.city || "—"}</div>
          ${selected.address ? `<div class="muted">Adresse Complet : ${selected.address}</div>` : ``}
          ${selected.url_localisation ? `<div class="muted" style="margin-top:4px">Localisation : ${selected.url_localisation}</div>` : ``}
        </div>
      </div>

      <div class="card" style="background:linear-gradient(180deg,#f8fafc,#fff)">
        <div class="label">Abonnement & Statuts</div>
        <div class="row" style="margin-top:8px">
          <div>Depuis : <b>${selected.subscriptionDate || "—"}</b></div>
          <div>État :
            <span class="pill" style="background:${st.bg};color:${st.color}">${status}</span>
          </div>
          <div style="grid-column:1/-1">Abonnement :
            <span class="pill" style="background:${abn.bg};color:${abn.color}">${statusAbn}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Effectifs -->
    <div class="sec">
      <div class="inner">
        <div class="label">Effectifs</div>
        <div class="ks">
          <span class="k indigo">🧑‍🏫 ${selected.educateurs ?? 0} éducateurs</span>
          <span class="k emerald">👨‍👩‍👧 ${selected.parents ?? 0} parents</span>
          <span class="k sky">🧒 ${selected.enfants ?? 0} enfants</span>
        </div>
      </div>
    </div>

    <!-- Historique -->
    <div class="sec">
      <div class="inner">
        <div class="label">Historique d’activités</div>
        <table class="hist">
          <thead><tr><th>Date</th><th>Événement</th></tr></thead>
          <tbody>
            ${(selected.history||[])
              .map(h => `<tr><td class="muted">${h.at}</td><td>${h.text}</td></tr>`)
              .join("") || `<tr><td class="muted" colspan="2">Aucune activité.</td></tr>`}
          </tbody>
        </table>
      </div>
    </div>

    <div class="footer">
      <span>Kidora • 10 Rue du Lac, Tunis • +216 00 000 000</span>
      <span>MF: 1234567/A • ${selected.id || ""}</span>
    </div>
  </section>

  <script>window.print(); setTimeout(()=>window.close(), 300);</script>
</body>
</html>
  `);

  w.document.close();
};


  const startEdit = (row) => {
    setEditId(row.id);
    setNewClient({
      ...row,
      usersId: row.usersId || null,
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
    try {
      const ok = await deleteEtablissement(row.id); // ✅ appel API réel
      if (ok) {
        setData((prev) => prev.filter((r) => r.id !== row.id));
        if (selected?.id === row.id) setSelected(null);

        await Swal.fire({
          title: "Supprimé",
          text: "Le client a été supprimé.",
          icon: "success",
          timer: 1400,
          showConfirmButton: false,
        });
      } else {
        throw new Error("Suppression échouée côté serveur.");
      }
    } catch (err) {
      console.error("Erreur suppression :", err);
      Swal.fire({
        title: "Erreur",
        text: err.message || "Une erreur est survenue pendant la suppression.",
        icon: "error",
      });
    }
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

<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-3">
  <WidgetKids
    variant="solid" bg="#4f46e5" size="sm" fx={false}  // indigo
    icon={<FiUsers />} title="Entreprises (total)"
    value={backendStats.total}
  />
  <WidgetKids
    variant="solid" bg="#10b981" size="sm" fx={false}  // emerald
    icon={<FiCheckCircle />} title="Actifs"
    value={backendStats.actifs}
  />
  <WidgetKids
    variant="solid" bg="#a78bfa" size="sm" fx={false}   // violet
    icon={<FiCalendar />} title="En essai"
    value={backendStats.essais}
  />
  <WidgetKids
    variant="solid" bg="#f59e0b" size="sm" fx={false}  // amber → orange
    icon={<FiAlertTriangle />} title="En retard"
    value={backendStats.retards}
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
 <table className="no-ukp min-w-[980px] w-full  border-separate [border-spacing:0_10px] text-slate-800 dark:text-white dark:bg-navy-800 dark:shadow-none">
    {/* EN-TÊTE */}
<thead className="sticky top-0 z-10  dark:text-white">
    <tr
      className="
       rounded-xl ring-1 ring-slate-200 dark:ring-white/10
        bg-white/90 supports-[backdrop-filter]:backdrop-blur
        text-[11px] uppercase tracking-wide
        text-gray-700 dark:text-white
        [&_th]:px-4 [&_th]:py-3 [&_th]:font-semibold
        [&_th:first-child]:rounded-l-xl [&_th:last-child]:rounded-r-xl

        /* peindre les TH (clair) */
        [&_th]:bg-white/85 supports-[backdrop-filter]:[&_th]:bg-white/70 [&_th]:backdrop-blur

        /* peindre les TH (dark) */
        dark:[&_th]:bg-navy-800/90 dark:[&_th]:backdrop-blur-none
         shadow-[0_8px_14px_-8px_rgba(2,6,23,.2)]
          divide-x divide-slate-100 dark:divide-white/10 [&_th]:text-center
      "
    >
      <Th onClick={() => toggleSort("name")}  label="Nom"    sortIcon={headerSortIcon("name")} />
      <Th onClick={() => toggleSort("type")}  label="Type"   sortIcon={headerSortIcon("type")}  />
      <Th onClick={() => toggleSort("city")}  label="Ville"  sortIcon={headerSortIcon("city")}  />
      <Th onClick={() => toggleSort("status")} label="Statut" sortIcon={headerSortIcon("status")} />
      <th className="text-center">Actions</th>
    </tr>
  </thead>

    {/* LIGNES */}
    <tbody className="text-sm dark:bg-navy-800">
      {pageRows.map((r) => (
          <tr
     key={r.id}
     className="   bg-white dark:bg-navy-800
          rounded-xl ring-1 ring-slate-200 dark:ring-white/10
          shadow-sm hover:shadow-md
          transition-colors
          hover:bg-slate-50/70 dark:hover:bg-navy-700/70
          divide-x divide-slate-50 dark:divide-white/10 [&_td]:text-center"
   >
          {/* ID masqué si tu veux */}
          {/* <td className="px-4 py-3 whitespace-nowrap font-mono text-xs text-slate-500">{r.id}</td> */}
          <td className="px-4 py-3 dark:bg-navy-800 dark:text-white">
            <button
              onClick={() => setSelected(r)}
              className="font-semibold text-slate-800 hover:underline dark:text-white"
              title="Voir les détails"
            >
              {r.name}
            </button>
          </td>
          <td className="px-4 py-3 whitespace-nowrap dark:bg-navy-800 dark:text-white">
            <TypeBadge type={r.type} />
          </td>
          <td className="px-4 py-3 dark:bg-navy-800 dark:text-white">{r.city}</td>
          <td className="px-4 py-3 whitespace-nowrap dark:bg-navy-800 dark:text-white">
            <StatusBadge status={r.status} />
          </td>
          <td className="px-4 py-3 dark:bg-navy-800 dark:text-white">
            <div className="flex items-center justify-center gap-1.5">
              <button
                onClick={() => setSelected(r)}
                className="icon-btn dark:text-white"
                title="Détails"
              >
                <FiEye />
              </button>
              <button
                onClick={() => startEdit(r)}
                className="icon-btn dark:text-white"
                title="Modifier"
              >
                <FiEdit2 />
              </button>
              <button
                onClick={() => deleteClient(r)}
                className="icon-btn danger dark:text-white"
                title="Supprimer"
              >
                <FiTrash2 />
              </button>

              {/* actions rapides (compactes) */}
             {/*   <button
                onClick={() => updateStatus(r.id, "Actif")}
                className="chip subtle success"
                title="Marquer Actif"
              >
                Actif
              </button>
              <button
                onClick={() => updateStatus(r.id, "Suspendu")}
                className="chip subtle warning"
                title="Suspendre"
              >
                Suspendre
              </button>
              <button
                onClick={() => updateStatus(r.id, "Résilié")}
                className="chip subtle danger"
                title="Résilier"
              >
                Résilier
              </button> */}
            </div>
          </td>
        </tr>
      ))}

      {pageRows.length === 0 && (
        <tr>
          <td colSpan={6} className="px-4 py-12 text-center text-sm text-slate-500">
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
                  <h3 className="text-md font-extrabold text-navy-700 dark:text-white">
                    {selected.name} <span className="ml-2"><TypeBadge type={selected.type} /></span>
                  </h3>
                 {/*  <div className="text-xs text-gray-500">{selected.id}</div> */}
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
                    <div className="font-semibold text-sm">{selected.city}</div>

                    {selected.address && (
                      <>
                        <div className="text-xs text-gray-500">Adresse</div>
                        <div className="font-medium text-sm">{selected.address}</div>
                      </>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs text-gray-500">Abonné depuis</div>
                    <div className="font-semibold text-sm">{selected.subscriptionDate}</div>
                  </div>
                  

                  {selected.phone && (
                    <div className="rounded-xl bg-gray-50 px-3 py-2 text-sm font-medium flex items-center gap-2 dark:text-gray-800">
                      <FiPhone /> <a className="hover:underline dark:text-gray-800" href={`tel:${selected.phone}`}>{selected.phone}</a>
                    </div>
                  )}

                  {selected.email && (
                    <div className="rounded-xl bg-gray-50 px-3 py-2 text-sm font-medium flex items-center gap-2 dark:text-gray-800">
                      <FiMail /> <a className="hover:underline dark:text-gray-800" href={`mailto:${selected.email}`}>{selected.email}</a>
                    </div>
                  )}

                   {/* Bloc effectifs */}
    <div className="md:col-span-2 mt-2">
      <div className="text-xs text-gray-500 mb-3">Effectifs</div>
      <div className="flex flex-wrap gap-8 text-xs">
        <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-3 font-semibold text-indigo-700">
          🧑‍🏫 {selected.educateurs ?? 0} éducateurs
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-3 font-semibold text-emerald-700">
          👨‍👩‍👧 {selected.parents ?? 0} parents
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-3 py-3 font-semibold text-sky-700">
          🧒 {selected.enfants ?? 0} enfants
        </span>
      </div>
    </div>
            <div className="md:col-span-2 flex items-center gap-3">
                    <div className="space-y-1 text-sm">
                   <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">État établissement :</span>
                      <StatusBadge status={selected.status} />
                  </div>
                 <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">Statut abonnement :</span>
                     <AbonnementBadge status={selected.statusAbonnement} />
                  </div>
                 </div>
             </div>

                  <div className="md:col-span-2 flex items-center gap-3">

                    {selected.url_localisation && (
                      <a
                        href={selected.url_localisation}
                        target="_blank" rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg border border-black/10 bg-white px-3 py-2 text-xs font-semibold shadow-sm hover:bg-gray-50 dark:text-gray-800"
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
                      <div className="text-xs text-gray-500 mb-1 ">Mot de passe</div>
                      <div className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2 text-sm shadow-sm dark:text-gray-800">
                        <span className="font-mono">
                          {showPwdDetail ? selected.password : "•".repeat(Math.max(8, selected.password.length))}
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowPwdDetail(s => !s)}
                          className="ml-1 rounded-md border border-black/10 p-1 hover:bg-gray-50 dark:text-gray-800 dark:hover:bg-gray-200"
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
                    className="dark:text-gray-800 ml-auto inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold shadow-sm hover:bg-gray-50"
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
  <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
    {/* Backdrop */}
    <div
      className="absolute inset-0 bg-black/30 backdrop-blur-sm"
      onClick={() => { setShowAdd(false); setEditId(null); resetNew(); }}
    />

    {/* Panel */}
    <form
      onSubmit={saveClient}
      className="
        relative z-10 w-full max-w-xl
        max-h-[90vh] overflow-y-auto   /* 👈 important */
        rounded-2xl bg-white p-5 shadow-2xl dark:bg-navy-800
        animate-[fadeIn_.25s_ease-out_both]
      "
    >
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
  onChange={(e) => {
    const value = e.target.value;

    // Supprime tout ce qui n'est pas chiffre
    const cleaned = value.replace(/\D/g, "");

    // Si plus de 8 chiffres => ne rien faire
    if (cleaned.length > 8) return;

    setNewClient((v) => ({ ...v, phone: cleaned }));
  }}
  className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm shadow-sm outline-none"
  placeholder="Ex: 12345678"
  required
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
                <span className="mb-1 block text-xs text-gray-500">Statut</span>
             <select
    value={newClient.status}
    onChange={(e) => setNewClient((v) => ({ ...v, status: e.target.value }))}
    className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm shadow-sm outline-none"
  >
    <option value="Actif">✅ Actif</option>
    <option value="Inactif">🚫 Inactif</option>
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
const StyleOnce = () => {
  useEffect(() => {
    const ID = "clients-table-pro";
    document.getElementById(ID)?.remove();

    const s = document.createElement("style");
    s.id = ID;
    s.innerHTML = `
:root{
  --c-text:#0f172a;          /* slate-900 */
  --c-muted:#64748b;         /* slate-500 */
  --c-line:#e5e7eb;          /* gray-200 */
  --c-hover:#f8fafc;         /* slate-50 */
  --c-bg:#ffffff;
  --r:12px;
}

/* En-tête */
thead tr{
  border-bottom:1px solid var(--c-line);
}
thead th{
  padding:12px 16px;
  text-align:left;
  font:600 11px/1.2 ui-sans-serif,system-ui;
  color:var(--c-muted);
  text-transform:uppercase;
  letter-spacing:.02em;
}

/* Cellules */
tbody td{
  padding:12px 16px;
  vertical-align:middle;
  color:#1f2937;            /* gray-800 */
}

/* Lignes */
tbody tr{
  background:var(--c-bg);
  border-bottom:1px solid var(--c-line);
}
tbody tr:hover{
  background:var(--c-hover);
}

/* Boutons icônes “ghost” */
.icon-btn{
  display:inline-flex; align-items:center; justify-content:center;
  width:34px; height:34px;
  border-radius:8px;
  border:1px solid transparent;
  background:transparent;
  color:#334155;            /* slate-700 */
  transition:background .15s ease, border-color .15s ease, color .15s ease, transform .15s ease;
}
.icon-btn:hover{
  background:#f1f5f9;       /* slate-100 */
  border-color:#e2e8f0;     /* slate-200 */
}
.icon-btn:active{ transform:translateY(1px); }
.icon-btn.danger{ color:#b91c1c; }             /* red-700 */
.icon-btn.danger:hover{ background:#fee2e2; border-color:#fecaca; }

/* Petites chips sobres pour actions rapides */
.chip{
  display:inline-flex; align-items:center; gap:.35rem;
  height:30px; padding:0 10px;
  border-radius:999px; font:600 12px/1 ui-sans-serif;
  border:1px solid;
}
.chip.subtle{ background:transparent; }
.chip.success{ color:#065f46; border-color:#a7f3d0; }   /* emerald */
.chip.warning{ color:#7c2d12; border-color:#fed7aa; }   /* orange */
.chip.danger{  color:#7f1d1d; border-color:#fecaca; }   /* red */

/* Badges “Type” et “Statut” existants : adoucir l’ombre */
td .rounded-full.border.shadow-xl,
td .rounded-full.border.shadow-sm{
  box-shadow:none !important;
}

/* Pagination (ta version) : juste un léger clean visuel */
.ukp-wrap{ padding:10px 12px; border-top:1px solid var(--c-line); }
.pg-btn{ border-radius:10px; }
.pg-btn.num.active{
  background:linear-gradient(135deg,#4f46e5,#06b6d4);
  color:#fff;
}

/* ---- Pagination : thème dark ---- */
.dark .ukp-actions .pg-btn {
  /* fond sombre semi-transparent + bordure sombre */
  background: rgba(255, 255, 255, 0.08) !important;
  color: #fff !important;
  border-color: rgba(255, 255, 255, 0.12) !important;
  box-shadow: 0 1px 0 rgba(0,0,0,.25), 0 10px 18px rgba(0,0,0,.20) !important;
}

.dark .ukp-actions .pg-btn:hover {
  background: rgba(255, 255, 255, 0.12) !important;
  box-shadow: 0 12px 24px rgba(0,0,0,.28) !important;
}

.dark .ukp-actions .pg-btn:disabled {
  background: rgba(255, 255, 255, 0.06) !important;
  color: rgba(255,255,255,.6) !important;
  box-shadow: none !important;
  opacity: .55 !important;
}

/* Numéro actif en dark : gradient lisible */
.dark .ukp-actions .pg-btn.num.active {
  color: #fff !important;
  background: linear-gradient(135deg, #4f46e5, #06b6d4) !important;
  border-color: transparent !important;
  box-shadow: 0 10px 24px rgba(79,70,229,.35) !important;
}

/* Ellipses */
.dark .ukp-actions .pg-ellipsis {
  color: #cbd5e1 !important; /* slate-300 */
}

    `;
    document.head.appendChild(s);
  }, []);
  return null;
};



export default ClientsPage;
