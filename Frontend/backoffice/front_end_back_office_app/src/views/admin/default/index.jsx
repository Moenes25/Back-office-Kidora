// src/views/admin/default/index.jsx
import React, { useState, useRef, useEffect } from "react";

// Composants
import WeeklyRevenue from "views/admin/default/components/WeeklyRevenue";
import TotalSpent from "views/admin/default/components/TotalSpent";
import CrechesMap from "components/maps/CrechesMap";
import Card from "components/card";
import WidgetKids from "components/widget/Widget";
import KpiBar from "components/KpiBar";
import AlertsPanel from "components/AlertsPanel";
import AppointmentPlanner from "components/calendar/AppointmentPlanner";
import AIIndicatorsPanel from "components/ai/AIIndicatorsPanel";

import { getTotalEtablissements , getChiffreAffairesTotal,getAlertsData ,  getNextExpirationsByType , getTopEtablissements}  from "services/dashboardService";

// ==== imports d’icônes (remplace tes imports actuels) ====
import {
  FiZap,          // Accès rapide (éclair = action rapide)
  FiUsers,        // bouton "Gérer les admins"
  FiCalendar,     // Planning
  FiLifeBuoy,     // Tickets / support
  FiCpu,          // Analyse IA
  FiSend,         // Envoyer facture
} from "react-icons/fi";

import {
  MdBusiness,            // Ajouter une entreprise
  MdAdminPanelSettings,  // entête "Gestion des admins"
  MdPayments,            // entête "Paiements"
} from "react-icons/md";

import { useNavigate } from "react-router-dom"; // si tu utilises react-router


// icons (lucide via react-icons)
import {
  LuBuilding2,     // établissements
  LuUsers2,        // parents
  LuBaby,          // enfants
  LuTrendingUp,    // chiffre d'affaires
  LuActivity,      // activité
  LuFileBarChart2, // rapports
  LuGauge          // fallback
} from "react-icons/lu";



// sans types TS
const ICONS = {
  "Nombre Totale d'etablissements": <LuBuilding2 />,
  "Nombre Totale de Parents":        <LuUsers2 />,
  "Nombre Totale des Enfants":       <LuBaby />,
  "Chiffres d'Affaires Totales":     <LuTrendingUp />,
  "Nombre d'activité d'etablissement": <LuActivity />,
  "Nombre de raports par jours":     <LuFileBarChart2 />,
};

const pickIcon = (title) => ICONS[title] ?? <LuGauge />;



// à placer au-dessus des 3 configs (près des MOCK DATA)
const MOTION = {
  chart: {
    animations: {
      enabled: true,
      easing: "easeinout",
      speed: 800,
      animateGradually: { enabled: true, delay: 120 }, // cascade bar-by-bar
      dynamicAnimation: { enabled: true, speed: 600 },  // quand les data changent
    },
    dropShadow: { enabled: true, top: 1, left: 0, blur: 3, opacity: 0.12 },
    toolbar: { show: false },
  },
  states: {
    hover:  { filter: { type: "lighten", value: 0.08 } },
    active: { filter: { type: "darken",  value: 0.25 } },
  },
};



// Libellés + couleurs + mois (si tu veux des couleurs cohérentes)
const TYPE_LABELS = ["Garderies", "Crèches", "Écoles"];
const TYPE_COLORS = ["#60a5fa", "#a78bfa", "#34d399"];
const MONTHS_FR = ["Jan","Fév","Mar","Avr","Mai","Juin","Juil","Août","Sep","Oct","Nov","Déc"];

/* === Objectif du mois (RadialBar multiseries) === */
const goalSeries = [78, 72, 65];              // Garderies / Crèches / Écoles

const radialGoalOptions = {
  chart: {
    type: "radialBar",
    toolbar: { show: false },
    animations: {
      enabled: true,
      easing: "easeinout",
      speed: 900,
      animateGradually: { enabled: true, delay: 140 },
      dynamicAnimation: { enabled: true, speed: 600 },
    },
    dropShadow: { enabled: true, top: 2, left: 0, blur: 6, opacity: 0.18 }, // léger 3D
  },
  labels: TYPE_LABELS,                        // ["Garderies","Crèches","Écoles"]
  colors: TYPE_COLORS,                        // ["#60a5fa","#a78bfa","#34d399"]
  stroke: { lineCap: "round" },               // extrémités arrondies
  fill: {
    type: "gradient",
    gradient: {
      shade: "light",
      type: "diagonal1",
      shadeIntensity: 0.3,
      gradientToColors: ["#93c5fd", "#c4b5fd", "#6ee7b7"],
      opacityFrom: 0.95,
      opacityTo: 0.8,
      stops: [0, 60, 100],
    },
  },
  plotOptions: {
    radialBar: {
      startAngle: -90,
      endAngle: 270,                           // cercle complet avec petite rotation
      hollow: {
        size: "58%",
        background: "transparent",
        dropShadow: { enabled: true, top: 3, blur: 6, opacity: 0.12 }, // 3D dans le “trou”
      },
      track: {
        background: "rgba(2,6,23,.06)",       // slate-950/6
        strokeWidth: "100%",
        margin: 6,
        dropShadow: { enabled: true, top: 1, blur: 3, opacity: 0.08 },
      },
      dataLabels: {
        show: true,
        name: {
          show: true,
          offsetY: 18,
          fontSize: "12px",
          color: "#64748b",
        },
        value: {
          show: true,
          offsetY: -8,
          fontSize: "24px",
          fontWeight: 800,
          formatter: (v) => `${Math.round(v)}%`, // valeur centrale
        },
        total: {
          show: true,
          label: "Moyenne",
          fontSize: "12px",
          color: "#475569",
          formatter: (w) => {
            const arr = w.globals.seriesTotals;
            const avg = arr.reduce((a, b) => a + b, 0) / arr.length || 0;
            return `${Math.round(avg)}%`;
          },
        },
      },
    },
  },
  legend: {
    show: true,
    position: "bottom",                        // “labels en dessous”
    fontSize: "12px",
    markers: { width: 10, height: 10, radius: 12 },
    itemMargin: { horizontal: 10, vertical: 4 },
    formatter: (seriesName, opts) =>
      `${seriesName}: ${opts.w.globals.series[opts.seriesIndex]}%`,
  },
  tooltip: { enabled: true, y: { formatter: (v) => `${v}%` } },
};






// Libellés + couleurs communs à nos cartes
const CATEGORY_LABELS = ["Garderies", "Crèches", "Écoles"];
const CATEGORY_COLORS = ["#60a5fa", "#a78bfa", "#34d399"]; // bleu / violet / vert

