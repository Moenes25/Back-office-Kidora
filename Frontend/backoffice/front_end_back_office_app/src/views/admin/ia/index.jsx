/* src/views/admin/ia/analyseIa.jsx */

import React from "react";
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import { FiFileText, FiDownload } from "react-icons/fi";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";

// tes charts existants (restent inchangés)
import DashboardCharts from "components/DashboardCharts";

// ========= APIs analytics (réelles) =========
import {
  getDashboardStats,
  getRepartitionParType,
  getRepartitionParStatut,
  getEvolutionMensuelle,
} from "services/dashboardService";

/* =========================================================
   Petites cartes KPI (ton composant d’origine, inchangé)
========================================================= */
function useTicker(base, wobble = 0.03) {
  const [v, setV] = useState(base);
  useEffect(() => {
    const id = setInterval(() => {
      setV((x) => +(x * (1 + (Math.random() * 2 - 1) * wobble)).toFixed(2));
    }, 1500);
    return () => clearInterval(id);
  }, [wobble]);
  return v;
}

function KpiSpark({ label, unit = "", color = "#fff", gradient, bgColor }) {
  const [data, setData] = useState(() => Array.from({ length: 40 }, () => 0));
  const value = useTicker(1 + Math.random() * 100, 0.06);

  useEffect(() => {
    const id = setInterval(() => {
      setData((d) => {
        const n = d.slice(1);
        n.push(Math.max(0, (n[n.length - 1] || 50) + (Math.random() * 14 - 7)));
        return n;
      });
    }, 900);
    return () => clearInterval(id);
  }, []);

  const option = useMemo(
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
          lineStyle: { width: 2, color, shadowBlur: 10, shadowColor: "rgba(0,0,0,.25)" },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: `${color}cc` },
              { offset: 1, color: `${color}00` },
            ]),
          },
          animationDuration: 600,
          animationDurationUpdate: 600,
        },
      ],
    }),
    [data, color]
  );

  const cardStyle = { background: gradient ? gradient : (bgColor ?? "#111827") };

  return (
    <div
      className="relative overflow-hidden rounded-2xl min-h-[120px] p-3 shadow-[0_14px_48px_rgba(2,6,23,.12)] text-white"
      style={cardStyle}
    >
      <div className="flex items-baseline justify-between">
        <span className="text-white/80 text-xs">{label}</span>
        <span className="text-white/60 text-xs">{unit}</span>
      </div>
      <div className="mt-1 text-2xl font-extrabold tracking-tight">
        {value}
        <span className="ml-1 text-sm text-white/70">{unit}</span>
      </div>
      <div className="mt-2 h-10">
        <ReactECharts option={option} style={{ height: 40 }} notMerge />
      </div>
    </div>
  );
}

/* =========================================================
   1) Hook: charge les données réelles pour les exports
========================================================= */
const initialAnalytics = {
  dashboard: null,   // /analytics/dashboard
  repType: null,     // /analytics/repartition/type
  repStatut: null,   // /analytics/repartition/statut
  evolution: null,   // /analytics/evolution-mensuelle
};

