// src/views/admin/default/index.jsx

import MiniCalendar from "components/calendar/MiniCalendar"; // (plus utilisé mais tu peux l’enlever si tu veux)
import WeeklyRevenue from "views/admin/default/components/WeeklyRevenue";
import TotalSpent from "views/admin/default/components/TotalSpent";

import { IoMdHome } from "react-icons/io";
import { IoDocuments } from "react-icons/io5";
import { MdBarChart, MdDashboard } from "react-icons/md";

import Widget from "components/widget/Widget";
import CrechesMap from "components/maps/CrechesMap";
import Card from "components/card";
import BarChart from "components/charts/BarChart";
import PieChart from "components/charts/PieChart";

// -----------------------------
// 🔢 Données graphiques statiques
// -----------------------------

// Nouvelles crèches par mois (exemple)
const newCrechesByMonthOptions = {
  chart: { toolbar: { show: false } },
  xaxis: {
    categories: [
      "Jan", "Fév", "Mar", "Avr", "Mai", "Juin",
      "Juil", "Août", "Sep", "Oct", "Nov", "Déc",
    ],
    labels: { style: { colors: "#94a3b8", fontSize: "11px" } },
  },
  yaxis: {
    labels: { style: { colors: "#94a3b8", fontSize: "11px" } },
  },
  grid: { borderColor: "#e2e8f0", strokeDashArray: 4 },
  dataLabels: { enabled: false },
  colors: ["#4c6fff"],
  plotOptions: {
    bar: {
      borderRadius: 6,
      columnWidth: "45%",
    },
  },
};

const newCrechesByMonthData = [
  {
    name: "Nouvelles crèches",
    data: [2, 3, 1, 4, 5, 3, 6, 4, 2, 3, 4, 5],
  },
];

// Répartition par région
const crechesByRegionDonutOptions = {
  labels: ["Grand Tunis", "Nord", "Sahel", "Sud"],
  legend: {
    position: "bottom",
    labels: { colors: "#64748b" },
  },
  colors: ["#4c6fff", "#a855f7", "#22c55e", "#f97316"],
};

const crechesByRegionDonutData = [48, 32, 21, 17];

// Top 10 crèches (données fake)
const topCreches = [
  {
    nom: "Les Petits Anges",
    ville: "Tunis",
    enfants: 120,
    licence: "Active",
    revenue: "250 DT",
  },
  {
    nom: "Arc-en-ciel",
    ville: "Ariana",
    enfants: 95,
    licence: "Active",
    revenue: "210 DT",
  },
  {
    nom: "Paradise Kids",
    ville: "La Marsa",
    enfants: 80,
    licence: "Active",
    revenue: "195 DT",
  },
  {
    nom: "Happy Kids",
    ville: "Ben Arous",
    enfants: 76,
    licence: "En alerte",
    revenue: "180 DT",
  },
  {
    nom: "Les Étoiles",
    ville: "Nabeul",
    enfants: 72,
    licence: "Active",
    revenue: "170 DT",
  },
  {
    nom: "BabyLand",
    ville: "Sousse",
    enfants: 68,
    licence: "Expirée",
    revenue: "0 DT",
  },
  {
    nom: "Kids Club",
    ville: "Sfax",
    enfants: 64,
    licence: "Active",
    revenue: "160 DT",
  },
  {
    nom: "MiniMonde",
    ville: "Tunis",
    enfants: 60,
    licence: "Active",
    revenue: "150 DT",
  },
  {
    nom: "Les Oursons",
    ville: "Monastir",
    enfants: 55,
    licence: "En alerte",
    revenue: "140 DT",
  },
  {
    nom: "Little Stars",
    ville: "Bizerte",
    enfants: 50,
    licence: "Active",
    revenue: "130 DT",
  },
];

// -----------------------------
// 🧩 Composant Dashboard
// -----------------------------

