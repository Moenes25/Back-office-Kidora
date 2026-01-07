import React, { useEffect, useState, useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { getDashboardStats } from "services/dashboardService";


import * as echarts from "echarts";
import { useMotionValue, useTransform, animate, motion } from "framer-motion";




function ChartCard({ title, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative rounded-2xl p-5 bg-white shadow-[0_14px_48px_rgba(2,6,23,.1)] border border-slate-100"
    >
      <div className="mb-3">
        <h3 className="text-lg font-bold text-slate-700">{title}</h3>
      </div>
      <div>{children}</div>
    </motion.div>
  );
}

export default function DashboardCharts() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getDashboardStats().then((data) => {
      if (data) setStats(data);
    });
  }, []);

const pieOption = useMemo(() => {
  if (!stats) return {};

  return {
    tooltip: {
      trigger: "item",
      backgroundColor: "#fff",
      borderColor: "#e2e8f0",
      textStyle: { color: "#1e293b" },
    },
    legend: {
      bottom: 0,
      textStyle: { color: "#64748b", fontWeight: 600 },
    },
    series: [
      {
        name: "Abonnement",
        type: "pie",
        radius: ["45%", "70%"],
        avoidLabelOverlap: false,
        label: {
          show: true,
          formatter: '{b}\n{d}%',
          fontSize: 12,
          fontWeight: "bold",
        },
        itemStyle: {
          borderColor: "#fff",
          borderWidth: 2,
        },
        emphasis: {
          scale: true,
          scaleSize: 10,
          itemStyle: { shadowBlur: 15, shadowColor: "rgba(0,0,0,0.2)" },
        },
        color: ["#0ea5e9", "#facc15"], // bleu / jaune
        data: [
          { value: stats.etablissements_avec_abonnement, name: "Avec abonnement" },
          { value: stats.etablissements_sans_abonnement, name: "Sans abonnement" },
        ],
      },
    ],
  };
}, [stats]);


const barEtatOption = useMemo(() => {
  if (!stats) return {};
  return {
    tooltip: { trigger: "axis" },
    grid: { left: '4%', right: '4%', bottom: '12%', containLabel: true },
    xAxis: {
      type: "category",
      data: ["Actif", "Inactif"],
      axisLabel: { color: "#475569", fontWeight: 600 },
      axisLine: { lineStyle: { color: "#cbd5e1" } },
    },
    yAxis: {
      type: "value",
      axisLabel: { color: "#475569" },
      splitLine: { lineStyle: { type: "dashed", color: "#e2e8f0" } },
    },
    series: [
      {
        name: "Établissements",
        type: "bar",
        data: [stats.etablissements_actifs, stats.etablissements_inactifs],
        itemStyle: {
          borderRadius: [8, 8, 0, 0],
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#34d399" },
            { offset: 1, color: "#10b981" },
          ]),
        },
        barWidth: 40,
      },
    ],
  };
}, [stats]);


const barMontantOption = useMemo(() => {
  if (!stats) return {};
  return {
    tooltip: { trigger: "axis" },
    xAxis: {
      type: "category",
      data: ["Montant payé", "Montant dû"],
      axisLabel: { color: "#475569" },
      axisLine: { lineStyle: { color: "#cbd5e1" } },
    },
    yAxis: {
      type: "value",
      axisLabel: { color: "#475569" },
      splitLine: { lineStyle: { type: "dashed", color: "#e2e8f0" } },
    },
    series: [
      {
        name: "Montants (TND)",
        type: "bar",
        data: [stats.montant_total_paye, stats.montant_total_du],
        barWidth: 40,
        itemStyle: {
          borderRadius: [8, 8, 0, 0],
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#f59e0b" },
            { offset: 1, color: "#ef4444" },
          ]),
        },
        label: {
          show: true,
          position: "top",
          fontWeight: "bold",
          formatter: (p) => `${p.value} TND`,
        },
      },
    ],
  };
}, [stats]);


const radialOption = useMemo(() => {
  if (!stats) return {};
  const value = Math.round(stats.taux_paiement * 100);

  return {
    series: [
      {
        type: 'pie',
        radius: ['70%', '90%'],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: 'center',
          formatter: `{c}%\nTaux de paiement`,
          fontSize: 18,
          fontWeight: 'bold',
          color: '#334155',
        },
        data: [
          { value, name: 'Payé', itemStyle: { color: '#10b981' } },
          { value: 100 - value, name: 'Impayé', itemStyle: { color: '#e2e8f0' } },
        ],
      },
    ],
  };
}, [stats]);



  if (!stats) return <p>Chargement...</p>;

  return (
   <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  <ChartCard title="Répartition des établissements">
    <ReactECharts option={pieOption} style={{ height: 320 }} />
  </ChartCard>

  <ChartCard title="État des établissements">
    <ReactECharts option={barEtatOption} style={{ height: 320 }} />
  </ChartCard>

  <ChartCard title="Montants payés vs dus">
    <ReactECharts option={barMontantOption} style={{ height: 320 }} />
  </ChartCard>

  <ChartCard title="Taux de paiement">
    <ReactECharts option={radialOption} style={{ height: 320 }} />
  </ChartCard>
</div>

  );
}
