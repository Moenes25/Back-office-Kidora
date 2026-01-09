// src/views/admin/ia/analyseIa.jsx
// APRÈS
import React, { useMemo, useState, useEffect, useRef } from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import Swal from "sweetalert2";
import { FiInfo } from "react-icons/fi";
import DashboardCharts from "components/DashboardCharts";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { FiFileText, FiDownload } from "react-icons/fi";
import { motion } from "framer-motion"; 
/* ====================== THEME & WRAPPERS ======================= */ 
const NeonPanel = ({ title, subtitle, children }) => 
  ( <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="relative rounded-2xl p-4 bg-slate-900/80 border border-cyan-400/10 shadow-[0_12px_40px_rgba(0,0,0,.35)]" > <div className="pointer-events-none absolute -inset-px rounded-2xl ring-1 ring-white/5" />
   <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl" /> {(title || subtitle) && ( <div className="mb-3"> <h3 className="text-cyan-100 font-semibold">{title}</h3> {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>} </div> )} <div className="relative">{children}</div> </motion.div> ); 
   const axisDark = { axisLine: { lineStyle: { color: "rgba(148,163,184,.25)" } }, axisTick: { show: false }, axisLabel: { color: "rgba(226,232,240,.85)" }, splitLine: { lineStyle: { color: "rgba(148,163,184,.12)" } }, };
    const cardBg = { background: "linear-gradient(180deg,rgba(8,47,73,.55),rgba(2,6,23,.65))" };
     /* =========================== KPIs ============================== */
      function useTicker(base, wobble = 0.03) { const [v, setV] = useState(base); useEffect(() => { const id = setInterval(() => { setV((x) => +(x * (1 + (Math.random() * 2 - 1) * wobble)).toFixed(2)); }, 1500); return () => clearInterval(id); }, [wobble]); return v; } 
     function KpiSpark({
  label,
  unit = "",
  color = "#22d3ee",
  gradient = "linear-gradient(135deg,#6366f1,#06b6d4)", // ⬅️ même API que KPI
}) {
  const [data, setData] = React.useState(() =>
    Array.from({ length: 40 }, () => 0)
  );
  const value = useTicker(1 + Math.random() * 100, 0.06);

  React.useEffect(() => {
    const id = setInterval(() => {
      setData((d) => {
        const n = d.slice(1);
        n.push(Math.max(0, (n[n.length - 1] || 50) + (Math.random() * 14 - 7)));
        return n;
      });
    }, 900);
    return () => clearInterval(id);
  }, []);

  const option = React.useMemo(
    () => ({
      grid: { left: 0, right: 0, top: 0, bottom: 0 },
      xAxis: { type: "category", show: false, data: data.map((_, i) => i) },
      yAxis: { type: "value", show: false },
      series: [
        {
          type: "line",
          data,
          smooth: true,
          showSymbol: false,
          lineStyle: { width: 2, color, shadowBlur: 12, shadowColor: echarts.color.parse(color) },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: echarts.color.modifyHSL(color, 0, 0, 0.75) },
              { offset: 1, color: "rgba(0,0,0,0)" },
            ]),
          },
          animationDuration: 600,
          animationDurationUpdate: 600,
        },
      ],
    }),
    [data, color]
  );

  return (
    <div
      className="
        relative overflow-hidden rounded-2xl border border-white/50 bg-white/70 backdrop-blur-md
        shadow-[0_14px_48px_rgba(2,6,23,.12)] min-h-[120px] p-3
      "
    >
      {/* film de couleur (même que KPI du calendar) */}
      <div className="absolute inset-0 opacity-25 z-0" style={{ background: gradient }} />

      {/* petits effets comme dans KPI */}
      <div className="pointer-events-none absolute -top-6 -right-6 h-28 w-28 rounded-full bg-white/60 blur-2xl kpi-float z-0" />
      <div className="pointer-events-none absolute -left-1/3 -top-1/2 h-[220%] w-1/3 rotate-[14deg] bg-white/40 blur-md kpi-shine z-0" />

      {/* contenu */}
      <div className="relative z-10">
        <div className="flex items-baseline justify-between">
          <span className="text-slate-600 text-xs">{label}</span>
          <span className="text-slate-500 text-xs">{unit}</span>
        </div>

        <div className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">
          {value}
          <span className="ml-1 text-sm text-slate-500">{unit}</span>
        </div>

        <div className="mt-2 h-10">
          <ReactECharts option={option} style={{ height: 40 }} notMerge />
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


/* ------------------------------------------------------------------ *
 * Palette Kidora (lisible, enfants/éducation)
 * ------------------------------------------------------------------ */
const C = {
  indigo:  "#6366f1",
  sky:     "#0ea5e9",
  emerald: "#10b981",
  amber:   "#f59e0b",
  rose:    "#f43f5e",
  slate:   "#64748b",
  violet:  "#8b5cf6",
  teal:    "#14b8a6",
  gray:    "#94a3b8",
};

/* ------------------------------------------------------------------ *
 * Données EXEMPLE (remplace par ton feed)
 * ------------------------------------------------------------------ */
const DATA = {
  clientsByTypeStatus: {
    types: ["Crèches", "Garderies", "Écoles"],
    statuts: ["Actif", "Essai", "Retard", "Suspendu"],
    // matrice [type][statut]
    values: [
      [120, 18, 14, 6],
      [140, 12, 22, 4],
      [95,  8,  9,  2],
    ],
  },
  revenus12m: {
    mois: ["Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc", "Jan", "Fév"],
    mrr:  [24, 26, 29, 31, 34, 36, 39, 42, 44, 47, 50, 54],
    forecast: [56, 59, 62], // 3 mois futurs (Fév+1 → Avr)
  },
  retention: {
    retention: 91, // %
    churn: 9,      // %
  },
  paiement: {
    mois: ["Sep", "Oct", "Nov", "Déc", "Jan", "Fév"],
    paye:   [86, 88, 84, 90, 87, 89],
    impaye: [14, 12, 16, 10, 13, 11],
  },
  tickets: {
    labels: ["Haute", "Moyenne", "Basse"],
    values: [28, 64, 41],
  },
  usageHeat: {
    // jours ISO → niveau d’utilisation (0..5)
    start: "2024-09-01",
    days:  180,
  },
};
function InfoHint({ title, html, position = "top-center", toast = true }) {
  const show = async () => {
    // s'il y a déjà une alerte visible, on la ferme tout de suite
    if (Swal.isVisible()) {
      await Swal.close();              // garantit la fermeture avant d'ouvrir l'autre
    }

    // mixin pour uniformiser les toasts
    const Toast = Swal.mixin({
      toast,
      position,
      showConfirmButton: false,
      timer: 6000,
      timerProgressBar: true,
      // swap instantané (sans fade) pour une transition nette
      showClass: { popup: "" },
      hideClass: { popup: "" },
    });

    Toast.fire({
      title,
      html,
      icon: "info",
    });
  };

  return (
    <button
      type="button"
      onClick={show} // ← clic = remplace l’info courante par la nouvelle
      className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full
                 border border-slate-200 bg-white text-slate-500 shadow hover:text-slate-700"
      aria-label="Informations sur le graphique"
      title="Infos"
    >
      <FiInfo />
    </button>
  );
}















/* ------------------------------------------------------------------ *
 * Historique d’actions IA / Back-office (FAKE DATA)
 * ------------------------------------------------------------------ */
const HISTORY_ROWS = [
  {
    date: "2025-02-10 09:42",
    type: "Compte",
    action: "Création de compte",
    cible: "École Horizon",
    details: "Compte école + 2 administrateurs créés",
    statut: "Succès",
    responsable: "Admin Kidora",
  },
  {
    date: "2025-02-10 11:15",
    type: "Licence",
    action: "Activation abonnement",
    cible: "Crèche Les P’tits Anges",
    details: "Plan Premium annuel",
    statut: "Succès",
    responsable: "Commercial Nord",
  },
  {
    date: "2025-02-10 14:03",
    type: "Paiement",
    action: "Relance impayé",
    cible: "Garderie Soleil",
    details: "1er rappel automatique (mail + SMS)",
    statut: "En cours",
    responsable: "Bot IA Paiements",
  },
  {
    date: "2025-02-11 09:02",
    type: "Support",
    action: "Ticket créé",
    cible: "Crèche Arc-en-ciel",
    details: "Problème de connexion éducatrices",
    statut: "Ouvert",
    responsable: "Support Kidora",
  },
  {
    date: "2025-02-11 10:37",
    type: "IA",
    action: "Score de risque mis à jour",
    cible: "École Les Sources",
    details: "Risque churn : 72% (baisse d’utilisation)",
    statut: "Alerte",
    responsable: "Moteur IA",
  },
  {
    date: "2025-02-11 16:20",
    type: "Carte",
    action: "Nouveau client géolocalisé",
    cible: "Crèche MiniMonde",
    details: "Affectation zone Nord / Tunis",
    statut: "Succès",
    responsable: "Admin régional",
  },
];
function HistoryTable() {
  const statusColors = {
    Succès: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    "En cours": "bg-amber-50 text-amber-700 ring-amber-200",
    Ouvert: "bg-sky-50 text-sky-700 ring-sky-200",
    Alerte: "bg-rose-50 text-rose-700 ring-rose-200",
  };

  return (
    <div className="rounded-2xl border border-black/10 bg-white shadow-sm mt-6 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-slate-50">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Historique des actions IA & Back Office
          </p>
          <p className="text-[11px] text-slate-400">
            Création de comptes, abonnements, alertes IA, relances de paiement…
          </p>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          Temps réel
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
       <table className="min-w-full text-sm border-separate [border-spacing:0_8px]">
          <thead>
            <tr className="bg-slate-50/80 text-xs uppercase text-slate-500">
              <th className="px-4 py-2 text-left font-semibold">Date</th>
              <th className="px-4 py-2 text-left font-semibold">Type</th>
              <th className="px-4 py-2 text-left font-semibold">Action</th>
              <th className="px-4 py-2 text-left font-semibold">Cible</th>
              <th className="px-4 py-2 text-left font-semibold">Détails</th>
              <th className="px-4 py-2 text-left font-semibold">Statut</th>
              <th className="px-4 py-2 text-left font-semibold">Responsable</th>
            </tr>
          </thead>
          <tbody>
            {HISTORY_ROWS.map((row, idx) => (
              <tr
                key={idx}
                className={`transition hover:bg-slate-50/80 ${
                  idx % 2 === 0 ? "bg-white" : "bg-slate-50/40"
                }`}
              >
                <td className="px-4 py-2 text-xs font-mono text-slate-500">
                  {row.date}
                </td>
                <td className="px-4 py-2">
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
                    {row.type}
                  </span>
                </td>
                <td className="px-4 py-2 text-slate-700 font-medium">
                  {row.action}
                </td>
                <td className="px-4 py-2 text-slate-600">{row.cible}</td>
                <td className="px-4 py-2 text-slate-500 text-xs">
                  {row.details}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ${
                      statusColors[row.statut] || "bg-slate-50 text-slate-600 ring-slate-200"
                    }`}
                  >
                    {row.statut}
                  </span>
                </td>
                <td className="px-4 py-2 text-slate-600 text-xs">
                  {row.responsable}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
// Construit les lignes de résumé pour PDF/CSV à partir des DATA
function buildSummaryRows() {
  const rows = [["Métrique", "Valeur"]];

  // 1) Clients par type & statut
  const { types, values } = DATA.clientsByTypeStatus;
  const totalClients = values.flat().reduce((a, b) => a + b, 0);
  rows.push(["Nombre total de clients (tous types)", totalClients]);

  types.forEach((type, idx) => {
    const totalType = values[idx].reduce((a, b) => a + b, 0);
    rows.push([`Clients - ${type}`, totalType]);
  });

  // 2) Rétention / churn
  rows.push(["Taux de rétention", `${DATA.retention.retention} %`]);
  rows.push(["Taux de churn", `${DATA.retention.churn} %`]);

  // 3) Revenus MRR (dernier mois)
  const lastMrr = DATA.revenus12m.mrr[DATA.revenus12m.mrr.length - 1];
  const lastMrrMonth = DATA.revenus12m.mois[DATA.revenus12m.mois.length - 1];
  rows.push([`MRR actuel (${lastMrrMonth})`, `${lastMrr} kDT`]);

  // 4) Paiements (dernier mois)
  const idxPay = DATA.paiement.mois.length - 1;
  const moisPay = DATA.paiement.mois[idxPay];
  rows.push([
    `Taux de paiement (${moisPay})`,
    `${DATA.paiement.paye[idxPay]} % payés / ${DATA.paiement.impaye[idxPay]} % impayés`,
  ]);

  // 5) Tickets par priorité
  rows.push(["Tickets priorité haute", DATA.tickets.values[0]]);
  rows.push(["Tickets priorité moyenne", DATA.tickets.values[1]]);
  rows.push(["Tickets priorité basse", DATA.tickets.values[2]]);

  // 6) Utilisation
  rows.push([
    "Période d’utilisation couverte",
    `${DATA.usageHeat.days} jours depuis ${DATA.usageHeat.start}`,
  ]);

  return rows;
}


/* ------------------------------------------------------------------ *
 * Layout – 2 colonnes en desktop
 * ------------------------------------------------------------------ */
export default function AnalyseIA() {

   const summaryRows = buildSummaryRows();

  const handleExportCSV = () => {
    const ws = XLSX.utils.aoa_to_sheet(summaryRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Analyse IA");
    XLSX.writeFile(wb, "analyse-ia.csv");
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const marginLeft = 14;
    let cursorY = 20;

    doc.setFontSize(18);
    doc.text("Rapport d'analyse IA", marginLeft, cursorY);
    cursorY += 8;

    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text("Synthèse des principaux indicateurs de la page Analyse IA.", marginLeft, cursorY);
    cursorY += 10;

    doc.setFontSize(12);
    doc.setTextColor(0);

    summaryRows.slice(1).forEach(([metric, value]) => {
      if (cursorY > 280) {
        doc.addPage();
        cursorY = 20;
      }
      doc.text(`• ${metric} : ${value}`, marginLeft, cursorY);
      cursorY += 7;
    });

    doc.save("analyse-ia.pdf");
  };
  return (
    <div className="space-y-5">
      {/* KPI Row */} 
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5"> 
    <KpiSpark label="Requêtes / s" color="#22d3ee"
  gradient="linear-gradient(135deg,#6366f1,#06b6d4)" />
<KpiSpark label="Latence p95 (ms)" unit="ms" color="#60a5fa"
  gradient="linear-gradient(135deg,#60a5fa,#3b82f6)" />
<KpiSpark label="Erreurs (%)" unit="%" color="#fb7185"
  gradient="linear-gradient(135deg,#f59e0b,#ef4444)" />
<KpiSpark label="Utilisateurs actifs" color="#34d399"
  gradient="linear-gradient(135deg,#10b981,#22d3ee)" />

     </div>
     {/* 🔽 Barre d’actions export sous les KPI */}
      <div className="flex justify-end gap-3 mb-2">
     <button
  onClick={handleExportPDF}
  className="
    inline-flex items-center gap-2 rounded-2xl border border-white/20
    bg-gradient-to-r from-[#a78bfa]/10 to-[#8b5cf6]/10
    px-3 py-2 text-sm font-semibold text-[#6d28d9]
    shadow-[0_10px_24px_rgba(2,6,23,.1)] backdrop-blur
    hover:from-[#a78bfa]/20 hover:to-[#8b5cf6]/20
  "
>
  <FiFileText className="text-sm" />
  Exporter le rapport PDF
</button>


        <button
          onClick={handleExportCSV}
          className="
           inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-gradient-to-r from-emerald-500/10 to-teal-400/10 px-3 py-2 text-sm font-semibold text-emerald-700 shadow-[0_10px_24px_rgba(2,6,23,.1)] backdrop-blur hover:from-emerald-500/20 hover:to-teal-400/20"
        >
          <FiDownload className="text-sm" />
          Exporter CSV / Excel
        </button>
      </div>



     

       <DashboardCharts />

    
    </div>
  );
}