const retentionCategories = [
  "Jan", "Fév", "Mar", "Avr", "Mai", "Juin",
  "Juil", "Août", "Sep", "Oct", "Nov", "Déc"
];

const retentionValues = [85, 87, 88, 89, 90, 92, 93, 91, 90, 89, 88, 87];


const utilisationCategories = [
  "Jan", "Fév", "Mar", "Avr", "Mai", "Juin",
  "Juil", "Août", "Sep", "Oct", "Nov", "Déc"
];

const utilisationValues = [70, 72, 75, 78, 80, 83, 85, 84, 82, 80, 78, 76];

// 💰 Revenus par type (en DT)
const revenusParType = {
  // 🔁 MODIFIE ICI tes montants
  series: [12500, 9800, 5150], // [Garderies, Crèches, Écoles]
  options: {
    labels: CATEGORY_LABELS,
    legend: { position: "bottom" },
    colors: CATEGORY_COLORS,
    dataLabels: { enabled: false },
    tooltip: {
      y: { formatter: (v) => `${v.toLocaleString("fr-TN")} DT` },
    },
  },
};

export const kpiPaiements = {
  series: [40, 30, 30],
  options: {
    ...MOTION,
    chart: {
      ...MOTION.chart,
      type: "donut",
      animations: {
        ...MOTION.chart.animations,
        speed: 900,
        animateGradually: { enabled: true, delay: 150 },
      },
    },
    stroke: { width: 0 },
    labels: CATEGORY_LABELS,
    legend: { position: "top", fontSize: "12px" },
    colors: CATEGORY_COLORS,
    // dégradé doux entre segments (peut être omis si tu veux des couleurs pleines)
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "diagonal1",
        shadeIntensity: 0.25,
        gradientToColors: ["#93c5fd", "#c4b5fd", "#6ee7b7"],
        opacityFrom: 0.95,
        opacityTo: 0.85,
        stops: [0, 70, 100],
      },
    },
    plotOptions: {
      pie: {
        expandOnClick: true,
        donut: {
          size: "80%",
          labels: {
            show: true,
            total: { show: true, label: "Total", fontSize: "14px", color: "#334155" },
            value: { formatter: (v) => `${Number(v || 0)}%` },
          },
        },
      },
    },
    tooltip: { y: { formatter: (v) => `${v}%` } },
    states: {
      ...MOTION.states,
      hover: { filter: { type: "lighten", value: 0.12 } },
    },
  },
};

/* ===== Helpers charts (sans fichier externe) ===== */
const buildPolarArea = (labels, values) => ({
  type: "polarArea",
  series: values,
  options: {
    ...MOTION,
    labels,
    colors: TYPE_COLORS,
    chart: { ...MOTION.chart, type: "polarArea", dropShadow: { enabled: true, top: 4, blur: 12, opacity: 0.18 } },
    stroke: { width: 0 },
    fill: { opacity: 0.92 },
    yaxis: { show: false },
    legend: { position: "bottom", fontSize: "12px" },
    plotOptions: { polarArea: { rings: { strokeWidth: 1 }, spokes: { strokeWidth: 1 } } },
  },
});

const buildBubbleGalaxy = (series) => ({
  type: "bubble",
  series,
  options: {
    ...MOTION,
    chart: { ...MOTION.chart, type: "bubble", dropShadow: { enabled: true, top: 2, blur: 8, opacity: 0.18 } },
    colors: TYPE_COLORS,
    dataLabels: { enabled: false },
    stroke: { width: 1 },
    xaxis: { type: "numeric", tickAmount: 12, labels: { style: { colors: "#64748b" } } },
    yaxis: { labels: { style: { colors: "#94a3b8" } } },
    fill: {
      opacity: 0.85,
      gradient: { shade: "light", type: "vertical", opacityFrom: 0.95, opacityTo: 0.55, stops: [0, 60, 100] },
    },
    tooltip: { y: { formatter: (v) => `${v}` }, z: { title: "Taille: " } },
  },
});

const buildRangeTimeline = (categories, series) => ({
  type: "rangeBar",
  series,
  options: {
    ...MOTION,
    chart: { ...MOTION.chart, type: "rangeBar" },
    plotOptions: { bar: { horizontal: true, borderRadius: 8, rangeBarGroupRows: true } },
    colors: TYPE_COLORS,
    xaxis: { type: "numeric", labels: { style: { colors: "#64748b" } } },
    yaxis: { categories, labels: { style: { colors: "#94a3b8" } } },
    grid: { borderColor: "rgba(2,6,23,.08)", strokeDashArray: 4 },
    tooltip: { y: { formatter: (val) => (Array.isArray(val) ? `${val[1] - val[0]} h` : val) } },
    legend: { position: "bottom" },
  },
});

const buildTreemap = (data) => ({
  type: "treemap",
  series: [{ data }],
  options: {
    ...MOTION,
    chart: { ...MOTION.chart, type: "treemap" },
    colors: TYPE_COLORS,
    plotOptions: { treemap: { enableShades: true, shadeIntensity: 0.25, useFillColorAsStroke: true } },
    dataLabels: {
      enabled: true,
      style: { fontSize: "12px", fontWeight: 700 },
      formatter: (txt, opt) => `${txt}\n${opt.value}`,
    },
    legend: { show: false },
    tooltip: { y: { formatter: (v) => `${v.toLocaleString("fr-TN")}` } },
  },
});


/* ---------- KPI mini charts (axes visibles) ---------- */
const axisStyle = {
  colors: Array(26).fill("#94a3b8"), // gris lisible (tailwind slate-400)
  fontSize: "11px",
  fontWeight: 600,
};

const gridStyle = {
  show: true,
  borderColor: "rgba(0,0,0,.12)",
  strokeDashArray: 4,
};

const yConf = {
  min: 0,
  max: 100,
  tickAmount: 5,
  labels: { show: true, style: { colors: "#94a3b8", fontSize: "11px", fontWeight: 600 } },
};

