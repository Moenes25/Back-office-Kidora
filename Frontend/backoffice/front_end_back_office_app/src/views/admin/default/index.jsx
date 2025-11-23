// src/views/admin/default/index.jsx
import React, { useState, useRef, useEffect } from "react";

// Composants
import WeeklyRevenue from "views/admin/default/components/WeeklyRevenue";
import TotalSpent from "views/admin/default/components/TotalSpent";
import CrechesMap from "components/maps/CrechesMap";
import Card from "components/card";
import BarChart from "components/charts/BarChart";
import PieChart from "components/charts/PieChart";
import Widget from "components/widget/Widget";
import AnimatedStatCard from "components/KpiBar";
import AlertsPanel from "components/AlertsPanel";
import AppointmentPlanner from "components/calendar/AppointmentPlanner";







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

// 🧁 Paiements par type (en %)
const kpiPaiements = {
  // 🔁 MODIFIE ICI tes pourcentages (doivent totaliser ~100)
  series: [40, 30, 30], // [Garderies, Crèches, Écoles]
  options: {
    labels: CATEGORY_LABELS,
    chart: { type: "donut", toolbar: { show: false }, animations: { enabled: true, speed: 700 } },
    stroke: { width: 0 },
    legend: { position: "top", fontSize: "11px" },
    colors: CATEGORY_COLORS,
    dataLabels: { enabled: false },
   plotOptions: {
  pie: {
    donut: {
      size: "80%",
      labels: {
        show: true,
        total: { show: true, label: "Total", fontSize: "14px" },
        value: { formatter: (v) => `${Number(v || 0)}%` },
      },
    },
  },
},

    tooltip: { y: { formatter: (v) => `${v}%` } },
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
    chart: {
      type: "bar",
      toolbar: { show: false },
      animations: { enabled: true, speed: 600 },
    },

    plotOptions: { 
      bar: { 
        columnWidth: "45%", 
        borderRadius: 6,
      },
    },

    dataLabels: { enabled: false },
    colors: ["#7dd3fc"],

    xaxis: {
      categories: retentionCategories,
      labels: {
        style: {
          colors: "#64748b",
          fontSize: "12px",
          fontWeight: 600,
        },
      },
    },

    yaxis: {
      min: 0,
      max: 100,
      tickAmount: 5,
      labels: {
        formatter: (v) => `${v}%`
      }
    },

    grid: {
      borderColor: "rgba(0,0,0,.12)",
      strokeDashArray: 4,
    },

    tooltip: {
      y: { formatter: (v) => `${v}% de rétention` }
    }
  }
};