const Dashboard = () => {
  return (
    <div>
      {/* 🧊 Widgets en haut */}

      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
        <Widget
          icon={<IoMdHome className="h-7 w-7 text-brand-500" />}
          title={"Total Crèches"}
          subtitle={"128"}
        />

        <Widget
          icon={<MdDashboard className="h-7 w-7 text-purple-500" />}
          title={"Enfants enregistrés"}
          subtitle={"5,432"}
        />

        <Widget
          icon={<IoDocuments className="h-7 w-7 text-indigo-500" />}
          title={"Éducateurs"}
          subtitle={"847"}
        />

        <Widget
          icon={<MdBarChart className="h-7 w-7 text-orange-500" />}
          title={"Nouvelles crèches (ce mois)"}
          subtitle={"12"}
        />

        <Widget
          icon={<MdBarChart className="h-7 w-7 text-green-500" />}
          title={"Revenus licences"}
          subtitle={"12,450 TND"}
        />

        <Widget
          icon={<MdDashboard className="h-7 w-7 text-red-500" />}
          title={"Licences expirées"}
          subtitle={"14"}
        />
      </div>

      {/* 📊 Graphiques existants */}

      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        <TotalSpent />
        <WeeklyRevenue />
      </div>

      {/* 🗺️ Google Map des crèches */}

      <div className="mt-5">
        <CrechesMap />
      </div>

      {/* 🧠 Bloc stats avancées : widget + 2 graphiques */}

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-3">
{/* 🔥 ULTRA GRADIENT PREMIUM CARD */}
<Card
  extra="
    group relative overflow-hidden 
    flex flex-col justify-between p-6 
    rounded-3xl 
    bg-white dark:bg-navy-800/80 
    border border-gray-200 dark:border-navy-700 
    shadow-xl hover:shadow-3xl
    transition-all duration-500
    hover:-translate-y-1 hover:scale-[1.02]
  "
>
  {/* 🌈 Gradient animé (fond premium) */}
  <div
    className="
      absolute inset-0 -z-10 
      bg-gradient-to-r from-purple-500 via-blue-500 to-emerald-400 
      opacity-20 blur-2xl
      transition-all duration-[2000ms]
      group-hover:opacity-40 group-hover:blur-3xl
      animate-gradient-move
    "
  ></div>

  {/* ✨ Glow circulaire animé */}
  <div
    className="
      absolute -bottom-10 -right-10 w-40 h-40 
      bg-gradient-to-br from-blue-500 to-purple-500 
      rounded-full opacity-20 blur-3xl
      group-hover:opacity-40 group-hover:blur-2xl
      transition-all duration-700
    "
  ></div>

  {/* 🔔 Titre */}
  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300 flex items-center gap-2">
    <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
    Prochaine expiration
  </p>

  {/* 🏷️ Nom crèche */}
  <h3 className="mt-3 text-xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
    Crèche Arc-en-ciel
  </h3>

  {/* 📄 Info licence */}
  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
    <span className="text-indigo-500 text-lg">📄</span>
    Licence Standard — expire le
    <span className="font-bold text-red-500">03/12/2025</span>
  </p>

  {/* ⏰ Badge expiration */}
  <span
    className="
      mt-4 inline-flex items-center gap-2 
      px-4 py-1.5 rounded-full 
      text-xs font-bold
      bg-gradient-to-r from-red-500/20 to-orange-400/20 
      text-red-600 dark:text-red-300 
      border border-red-200 dark:border-red-700/50
      shadow-md
      animate-pulse
    "
  >
    ⏰ J-5 restant
  </span>

  {/* 🌈 Ligne décorative animée */}
  <div
    className="
      mt-5 h-1 w-full rounded-full 
      bg-gradient-to-r from-purple-500 via-blue-500 to-emerald-400
      animate-gradient-slide
    "
  ></div>
</Card>



   {/* 📈 Nouvelles crèches par mois */}
<Card
  extra="
    p-5 relative overflow-hidden
    bg-white/80 dark:bg-navy-800/70 
    backdrop-blur-xl border border-gray-200 dark:border-navy-700 
    rounded-2xl shadow-lg 
    hover:shadow-2xl hover:-translate-y-1
    transition-all duration-500
    group
  "
>

  {/* 🔥 Glow gradient (ATTÉNUÉ) */}
  <div className="
    absolute inset-0 
    opacity-[0.25]                 /* 🔥 Était 0.60 → maintenant 0.25 */
    bg-[radial-gradient(circle_at_top_left,_#a5b4fc_0%,_#c4b5fd_40%,_#99f6e4_90%)]
    /* 🔥 Couleurs adoucies (indigo-200, purple-200, teal-200) */
    blur-2xl                       /* 🔥 Était blur-3xl → réduit */
    group-hover:blur-xl group-hover:opacity-40
    transition-all duration-700
    pointer-events-none
  "></div>

  {/* Header */}
  <div className="relative z-10 mb-4 flex items-center justify-between">
    <h3
      className="
        text-lg font-extrabold
        bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-400
        bg-clip-text text-transparent
        animate-gradient-x
      "
    >
      📈 Nouvelles crèches par mois
    </h3>
  </div>

  {/* Ligne décorative */}
  <div className="
    relative z-10 mb-3 h-1 w-32 
    bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-400 
    rounded-full opacity-80
  "></div>

  {/* CHART */}
  <div className="relative z-10 h-[230px] w-full">
    <BarChart
      chartData={newCrechesByMonthData}
      chartOptions={newCrechesByMonthOptions}
    />
  </div>

</Card>


<Card
  extra="
    p-5 relative overflow-hidden
    bg-white/70 dark:bg-navy-800/60 
    backdrop-blur-xl border border-gray-200 dark:border-navy-700 
    rounded-2xl shadow-lg 
    hover:shadow-3xl hover:-translate-y-1
    transition-all duration-500
    group
  "
>
  {/* Glow animé */}
  <div
    className="
      absolute inset-0 opacity-40
      bg-[radial-gradient(circle_at_center,_rgba(99,102,241,0.4),_rgba(147,51,234,0.3),_rgba(20,184,166,0.4))]
      blur-3xl
      group-hover:blur-xl group-hover:opacity-70
      transition-all duration-700
      pointer-events-none
    "
  ></div>

  {/* Titre */}
  <div className="relative z-10 mb-4 flex items-center gap-2">
    <span className="text-xl animate-bounce">🍩</span>
    <h3
      className="
        text-lg font-extrabold
        bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-400
        bg-clip-text text-transparent
        animate-gradient-x
      "
    >
      Répartition des crèches par région
    </h3>
  </div>

  {/* Donut Chart */}
  <div className="relative z-10 h-[230px] w-full">
    <PieChart
      series={crechesByRegionDonutData}
      options={crechesByRegionDonutOptions}
    />
  </div>
</Card>

      </div>

   {/* 🏆 Tableau Top 10 crèches — Version Premium Animée */}
<div className="mt-5">
  <Card
    extra="
      w-full p-6 relative overflow-hidden
      bg-white/80 dark:bg-navy-800/60 
      backdrop-blur-xl border border-gray-200 dark:border-navy-700 
      rounded-3xl shadow-lg 
      transition-all duration-500
      hover:shadow-3xl
      group
    "
  >
    {/* 🔥 Glow animé de fond */}
    <div
      className="
        absolute inset-0 -z-10 
        bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.25),_rgba(59,130,246,0.2),_rgba(45,212,191,0.25))]
        blur-3xl opacity-30
        group-hover:opacity-60 group-hover:blur-2xl
        transition-all duration-700
      "
    ></div>

    {/* Titre */}
    <h3
      className="
        text-lg font-extrabold mb-4
        bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-400
        bg-clip-text text-transparent animate-gradient-x
      "
    >
      🏆 Top 10 crèches
    </h3>

    <div className="overflow-x-auto rounded-xl">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr
            className="
              text-xs font-semibold uppercase tracking-wide
              text-gray-500 dark:text-gray-300
              bg-gradient-to-r from-gray-50 to-gray-100 dark:from-navy-700 dark:to-navy-600
              border-b border-gray-200 dark:border-white/10
            "
          >
            <th className="py-3 px-3">Crèche</th>
            <th className="py-3 px-3">Ville</th>
            <th className="py-3 px-3">Enfants</th>
            <th className="py-3 px-3">Licence</th>
            <th className="py-3 px-3">Revenus</th>
          </tr>
        </thead>

        <tbody>
          {topCreches.map((c, i) => (
            <tr
              key={i}
              className="
                transition-all duration-300
                hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 
                dark:hover:from-navy-700/40 dark:hover:to-navy-600/40
                hover:translate-x-[4px]
                border-b border-gray-100 dark:border-white/5
                animate-fadeIn
              "
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {/* NOM */}
              <td className="py-3 px-3 text-sm font-bold text-navy-700 dark:text-white">
                {c.nom}
              </td>

              {/* VILLE */}
              <td className="py-3 px-3 text-sm text-gray-600 dark:text-gray-300">
                {c.ville}
              </td>

              {/* ENFANTS */}
              <td className="py-3 px-3 text-sm text-gray-600 dark:text-gray-300">
                {c.enfants}
              </td>

              {/* LICENCE — BADGE ANIMÉ */}
              <td className="py-3 px-3 text-sm">
                <span
                  className={[
                    "rounded-full px-3 py-1 text-xs font-semibold shadow-sm animate-bounce-slow",
                    c.licence === "Active" &&
                      "bg-green-100 text-green-600 dark:bg-green-500/20",
                    c.licence === "En alerte" &&
                      "bg-yellow-100 text-yellow-600 dark:bg-yellow-500/20",
                    c.licence === "Expirée" &&
                      "bg-red-100 text-red-600 dark:bg-red-500/20",
                  ].join(" ")}
                >
                  {c.licence}
                </span>
              </td>

              {/* REVENUS */}
              <td className="py-3 px-3 text-sm text-gray-700 dark:text-gray-200 font-medium">
                {c.revenue}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </Card>
</div>

    </div>
  );
};

export default Dashboard;