function useAnalytics() {
  const [analytics, setAnalytics] = useState(initialAnalytics);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [dashboard, repType, repStatut, evolution] = await Promise.all([
          getDashboardStats(),
          getRepartitionParType(),
          getRepartitionParStatut(),
          getEvolutionMensuelle(),
        ]);
        if (!mounted) return;
        setAnalytics({ dashboard, repType, repStatut, evolution });
      } catch (e) {
        console.error("Chargement analytics failed:", e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return { analytics, loading };
}


// remplace toLocaleString("fr-FR") par ceci quand tu écris dans le PDF
function formatNumberFR(n) {
  if (n == null || isNaN(+n)) return "0";
  // nombre FR avec espace fine, puis on normalise vers espace simple
  const s = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(+n);
  return s.replace(/\u202F|\u00A0/g, " "); // ← évite le bug PDF (&1&1…)
}

function formatMoneyFR(n) {
  if (n == null || isNaN(+n)) return "0 TND";
  // pas de symbole exotique, on garde "TND" en suffixe
  return `${formatNumberFR(n)} TND`;
}

/* =========================================================
   2) Builder de synthèse (utilisé par CSV/XLSX/PDF)
========================================================= */
function buildSummaryRowsFrom(analytics) {
  const rows = [["Métrique", "Valeur"]];
  const { dashboard, repType, repStatut, evolution } = analytics || {};

  if (dashboard) {
    const total = dashboard.total_etablissements ?? 0;
    const sans = dashboard.sans_abonnement ?? 0;
    const avec = Math.max(0, total - sans);

    rows.push(["Établissements (total)", total]);
    rows.push(["Avec abonnement", avec]);
    rows.push(["Sans abonnement", sans]);
    rows.push(["Montant payé (TND)", (dashboard.montant_total_paye ?? 0).toLocaleString("fr-FR")]);
    rows.push(["Montant dû (TND)", (dashboard.montant_total_du ?? 0).toLocaleString("fr-FR")]);
  }

  if (repType?.labels && repType?.data) {
    rows.push(["—", "—"]);
    rows.push(["Répartition par type (total)", repType.data.reduce((a, b) => a + b, 0)]);
    repType.labels.forEach((l, i) => rows.push([`Type: ${l}`, repType.data[i] ?? 0]));
  }

  if (repStatut?.labels && repStatut?.data) {
    rows.push(["—", "—"]);
    rows.push(["Répartition par statut (total)", repStatut.data.reduce((a, b) => a + b, 0)]);
    repStatut.labels.forEach((l, i) => rows.push([`Statut: ${l}`, repStatut.data[i] ?? 0]));
  }

  if (evolution?.mois && evolution?.paye && evolution?.impaye) {
    const i = evolution.mois.length - 1;
    if (i >= 0) {
      rows.push(["—", "—"]);
      rows.push([
        `Paiements (${evolution.mois[i]})`,
        `Payé: ${evolution.paye[i] ?? 0} • Impayé: ${evolution.impaye[i] ?? 0}`,
      ]);
    }
  }

  return rows;
}



/* =========================================================
   3) Exports (CSV / XLSX / PDF) — style propre
========================================================= */
// utils CSV
function csvEscape(v) {
  return `"${(v ?? "").toString().replace(/\r?\n/g, " ").replace(/"/g, '""')}"`;
}

// CSV (UTF-8 ; ; )
function exportCSVFrom(analytics) {
  const summary = buildSummaryRowsFrom(analytics);
  const csv = summary.map(r => r.map(csvEscape).join(";")).join("\r\n");
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `analyse-ia_${new Date().toISOString().slice(0,19).replace(/[:T]/g,"-")}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}

// XLSX multi-feuilles
function exportXLSXFrom(analytics) {
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet(buildSummaryRowsFrom(analytics)),
    "Résumé"
  );

  if (analytics.repType?.labels) {
    const typeRows = [["Type", "Nombre"], ...analytics.repType.labels.map((l, i) => [l, analytics.repType.data[i] ?? 0])];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(typeRows), "Par type");
  }
  if (analytics.repStatut?.labels) {
    const stRows = [["Statut", "Nombre"], ...analytics.repStatut.labels.map((l, i) => [l, analytics.repStatut.data[i] ?? 0])];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(stRows), "Par statut");
  }
  if (analytics.evolution?.mois) {
    const evoRows = [["Mois", "Payé", "Impayé"], ...analytics.evolution.mois.map((m, i) => [m, analytics.evolution.paye[i] ?? 0, analytics.evolution.impaye[i] ?? 0])];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(evoRows), "Évolution");
  }

  XLSX.writeFile(wb, `analyse-ia_${new Date().toISOString().slice(0,10)}.xlsx`);
}

// PDF (bandeau + alignements + pagination)
function exportPDFFrom(analytics) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  const Mx = 42, My = 48;         // marges
  const colK = Mx + 12;           // padding gauche dans la carte/table
  let y = My;

  // --- Bandeau ---
  doc.setFillColor(79, 70, 229);  // indigo
  doc.rect(0, 0, pageW, 68, "F");
  doc.setFontSize(16); doc.setTextColor(255);
  doc.text("Kidora — Rapport d'analyse IA", Mx, 44);
  doc.setFontSize(10);
  doc.text(new Date().toLocaleString("fr-FR").replace(/\u202F|\u00A0/g, " "), pageW - Mx, 44, { align: "right" });

  // --- Carte/Table conteneur ---
  y = 96;
  const cardW = pageW - Mx * 2;
  const rowH = 26;

  // header de section
  doc.setFontSize(12); doc.setTextColor(30);
  doc.text("Synthèse", Mx, y); y += 12;

  // carte arrondie
  doc.setDrawColor(230); doc.setFillColor(255,255,255);
  doc.roundedRect(Mx, y, cardW, 340, 8, 8, "S"); // hauteur large; on s'arrêtera avant si besoin
  let tableTop = y + 6; y = tableTop;

  // entête de table
  const thH = 30;
  //doc.setFillColor(245, 243, 255); // violet très clair
  //doc.roundedRect(Mx+3, y, cardW-6, thH, 6, 6, "F");
  //doc.setFontSize(11); doc.setTextColor(80);
  //doc.text("Métrique", colK, y + 19);
  const colV = Mx + cardW - 12; // bord droit intérieur
  //doc.text("Valeur", colV, y + 19, { align: "right" });
  y += thH + 4;

  // lignes
  const rows = buildSummaryRowsFrom(analytics).filter(r => r[0] !== "—");
  doc.setFontSize(11);

  rows.forEach((row, i) => {
    const isEven = i % 2 === 0;
    // zébrage
    if (isEven) {
      doc.setFillColor(248, 250, 252); // slate-50
      doc.rect(Mx+3, y, cardW-6, rowH, "F");
    }
    // clé
    doc.setTextColor(60);
    doc.text(`• ${row[0]}`, colK, y + 17);

    // valeur (à droite)
    doc.setTextColor(90);
    const val = String(row[1]).replace(/\u202F|\u00A0/g, " ");
    doc.text(val, colV, y + 17, { align: "right" });

    y += rowH;

    // pagination simple
    if (y + rowH > pageH - My) {
      doc.addPage();
      y = My;
    }
  });

  // pied de page
  if (y + 28 > pageH - My) { doc.addPage(); y = My; }
  y += 12;
  doc.setDrawColor(230); doc.line(Mx, y, pageW - Mx, y); y += 18;
  doc.setFontSize(9); doc.setTextColor(120);
  doc.text("© Kidora — Back Office", Mx, y);

  doc.save(`analyse-ia_${new Date().toISOString().slice(0,10)}.pdf`);
}


/* =========================================================
   4) Composant principal
========================================================= */
export default function AnalyseIA() {
  const { analytics, loading } = useAnalytics();

  const handleExportCSV  = () => exportCSVFrom(analytics);
  const handleExportXLSX = () => exportXLSXFrom(analytics);
  const handleExportPDF  = () => exportPDFFrom(analytics);

  if (loading) return <p>Chargement…</p>;

  return (
    <div className="space-y-5">
      {/* KPI Row (décoratif) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-2">
        <KpiSpark label="Requêtes / s" bgColor="#4f46e5" color="#ffffff" />
        <KpiSpark label="Latence p95" unit="ms" gradient="linear-gradient(135deg,#60a5fa,#3b82f6)" color="#ffffff" />
        <KpiSpark label="Erreurs" unit="%" gradient="linear-gradient(135deg,#f59e0b,#ef4444)" color="#ffffff" />
        <KpiSpark label="Utilisateurs actifs" gradient="linear-gradient(135deg,#10b981,#22d3ee)" color="#ffffff" />
      </div>

      {/* Boutons export */}
      <div className="flex justify-end gap-3">
        <button
          onClick={handleExportPDF}
          className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-gradient-to-r from-[#a78bfa]/10 to-[#8b5cf6]/10 px-3 py-2 text-sm font-semibold text-[#6d28d9] shadow-[0_10px_24px_rgba(2,6,23,.1)] backdrop-blur hover:from-[#a78bfa]/20 hover:to-[#8b5cf6]/20"
        >
          <FiFileText className="text-sm" />
          Exporter le rapport PDF
        </button>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-gradient-to-r from-emerald-500/10 to-teal-400/10 px-3 py-2 text-sm font-semibold text-emerald-700 shadow-[0_10px_24px_rgba(2,6,23,.1)] backdrop-blur hover:from-emerald-500/20 hover:to-teal-400/20"
        >
          <FiDownload className="text-sm" />
          Exporter CSV
        </button>
      </div>

      {/* Tes graphiques existants (déjà branchés aux APIs) */}
      <DashboardCharts />
    </div>
  );
}
