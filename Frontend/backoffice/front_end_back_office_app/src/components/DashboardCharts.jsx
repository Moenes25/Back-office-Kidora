import React, { useEffect, useState, useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { getDashboardStats, getEtablissementsSansAbonnement } from "services/dashboardService";
import * as echarts from "echarts";
import { motion } from "framer-motion";

/* -------- helpers thème -------- */
const isDarkMode = () =>
  typeof document !== "undefined" &&
  document.documentElement.classList.contains("dark");

const uiColors = () => {
  const dark = isDarkMode();
  return {
    text: dark ? "#ffffff" : "#0f172a",         // ← texte principal (white/black)
    sub: dark ? "#cbd5e1" : "#475569",          // ← texte secondaire (labels)
    axis: dark ? "#475569" : "#cbd5e1",
    grid: dark ? "#334155" : "#e5e7eb",
    tooltipBg: dark ? "rgba(15,23,42,.96)" : "rgba(255,255,255,.98)",
    tooltipBorder: dark ? "rgba(255,255,255,.08)" : "rgba(15,23,42,.08)",
  };
};

/* -------- Card -------- */
function ChartCard({ title, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="
        relative rounded-2xl p-5
        bg-white dark:bg-navy-800
        shadow-md border border-slate-100 dark:border-slate-800
        text-slate-900 dark:text-white     /* ← héritage de couleur pour toute la carte */
      "
    >
      <div className="mb-3">
        <h3 className="text-lg font-bold"> {title} </h3> {/* ← couleur héritée */}
      </div>
      <div>{children}</div>
    </motion.div>
  );
}

export default function DashboardCharts() {
  const [stats, setStats] = useState(null);
  const [sansAbonnement, setSansAbonnement] = useState(0);

  useEffect(() => {
    getDashboardStats().then((data) => data && setStats(data));
    getEtablissementsSansAbonnement().then((count) => setSansAbonnement(count));
  }, []);

  /* -------- Donut -------- */
  const donutOption = useMemo(() => {
    if (!stats) return {};
    const { text, sub, axis, grid, tooltipBg, tooltipBorder } = uiColors();

    const avec = Math.max(0, stats.total_etablissements - sansAbonnement);
    const sans = Math.max(0, sansAbonnement);

    return {
      backgroundColor: "transparent",
      tooltip: {
        trigger: "item",
        backgroundColor: tooltipBg,
        borderColor: tooltipBorder,
        textStyle: { color: text },
      },
      legend: {
        bottom: 0,
        textStyle: { color: sub, fontWeight: 600 },
        icon: "circle",
      },
      color: ["#3b82f6", "#8b5cf6"],
      series: [
        {
          name: "Abonnement",
          type: "pie",
          radius: ["60%", "80%"],
          label: { show: false },
          emphasis: {
            label: {
              show: true,
              fontSize: 14,
              fontWeight: "bold",
              color: text,
              formatter: "{b}: {d}%",
            },
          },
          data: [
            { value: avec, name: "Avec abonnement" },
            { value: sans, name: "Sans abonnement" },
          ],
        },
      ],
    };
  }, [stats, sansAbonnement]);

/* -------- Line (avec labels d’axes) -------- */
const lineOption = useMemo(() => {
  const { text, sub, axis, grid, tooltipBg, tooltipBorder } = uiColors();
  return {
    backgroundColor: "transparent",
    tooltip: { trigger: "axis", backgroundColor: tooltipBg, borderColor: tooltipBorder, textStyle: { color: text } },
    grid: { left: 56, right: 16, bottom: 60, top: 30 }, // un peu plus d’espace pour les noms d’axes
    xAxis: {
      type: "category",
      data: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin"],
      axisLine: { lineStyle: { color: axis } },
      axisLabel: { color: sub },
      name: "Mois",
      nameLocation: "middle",
      nameGap: 40,
      nameTextStyle: { color: sub, fontWeight: 700 },
    },
    yAxis: {
      type: "value",
      axisLine: { show: false },
      axisLabel: { color: sub },
      splitLine: { lineStyle: { color: grid, type: "dashed" } },
      name: "Montants",
      nameLocation: "middle",
      nameGap: 45,
      nameTextStyle: { color: sub, fontWeight: 700 },
    },
    color: ["#3b82f6", "#8b5cf6"],
    series: [
      { name: "Payé", type: "line", smooth: true, data: [30, 50, 70, 90, 100, 110] },
      { name: "Impayé", type: "line", smooth: true, data: [70, 50, 40, 30, 20, 10] },
    ],
  };
}, []);


/* -------- Bars (avec labels d’axes) -------- */
const barsOption = useMemo(() => {
  if (!stats) return {};
  const { sub, grid, tooltipBg, tooltipBorder, text, axis } = uiColors();
  return {
    backgroundColor: "transparent",
    tooltip: { trigger: "axis", backgroundColor: tooltipBg, borderColor: tooltipBorder, textStyle: { color: text } },
    grid: { left: 56, right: 16, bottom: 56, top: 24 },
    xAxis: {
      type: "category",
      data: ["Payé", "Dû"],
      axisLabel: { color: sub },
      axisLine: { lineStyle: { color: axis } },
      name: "Catégories",
      nameLocation: "middle",
      nameGap: 36,
      nameTextStyle: { color: sub, fontWeight: 700 },
    },
    yAxis: {
      type: "value",
      axisLabel: { color: sub, formatter: (v) => v.toLocaleString("fr-FR") },
      splitLine: { lineStyle: { type: "dashed", color: grid } },
      name: "TND",
      nameLocation: "middle",
      nameGap: 45,
      nameTextStyle: { color: sub, fontWeight: 700 },
    },
    color: ["#3b82f6", "#8b5cf6"],
    series: [
      { name: "Montants", type: "bar", barWidth: 30, data: [stats.montant_total_paye, stats.montant_total_du] },
    ],
  };
}, [stats]);


  if (!stats) return <p>Chargement...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <ChartCard title="Répartition des établissements">
        <ReactECharts option={donutOption} style={{ height: 280 }} />
      </ChartCard>

      <ChartCard title="Évolution du paiement">
        <ReactECharts option={lineOption} style={{ height: 280 }} />
      </ChartCard>

      <ChartCard title="Montants payés / dus">
        <ReactECharts option={barsOption} style={{ height: 280 }} />
      </ChartCard>
    </div>
  );
}