export const kpiRetention = {
  series: [{ name: "Rétention", data: retentionValues }],
  options: {
    ...MOTION,
    chart: { ...MOTION.chart, type: "bar" },
    colors: ["#7dd3fc"],
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "vertical",
        shadeIntensity: 0.25,
        opacityFrom: 0.95,
        opacityTo: 0.8,
        stops: [0, 60, 100],
      },
    },
    plotOptions: {
      bar: {
        columnWidth: "45%",
        borderRadius: 8,
        borderRadiusApplication: "end", // arrondi en haut
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: retentionCategories,
      labels: {
        style: { colors: "#64748b", fontSize: "12px", fontWeight: 600 },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      min: 0,
      max: 100,
      tickAmount: 5,
      labels: { formatter: (v) => `${v}%`, style: { colors: "#94a3b8", fontSize: "11px", fontWeight: 600 } },
    },
    grid: { borderColor: "rgba(0,0,0,.08)", strokeDashArray: 4 },
    tooltip: { y: { formatter: (v) => `${v}% de rétention` } },
    legend: { show: false },
  },
};




export const kpiUtilisation = {
  series: [{ name: "Utilisation", data: utilisationValues }],
  options: {
    ...MOTION,
    chart: { ...MOTION.chart, type: "bar" },
    colors: ["#c4b5fd"],
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "vertical",
        shadeIntensity: 0.25,
        opacityFrom: 0.95,
        opacityTo: 0.8,
        stops: [0, 60, 100],
      },
    },
    plotOptions: {
      bar: {
        columnWidth: "45%",
        borderRadius: 8,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: utilisationCategories,
      labels: {
        style: { colors: "#64748b", fontSize: "12px", fontWeight: 600 },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      min: 0,
      max: 100,
      tickAmount: 5,
      labels: { formatter: (v) => `${v}%`, style: { colors: "#94a3b8", fontSize: "11px", fontWeight: 600 } },
    },
    grid: { borderColor: "rgba(0,0,0,.08)", strokeDashArray: 4 },
    tooltip: { y: { formatter: (v) => `${v}% d’utilisation` } },
    legend: { show: false },
  },
};





const newCrechesByMonthOptions = {
  chart: { toolbar: { show: false } },
  xaxis: {
    categories: ["Jan","Fév","Mar","Avr","Mai","Juin","Juil","Août","Sep","Oct","Nov","Déc"],
  },
  dataLabels: { enabled: false },
  colors: ["#4c6fff"],
  plotOptions: { bar: { borderRadius: 6, columnWidth: "45%" } },
};
const newCrechesByMonthData = [
  { name: "Nouvelles crèches", data: [2,3,1,4,5,3,6,4,2,3,4,5] }
];
// --- séries mensuelles par type ---
const monthlyNew = {
  creches:   [2,3,1,4,5,3,6,4,2,3,4,5],
  garderies: [1,2,2,3,3,2,4,3,2,2,3,4],
  ecoles:    [0,1,1,1,2,1,2,1,1,1,1,2],
};

const barBaseOptions = {
  chart: { toolbar: { show: false } },
  xaxis: { categories: ["Jan","Fév","Mar","Avr","Mai","Juin","Juil","Août","Sep","Oct","Nov","Déc"] },
  dataLabels: { enabled: false },
  plotOptions: { bar: { borderRadius: 6, columnWidth: "45%" } },
};

const colorMap = { creches: "#4c6fff", garderies: "#f59e0b", ecoles: "#10b981" };
const labelMap = { creches: "crèches", garderies: "garderies", ecoles: "écoles" };

const barOptionsFor = (type) => ({
  ...barBaseOptions,
  colors: [colorMap[type]],
});
const barSeriesFor = (type) => ([
  { name: `Nouvelles ${labelMap[type]}`, data: monthlyNew[type] }
]);

const totalByType = {
  creches: monthlyNew.creches.reduce((a,b)=>a+b,0),
  garderies: monthlyNew.garderies.reduce((a,b)=>a+b,0),
  ecoles: monthlyNew.ecoles.reduce((a,b)=>a+b,0),
};

// EntityFilter.jsx (ou dans le même fichier)
// Composant drop-down avec style “pill”, 3D léger, accessibilité & clavier

function FilterFX() {
  return (
    <style>{`
      @keyframes pop {
        0% { opacity:0; transform: translateY(6px) scale(.98) }
        70%{ opacity:1; transform: translateY(-2px) scale(1.01) }
        100%{ opacity:1; transform: translateY(0) scale(1) }
      }
      @media (prefers-reduced-motion: reduce){
        .anim-pop{ animation:none !important }
        .tilt{ transform:none !important }
      }
    `}</style>
  );
}

