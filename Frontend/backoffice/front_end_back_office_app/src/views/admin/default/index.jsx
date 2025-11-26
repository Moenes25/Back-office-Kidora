// src/views/admin/default/index.jsx
import React, { useState, useRef, useEffect } from "react";

// Composants
import WeeklyRevenue from "views/admin/default/components/WeeklyRevenue";
import TotalSpent from "views/admin/default/components/TotalSpent";
import CrechesMap from "components/maps/CrechesMap";
import Card from "components/card";
import BarChart from "components/charts/BarChart";
import PieChart from "components/charts/PieChart";
import WidgetKids from "components/widget/Widget";
import ApexChart from "components/KpiBar";
import { lineOptions, areaOptions, radarOptions, heatmapOptions, radialOptions } from "components/KpiBar";
import AlertsPanel from "components/AlertsPanel";
import AppointmentPlanner from "components/calendar/AppointmentPlanner";
import AIIndicatorsPanel from "components/ai/AIIndicatorsPanel";









// icons
import { PiUsersThree, PiBaby, PiChalkboardTeacher, PiMoney } from "react-icons/pi";
import { MdChildCare, MdPersonAddAlt1, MdPersonOff, MdCheckCircle } from "react-icons/md";
import { AiOutlineWarning } from "react-icons/ai";



/* ---------------------------------------------------
  MOCK DATA
--------------------------------------------------- */
const kpis = {
  totalClientsActifs: 312,
  garderies: 140,
  creches: 128,
  ecoles: 44,
  nouveauxCeMois: 18,
  resiliesCeMois: 5,
  tauxRetention: 0.93,
  tauxUtilisation: 0.78,
  tauxPaiement: 0.88,
};
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

<Card extra="relative p-5 rounded-2xl shadow-sm hover:-translate-y-0.5 transition">
  <h3 className="mb-3 text-lg font-extrabold">🎯 Objectif du mois</h3>
  <ApexChart type="radialBar" options={radialGoalOptions} series={goalSeries} height={260} />
</Card>




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
  const [hover, setHover] = React.useState(-1);   // focus clavier/hover
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

  const toggle = () => {
    setOpen(s => !s);
    setHover(currentIndex);
  };

  const select = (v) => {
    onChange?.(v);
    setOpen(false);
    btnRef.current?.focus();
  };

  // Navigation clavier sur le bouton
  const onKeyDown = (e) => {
    if (!open && (e.key === "Enter" || e.key === " " || e.key === "ArrowDown")) {
      e.preventDefault();
      setOpen(true);
      setHover(currentIndex);
      return;
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
        "
        style={{
          // petit relief 3D et halo discret
          boxShadow: "inset 0 -1px 0 rgba(2,6,23,.06), 0 6px 18px -10px rgba(2,6,23,.18)",
        }}
      >
        {/* pastille colorée selon la sélection */}
        <span className={`h-2 w-2 rounded-full ${current.color}`} aria-hidden />
        <span className="truncate">{current.label}</span>

        {/* compteur */}
        <span className="ml-1 rounded-full bg-black/5 px-2 text-[11px] font-bold">
          {current.count}
        </span>

        {/* chevron animé */}
        <svg
          width="16" height="16" viewBox="0 0 20 20"
          className={`opacity-60 transition-transform ${open ? "rotate-180" : ""}`}
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
            backdrop-blur shadow-[0_18px_45px_-22px_rgba(2,6,23,.35)]
            anim-pop
          "
        >
          {/* petite pointe */}
          <span className="absolute -top-2 right-6 h-3 w-3 rotate-45 bg-white border-l border-t border-black/10" />

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
                      hovered ? "bg-sky-50" : "hover:bg-gray-50",
                      active ? "ring-1 ring-sky-200 bg-sky-50/70" : "",
                    ].join(" ")}
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      <span className={`h-2 w-2 rounded-full ${o.color}`} />
                      <span className="truncate">{o.label}</span>
                      {active && (
                        <svg width="14" height="14" viewBox="0 0 20 20" className="text-sky-600">
                          <path fill="currentColor" d="M7.5 13.3l-3-3 1.1-1.1 1.9 1.9 5.4-5.4 1.1 1.1z"/>
                        </svg>
                      )}
                    </span>
                    <span className="rounded-full bg-black/5 px-2 text-[11px] font-bold">
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


