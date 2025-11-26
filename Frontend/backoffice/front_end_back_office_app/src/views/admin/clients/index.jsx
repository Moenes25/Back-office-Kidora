/* eslint-disable */
import React, { useMemo, useState, useEffect } from "react";
import Card from "components/card";
import {
  FiSearch,
  FiFilter,
  FiPrinter,
  FiChevronLeft,
  FiChevronRight,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiEyeOff,
  FiPhone,
  FiMail,
  FiMapPin,
  FiLink,
} from "react-icons/fi";
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
  const t = TYPE_META[type] || {
    label: type,
    chip: "bg-gray-100 text-gray-700",
  };
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${t.chip}`}
    >
      {t.label}
    </span>
  );
};

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
    "Tunis",
    "Ariana",
    "Ben Arous",
    "Manouba",
    "Nabeul",
    "Zaghouan",
    "Bizerte",
    "Béja",
    "Jendouba",
    "Le Kef",
    "Siliana",
    "Sousse",
    "Monastir",
    "Mahdia",
    "Kairouan",
    "Kasserine",
    "Sidi Bouzid",
    "Sfax",
    "Gabès",
    "Médenine",
    "Tataouine",
    "Gafsa",
    "Tozeur",
    "Kebili",
  ];
  const PLAN_OPTIONS = [
    "Essai 14 jours",
    "Standard / Mensuel",
    "Premium / Mensuel",
    "Standard / Annuel",
    "Premium / Annuel",
    "Établissement / Annuel",
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
  const resetNew = () => {
    setNewClient(emptyClient);
    setShowPwd(false);
  };

  const saveClient = (e) => {
    e?.preventDefault?.();
    if (!newClient.name.trim() || !newClient.city.trim()) return;

    const emailOk =
      !newClient.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newClient.email);
    const urlOk =
      !newClient.url_localisation ||
      /^https?:\/\/.+/.test(newClient.url_localisation);
    if (!emailOk) {
      alert("Email invalide");
      return;
    }
    if (!urlOk) {
      alert("URL de localisation invalide");
      return;
    }

    if (editId) {
      setData((prev) =>
        prev.map((r) =>
          r.id === editId ? { ...r, ...newClient, id: editId } : r
        )
      );
    } else {
      const prefix =
        newClient.type === "creches"
          ? "C"
          : newClient.type === "garderies"
          ? "G"
          : "E";
      const rand = String(Math.floor(Math.random() * 900) + 100).padStart(
        3,
        "0"
      );
      const added = {
        ...newClient,
        id: `${prefix}-${rand}`,
        history: [
          {
            at: `${new Date().toISOString().slice(0, 10)} 09:00`,
            text: "Client créé depuis le back-office",
          },
        ],
      };
      setData((prev) => [added, ...prev]);
    }
    setShowAdd(false);
    setEditId(null);
    resetNew();
  };

  // liste/pagination
  const PAGE_SIZE = 8;
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  useEffect(() => setPage(1), [typeFilter, statusFilter, search]);

  const filtered = useMemo(() => {
    let rows = [...data];
    if (typeFilter !== "all") rows = rows.filter((r) => r.type === typeFilter);
    if (statusFilter !== "all")
      rows = rows.filter((r) => r.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (r) =>
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
  const drawerUI = selected ? STATUS_UI[selected.status] || {} : {};

  /* ----------------------- Actions ----------------------- */
  const updateStatus = (id, newStatus) => {
    setData((rows) =>
      rows.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
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
        <h1>${selected.name} <span class="chip">${
      TYPE_META[selected.type]?.label || selected.type
    }</span></h1>
        <div class="muted">${selected.id}</div>
        <h2>Informations générales</h2>
        <table>
          <tr><td>Ville</td><td>${selected.city}</td></tr>
          <tr><td>Adresse</td><td>${selected.address || ""}</td></tr>
          <tr><td>Téléphone</td><td>${selected.phone || ""}</td></tr>
          <tr><td>Email</td><td>${selected.email || ""}</td></tr>
          <tr><td>URL localisation</td><td>${
            selected.url_localisation || ""
          }</td></tr>
          <tr><td>Date d'abonnement</td><td>${
            selected.subscriptionDate
          }</td></tr>
          <tr><td>Formule</td><td>${selected.plan}</td></tr>
          <tr><td>Statut</td><td>${selected.status}</td></tr>
        </table>
        <h2>Historique</h2>
        <table>${(selected.history || [])
          .map((h) => `<tr><td>${h.at}</td><td>${h.text}</td></tr>`)
          .join("")}</table>
        <script>window.print(); setTimeout(()=>window.close(), 300);</script>
      </body></html>
    `);
    w.document.close();
  };

  const startEdit = (row) => {
    setEditId(row.id);
    setNewClient({
      ...row,
      subscriptionDate:
        row.subscriptionDate || new Date().toISOString().slice(0, 10),
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
      await Swal.fire({
        title: "Supprimé",
        text: "Le client a été supprimé.",
        icon: "success",
        timer: 1400,
        showConfirmButton: false,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => {
            setShowAdd(true);
            setEditId(null);
            resetNew();
          }}
          className="border-black/10 relative inline-flex items-center gap-2 rounded-2xl border bg-white px-4 py-2 text-sm font-bold shadow-sm transition-all before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-r before:from-indigo-500/20 before:to-sky-400/20 before:opacity-0 before:transition-opacity hover:shadow-lg hover:before:opacity-100"
        >
          <span className="grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-sky-500 text-white shadow">
            <FiPlus />
          </span>
          Ajouter un client
        </button>
      </div>

      {/* Filtres */}
      <Card extra="p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="border-black/10 flex items-center gap-2 rounded-xl border bg-white px-3 py-2 shadow-sm">
            <FiSearch className="opacity-60" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par nom, ville, ID…"
              className="bg-transparent w-72 text-sm outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="border-black/10 inline-flex items-center gap-1 rounded-xl border bg-white px-2 py-1.5 shadow-sm">
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

            <div className="border-black/10 inline-flex items-center gap-1 rounded-xl border bg-white px-2 py-1.5 shadow-sm">
              <span className="text-xs font-semibold opacity-70">Statut</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-sm outline-none"
              >
                <option value="all">Tous</option>
                {Object.keys(STATUS_UI).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* LISTE EN CARTES */}
      <Card extra="p-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="text-sm text-gray-500">
            {filtered.length} client(s) • page {page} /{" "}
            {Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))}
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500">Trier par</label>
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value)}
              className="border-black/10 rounded-lg border bg-white px-2 py-1 text-sm shadow-sm"
            >
              <option value="name">Nom</option>
              <option value="city">Ville</option>
              <option value="type">Type</option>
              <option value="status">Statut</option>
            </select>

            <button
              onClick={() => setSortAsc((s) => !s)}
              className="border-black/10 rounded-lg border bg-white px-2 py-1 text-sm shadow-sm"
              title={sortAsc ? "Ordre croissant" : "Ordre décroissant"}
            >
              {sortAsc ? "▲" : "▼"}
            </button>
          </div>
        </div>

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
                style={{
                  animation: `popIn .35s ease-out both`,
                  animationDelay: `${i * 60}ms`,
                }}
              >
                {/* accent */}
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

                {/* infos principales organisées */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-xs text-gray-500">Ville</div>
                    <div className="font-semibold">{r.city}</div>
                    {r.address && (
                      <>
                        <div className="mt-1 text-xs text-gray-500">
                          Adresse
                        </div>
                        <div className="font-medium">{r.address}</div>
                      </>
                    )}
                  </div>

                  <div>
                    <div className="text-xs text-gray-500">Abonnement</div>
                    <div className="font-semibold">{r.plan}</div>
                    <div className="text-[11px] text-gray-500">
                      depuis {r.subscriptionDate}
                    </div>
                  </div>

                  {r.phone && (
                    <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2 font-medium dark:bg-white/5">
                      <FiPhone />{" "}
                      <a className="hover:underline" href={`tel:${r.phone}`}>
                        {r.phone}
                      </a>
                    </div>
                  )}
                  {r.email && (
                    <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2 font-medium dark:bg-white/5">
                      <FiMail />{" "}
                      <a className="hover:underline" href={`mailto:${r.email}`}>
                        {r.email}
                      </a>
                    </div>
                  )}

                  {r.url_localisation && (
                    <div className="col-span-2">
                      <a
                        href={r.url_localisation}
                        target="_blank"
                        rel="noreferrer"
                        className="border-black/10 inline-flex items-center gap-2 rounded-lg border bg-white px-3 py-1.5 text-xs font-semibold shadow-sm hover:bg-gray-50"
                        title="Ouvrir la localisation"
                      >
                        <FiMapPin /> Localisation
                      </a>
                    </div>
                  )}
                </div>

                {/* actions */}
                <div className="mt-3 flex flex-wrap items-center justify-end gap-2">
                  <button
                    onClick={() => setSelected(r)}
                    className="border-black/10 rounded-lg border bg-white px-3 py-1.5 text-xs font-semibold shadow-sm hover:bg-gray-50"
                  >
                    Détails
                  </button>
                  <button
                    onClick={() => updateStatus(r.id, "Actif")}
                    className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm hover:bg-emerald-100"
                  >
                    <HiOutlineRefresh className="-mt-[2px]" /> Renouveler
                  </button>
                  <button
                    onClick={() => updateStatus(r.id, "Suspendu")}
                    className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 shadow-sm hover:bg-amber-100"
                  >
                    <RiPauseCircleLine className="-mt-[2px]" /> Suspendre
                  </button>
                  <button
                    onClick={() => updateStatus(r.id, "Résilié")}
                    className="border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold shadow-sm"
                  >
                    <RiDeleteBinLine className="-mt-[2px]" /> Résilier
                  </button>
                </div>

                {/* actions flottantes */}
                <div className="absolute bottom-3 left-3 z-20 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => startEdit(r)}
                    title="Modifier"
                    className="border-black/10 inline-flex h-9 w-9 items-center justify-center rounded-xl border bg-white/90 shadow backdrop-blur hover:bg-white"
                  >
                    <FiEdit2 className="opacity-70" />
                  </button>
                  <button
                    onClick={() => deleteClient(r)}
                    title="Supprimer"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-red-600 text-white shadow hover:bg-red-700"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* pagination */}
        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="text-xs text-gray-500">
            Page <span className="font-semibold">{page}</span> / {pageCount} •{" "}
            {filtered.length} clients
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="border-black/10 inline-flex h-8 w-8 items-center justify-center rounded-lg border bg-white text-sm font-semibold shadow-sm disabled:opacity-40"
              aria-label="Précédent"
            >
              <FiChevronLeft />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              disabled={page === pageCount}
              className="border-black/10 inline-flex h-8 w-8 items-center justify-center rounded-lg border bg-white text-sm font-semibold shadow-sm disabled:opacity-40"
              aria-label="Suivant"
            >
              <FiChevronRight />
            </button>
          </div>
        </div>
      </Card>

      {/* DRAWER / FICHE */}
      {selected && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="bg-black/20 absolute inset-0 backdrop-blur-[1px]"
            onClick={() => setSelected(null)}
          />
          <div
            className={[
              "relative ml-auto h-full w-full bg-white shadow-2xl dark:bg-navy-800 sm:w-[560px]",
              "max-h-screen overflow-y-auto overscroll-contain rounded-2xl border",
              drawerUI.border || "border-gray-200",
              drawerUI.ring ? `ring-1 ${drawerUI.ring}` : "",
            ].join(" ")}
          >
            <div className="sticky top-0 z-10 border-b bg-white/80 p-4 backdrop-blur dark:bg-navy-800/80">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-extrabold text-navy-700 dark:text-white">
                    {selected.name}{" "}
                    <span className="ml-2">
                      <TypeBadge type={selected.type} />
                    </span>
                  </h3>
                  <div className="text-xs text-gray-500">{selected.id}</div>
                </div>
                <button
                  className="border-black/10 rounded-lg border bg-white px-2 py-1 text-xs font-semibold shadow-sm hover:bg-gray-50"
                  onClick={() => setSelected(null)}
                >
                  Fermer
                </button>
              </div>
            </div>

            <div className="space-y-5 p-4 pb-8">
              <Card extra="p-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                    <div className="font-semibold">
                      {selected.subscriptionDate}
                    </div>
                    <div className="text-xs text-gray-500">Formule</div>
                    <div className="font-semibold">{selected.plan}</div>
                  </div>

                  {selected.phone && (
                    <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2 text-sm font-medium">
                      <FiPhone />{" "}
                      <a
                        className="hover:underline"
                        href={`tel:${selected.phone}`}
                      >
                        {selected.phone}
                      </a>
                    </div>
                  )}

                  {selected.email && (
                    <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2 text-sm font-medium">
                      <FiMail />{" "}
                      <a
                        className="hover:underline"
                        href={`mailto:${selected.email}`}
                      >
                        {selected.email}
                      </a>
                    </div>
                  )}

                  <div className="flex items-center gap-3 md:col-span-2">
                    <StatusBadge status={selected.status} />
                    {selected.url_localisation && (
                      <a
                        href={selected.url_localisation}
                        target="_blank"
                        rel="noreferrer"
                        className="border-black/10 inline-flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm font-semibold shadow-sm hover:bg-gray-50"
                      >
                        <FiMapPin /> Ouvrir la localisation
                      </a>
                    )}
                    {selected.url_localisation && (
                      <a
                        href={selected.url_localisation}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-gray-500 hover:underline"
                      >
                        <FiLink /> {selected.url_localisation.split("?")[0]}
                      </a>
                    )}
                  </div>

                  {/* Mot de passe avec œil */}
                  {selected.password && (
                    <div className="md:col-span-2">
                      <div className="mb-1 text-xs text-gray-500">
                        Mot de passe
                      </div>
                      <div className="border-black/10 inline-flex items-center gap-2 rounded-xl border bg-white px-3 py-2 text-sm shadow-sm">
                        <span className="font-mono">
                          {showPwdDetail
                            ? selected.password
                            : "•".repeat(Math.max(8, selected.password.length))}
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowPwdDetail((s) => !s)}
                          className="border-black/10 ml-1 rounded-md border p-1 hover:bg-gray-50"
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
                    onClick={() =>
                      updateStatus(selected.id, "En période d’essai")
                    }
                    className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100"
                  >
                    🧪 Passer en essai
                  </button>
                  <button
                    onClick={() =>
                      updateStatus(selected.id, "En retard de paiement")
                    }
                    className="inline-flex items-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-3 py-2 text-sm font-semibold text-orange-700 hover:bg-orange-100"
                  >
                    ⏰ Marquer en retard
                  </button>
                  <button
                    onClick={() => updateStatus(selected.id, "Suspendu")}
                    className="border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold"
                  >
                    <RiPauseCircleLine /> Suspendre
                  </button>
                  <button
                    onClick={() => updateStatus(selected.id, "Résilié")}
                    className="border-rose-300 bg-rose-100 text-rose-800 hover:bg-rose-200 inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold"
                  >
                    <RiDeleteBinLine /> Résilier
                  </button>
                  <button
                    onClick={printSelected}
                    className="border-black/10 ml-auto inline-flex items-center gap-2 rounded-xl border bg-white px-3 py-2 text-sm font-semibold shadow-sm hover:bg-gray-50"
                  >
                    <FiPrinter /> Export PDF
                  </button>
                </div>
              </Card>

              <Card extra="p-4">
                <h4 className="mb-3 text-sm font-bold">
                  Historique d’activités
                </h4>
                <div className="space-y-2">
                  {(selected.history || []).map((h, i) => (
                    <div
                      key={i}
                      className="border-black/5 rounded-xl border bg-white px-3 py-2 text-sm shadow-sm"
                    >
                      <div className="text-xs text-gray-500">{h.at}</div>
                      <div className="font-medium">{h.text}</div>
                    </div>
                  ))}
                  {(!selected.history || selected.history.length === 0) && (
                    <div className="text-sm text-gray-500">
                      Aucune activité pour le moment.
                    </div>
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
          <div
            className="bg-black/30 absolute inset-0 backdrop-blur-sm"
            onClick={() => {
              setShowAdd(false);
              setEditId(null);
              resetNew();
            }}
          />
          <form
            onSubmit={saveClient}
            className="relative z-10 w-[95%] max-w-xl animate-[fadeIn_.25s_ease-out_both] rounded-2xl bg-white p-5 shadow-2xl dark:bg-navy-800"
          >
            <div className="mb-4 flex items-start justify-between">
              <h3 className="text-lg font-extrabold text-navy-700 dark:text-white">
                {editId ? "Modifier le client" : "Ajouter un client"}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowAdd(false);
                  setEditId(null);
                  resetNew();
                }}
                className="border-black/10 rounded-lg border bg-white px-2 py-1 text-xs font-semibold shadow-sm hover:bg-gray-50"
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
                  onChange={(e) =>
                    setNewClient((v) => ({ ...v, name: e.target.value }))
                  }
                  className="border-black/10 w-full rounded-xl border bg-white px-3 py-2 text-sm shadow-sm outline-none"
                  placeholder="Crèche / Garderie / École…"
                />
              </label>

              <label className="text-sm">
                <span className="mb-1 block text-xs text-gray-500">Type</span>
                <select
                  value={newClient.type}
                  onChange={(e) =>
                    setNewClient((v) => ({ ...v, type: e.target.value }))
                  }
                  className="border-black/10 w-full rounded-xl border bg-white px-3 py-2 text-sm shadow-sm outline-none"
                >
                  <option value="creches">Crèche</option>
                  <option value="garderies">Garderie</option>
                  <option value="ecoles">École</option>
                </select>
              </label>

              <label className="text-sm md:col-span-2">
                <span className="mb-1 block text-xs text-gray-500">
                  Localisation (gouvernorat)
                </span>
                <select
                  required
                  value={newClient.city}
                  onChange={(e) =>
                    setNewClient((v) => ({ ...v, city: e.target.value }))
                  }
                  className="border-black/10 w-full rounded-xl border bg-white px-3 py-2 text-sm shadow-sm outline-none"
                >
                  <option value="" disabled>
                    — Choisir un gouvernorat —
                  </option>
                  {TN_GOVS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </label>

              {/* Adresse complète */}
              <label className="text-sm md:col-span-2">
                <span className="mb-1 block text-xs text-gray-500">
                  Adresse complète
                </span>
                <input
                  value={newClient.address}
                  onChange={(e) =>
                    setNewClient((v) => ({ ...v, address: e.target.value }))
                  }
                  className="border-black/10 w-full rounded-xl border bg-white px-3 py-2 text-sm shadow-sm outline-none"
                  placeholder="Rue, numéro, ville…"
                />
              </label>
              {/* URL localisation */}
              <label className="text-sm">
                <span className="mb-1 block text-xs text-gray-500">
                  URL localisation (Google Maps)
                </span>
                <input
                  type="url"
                  value={newClient.url_localisation}
                  onChange={(e) =>
                    setNewClient((v) => ({
                      ...v,
                      url_localisation: e.target.value,
                    }))
                  }
                  className="border-black/10 w-full rounded-xl border bg-white px-3 py-2 text-sm shadow-sm outline-none"
                  placeholder="https://maps.google.com/…"
                />
              </label>

              {/* Téléphone */}
              <label className="text-sm">
                <span className="mb-1 block text-xs text-gray-500">
                  Téléphone
                </span>
                <input
                  type="tel"
                  value={newClient.phone}
                  onChange={(e) =>
                    setNewClient((v) => ({ ...v, phone: e.target.value }))
                  }
                  className="border-black/10 w-full rounded-xl border bg-white px-3 py-2 text-sm shadow-sm outline-none"
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
                  onChange={(e) =>
                    setNewClient((v) => ({ ...v, email: e.target.value }))
                  }
                  className="border-black/10 w-full rounded-xl border bg-white px-3 py-2 text-sm shadow-sm outline-none"
                  placeholder="contact@exemple.tn"
                />
              </label>

              <label className="text-sm">
                <span className="mb-1 block text-xs text-gray-500">
                  Mot de passe
                </span>

                {/* parent positionné */}
                <div className="relative">
                  <input
                    type={showPwd ? "text" : "password"}
                    name="clientPassword"
                    autoComplete="new-password"
                    value={newClient.password}
                    onChange={(e) =>
                      setNewClient((v) => ({ ...v, password: e.target.value }))
                    }
                    className="border-black/10 w-full rounded-xl border bg-white px-3 py-2 pr-10 text-sm shadow-sm outline-none"
                    placeholder="••••••••"
                  />

                  {/* icône œil */}
                  <button
                    type="button"
                    onClick={() => setShowPwd((s) => !s)}
                    className="border-black/10 absolute right-2 top-1/2 -translate-y-1/2 rounded-md border bg-white px-2 py-1 text-xs shadow-sm"
                    aria-label={
                      showPwd
                        ? "Masquer le mot de passe"
                        : "Afficher le mot de passe"
                    }
                  >
                    {showPwd ? "🙈" : "👁️"}
                  </button>
                </div>
              </label>

              <label className="text-sm">
                <span className="mb-1 block text-xs text-gray-500">
                  Date d’abonnement
                </span>
                <input
                  type="date"
                  value={newClient.subscriptionDate}
                  onChange={(e) =>
                    setNewClient((v) => ({
                      ...v,
                      subscriptionDate: e.target.value,
                    }))
                  }
                  className="border-black/10 w-full rounded-xl border bg-white px-3 py-2 text-sm shadow-sm outline-none"
                />
              </label>

              <label className="text-sm">
                <span className="mb-1 block text-xs text-gray-500">
                  Formule
                </span>
                <select
                  required
                  value={newClient.plan}
                  onChange={(e) =>
                    setNewClient((v) => ({ ...v, plan: e.target.value }))
                  }
                  className="border-black/10 w-full rounded-xl border bg-white px-3 py-2 text-sm shadow-sm outline-none"
                >
                  <option value="" disabled>
                    — Choisir une formule —
                  </option>
                  {PLAN_OPTIONS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-sm">
                <span className="mb-1 block text-xs text-gray-500">Statut</span>
                <select
                  value={newClient.status}
                  onChange={(e) =>
                    setNewClient((v) => ({ ...v, status: e.target.value }))
                  }
                  className="border-black/10 w-full rounded-xl border bg-white px-3 py-2 text-sm shadow-sm outline-none"
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
                onClick={() => {
                  setShowAdd(false);
                  setEditId(null);
                  resetNew();
                }}
                className="border-black/10 rounded-xl border bg-white px-4 py-2 text-sm font-semibold shadow-sm hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="relative inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-sky-500 px-4 py-2 text-sm font-bold text-white shadow transition-all hover:shadow-lg"
              >
                <FiPlus />{" "}
                {editId ? "Enregistrer les modifications" : "Enregistrer"}
              </button>
            </div>
          </form>
        </div>
      )}

      <StyleOnce />
    </div>
  );
};

/* animations */
const StyleOnce = () => {
  useEffect(() => {
    if (document.getElementById("clients-kf")) return;
    const s = document.createElement("style");
    s.id = "clients-kf";
    s.innerHTML = `
      @keyframes slideIn { from { transform: translateX(20px); opacity: 0 } to { transform: translateX(0); opacity: 1 } }
      @keyframes popIn { 0%{ transform: translateY(6px) scale(.98); opacity: 0 } 60%{ transform: translateY(0) scale(1.01); opacity: 1 } 100%{ transform: translateY(0) scale(1); } }
      @keyframes shake { 0%,100% { transform: translateX(0) } 25% { transform: translateX(-2px) } 50% { transform: translateX(2px) } 75% { transform: translateX(-1px) } }
    `;
    document.head.appendChild(s);
  }, []);
  return null;
};

export default ClientsPage;