function EntityFilter({ value, onChange, counts = { creches:0, garderies:0, ecoles:0 } }) {
  const [open, setOpen] = React.useState(false);
  const [hover, setHover] = React.useState(-1);
  const ref = React.useRef(null);
  const btnRef = React.useRef(null);

  React.useEffect(() => {
    const onDocClick = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const options = [
    { v: "creches",   label: "Crèches",   count: counts.creches ?? 0,   color: "bg-indigo-500"  },
    { v: "garderies", label: "Garderies", count: counts.garderies ?? 0, color: "bg-amber-500"   },
    { v: "ecoles",    label: "Écoles",    count: counts.ecoles ?? 0,    color: "bg-emerald-500" },
  ];
  const current = options.find(o => o.v === value) ?? options[0];
  const currentIndex = options.findIndex(o => o.v === value);

  const toggle  = () => { setOpen(s => !s); setHover(currentIndex); };
  const select  = (v) => { onChange?.(v); setOpen(false); btnRef.current?.focus(); };
  const onKeyDown = (e) => {
    if (!open && (e.key === "Enter" || e.key === " " || e.key === "ArrowDown")) {
      e.preventDefault(); setOpen(true); setHover(currentIndex); return;
    }
    if (!open) return;
    if (e.key === "Escape") { setOpen(false); btnRef.current?.focus(); }
    if (e.key === "ArrowDown") { e.preventDefault(); setHover(i => (i+1) % options.length); }
    if (e.key === "ArrowUp")   { e.preventDefault(); setHover(i => (i-1+options.length) % options.length); }
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(options[Math.max(0, hover)].v); }
  };

  return (
    <div ref={ref} className="relative">
      <FilterFX/>

      {/* Bouton pill */}
      <button
        ref={btnRef}
        type="button"
        onClick={toggle}
        onKeyDown={onKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="
          group inline-flex items-center gap-2 rounded-2xl border border-black/10
          bg-white/80 px-3 py-1.5 text-sm font-semibold shadow-sm
          hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300
          transition

          dark:bg-slate-800/80 dark:text-slate-200 dark:border-white/10
          dark:hover:bg-slate-800 dark:focus-visible:ring-sky-800
        "
        style={{
          boxShadow: "inset 0 -1px 0 rgba(2,6,23,.06), 0 6px 18px -10px rgba(2,6,23,.18)",
        }}
      >
        {/* pastille colorée */}
        <span className={`h-2 w-2 rounded-full ${current.color}`} aria-hidden />
        <span className="truncate">{current.label}</span>

        {/* compteur */}
        <span className="ml-1 rounded-full bg-black/5 px-2 text-[11px] font-bold dark:bg-white/10">
          {current.count}
        </span>

        {/* chevron */}
        <svg
          width="16" height="16" viewBox="0 0 20 20"
          className={`opacity-70 transition-transform ${open ? "rotate-180" : ""} text-slate-600 dark:text-slate-300`}
          aria-hidden
        >
          <path fill="currentColor" d="M5.23 7.21a.75.75 0 011.06.02L10 11.1l3.71-3.87a.75.75 0 111.08 1.04l-4.24 4.41a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"/>
        </svg>
      </button>

      {/* Menu */}
      {open && (
        <div
          role="listbox"
          aria-activedescendant={hover >= 0 ? `opt-${options[hover].v}` : undefined}
          className="
            absolute right-0 z-20 mt-2 w-56 rounded-2xl border border-black/10 bg-white/95
            backdrop-blur shadow-[0_18px_45px_-22px_rgba(2,6,23,.35)] anim-pop

            dark:bg-slate-900/90 dark:text-slate-200 dark:border-white/10
          "
        >
          {/* pointe */}
          <span className="absolute -top-2 right-6 h-3 w-3 rotate-45 bg-white border-l border-t border-black/10
                           dark:bg-slate-900 dark:border-white/10" />

          <ul className="p-1">
            {options.map((o, i) => {
              const active = value === o.v;
              const hovered = hover === i;
              return (
                <li key={o.v} id={`opt-${o.v}`}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={active}
                    onMouseEnter={() => setHover(i)}
                    onClick={() => select(o.v)}
                    className={[
                      "w-full rounded-xl px-3 py-2 text-left text-sm transition flex items-center justify-between",
                      hovered ? "bg-sky-50 dark:bg-slate-800" : "hover:bg-gray-50 dark:hover:bg-slate-800/80",
                      active
                        ? "ring-1 ring-sky-200 bg-sky-50/70 dark:ring-sky-800 dark:bg-sky-900/30"
                        : "",
                    ].join(" ")}
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      <span className={`h-2 w-2 rounded-full ${o.color}`} />
                      <span className="truncate">{o.label}</span>
                      {active && (
                        <svg width="14" height="14" viewBox="0 0 20 20" className="text-sky-600 dark:text-sky-400">
                          <path fill="currentColor" d="M7.5 13.3l-3-3 1.1-1.1 1.9 1.9 5.4-5.4 1.1 1.1z"/>
                        </svg>
                      )}
                    </span>
                    <span className="rounded-full bg-black/5 px-2 text-[11px] font-bold dark:bg-white/10">
                      {o.count}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}




const topCreches = [
  { nom: "Les Petits Anges", ville: "Tunis", enfants: 120, licence: "Active",  revenue: "250 DT" },
  { nom: "Arc-en-ciel",      ville: "Ariana", enfants: 95,  licence: "Active",  revenue: "210 DT" },
  { nom: "Paradise Kids",    ville: "La Marsa", enfants: 80, licence: "Active",  revenue: "195 DT" },
  { nom: "Happy Kids",       ville: "Ben Arous", enfants: 76, licence: "En alerte", revenue: "180 DT" },
  { nom: "Les Étoiles",      ville: "Nabeul", enfants: 72, licence: "Active",  revenue: "170 DT" },
  { nom: "BabyLand",         ville: "Sousse", enfants: 68, licence: "Expirée", revenue: "0 DT" },
  { nom: "Kids Club",        ville: "Sfax",   enfants: 64, licence: "Active",  revenue: "160 DT" },
  { nom: "MiniMonde",        ville: "Tunis",  enfants: 60, licence: "Active",  revenue: "150 DT" },
  { nom: "Les Oursons",      ville: "Monastir", enfants: 55, licence: "En alerte", revenue: "140 DT" },
  { nom: "Little Stars",     ville: "Bizerte", enfants: 50, licence: "Active",  revenue: "130 DT" },
];
// EXEMPLES - à adapter avec tes vraies données
const topGarderies = [
  { nom: "Garderie Soleil", ville: "Tunis", enfants: 110, licence: "Active", revenue: "230 DT" },
  { nom: "Nounours", ville: "Sfax", enfants: 78, licence: "En alerte", revenue: "150 DT" },
  { nom: "Les Lutins", ville: "Sousse", enfants: 66, licence: "Active", revenue: "140 DT" },
];

const topEcoles = [
  { nom: "École Horizon", ville: "Ariana", enfants: 320, licence: "Active", revenue: "900 DT" },
  { nom: "École Les Sources", ville: "Nabeul", enfants: 260, licence: "Active", revenue: "740 DT" },
];

const nextExpirationByType = {
  creches: {
    nom: "Crèche Arc-en-ciel",
    licence: "Licence Standard",
    date: "03/12/2025",
    restant: "J-5",
  },
  garderies: {
    nom: "Garderie Soleil",
    licence: "Licence Premium",
    date: "12/11/2025",
    restant: "J-12",
  },
  ecoles: {
    nom: "École Horizon",
    licence: "Licence Établissement",
    date: "21/01/2026",
    restant: "J-45",
  },
};



// --- pagination table ---
const PAGE_SIZE = 3;

function WidgetFX() {
  return (
    <style>{`
      /* ===== motion safety ===== */
      @media (prefers-reduced-motion: reduce) {
        .motion-ok { transition: none !important; animation: none !important; }
      }

      /* ===== keyframes ===== */
      @keyframes kpi-enter {
        0% { opacity: 0; transform: translateY(10px) scale(.98) }
        60%{ opacity: 1; transform: translateY(-2px) scale(1.01) }
        100%{ opacity: 1; transform: translateY(0) scale(1) }
      }
      @keyframes shine {
        from { background-position: 200% 0 }
        to   { background-position: -200% 0 }
      }
      @keyframes icon-float { 
        0%,100% { transform: translateY(0) } 
        50% { transform: translateY(-3px) } 
      }
      @keyframes icon-pop {
        0% { transform: scale(1) }
        50% { transform: scale(1.08) }
        100% { transform: scale(1) }
      }

      .animate-enter { animation: kpi-enter .34s cubic-bezier(.2,0,0,1) both }
      .animate-shine { animation: shine 2.2s linear infinite }
      .animate-icon-float { animation: icon-float 3s ease-in-out infinite }
      .animate-icon-pop   { animation: icon-pop .4s ease both }

      /* grain subtil pour un rendu premium */
      .grain:before {
        content: ""; position: absolute; inset: 0; pointer-events: none; opacity: .06;
        background: url("data:image/svg+xml;utf8,\
<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'>\
<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter>\
<rect width='100%' height='100%' filter='url(#n)' opacity='.25'/>\
</svg>") center/200px 200px repeat;
        mix-blend-mode: overlay; border-radius: 20px;
      }
    `}</style>
  );
}





function SectionCard({ icon, title, children, footer }) {
  return (
    <div className="
      h-full flex flex-col
      rounded-2xl overflow-hidden bg-white
      shadow-[0_14px_38px_rgba(2,6,23,.12)] ring-1 ring-black/5 dark:bg-navy-800 dark:text-white
    ">
      {/* header */}
      <div className="flex items-center gap-2 bg-[#3b5edb] text-white px-4 py-3 text-sm font-semibold">
        <span className="inline-grid h-5 w-5 place-items-center rounded-md bg-white/15">{icon}</span>
        <span>{title}</span>
      </div>

      {/* body: occupe l’espace restant */}
      <div className="p-4 flex-1">{children}</div>

      {/* footer: reste collé en bas */}
      {footer && <div className="px-4 pb-4 mt-auto">{footer}</div>}
    </div>
  );
}


// Bouton orange “gros” (Accès rapide)
function QuickBtn({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold
                 bg-gradient-to-b from-[#ff7a3d] to-[#ff5e24] text-white
                 shadow-[0_10px_22px_rgba(249,115,22,.35)] active:translate-y-[1px] transition"
    >
      <span className="inline-grid h-7 w-7 place-items-center ">{icon}</span>
      {label}
    </button>
  );
}

// Lignes à puces (à gauche un petit point)
function BulletList({ items }) {
  return (
    <ul className="space-y-2 text-[13px] text-slate-700 dark:text-white">
      {items.map((t, i) => (
        <li key={i} className="flex items-start gap-2">
          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-slate-400" />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

// Bouton secondaire bleu (footer des cartes)
function PrimaryAction({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full inline-flex items-center justify-center gap-2 rounded-xl
                 bg-[#3b5edb] text-white px-4 py-2 text-sm font-bold
                 shadow-[0_12px_28px_rgba(59,94,219,.35)] hover:brightness-110 transition"
    >
      {icon}
      {label}
    </button>
  );
}

/* ---------------------------------------------------
  DASHBOARD
--------------------------------------------------- */

const Dashboard = () => {

  /* ---------------------------------------------------
  Widget DATA
--------------------------------------------------- */
const [kpis, setKpis] = useState({ totalEtablissements: 0, totalParents: 0, totalEnfants: 0,  totalActivites: 0 });

const [nombreEtablissements, setNombreEtablissements] = useState(0);
const [chiffreAffaires, setChiffreAffaires] = useState(0);



useEffect(() => {
  const fetchNombreEtablissements = async () => {
    const total = await getTotalEtablissements();
    setNombreEtablissements(total);
  };

  fetchNombreEtablissements();
}, []);
  useEffect(() => {
    const fetchData = async () => {
      const total = await getChiffreAffairesTotal();
      setChiffreAffaires(total);
    };
    fetchData();
  }, []);









const [alerts, setAlerts] = useState({
     latePayments: [],
    inactiveClients: [],
     priorityTickets: [
    { id: "#T-9201", client: "Crèche MiniMonde", subject: "Facturation", age: "2h", prio: "Haute" },
    { id: "#T-9188", client: "Garderie Nounours", subject: "Connexion", age: "5h", prio: "Haute" },
  ],
  });

useEffect(() => {
  async function fetchAlerts() {
    const data = await getAlertsData();
    setAlerts((prev) => ({
      ...prev,            
      ...data             
    }));
  }
  fetchAlerts();
}, []);


const [expirations, setExpirations] = useState({
  creches: null,
  garderies: null,
  ecoles: null,
});

useEffect(() => {
  async function fetchExpirations() {
    const data = await getNextExpirationsByType();
    setExpirations(data);
  }
  fetchExpirations();
}, []);


const [etablissements, setEtablissements] = useState([]);
useEffect(() => {
  async function fetchTop() {
    const data = await getTopEtablissements();
    setEtablissements(data);
  }
  fetchTop();
}, []);


const impayes = 1 - kpis.tauxPaiement;
const [barFilter, setBarFilter] = useState("creches");

// états indépendants
const [cardFilter, setCardFilter]   = useState("creches");   // pour la CARTE
const [tableFilter, setTableFilter] = useState("creches");   // pour la TABLE

// ⚠️ Définir nextExp AVANT de l'utiliser
const nextExp = expirations[cardFilter] ?? {
  nom: "Aucune expiration trouvée",
  licence: "-",
  date: "-",
  restant: "J-∞",
};
const [pageByType, setPageByType] = useState({
  creches: 0,
  garderies: 0,
  ecoles: 0
});

const currentType = cardFilter;
const items = expirations[currentType] ?? [];
const pageIndex = pageByType[currentType] ?? 0;
const maxPage = items.length;
const currentExp = items[pageIndex] ?? {
  nom: "Aucune expiration trouvée",
  licence: "-",
  date: "-",
  restant: "J-∞",
  daysLeft: 9999
};



// Sévérité d’alarme à partir de "J-5", "J-12", etc.
const alarm = React.useMemo(() => {
  const days = currentExp?.daysLeft;
  if (typeof days === "number") {
    if (days < 0) return "critical"; // 🔴 Expiré = critique
    if (days <= 3) return "critical"; // 🔴 3 jours ou moins
    if (days <= 10) return "warn";    // 🟠 entre 4 et 10 jours
  }
  return "ok";                        // ✅ tout va bien
}, [currentExp]);



// libellés par type (déclaré DANS Dashboard)
const typeLabel = { creches: "crèches", garderies: "garderies", ecoles: "écoles" };

// 🔢 Compteurs pour le BOUTON de la TABLE (total de lignes par type)
const countsTable = {
  creches: etablissements.filter(e => e.type === "creches").length,
  garderies: etablissements.filter(e => e.type === "garderies").length,
  ecoles: etablissements.filter(e => e.type === "ecoles").length,
};

const navigate = useNavigate?.() || ((to)=>console.log("go:", to));

// 🔢 Compteurs pour le BOUTON de la CARTE (ici: 1 élément par type)
const countsCard = {
  creches: expirations.creches?.length ?? 0,
  garderies: expirations.garderies?.length ?? 0,
  ecoles: expirations.ecoles?.length ?? 0,
};



// données dynamiques
const tableRows = React.useMemo(() => {
  return etablissements
    .filter(e => e.type === tableFilter)
    .sort((a, b) => b.revenuValeur - a.revenuValeur) // top par montant payé
    .slice(0, 10); // top 10
}, [etablissements, tableFilter]);

const [page, setPage] = useState(1);

// remets à la page 1 si l’utilisateur change le filtre ou si la taille change
useEffect(() => { setPage(1); }, [tableFilter]);
useEffect(() => {
  const max = Math.max(1, Math.ceil(tableRows.length / PAGE_SIZE));
  if (page > max) setPage(max);
}, [tableRows, page]);

const pageCount = Math.max(1, Math.ceil(tableRows.length / PAGE_SIZE));
const start = (page - 1) * PAGE_SIZE;
const visibleRows = tableRows.slice(start, start + PAGE_SIZE);


// === Disponibilités d'exemple : { 'YYYY-MM-DD': ['09:00', ...] }
const availability = (() => {
  const out = {};
  const today = new Date();
  for (let i = 0; i < 90; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const iso = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;

    // exemple : du lundi au vendredi, créneaux le matin et l’aprem
    const day = d.getDay(); // 0=dim…6=sam
    if (day >= 1 && day <= 5) {
      out[iso] = ["09:00","10:00","11:30","14:00","15:30","16:30"];
    } else {
      out[iso] = []; // week-end fermé
    }
  }
  return out;
})();




  return (
    <div className="animate-fadeIn">

      {/* *********************************************************** */}
      {/* 🔵 KPI CARDS */}
      {/* *********************************************************** */}
<WidgetFX />
<div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
  <WidgetKids variant="solid" bg="#16a34a" size="sm" fx={false}    
    icon={pickIcon("Nombre Totale d'etablissements")}
    title="Nombre Totale d'etablissements"
    value={nombreEtablissements}
  />

  <WidgetKids variant="solid" bg="#4f46e5" size="sm" fx={false}    
    icon={pickIcon("Nombre Totale de Parents")}
    title="Nombre Totale de Parents"
    value={55}
  />

  <WidgetKids variant="solid" bg="#10b981" size="sm" fx={false}    
    icon={pickIcon("Nombre Totale des Enfants")}
    title="Nombre Totale des Enfants"
    value={55}
  />

  <WidgetKids variant="solid" bg="#22c55e" size="sm" fx={false}    
    icon={pickIcon("Chiffres d'Affaires Totales")}
    title="Chiffres d'Affaires Totales"
    value={chiffreAffaires}
    format={(n) => n.toLocaleString('fr-FR', { style: 'currency', currency: 'TND' })}
  />

  <WidgetKids variant="solid" bg="#f59e0b" size="sm" fx={false}    
    icon={pickIcon("Nombre d'activité d'etablissement")}
    title="Nombre d'activité d'etablissement"
    value={55}
  />

  <WidgetKids variant="solid" bg="#111827" size="sm" fx={false}    
    icon={pickIcon("Nombre de raports par jours")}
    title="Nombre de rapports par jour"
    value={55}
  />
</div>







<div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
  {/* 1) Accès rapide */}
  <SectionCard icon={<FiZap className="h-4 w-4" />} title="Accès rapide">
    <div className="space-y-2">
      <QuickBtn
        icon={<MdBusiness className="h-5 w-5" />}
        label="Ajouter une entreprise"
        onClick={() => navigate("/admin/Entreprises")}
      />
      <QuickBtn
        icon={<FiCalendar className="h-5 w-5" />}
        label="Planning"
        onClick={() => navigate("/admin/calendrier")}
      />
      <QuickBtn
        icon={<FiLifeBuoy className="h-5 w-5" />}
        label="Gérer tickets"
        onClick={() => navigate("/admin/support")}
      />
      <QuickBtn
        icon={<FiCpu className="h-5 w-5" />}
        label="Analyse IA"
        onClick={() => navigate("/admin/ia")}
      />
    </div>
  </SectionCard>

  {/* 2) Gestion des admins */}
  <SectionCard
    icon={<MdAdminPanelSettings className="h-4 w-4" />}
    title="Gestion des admins"
    footer={
      <PrimaryAction
        icon={<FiUsers className="h-5 w-5" />}
        label="Gérer les admins"
        onClick={() => navigate("/admin/profile", { state: { section: "admin" } })}
      />
    }
  >
    <BulletList
      items={[
        "Liste des administrateurs",
        "Créer / Modifier un admin",
        "Rôles & permissions",
        "Historique des connexions",
      ]}
    />
  </SectionCard>

  {/* 3) Paiements */}
  <SectionCard
    icon={<MdPayments className="h-4 w-4" />}
    title="Paiements"
    footer={
      <PrimaryAction
        icon={<FiSend className="h-5 w-5" />}
        label="Envoyer Facture"
        onClick={() => navigate("/admin/paiements")}
      />
    }
  >
    <BulletList
      items={[
        "Suivi des paiements",
        "Relancer abonnement",
        "Facturation",
      ]}
    />
  </SectionCard>
</div>





      {/* *********************************************************** */}
      {/* 🔥 KPI BARS */}
      {/* *********************************************************** */}

<div className="mt-5 gap-5 ">
   <KpiBar />


</div>

 {/* *****<AIIndicatorsPanel
  stats={{
    creches: { count: 128, info: "actives" },
    garderies: { count: 140, info: "actives" },
    ecoles: { count: 44, info: "actives" }
  }}
  onSelect={(type) => {
    // route, filtre, ou open modal :
    // ex: router.push(`/admin/${type}`);
    console.log("Nuage cliqué:", type);
  }}
  links={{ chatbot: "/assistant" }}
/>*** */}


    







      {/* *********************************************************** */}
      {/* 🗺 MAP */}
      {/* *********************************************************** */}
     {/* 🗺 MAP */}
<div className="mt-6 animate-fadeIn">
  <CrechesMap />
</div>

{/* 📅 PLANNER : calendrier + modal + liste de RDV */}
<Card extra="
  hidden mt-6 p-6 rounded-3xl relative group overflow-visible
  shadow-[0_0.0625em_0.0625em_rgba(0,0,0,0.25),0_0.125em_0.5em_rgba(0,0,0,0.25),inset_0_0_0_1px_rgba(255,255,255,0.1)]
  hover:shadow-[0_0.125em_0.125em_rgba(0,0,0,0.28),0_0.5em_1em_-0.2em_rgba(0,0,0,0.3),inset_0_0_0_1px_rgba(255,255,255,0.12)]
"
>
  <div className="card-glow"></div>
  <h3 className="mb-4 text-lg font-extrabold bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-400 bg-clip-text text-transparent">
    📅 Planifier des rendez-vous
  </h3>

  <AppointmentPlanner
    availability={availability}  // ← l’objet “dateISO -> [créneaux]” que tu génères déjà
    minDate={new Date()}
    maxMonths={6}
  />
</Card>

{/* ===== EXPIRATION + TABLE (colonne gauche) | ALERTES (colonne droite) ===== */}
<div className="mt-6 grid gap-5 xl:grid-cols-[2fr,1fr] items-start">
  {/* COLONNE GAUCHE : Expiration + Table */}
  <div className="grid gap-5 content-start">
    {/* --- Carte Prochaine expiration --- */}
    <Card
      extra="p-6 rounded-3xl relative group overflow-hidden bg-white/80 backdrop-blur-xl border border-black/10 shadow-[0_28px_70px_-24px_rgba(2,6,23,.28),0_12px_24px_-18px_rgba(2,6,23,.22)]"
      data-alarm={alarm}
    >



  {/* HALO ROUGE ANIMÉ (visible si alarme) */}
  <span
    aria-hidden
    className="alarm-glow pointer-events-none absolute inset-0 -z-10 opacity-0"
  />



  {/* Header : label + filtre */}
  <div className="flex items-start justify-between gap-4">
    <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-gray-500">
      {/* point d’état */}
      <span
        className="inline-block h-2 w-2 rounded-full bg-rose-500"
        style={{ animation: alarm === "critical" ? "alarm-blink .9s steps(2,end) infinite" : alarm === "warn" ? "alarm-blink 1.4s steps(2,end) infinite" : "none" }}
      />
      Prochaine expiration — <span className="normal-case text-gray-700">{typeLabel[cardFilter]}</span>
    </p>

    <div className="shrink-0 z-10">
      <EntityFilter value={cardFilter} onChange={setCardFilter} counts={countsCard} />
    </div>
  </div>

  {/* Titre (légère secousse si CRITIQUE) */}
  <h3
    className="mt-2 text-md font-black leading-tight bg-gradient-to-r from-indigo-600 via-violet-600 to-sky-500 bg-clip-text text-transparent inline-flex items-center gap-2"
    style={{ animation: alarm === "critical" ? "alarm-wiggle .36s ease-in-out 3" : "none" }}
  >
    {/* petite sirène si critique */}
    {alarm === "critical" && (
      <span className="inline-grid h-4 w-4 place-items-center rounded-md bg-rose-100 text-rose-600 ">
        🔔
      </span>
    )}
    {currentExp.nom}
  </h3>

  {/* Métadonnées */}
  <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
    <span className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white/70 px-3 py-1 font-semibold text-gray-700">
      <svg width="16" height="16" viewBox="0 0 24 24" className="opacity-70"><path fill="currentColor" d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm8 1.5V8h4.5L14 3.5Z"/></svg>
      {currentExp.licence}
    </span>
<span className="inline-flex items-center gap-2 rounded-xl bg-rose-50 px-3 py-1 font-semibold text-rose-700 ring-1 ring-rose-200">
  <svg width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M7 2v2H5a2 2 0 0 0-2 2v2h18V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2H7Zm14 8H3v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V10Zm-4 3h-4v4h4v-4Z"/></svg>
  {currentExp.daysLeft < 0 ? "expiré le" : "expire le"} <span className="font-black ml-1">{currentExp.date}</span>
</span>

  </div>

  {/* Badge alarme + message */}
 <div
  className={[ 
    "mt-3 rounded-2xl px-3 py-2 text-sm font-semibold flex items-center gap-2",
    alarm === "critical"
      ? "border border-rose-300 bg-rose-50/80 text-rose-700"
      : alarm === "warn"
      ? "border border-amber-300 bg-amber-50/80 text-amber-800"
      : "border border-emerald-200 bg-emerald-50/80 text-emerald-700",
  ].join(" ")}
>
  <span className="inline-block h-2 w-2 rounded-full bg-current opacity-70" />
  {currentExp.daysLeft < 0 ? "❌" : alarm === "critical" || alarm === "warn" ? "⏰" : "✅"}
 {currentExp.daysLeft < 0
  ? `expiré depuis ${Math.abs(currentExp.daysLeft)} jours`
  : `${currentExp.restant} restant`}

</div>

{/* Points de navigation */}
{items.length > 1 && (
  <div className="mt-4 flex justify-center gap-2">
    {items.map((_, i) => (
      <button
        key={i}
        onClick={() => setPageByType(prev => ({ ...prev, [currentType]: i }))}
        className={`h-3 w-3 rounded-full border-2 transition ${
          i === pageIndex
           ? "bg-gray-800  dark:bg-white border-gray-800dark:border-white"
          : "bg-transparent border-gray/800 dark:border-white/20"
        }`}
        aria-label={`Page ${i + 1}`}
      />
    ))}
  </div>
)}

  {/* Styles d’animation & alarme */}
  <style>{`
    @keyframes stripes {
      0% { transform: translateX(-120%); }
      100% { transform: translateX(120%); }
    }
    @keyframes alarm-glow {
      0%, 100% { opacity: .35; }
      50%      { opacity: .65; }
    }
    @keyframes alarm-blink {
      50% { opacity: .2 }
    }
    @keyframes alarm-wiggle {
      0%   { transform: translateX(0) rotate(0) }
      25%  { transform: translateX(-1px) rotate(-1.2deg) }
      50%  { transform: translateX(1px) rotate(1.2deg) }
      75%  { transform: translateX(-.5px) rotate(-.8deg) }
      100% { transform: translateX(0) rotate(0) }
    }

    /* Aura rouge animée quand data-alarm != ok */
    [data-alarm="warn"]   .alarm-glow,
    [data-alarm="critical"] .alarm-glow { 
      background: radial-gradient(60% 60% at 50% 0%, rgba(251,113,133,.18), transparent 65%);
      animation: alarm-glow 2.2s ease-in-out infinite;
    }
    [data-alarm="critical"] .alarm-glow {
      background: radial-gradient(60% 60% at 50% 0%, rgba(239,68,68,.22), transparent 65%);
      animation-duration: 1.5s;
    }

    /* Ligne scan en haut – teinte selon état */
    [data-alarm="critical"] .alarm-scan { background: linear-gradient(90deg,transparent,#ef4444,transparent); animation: stripes 1.3s linear infinite; }
    [data-alarm="warn"]     .alarm-scan { background: linear-gradient(90deg,transparent,#f59e0b,transparent); animation: stripes 1.8s linear infinite; }
    [data-alarm="ok"]       .alarm-scan { background: linear-gradient(90deg,transparent,#10b981,transparent); animation: stripes 2.4s linear infinite; }
  `}</style>
    </Card>

    {/* --- Table Top 10 --- */}
    <Card extra="p-6 rounded-3xl relative group overflow-hidden shadow-lg">
         <div className="card-glow"></div>

    <div className="mb-4 flex items-center justify-between ">
      <h3 className="relative z-10 text-md font-extrabold">
        🏆 Top 10 {typeLabel[tableFilter]}
      </h3>

      {/* Filtre table — INDEPENDANT */}
     <EntityFilter value={tableFilter} onChange={setTableFilter} counts={countsTable} />

    </div>

    <div className="relative z-10 overflow-x-auto rounded-xl">
      {tableRows.length === 0 ? (
        <div className="p-6 text-sm text-gray-500">
          Aucune donnée pour les {typeLabel[tableFilter]} pour le moment.
        </div>
      ) : (
<table className="w-full text-left border-collapse text-slate-800 dark:text-white dark:!bg-navy-800 dark:shadow-none">
  <thead>
    <tr className="text-xs font-semibold uppercase tracking-wide text-gray-500 bg-gradient-to-r from-gray-50 to-gray-100 dark:bg-transparent">
      <th className="py-3 px-3 border-b border-slate-200 dark:border-white/15 dark:bg-navy-800">
        Nom
      </th>
      <th className="py-3 px-3 border-b border-slate-200 dark:border-white/15 dark:bg-navy-800">
        Ville
      </th>
      <th className="py-3 px-3 border-b border-slate-200 dark:border-white/15 dark:bg-navy-800">
        Enfants
      </th>
      <th className="py-3 px-3 border-b border-slate-200 dark:border-white/15 dark:bg-navy-800">
        Licence
      </th>
      <th className="py-3 px-3 border-b border-slate-200 dark:border-white/15 dark:bg-navy-800 ">
        Revenus
      </th>
    </tr>
  </thead>

  <tbody>
    {visibleRows.map((c, i) => (
      <tr
        key={`${c.nom}-${start + i}`}
        className="
          group transition-all border-b last:border-0
          border-slate-200 dark:border-white/10
          hover:bg-gray-50
          dark:hover:bg-white/90 
          dark:hover:text-gray-900
          animate-[fadeIn_.35s_ease-out_both]
        "
        style={{ animationDelay: `${i * 90}ms` }}
      >
        {/* les td hériteront de la couleur au hover en dark */}
        <td className="py-3 px-3 text-md font-bold transition-colors dark:bg-navy-800 dark:text-white ">
          {c.nom}
        </td>
        <td className="py-3 px-3 text-md  transition-colors dark:bg-navy-800 dark:text-white ">
          {c.ville}
        </td>
        <td className="py-3 px-3 text-md  transition-colors dark:bg-navy-800 dark:text-white tabular-nums ">
          {c.enfants}
        </td>
        <td className="py-3 px-3 text-md  dark:bg-navy-800 dark:text-white">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              c.licence === "Active"
                ? "bg-green-100 text-green-700 dark:bg-emerald-400/10 dark:text-emerald-300"
                : c.licence === "En alerte"
                ? "bg-yellow-100 text-yellow-700 dark:bg-amber-400/10 dark:text-amber-300"
                : "bg-red-100 text-red-700 dark:bg-rose-400/10 dark:text-rose-300"
            }`}
          >
            {c.licence}
          </span>
        </td>
        <td className="py-3 px-3 text-md  font-medium transition-colors  dark:bg-navy-800 dark:text-white">
          {c.revenue}
        </td>
      </tr>
    ))}
  </tbody>
</table>


        
      )}
         {/* Pagination */}
        <div className="flex items-center justify-between gap-3 p-3">
          <div className="text-xs text-gray-500">
            Page <span className="font-semibold">{page}</span> / {pageCount} •&nbsp;
            {tableRows.length} lignes
          </div>

          <nav className="relative inline-flex items-center gap-1 rounded-2xl border border-black/10 bg-white/70 backdrop-blur-sm px-1.5 py-1 shadow-sm">
            {/* curseur animé */}
            <span
              className="absolute top-1 bottom-1 rounded-xl bg-black/[.04] transition-all duration-300"
              style={{
                left: `${(Math.min(page, 3) - 1) * 42 + 6}px`,
                width: "38px",
                opacity: pageCount > 1 ? 1 : 0
              }}
              aria-hidden
            />

            {/* Prev */}
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="relative z-10 px-2.5 py-1 text-sm font-semibold text-gray-700 hover:text-gray-900 disabled:opacity-40"
              disabled={page === 1}
              aria-label="Page précédente"
            >
              ‹
            </button>

            {/* Pages centrées (max 3) */}
            {Array.from({ length: pageCount }, (_, i) => i + 1)
              .slice(
                Math.max(0, Math.min(page - 2, pageCount - 3)),
                Math.max(3, Math.min(page + 1, pageCount))
              )
              .map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPage(n)}
                  className={[
                    "relative z-10 h-8 w-9 rounded-xl text-sm font-semibold transition-colors",
                    n === page ? "text-gray-900" : "text-gray-600 hover:text-gray-900"
                  ].join(" ")}
                  aria-current={n === page ? "page" : undefined}
                >
                  {n}
                </button>
              ))}

            {/* Next */}
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              className="relative z-10 px-2.5 py-1 text-sm font-semibold text-gray-700 hover:text-gray-900 disabled:opacity-40"
              disabled={page === pageCount}
              aria-label="Page suivante"
            >
              ›
            </button>
          </nav>
        </div>  {/* ← fin pagination */}
    </div>
    </Card>
  </div>

  {/* COLONNE DROITE : Alertes empilées */}
  <div className="grid gap-5 auto-rows-[minmax(0,1fr)]">
    <AlertsPanel alerts={alerts} stacked />
  </div>
</div>



  




    </div>
  );
};

export default Dashboard;