const alerts = {
  latePayments: [
    { name: "Crèche Les P’tits Anges", days: 18, amount: "380 DT" },
    { name: "Crèche Arc-en-ciel",      days: 10, amount: "220 DT" },
  ],
  inactiveClients: [
    { name: "Crèche BabyLand", days: 21 },
    { name: "École Horizon",   days: 16 },
  ],
  priorityTickets: [
    { id: "#T-9201", client: "Crèche MiniMonde", subject: "Facturation", age: "2h", prio: "Haute" },
    { id: "#T-9188", client: "Garderie Nounours", subject: "Connexion", age: "5h", prio: "Haute" },
  ],
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




/* ---------------------------------------------------
  DASHBOARD
--------------------------------------------------- */

const Dashboard = () => {
const impayes = 1 - kpis.tauxPaiement;
const [barFilter, setBarFilter] = useState("creches");

// états indépendants
const [cardFilter, setCardFilter]   = useState("creches");   // pour la CARTE
const [tableFilter, setTableFilter] = useState("creches");   // pour la TABLE

// ⚠️ Définir nextExp AVANT de l'utiliser
const nextExp = nextExpirationByType[cardFilter]; // données de la carte selon cardFilter

// Sévérité d’alarme à partir de "J-5", "J-12", etc.
const alarm = React.useMemo(() => {
  const rest = String(nextExp?.restant ?? "");      // ex: "J-5"
  const n = parseInt(rest.replace(/[^\d]/g, ""), 10); // -> 5
  if (!Number.isFinite(n)) return "ok";
  return n <= 3 ? "critical" : n <= 10 ? "warn" : "ok";
}, [nextExp]);

// libellés par type (déclaré DANS Dashboard)
const typeLabel = { creches: "crèches", garderies: "garderies", ecoles: "écoles" };

// 🔢 Compteurs pour le BOUTON de la TABLE (total de lignes par type)
const countsTable = {
  creches: topCreches.length,
  garderies: topGarderies.length,
  ecoles: topEcoles.length,
};

// 🔢 Compteurs pour le BOUTON de la CARTE (ici: 1 élément par type)
const countsCard = {
  creches: nextExpirationByType.creches ? 1 : 0,
  garderies: nextExpirationByType.garderies ? 1 : 0,
  ecoles: nextExpirationByType.ecoles ? 1 : 0,
};

// données dynamiques
const tableRows =
  tableFilter === "creches"   ? topCreches   :
  tableFilter === "garderies" ? topGarderies :
  tableFilter === "ecoles"    ? topEcoles    : [];




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
<div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-6">
  <WidgetKids stacked tone="grape"     delay={0}   icon={<PiUsersThree />}       title="Clients actifs"    subtitle={kpis.totalClientsActifs} />
  <WidgetKids stacked tone="sunny"     delay={60}  icon={<MdPersonAddAlt1 />}    title="Nouveaux ce mois"  subtitle={kpis.nouveauxCeMois} />
  <WidgetKids stacked tone="bubblegum" delay={120} icon={<AiOutlineWarning />}    title="Résiliés ce mois"  subtitle={kpis.resiliesCeMois} />
  <WidgetKids stacked tone="sky"       delay={180} icon={<PiChalkboardTeacher />} title="Écoles actives"    subtitle={kpis.ecoles} />
  <WidgetKids stacked tone="lime"      delay={240} icon={<MdChildCare />}         title="Garderies actives" subtitle={kpis.garderies} />
  <WidgetKids stacked tone="grape"     delay={300} icon={<PiBaby />}              title="Crèches actives"   subtitle={kpis.creches} />
</div>



      {/* *********************************************************** */}
      {/* 🔥 KPI BARS */}
      {/* *********************************************************** */}

<div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
  {/* Line */}
 <Card extra="relative p-5 rounded-2xl shadow-sm hover:-translate-y-0.5 transition">
  <h3 className="mb-3 text-lg font-extrabold">📈 Croissance des inscriptions</h3>
  <ApexChart
    type="line"
    options={{
      ...lineOptions,
      colors: TYPE_COLORS,                 // 1 couleur par série
      xaxis: { categories: MONTHS_FR },    // mois FR
    }}
    series={[
      { name: "Garderies", data: [12,15,14,18,20,22,24,23,19,17,16,18] },
      { name: "Crèches",   data: [10,12,11,14,16,18,19,18,16,15,14,15] },
      { name: "Écoles",    data: [ 3, 4, 4, 5,  6,  7,  8,  7,  6,  5,  5,  6] },
    ]}
    height={300}
  />
</Card>

 <Card extra="relative p-5 rounded-2xl shadow-sm hover:-translate-y-0.5 transition">
  <h3 className="mb-3 text-lg font-extrabold">
    🍩 Répartition annuelle par type 
  </h3>

  <PieChart
    series={[
      [12,15,14,18,20,22,24,23,19,17,16,18].reduce((a,b)=>a+b,0), // Garderies
      [10,12,11,14,16,18,19,18,16,15,14,15].reduce((a,b)=>a+b,0), // Crèches
      [ 3, 4, 4, 5, 6, 7, 8, 7, 6, 5, 5, 6].reduce((a,b)=>a+b,0), // Écoles
    ]}
    options={{
      labels: TYPE_LABELS,        // ["Garderies", "Crèches", "Écoles"]
      colors: TYPE_COLORS,        // ["#60a5fa", "#a78bfa", "#34d399"] par ex.
      legend: { position: "bottom" },
      dataLabels: { enabled: false },
      // (optionnel) si c'est un donut et tu veux un total au centre :
      plotOptions: {
        pie: {
          donut: {
            size: "70%",
            labels: { show: true, total: { show: true, label: "Total" } }
          }
        }
      }
    }}
  />
</Card>
  {/* Heatmap (tickets / jour x priorité) */}
<Card extra="relative p-5  rounded-2xl shadow-sm hover:-translate-y-0.5 transition">
  <h3 className="mb-3 text-lg font-extrabold">🔥 Tickets par jour</h3>
  <ApexChart
    type="bar"
    options={{
      chart: { type: "bar", stacked: true, toolbar: { show: false }, animations: { enabled: true } },
      plotOptions: { bar: { columnWidth: "55%", borderRadius: 10 } },
      xaxis: { categories: ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"] },
      dataLabels: { enabled: false },
      colors: ["#60a5fa","#a78bfa","#34d399"],
      grid: { borderColor: "rgba(0,0,0,.08)", strokeDashArray: 4 },
      tooltip: { y: { formatter: (v) => `${v} ticket(s)` } },
      legend: { position: "bottom" },
      fill: { opacity: 0.95 },
    }}
    series={[
      { name: "Garderies", data: [3,4,2,6,5,2,1] },
      { name: "Crèches",   data: [4,5,3,7,6,3,2] },
      { name: "Écoles",    data: [2,3,2,4,3,1,1] },
    ]}
    height={300}
  />
</Card>

  {/* Area */}
<Card extra="relative p-5 hidden rounded-2xl shadow-sm hover:-translate-y-0.5 transition">
  <h3 className="mb-3 text-lg font-extrabold">🌊 Usage mensuel</h3>
  <ApexChart
    type="area"
    options={{
      ...areaOptions,
      colors: TYPE_COLORS,
      xaxis: { categories: MONTHS_FR },
    }}
    series={[
      { name: "Garderies", data: [68,70,72,74,76,78,80,79,77,75,73,72] },
      { name: "Crèches",   data: [64,66,68,70,72,74,76,75,73,71,69,68] },
      { name: "Écoles",    data: [58,60,62,64,66,68,70,69,67,65,63,62] },
    ]}
    height={360}
  />
</Card>


  {/* RadialBar (progress) */}
<Card extra="relative p-5  hidden rounded-2xl shadow-sm hover:-translate-y-0.5 transition">
  <h3 className="mb-3 text-lg font-extrabold">🎯 Objectif du mois</h3>
  <ApexChart type="radialBar" options={radialGoalOptions} series={goalSeries} height={360} />
</Card>

  {/* Radar (satisfaction par critère) */}
 <Card extra="relative p-5 hidden rounded-2xl shadow-sm hover:-translate-y-0.5 transition">
  <h3 className="mb-3 text-lg font-extrabold">⭐ Satisfaction (sondage)</h3>
  <ApexChart
    type="radar"
    options={{
      ...radarOptions,
      colors: TYPE_COLORS,
      xaxis: { categories: ["Qualité","Support","Prix","Fiabilité","UX"] },
    }}
    series={[
      { name: "Garderies", data: [62, 65, 68, 68, 64] },
      { name: "Crèches",   data: [76, 77, 75, 70, 72] },
      { name: "Écoles",    data: [80, 83, 72, 86, 81] },
    ]}
    height={300}
  />
</Card>

</div>

<AIIndicatorsPanel
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
/>


    







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


      {/* *********************************************************** */}
      {/* 🔔 ALERTS */}
      {/* *********************************************************** */}
    <div className="mt-6 animate-fadeIn">
     <AlertsPanel alerts={alerts} />
   </div>

<div className="mt-6 grid grid-cols-1 gap-5">
{/* === CARTE PROCHAINE EXPIRATION (style amélioré) === */}
<Card
  extra={`
    col-span-full p-6 rounded-3xl relative group overflow-hidden
    bg-white/80 backdrop-blur-xl border border-black/10
    shadow-[0_28px_70px_-24px_rgba(2,6,23,.28),0_12px_24px_-18px_rgba(2,6,23,.22)]
  `}
  data-alarm={alarm} // ← "ok" | "warn" | "critical"
>
  {/* HALO DE FOND (indigo) */}
  <span
    className="pointer-events-none absolute -inset-16 -z-10 opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-40"
    style={{ background: "radial-gradient(700px 340px at 20% 0%, rgba(99,102,241,.18), transparent 60%)" }}
  />

  {/* HALO ROUGE ANIMÉ (visible si alarme) */}
  <span
    aria-hidden
    className="alarm-glow pointer-events-none absolute inset-0 -z-10 opacity-0"
  />

  {/* LIGNE SCAN EN HAUT (accent danger) */}
  <span
    className="absolute left-0 right-0 top-0 h-[3px] overflow-hidden"
    aria-hidden
  >
    <span className="block h-full w-[40%] alarm-scan" />
  </span>

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
    className="mt-2 text-2xl font-black leading-tight bg-gradient-to-r from-indigo-600 via-violet-600 to-sky-500 bg-clip-text text-transparent inline-flex items-center gap-2"
    style={{ animation: alarm === "critical" ? "alarm-wiggle .36s ease-in-out 3" : "none" }}
  >
    {/* petite sirène si critique */}
    {alarm === "critical" && (
      <span className="inline-grid h-6 w-6 place-items-center rounded-md bg-rose-100 text-rose-600 ring-1 ring-rose-200">
        🔔
      </span>
    )}
    {nextExp.nom}
  </h3>

  {/* Métadonnées */}
  <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
    <span className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white/70 px-3 py-1 font-semibold text-gray-700">
      <svg width="16" height="16" viewBox="0 0 24 24" className="opacity-70"><path fill="currentColor" d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm8 1.5V8h4.5L14 3.5Z"/></svg>
      {nextExp.licence}
    </span>

    <span className="inline-flex items-center gap-2 rounded-xl bg-rose-50 px-3 py-1 font-semibold text-rose-700 ring-1 ring-rose-200">
      <svg width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M7 2v2H5a2 2 0 0 0-2 2v2h18V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2H7Zm14 8H3v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V10Zm-4 3h-4v4h4v-4Z"/></svg>
      expire le <span className="font-black ml-1">{nextExp.date}</span>
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
    {alarm !== "ok" ? "⏰" : "✅"} {nextExp.restant} restant
  </div>

  {/* Barre de progression / activité – couleur selon alarme */}
  <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-black/10">
    <span
      className="block h-full w-[45%] rounded-full"
      style={{
        background:
          alarm === "critical"
            ? "linear-gradient(90deg,#fb7185,#ef4444,#fb7185)"
            : alarm === "warn"
            ? "linear-gradient(90deg,#f59e0b,#f97316,#f59e0b)"
            : "linear-gradient(90deg,#34d399,#10b981,#34d399)",
        backgroundSize: "200% 100%",
        animation: "stripes 2.4s linear infinite",
        filter: "saturate(1.05)",
      }}
    />
  </div>

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



  {/* === TABLE TOP 10 (avec SON filtre propre) === */}
  <Card extra="col-span-full p-6 rounded-3xl relative group overflow-hidden shadow-lg ">
    <div className="card-glow"></div>

    <div className="mb-4 flex items-center justify-between ">
      <h3 className="relative z-10 text-lg font-extrabold">
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
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-xs font-semibold uppercase tracking-wide text-gray-500 bg-gradient-to-r from-gray-50 to-gray-100 ">
              <th className="py-3 px-3">Nom</th>
              <th className="py-3 px-3">Ville</th>
              <th className="py-3 px-3">Enfants</th>
              <th className="py-3 px-3">Licence</th>
              <th className="py-3 px-3">Revenus</th>
            </tr>
          </thead>
          <tbody>
  {visibleRows.map((c, i) => (
    <tr
      key={`${c.nom}-${start + i}`}
      className="hover:bg-gray-50 transition-all border-b last:border-0 animate-[fadeIn_.35s_ease-out_both]"
      style={{ animationDelay: `${i * 90}ms` }}
    >
      <td className="py-3 px-3 font-bold">{c.nom}</td>
      <td className="py-3 px-3">{c.ville}</td>
      <td className="py-3 px-3">{c.enfants}</td>
      <td className="py-3 px-3">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            c.licence === "Active"
              ? "bg-green-100 text-green-700"
              : c.licence === "En alerte"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {c.licence}
        </span>
      </td>
      <td className="py-3 px-3 font-medium">{c.revenue}</td>
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


    </div>
  );
};

export default Dashboard;
