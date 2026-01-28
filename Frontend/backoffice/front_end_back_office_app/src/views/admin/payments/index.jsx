/* eslint-disable */
import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiTrendingUp, FiCheckCircle, FiAlertTriangle, FiEye, FiSend, FiEdit2, FiTrash2  } from "react-icons/fi";
import { FiSearch, FiDownload } from "react-icons/fi";
import logoKidora from "assets/img/logo/logo.png";
import {
  FiDownloadCloud,
  FiFilter,
  FiMoreVertical,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { QRCodeCanvas } from "qrcode.react";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// en haut du fichier page.jsx
import { getAllEtablissements } from "services/entreprisesService";
import { createFacture } from "services/factureService";          
import { getFactures, deleteFacture, updateFacture ,  pickAvatarGradient, getFactureFull , getTotalsStats} from "services/factureService";
import { getNombreEnfantsParEtablissement } from "services/dashboardService"; 
import Swal from "sweetalert2";





import { FiUsers, FiActivity, FiStar } from "react-icons/fi"; 
import WidgetKids from "components/widget/Widget";
const CARD_BG = {
  total:  "#4f46e5", // indigo
  paid:   "#10b981", // emerald
  unpaid: "#f59e0b", // amber
  sent:   "#8b5cf6", // purple
};
const PAIEMENT_LABELS = {
  VIREMENT: "Virement bancaire",
  CHEQUE: "Chèque",
  ESPECES: "Espèces",
  CARTE_BANCAIRE: "Carte bancaire",
};
const TVA_RATE = 19;

const fmtMoney = (n) =>
  (Number(n) || 0).toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " DT";

function computeTotals(lines = []) {
  const rows = lines.map(l => {
    const qty = Number(l.qty) || 0;
    const puHT = Number(l.puHT) || 0;

    const ht = qty * puHT;
    const tva = ht * (TVA_RATE / 100);
    const ttc = ht + tva;

    return {
      ...l,
      tvaRate: TVA_RATE,   // 👈 taux clair
      ht,
      tva,
      ttc,
    };
  });

  const subHT = rows.reduce((s, r) => s + r.ht, 0);
  const subTVA = rows.reduce((s, r) => s + r.tva, 0);
  const total = subHT + subTVA;

  return { rows, subHT, subTVA, total };
}


/* --------------------------- Données démo --------------------------- */





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
  onClick={() => onExportCSV("page")}
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
          className="mt-3 w-full max-w-xl rounded-2xl border border-white/30 bg-white/80 p-4 shadow-2xl backdrop-blur-xl dark:bg-navy-800"
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
  const initial = (name || "?").trim().charAt(0).toUpperCase();
  const bg = color ? `bg-gradient-to-br ${color}` : "bg-slate-300"; // fallback neutre
  return (
    <div className="flex items-center gap-3">
      <div className={`h-9 w-9 rounded-full ${bg} shadow-[0_10px_22px_rgba(15,23,42,.25)] grid place-items-center text-sm font-bold text-white`}>
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
/* --------------------------- Modale d’édition --------------------------- */


// Remplace ta FactureModal par cette version "branchée"
const FactureModal = ({ row = {}, onClose, onCreated }) => {
  const [etabs, setEtabs] = useState([]);
  const [etabId, setEtabId] = useState("");          // on envoie l'id au backend
  const [statut, setStatut] = useState("IMPAYEE");   // enum backend
  const [methode, setMethode] = useState("VIREMENT");// valeur par défaut
  const [nombreEnfants, setNombreEnfants] = useState(0);
const [montantEstime, setMontantEstime] = useState(0);

  useEffect(() => {
    (async () => {
      const list = await getAllEtablissements();
      setEtabs(list);
    })();
  }, []);

  // si on vient d'une ligne existante, pré-sélectionner
  useEffect(() => {
    if (!row?.raw) return;
    const id = row.raw?.etablissement?.idEtablissment;
    if (id) setEtabId(id);
    if (row.raw?.statutFacture) setStatut(String(row.raw.statutFacture).toUpperCase());
    if (row.raw?.methode) setMethode(String(row.raw.methode).toUpperCase());
  }, [row]);


  useEffect(() => {
  if (!etabId) return;
  (async () => {
    const count = await getNombreEnfantsParEtablissement(etabId);
    setNombreEnfants(count);
    const montantBase = count * 15;
    const montantTVA = montantBase * 0.19;
    const montantTotal = montantBase + montantTVA + 1;
    setMontantEstime(montantTotal);
  })();
}, [etabId]);

const handleSubmit = async () => {
  if (!etabId) return alert("Sélectionnez un établissement");
const montantHT = nombreEnfants * 15;
const montantTVA = montantHT * 0.19;
const timbreFiscal = 1;
const montantTTC = montantHT + montantTVA + timbreFiscal;
const dto = {
  etablissementId: etabId,
  methode,
  statutFacture: statut
};


  const created = await createFacture(dto);

  const etab = etabs.find(e => String(e.idEtablissment) === String(etabId));

const patched = {
  ...created,
  client: etab?.nomEtablissement || created.client || "",
  email: etab?.email || created.email || "",
  region: etab?.region || created.region || "",

  // 👇 OBLIGATOIRE
  nombreEnfants,
  montantHT,
  montantTVA,
  timbreFiscal,
  montantTTC,
};



  // ✅ assure une couleur même si l’API ne l’a pas mise
  patched.avatarColor = created.avatarColor ||
                        pickAvatarGradient(patched.client || patched.id);

  onCreated?.(patched);

  await Swal.fire({
    icon: "success",
    title: "Nouvelle facture ajoutée",
    text: `${patched.client || "Établissement"} • ${patched.id}`,
    timer: 1800,
    showConfirmButton: false,
  });

  onClose();
};
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl border">
        <h3 className="text-lg font-bold mb-4">{row?.id ? "Nouvelle facture (backend n’expose pas l’édition)" : "Nouvelle facture"}</h3>

        <div className="space-y-3 text-sm">
          <select
            value={etabId}
            onChange={(e)=>setEtabId(e.target.value)}
            className="w-full rounded-xl border p-2"
          >
            <option value="">-- Sélectionnez un établissement --</option>
            {etabs.map(e => (
              <option key={e.idEtablissment} value={e.idEtablissment}>
                {e.nomEtablissement} — {e.region}
              </option>
            ))}
          </select>

          <select
            value={statut}
            onChange={(e)=>setStatut(e.target.value)}
            className="w-full rounded-xl border p-2"
          >
            <option value="PAYEE">Payée</option>
            <option value="IMPAYEE">Impayée</option>
            <option value="EN_ATTENTE">En attente</option>
            <option value="ANNULEE">Annulée</option>
          </select>

         {/*  <select
            value={methode}
            onChange={(e)=>setMethode(e.target.value)}
            className="w-full rounded-xl border p-2"
          >
            <option value="VIREMENT">Virement</option>
            <option value="CARTE_BANCAIRE">Carte bancaire</option>
            <option value="CHEQUE">Chèque</option>
            <option value="ESPECES">Espèces</option>
          </select> */}
        </div>
        <div className="mt-3 text-sm text-slate-700 bg-indigo-50 border border-indigo-200 rounded p-2">
  <p>
    <strong>{nombreEnfants}</strong> enfant{nombreEnfants > 1 ? "s" : ""} associé{nombreEnfants > 1 ? "s" : ""} à cet établissement
  </p>
  <p>
    Montant TTC estimé : <strong>{fmtMoney(montantEstime)}</strong>
  </p>
</div>

        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-xl border px-3 py-1.5 text-sm">Annuler</button>
          <button onClick={handleSubmit} className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">Enregistrer</button>
        </div>
      </div>
    </div>
  );
};


/* --------------------------- INVOICE PREVIEW (créatif) --------------------------- */

const InvoicePreview = React.forwardRef(function InvoicePreview(
  { row, lines, className = "" },
  ref
) {

const montantHT = Number(row?.montantHT);
const montantTVA = Number(row?.montantTVA);
const TIMBRE = Number(row?.timbreFiscal ?? 1);
const montantTTC = Number(row?.montantTTC);



const nombreEnfants = Number(row?.nombreEnfants ?? 0);







const fallbackLines = [{
  desc: `Abonnement Platfome Kidora`,
  qty: 1,
  puHT: montantHT,
}];





const linesToUse = Array.isArray(lines) && lines.length ? lines : fallbackLines;

const calcRows = [{
  desc: `Abonnement Platfome Kidora`,
  qty: 1,
  puHT: montantHT,
  ht: montantHT,
  tva: montantTVA,
  ttc: montantTTC - TIMBRE,
}];

const total = montantTTC;


  const status = row?.status || "Non défini";

  const Hr = ({ className = "" }) => (
    <div className={`h-px w-full bg-slate-300 ${className}`} />
  );
console.log("NOMBRE ENFANTS PREVIEW =", nombreEnfants);


  return (
   <section
  ref={ref}
  className={`mx-auto max-w-[980px] bg-white shadow-md rounded-md border border-slate-300 print:shadow-none print:border-0 print:rounded-none ${className}`}
>
  {/* DATE */}
  <div className="px-6 pt-4 text-[11px] text-slate-500">
    {new Date().toLocaleString("fr-FR")}
  </div>

  {/* EN-TÊTE */}
  <div className="px-6 pt-2 grid grid-cols-1 md:grid-cols-[1fr_1.1fr] gap-4 items-start">
    {/* Société */}
    <div className="border border-slate-300 rounded-md p-3 grid grid-cols-[64px_1fr] gap-6 items-center">
      <div className="h-20 w-20 rounded-md border border-slate-300 grid place-items-center overflow-hidden">
        <img className="object-contain h-18 w-18" src={logoKidora} alt="Kidora" />
      </div>
      <div className="leading-tight gap-6 ">
        <div className="font-extrabold text-[15px] uppercase mb-1">KIDORA</div>
        <div className="text-[12px]">Adresse : Tunis 3074 - Tunisie</div>
        <div className="text-[12px]">MF : 1860471/X</div>
        <div className="text-[12px]">RC : B1417982022 / RNE : 1706280V</div>
        <div className="text-[12px]">Tél : +216 50 000 000</div>
        <div className="text-[12px]">Email : support@kidora.tn</div>
      </div>
    </div>

    {/* Client */}
    <div className="border border-slate-300 rounded-md p-3 h-full">
      <div className="font-semibold text-[13px] mb-1">{row?.client || "—"}</div>
      <div className="text-[12px]">Adresse : {row?.region || "—"} - {row?.pays || "Tunisie"}</div>
      <div className="text-[12px]">{row?.email ? `Email : ${row.email}` : "Email : —"}</div>
        <div className="text-[12px]">{row?.telephone ? `Tél : ${row.telephone}` : "Tél : —"}</div>
      
    </div>
  </div>

  {/* TITRE */}
  <div className="px-6 mt-4">
    <div className="flex items-center gap-4">
      <Hr />
      <h1 className="text-[16px] font-bold whitespace-nowrap">Facture N° {row?.id || "—"}</h1>
      <Hr />
    </div>
  </div>

  {/* Infos client + facture */}
  <div className="px-6 mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-[13px]">
    <div className="border border-slate-300 rounded-md p-3">
      <div className="font-semibold mb-2">Client</div>
      <div className="grid grid-cols-[90px_1fr] gap-y-1">
        <span className="text-slate-500">Nom :</span>
        <span>{row?.client || "—"}</span>
        <span className="text-slate-500">Adresse :</span>
        <span>{row?.region || "—"}</span>
        <span className="text-slate-500">Email :</span>
        <span>{row?.email || "—"}</span>
         <span className="text-slate-500">Téléphone :</span>
            <span>{row?.telephone || "—"}</span>

    <span className="text-slate-500">Type :</span>
    <span>
      {TYPE_META[row?.type]?.label || row?.type || "—"}
    </span>

    <span className="text-slate-500">Enfants :</span>
    <span>
      {row?.nombreEnfants ?? 0}
    </span>
      </div>
    </div>

    <div className="border border-slate-300 rounded-md p-3">
      <div className="font-semibold mb-2">Informations facture</div>
      <div className="grid grid-cols-[120px_1fr] gap-y-1">
        <span className="text-slate-500">Date :</span>
        <span>{row?.date || new Date().toLocaleDateString("fr-FR")}</span>
        <span className="text-slate-500">N° :</span>
        <span>{row?.id || "—"}</span>
        <span className="text-slate-500">Statut :</span>
        <span>{status}</span>
      {/* <span className="text-slate-500">Code Client :</span>
        <span>{row?.codeClient || "CLI-XXXX"}</span>
        <span className="text-slate-500">Code TVA :</span>
        <span>TVA-0F9GO1E4R</span>
        <span className="text-slate-500">Période :</span>
        <span>{row?.periode || "Janvier 2026"}</span>*/}
      </div>
    </div>
  </div>
  

  {/* LIGNES PRODUITS */}
  <div className="px-6 mt-3">
    <table className="w-full text-[13px] border border-slate-300 border-separate border-spacing-0">
      <thead>
        <tr className="bg-slate-100 text-slate-700 uppercase">
          {["Code", "Désignation", "Qté", "P.U. HT", "Remise", "Montant HT", "TVA%", "Montant TTC"].map((h) => (
            <th key={h} className="border border-slate-300 px-2 py-2 text-left text-[11px] font-semibold">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {calcRows.map((r, i) => (
          <tr key={i} className="odd:bg-white even:bg-slate-50">
            <td className="border border-slate-300 px-2 py-1">PROD-001</td>
            <td className="border border-slate-300 px-2 py-1">{r.desc}</td>
            <td className="border border-slate-300 px-2 py-1 text-center">{r.qty}</td>
            <td className="border border-slate-300 px-2 py-1 text-right">{fmtMoney(r.puHT)}</td>
            <td className="border border-slate-300 px-2 py-1 text-center">0%</td>
            <td className="border border-slate-300 px-2 py-1 text-right">{fmtMoney(r.ht)}</td>
            <td className="border border-slate-300 px-2 py-1 text-center">19%</td>
            <td className="border border-slate-300 px-2 py-1 text-right">{fmtMoney(r.ttc)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* TOTALS */}
  <div className="px-6 mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
 {/* TABLE TVA (support multi-taux) */}
<table className="text-[13px] w-full border border-slate-300 border-separate border-spacing-0">
  <thead className="bg-slate-100">
    <tr>
      <th className="border border-slate-300 px-2 py-2 text-left">T.V.A. %</th>
      <th className="border border-slate-300 px-2 py-2 text-left">Assiette</th>
      <th className="border border-slate-300 px-2 py-2 text-left">Montant</th>
    </tr>
  </thead>
 <tbody>
  <tr>
    <td className="border px-2 py-2">19%</td>
    <td className="border px-2 py-2">{fmtMoney(montantHT)}</td>
    <td className="border px-2 py-2">{fmtMoney(montantTVA)}</td>
  </tr>
</tbody>

</table>


    <div className="text-sm border border-slate-300 rounded-md p-3 leading-tight">
  <div className="flex justify-between border-b py-1">
  <span>Total HT</span>
  <strong>{fmtMoney(montantHT)}</strong>
</div>

<div className="flex justify-between border-b py-1">
  <span>Total TVA (19%)</span>
  <strong>{fmtMoney(montantTVA)}</strong>
</div>

<div className="flex justify-between border-b py-1">
  <span>Timbre fiscal</span>
  <strong>{fmtMoney(TIMBRE)}</strong>
</div>

<div className="mt-2 pt-2  flex justify-between text-base font-bold">
  <span>Net à Payer</span>
  <span>{fmtMoney(montantTTC)}</span>
</div>

    </div>
  </div>

  {/* RÉCAP TTC */}
  <div className="px-6 mt-4 text-base font-semibold text-right">
   Total TTC à régler : <strong>{fmtMoney(montantTTC)}</strong>

  </div>

  {/* MODALITÉS DE PAIEMENT & MENTIONS */}
  <div className="px-6 mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-[13px]">
    <div className="border border-slate-300 rounded-md p-3">
      <div className="font-semibold mb-2">Modalités de paiement</div>
      <p>
  Mode de paiement : {PAIEMENT_LABELS[row?.methode?.toUpperCase()] || "—"}
</p>

      <p>Délai de paiement : 30 jours</p>
      <p>RIB Kidora : TN59 1234 5678 9123 4567 89</p>
    </div>

    <div className="border border-slate-300 rounded-md p-3">
      <div className="font-semibold mb-2">Mentions légales</div>
      <p>Facture générée par la plateforme Kidora</p>
      <p>TVA incluse selon la réglementation tunisienne</p>
    </div>
  </div>

  {/* ARRÊTÉ */}
  <div className="px-6 mt-4 text-sm">
    <strong>
      Arrêté la présente Facture à la somme de — {fmtMoney(montantTTC)} —

    </strong>
  </div>

  {/* SIGNATURES */}
  <div className="px-6 mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-center text-slate-700">
    <div className="border border-slate-300 h-28 flex items-end justify-center p-2 rounded">
      Notes
    </div>
    <div className="border border-slate-300 h-28 flex items-end justify-center p-2 rounded">
      Signature Client
    </div>
    <div className="border border-slate-300 h-28 flex items-end justify-center p-2 rounded">
      Signature & Cachet
    </div>
  </div>

  {/* FOOTER */}
  <footer className="px-6 py-5 text-center text-[11px] text-slate-500">
    Commercial Management • KIDORA — contact : +216 50 000 000 — MF: 1860471/X
  </footer>

  {/* Impression */}
  <style>{`
    @media print {
      section { box-shadow: none !important; }
      table { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
    }
  `}</style>
</section>

  );
});



/* --------------------------- Modale d’aperçu (utilise InvoicePreview) --------------------------- */

function InvoiceModal({ row, onClose }) {




  const previewRef = React.useRef(null);

const handlePrint = () => {
  if (!previewRef.current) return;

  // clone du preview
  const clone = previewRef.current.cloneNode(true);
  clone.id = "print-clone";
  document.body.appendChild(clone);

  // Styles pour l’impression dans la même fenêtre
  const style = document.createElement("style");
  style.textContent = `
    @media print {
      body > *:not(#print-clone) { display: none !important; }
      #print-clone { display: block !important; }
      html, body { background: #fff !important; }
    }
  `;
  document.head.appendChild(style);

  // lance l’impression
  window.print();

  // nettoyage après impression
  const cleanup = () => {
    document.head.removeChild(style);
    document.body.removeChild(clone);
    window.removeEventListener("afterprint", cleanup);
  };
  window.addEventListener("afterprint", cleanup);
};



  // Export PDF identique au preview (capture canvas)
const exportPDF = async () => {
  if (!previewRef.current) return;

  const node = previewRef.current;

  // 1) Raster du preview en haute définition
  const canvas = await html2canvas(node, {
    scale: 2,
    backgroundColor: "#ffffff",
    useCORS: true,
  });

  // 2) Dimensions PDF
  const pdf = new jsPDF({ unit: "pt", format: "a4" }); // 595.28 x 841.89
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();

  // 3) Mise à l’échelle pour coller à la largeur
  const imgW = pageW;                          // largeur en points
  const imgH = (canvas.height * imgW) / canvas.width; // hauteur correspondante en points

  // ⚠️ On calcule la hauteur d’une page EN PIXELS
  // px par page = canvas.width * (pageH / pageW)
  const pxPerPage = Math.floor(canvas.width * (pageH / pageW));

  let offsetPx = 0;
  let pageIndex = 0;

  while (offsetPx < canvas.height) {
    const sliceHpx = Math.min(pxPerPage, canvas.height - offsetPx);

    // on crée un canvas "page" en px
    const pageCanvas = document.createElement("canvas");
    pageCanvas.width  = canvas.width;
    pageCanvas.height = sliceHpx;

    const ctx = pageCanvas.getContext("2d");
    ctx.drawImage(
      canvas,
      0, offsetPx,                // src x,y (px)
      canvas.width, sliceHpx,     // src w,h (px)
      0, 0,                       // dst x,y (px)
      pageCanvas.width, sliceHpx  // dst w,h (px)
    );

    const pageData = pageCanvas.toDataURL("image/png");
    if (pageIndex > 0) pdf.addPage();

    // hauteur de cette tranche en POINTS
    const sliceHpt = (sliceHpx * imgW) / canvas.width;

    pdf.addImage(pageData, "PNG", 0, 0, imgW, sliceHpt);

    offsetPx += sliceHpx;
    pageIndex += 1;
  }

  pdf.save(`${row?.id || "facture"}.pdf`);
};


  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* clic sur le backdrop = fermer */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
        <motion.div
          initial={{ y: 12, scale: 0.98, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          exit={{ y: 8, scale: 0.98, opacity: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="relative z-10 w-[800px] max-w-[95vw] max-h-[90vh] overflow-auto rounded-2xl bg-transparent"
        >
          <InvoicePreview ref={previewRef} row={row} />


          {/* barre d’actions (non imprimée) */}
          <div className="mt-3 flex justify-end gap-2 print:hidden">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-1.5 text-sm font-semibold shadow-sm"
            >
              Imprimer
            </button>
            <button
              onClick={exportPDF}
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





/* ============================ Page ============================ */
export default function PaymentsPage() {
  /* --- états --- */
const [viewRow, setViewRow] = useState(null);
  const [rows, setRows] = useState([]);

  // KPIs récupérés de l'API
  const [kpi, setKpi] = useState({ total: 0, payees: 0, impayees: 0, envoyees: null });
const envoyeesEstime = Math.max(0, kpi.total - kpi.impayees);
  useEffect(() => {
    (async () => {
      try {
        const data = await getTotalsStats(); // <- garde bien ce nom
        setKpi(data);
      } catch (e) {
        console.error("KPI fetch error", e);
      }
    })();
  }, []);

  // ✅ construit les cartes à partir du state kpi
  const STAT_CARDS = useMemo(() => {
    const base = [
      { id: "total",  label: "Total des factures",  value: kpi.total,    icon: <FiTrendingUp className="text-2xl" /> },
      { id: "paid",   label: "Factures payées",     value: kpi.payees,   icon: <FiCheckCircle className="text-2xl" /> },
      { id: "unpaid", label: "Factures impayées",   value: kpi.impayees, icon: <FiAlertTriangle className="text-2xl" /> },
      { id: "sent", label: "Factures envoyées", value: envoyeesEstime, icon: <FiSend className="text-2xl" /> }
    ];
    return kpi.envoyees != null
      ? [...base, { id: "sent", label: "Factures envoyées", value: kpi.envoyees, icon: <FiSend className="text-2xl" /> }]
      : base;
  }, [kpi]);

// charge la liste au montage
useEffect(() => {
  (async () => {
    const list = await getFactures();
    setRows(list);
  })();
}, []);

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

// ---------- Helpers CSV (échappement, formats) ----------
function csvEscape(v) {
  // guillemets -> doublés, retours à la ligne -> espace
  const s = (v ?? "").toString().replace(/\r?\n/g, " ").replace(/"/g, '""');
  return `"${s}"`;
}

function formatNumber2(n) {
  // pour afficher 2 décimales dans CSV (EXCEL lira le nombre)
  const x = Number(n) || 0;
  return x.toFixed(2).replace(".", ","); // FR : virgule
}

// transforme "1 juin 2025, 08:22" -> ISO 2025-06-01 08:22
function toIsoFromFr(s) {
  const d = parseFrDate(s);
  if (!d || isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
// ---------- Construit les lignes pour "paiements.csv" ----------
// Remplace ta fonction buildPaymentsCsvRows par celle-ci
function buildPaymentsCsvRows(dataset = [], { includeId = false } = {}) {
  // colonnes dans le même ordre que ton tableau
  const header = includeId
    ? ["id", "date", "etablissement", "type", "gouvernorat", "email", "statut"]
    : ["date", "etablissement", "type", "gouvernorat", "email", "statut"];

  const rows = dataset.map((r) => {
    const base = [
      r.date || "",
      r.client || "",
      (TYPE_META[r.type]?.label ?? r.type ?? ""),
      (r.region ?? ""),
      (r.email ?? ""),
      (r.status ?? ""),
    ];
    return includeId ? [r.id || "", ...base] : base;
  });

  return { header, rows };
}


// ---------- Construit les lignes pour "paiements_lignes.csv" (1 ligne par article) ----------
function buildPaymentLinesCsvRows(dataset = []) {
  const header = [
    "id_facture",
    "date_iso",
    "etablissement",
    "designation",
    "quantite",
    "pu_ht",
    "tva_pct",
    "total_ht",
    "total_ttc"
  ];

  const rows = [];
  dataset.forEach((r) => {
    const items = Array.isArray(r.lines) && r.lines.length
      ? r.lines
      : (r.abonnement ? [{ desc: r.abonnement, qty: 1, puHT: 0, tva: 0 }] : []);

    items.forEach((it) => {
      const qty = Number(it.qty) || 0;
      const pu  = Number(it.puHT) || 0;
      const tva = Number(it.tva) || 0;
      const ht  = qty * pu;
      const ttc = ht + ht * (tva/100);

      rows.push([
        r.id,
        toIsoFromFr(r.date),
        r.client,
        it.desc || "",
        qty,
        formatNumber2(pu),
        tva,
        formatNumber2(ht),
        formatNumber2(ttc)
      ]);
    });
  });

  return { header, rows };
}
// ---------- Écrit un fichier CSV (UTF-8 + BOM) ----------
function downloadCsv(filename, header, rows, separator = ";") {
  const head = header.map(csvEscape).join(separator);
  const body = rows.map(r => r.map(csvEscape).join(separator)).join("\r\n");
  const file = head + "\r\n" + body;
  const blob = new Blob([`\uFEFF${file}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
function exportCSVEnhanced(scope = "visible", dataAll, dataFiltered, selectedSet, pageRows) {
  let data = [];
  if (scope === "selected") {
    data = dataFiltered.filter(r => selectedSet.has(r.id));
  } else if (scope === "all") {
    data = dataAll;
  } else if (scope === "page") {
    data = pageRows;                    // ✅ uniquement la page affichée
  } else {
    data = dataFiltered;                // "visible" = tout le filtré
  }

  const { header: H1, rows: R1 } = buildPaymentsCsvRows(data, { includeId: false });
  downloadCsv(`paiements_${scope}_${new Date().toISOString().slice(0,10)}.csv`, H1, R1);
}


const handleExportCSV = (scope = "visible") =>
  exportCSVEnhanced(scope, rows, filtered, selected, pageRows);

const handleCreated = async (createdRow) => {
  // soit refetch propre
  const list = await getFactures();
  setRows(list);
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

const onRowAction = async (id, action) => {
  setOpenRowMenu(null);
  if (action !== "view") return;

  try {
    const rich = await getFactureFull(id);

    // ✅ le backend fournit déjà TOUT
    setViewRow({
      ...rich,
      montantHT: rich.montantHT,
      montantTVA: rich.montantTVA,
      montantTTC: rich.montantTTC,
      timbreFiscal: rich.timbreFiscal,
      nombreEnfants: rich.nombreEnfants,
    });

  } catch (e) {
    console.error("Erreur chargement facture", e);
    const fallback = rows.find(r => r.id === id);
    setViewRow(fallback || null);
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
  {STAT_CARDS.map((s, i) => <StatCard key={s.id} stat={s} index={i} />)}
</div>


      {/* Header */}
      {/* TOOLBAR */}

<div ref={filterRef} className="relative">
 <PaymentsToolbar
  q={search}
  setQ={(v)=>{ setSearch(v); setPage(1); }}
  onToggleFilters={()=>setOpenFilters(v=>!v)}
  onExportCSV={handleExportCSV}          // ✅ au lieu de passer exportCSVEnhanced directement
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
  <tr className="bg-slate-50/60 text-xs uppercase text-slate-400 dark:text-white dark:bg-navy-700/90 [&_th]:text-center ">
   
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
      className={`transition hover:bg-slate-50/70 dark:text-white dark:bg-navy-800 [&_td]:text-center  relative ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/40"} ${openRowMenu === row.id ? "z-[60]" : ""}`}
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
      className="icon-btn dark:text-white dark:hover:text-gray-800"
      title="Voir"
      onClick={() => onRowAction(row.id, "view")}
      aria-label="Voir"
    >
      <FiEye />
    </button>

   {/*  <button
      className="icon-btn dark:text-white hidden dark:hover:text-gray-800"
      title="Modifier"
      onClick={() => setEditRow(row)}
      aria-label="Modifier"
    >
      <FiEdit2 />
    </button>*/}

    <button
      className="icon-btn dark:text-white dark:hover:text-gray-800"
      title="Envoyer"
      onClick={() => onRowAction(row.id, "send")}
      aria-label="Envoyer"
    >
      <FiSend />
    </button>

  


   {/*  <button
      className="icon-btn danger dark:text-white hidden dark:hover:text-gray-800"
      title="Supprimer"
      onClick={() => onRowAction(row.id, "delete")}
      aria-label="Supprimer"
    >
      <FiTrash2 />
    </button> */}
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
        <InvoiceModal
          row={viewRow}
          onClose={() => setViewRow(null)}
        />
      )}
{editRow && (
  <FactureModal
    row={editRow}
    onClose={() => setEditRow(null)}
      onCreated={(newRow) => {
     // insertion optimiste en tête (sans refetch)
     setRows(prev => [newRow, ...prev]);
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