export const kpiUtilisation = {
  series: [{ name: "Utilisation", data: utilisationValues }],
  options: {
    chart: {
      type: "bar",
      toolbar: { show: false },
      animations: { enabled: true, speed: 600 },
    },
    plotOptions: { bar: { columnWidth: "45%", borderRadius: 6 } },
    dataLabels: { enabled: false },
    colors: ["#c4b5fd"],

    xaxis: {
      categories: utilisationCategories,
      labels: {
        style: { colors: "#64748b", fontSize: "12px", fontWeight: 600 }
      },
      
    },

    yaxis: {
      min: 0,
      max: 100,
      tickAmount: 5,
      labels: { formatter: (v) => `${v}%` }
    },

    tooltip: {
      y: { formatter: (v) => `${v}% d’utilisation` }
    }
  }
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

function EntityFilter({ value, onChange, counts = { creches:0, garderies:0, ecoles:0 } }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    const onDocClick = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const options = [
    { v: "creches",   label: "Crèches",   count: counts.creches ?? 0 },
    { v: "garderies", label: "Garderies", count: counts.garderies ?? 0 },
    { v: "ecoles",    label: "Écoles",    count: counts.ecoles ?? 0 },
  ];
  const current = options.find(o => o.v === value)?.label ?? "Crèches";
  const currentCount = options.find(o => o.v === value)?.count ?? 0;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(s => !s)}
        className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white/80 px-3 py-1.5 text-sm font-semibold shadow-sm hover:bg-white"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {current}
        <span className="ml-1 rounded-full bg-black/5 px-2 text-[11px] font-bold">{currentCount}</span>
        <svg width="16" height="16" viewBox="0 0 20 20" className="opacity-70">
          <path fill="currentColor" d="M5.23 7.21a.75.75 0 011.06.02L10 11.1l3.71-3.87a.75.75 0 111.08 1.04l-4.24 4.41a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"/>
        </svg>
      </button>

      {open && (
        <div role="menu" className="absolute right-0 z-20 mt-2 w-48 rounded-xl border border-black/10 bg-white p-1 shadow-lg">
          {options.map(o => (
            <button
              key={o.v}
              role="menuitem"
              onClick={() => { onChange(o.v); setOpen(false); }}
              className={`w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center justify-between ${value === o.v ? "bg-gray-100 font-semibold" : ""}`}
            >
              <span>{o.label}</span>
              <span className="rounded-full bg-black/5 px-2 text-[11px] font-bold">{o.count}</span>
            </button>
          ))}
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

const nextExp = nextExpirationByType[cardFilter]; // données de la carte selon cardFilter

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
  <Widget stacked tone="indigo"  animated delay={0}   icon={<PiUsersThree />}      title="Clients actifs"       subtitle={kpis.totalClientsActifs} />
  <Widget stacked tone="amber"   animated delay={60}  icon={<MdPersonAddAlt1 />}   title="Nouveaux ce mois"     subtitle={kpis.nouveauxCeMois} />
  <Widget stacked tone="sky"     animated delay={120} icon={<AiOutlineWarning />}   title="Résiliés ce mois"     subtitle={kpis.resiliesCeMois} />
  <Widget stacked tone="emerald" animated delay={180} icon={<PiChalkboardTeacher />}title="Écoles actives"       subtitle={kpis.ecoles} />
  <Widget stacked tone="emerald" animated delay={300} icon={<MdChildCare />}       title="Garderies actives"    subtitle={kpis.garderies} />
  <Widget stacked tone="emerald" animated delay={240} icon={<PiBaby />}            title="Crèches actives"      subtitle={kpis.creches} />
</div>




      {/* *********************************************************** */}
      {/* 🔥 KPI BARS */}
      {/* *********************************************************** */}
{/* *********************************************************** */}
{/* 📈 KPI CHARTS (nouveau look) */}
{/* *********************************************************** */}
<div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">

  {/* 1) Rétention – mini bar chart + valeur en haut à gauche */}
  <Card extra="relative p-5 rounded-2xl shadow-sm hover:-translate-y-0.5 transition">
    <div className="mb-3 flex items-center justify-between">
      <div>
        <p className="text-md font-semibold uppercase tracking-wide text-gray-500">Taux de rétention</p>
        <p className="mt-1 text-3xl font-extrabold tabular-nums">{Math.round(kpis.tauxRetention * 100)}%</p>
      </div>
    </div>
    <div className="h-[250px]">
      <BarChart chartData={kpiRetention.series} chartOptions={kpiRetention.options} />
    </div>
  </Card>

  {/* 2) Utilisation – mini bar chart mauve */}
  <Card extra="relative p-5 rounded-2xl shadow-sm hover:-translate-y-0.5 transition">
    <div className="mb-3 flex items-center justify-between">
      <div>
        <p className="text-md font-semibold uppercase tracking-wide text-gray-500">Taux d’utilisation</p>
        <p className="mt-1 text-3xl font-extrabold tabular-nums">{Math.round(kpis.tauxUtilisation * 100)}%</p>
      </div>
    </div>
    <div className="h-[250px]">
      <BarChart chartData={kpiUtilisation.series} chartOptions={kpiUtilisation.options} />
    </div>
  </Card>

  {/* 3) Paiements – donut “anneau” */}
  <Card extra="relative p-5 rounded-2xl shadow-sm hover:-translate-y-0.5 transition">
    <div className="mb-3 flex items-center justify-between">
      <div>
        <p className="text-md font-semibold uppercase tracking-wide text-gray-500">Paiements</p>
        <p className="mt-1 text-3xl font-extrabold tabular-nums">{Math.round(kpis.tauxPaiement * 100)}%</p>
      </div>
    </div>
    <div className="h-[250px]">
      <PieChart series={kpiPaiements.series} options={kpiPaiements.options} />
    </div>
  </Card>

</div>




      {/* *********************************************************** */}
      {/* 📊 CHARTS */}
      {/* *********************************************************** */}
      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
        
        {/* PIE */}
        <Card extra="relative group p-5 rounded-2xl shadow-lg hover:-translate-y-1 transition-all">
          <div className="card-glow"></div>
          <h3 className="relative z-10 mb-4 text-lg font-extrabold bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-400 bg-clip-text text-transparent animate-gradient-x">
            🍩 Revenus par type de client
          </h3>
          <PieChart series={revenusParType.series} options={revenusParType.options} />
        </Card>

        {/* BAR */}
       {/* BAR (filtrable par type) */}
<Card extra="relative group p-5 rounded-2xl shadow-lg hover:-translate-y-1 transition-all">
  <div className="card-glow"></div>

  <div className="relative z-10 mb-4 flex items-start justify-between">
    <h3 className="text-lg font-extrabold bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-400 bg-clip-text text-transparent animate-gradient-x">
      📈 Nouvelles {labelMap[barFilter]} par mois
    </h3>

    {/* filtre à droite */}
    <EntityFilter
      value={barFilter}
      onChange={setBarFilter}
      counts={totalByType}   // badge = total annuel par type
    />
  </div>

  <div className="h-[230px]">
    <BarChart
      chartData={barSeriesFor(barFilter)}
      chartOptions={barOptionsFor(barFilter)}
    />
  </div>
</Card>


      </div>

      {/* *********************************************************** */}
      {/* 🗺 MAP */}
      {/* *********************************************************** */}
     {/* 🗺 MAP */}
<div className="mt-6 animate-fadeIn">
  <CrechesMap />
</div>

{/* 📅 PLANNER : calendrier + modal + liste de RDV */}
<Card extra="
  mt-6 p-6 rounded-3xl relative group overflow-visible
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
  {/* === CARTE PROCHAINE EXPIRATION (avec son filtre propre) === */}
  <Card extra="col-span-full p-6 rounded-3xl relative group overflow-hidden shadow-lg">
    <div className="card-glow"></div>

    {/* Filtre à droite — INDEPENDANT */}
    <div className="absolute right-6 top-6 flex items-center gap-3">
      <EntityFilter value={cardFilter} onChange={setCardFilter} counts={countsCard} />

    </div>

    <p className="flex items-center gap-2 text-xs font-semibold uppercase">
      <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
      Prochaine expiration — <span className="normal-case">{typeLabel[cardFilter]}</span>
    </p>

    <h3 className="mt-3 text-xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
      {nextExp.nom}
    </h3>

    <p className="mt-2 text-sm text-gray-600 flex items-center gap-2">
      📄 {nextExp.licence} — expire le{" "}
      <span className="font-bold text-red-500">{nextExp.date}</span>
    </p>

    <span className="mt-4 inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold bg-red-500/20 text-red-600 border border-red-200 animate-pulse">
      ⏰ {nextExp.restant} restant
    </span>

    <div className="mt-4 h-1 w-full rounded-full bg-gradient-to-r from-purple-500 via-blue-500 to-emerald-400 animate-gradient-slide"></div>
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
