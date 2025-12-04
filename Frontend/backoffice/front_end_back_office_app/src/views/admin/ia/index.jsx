// src/views/admin/ia/analyseIa.jsx
// APRÈS
import React, { useMemo, useState, useEffect, useRef } from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import Swal from "sweetalert2";
import { FiInfo } from "react-icons/fi";

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
 * Helpers
 * ------------------------------------------------------------------ */
function genCalendarData(startISO, days) {
  const start = new Date(startISO + "T00:00:00");
  const out = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const iso = d.toISOString().slice(0, 10);
    // fake: activité 0..5 (WE plus bas)
    const isWE = d.getDay() === 0 || d.getDay() === 6;
    const v = Math.max(0, Math.round((Math.sin(i / 7) + 1) * 2 + (isWE ? -2 : 1)));
    out.push([iso, v]);
  }
  return out;
}
function useEchartsReady() {
  const ref = React.useRef(null);
  const [inst, setInst] = React.useState(null);
  const onChartReady = React.useCallback((i) => setInst(i), []);
  // optionnel: nettoyer au démontage
  React.useEffect(() => () => { try { inst?.dispose?.(); } catch {} }, [inst]);
  return { ref, inst, onChartReady };
}

/* ====================== BIG TIME SERIES ========================= */
// === Timeseries 2D clair, animé en temps réel (sans echarts-gl) ===
function MultiTimeseries({ title = "Performance IA — débit, erreurs et p95" }) {
  const len = 120;
  const xsRef   = React.useRef(Array.from({ length: len }, (_, i) => i));
  const reqRef  = React.useRef([]);
  const errRef  = React.useRef([]);
  const p95Ref  = React.useRef([]);
  const pHiRef  = React.useRef([]);
  const pLoRef  = React.useRef([]);

  // seed
  React.useMemo(() => {
    const xs = xsRef.current;
    const req = xs.map(i => 250 + Math.sin(i/6)*40 + (Math.random()*30-15));
    const err = xs.map(i => 1.2 + Math.abs(Math.sin(i/11))*1.8 + Math.random()*0.6);
    const p95 = xs.map(i => 180 + Math.sin(i/7)*25 + Math.random()*18);
    reqRef.current = req.slice();
    errRef.current = err.slice();
    p95Ref.current = p95.slice();
    pHiRef.current = p95.map(v => v + 18);
    pLoRef.current = p95.map(v => v - 18);
  }, []);

  const AX = {
    axisLine:  { lineStyle: { color: "#cbd5e1", width: 1 } },
    axisTick:  { show: false },
    axisLabel: { color: "#475569" },
    splitLine: { lineStyle: { color: "#e2e8f0" } },
  };

  const { ref: chartRef, inst, onChartReady } = useEchartsReady();

  const option = React.useMemo(() => ({
    backgroundColor: "transparent",
    title: {
      text: title, left: "center", top: 8,
      textStyle: { fontSize: 13, fontWeight: 700, color: "#334155" }
    },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "cross", label: { backgroundColor: "#0f172a" } }
    },
    grid: { left: 60, right: 56, top: 64, bottom: 36 },
    legend: {
      top: 32,
      data: ["Req/s", "Error %", "p95", "p95 band"],
      textStyle: { color: "#334155" }
    },
    // ⚠️ axes en TABLEAUX pour éviter le bug axisBuilder
    xAxis: [{
      type: "category",
      data: xsRef.current,
      ...AX
    }],
    yAxis: [
      { type: "value", name: "req/s", position: "left",  nameTextStyle: { color: "#475569", padding: [0,8,0,0] }, ...AX },
      { type: "value", name: "ms",    position: "right", nameTextStyle: { color: "#475569", padding: [0,0,0,8] }, ...AX },
    ],
    series: [
      // Bande p95 (haut/bas empilée)
      {
        id: "p95Hi",
        name: "p95 band",
        type: "line",
        data: pHiRef.current,
        yAxisIndex: 1,
        stack: "p95band",
        lineStyle: { width: 0 },
        symbol: "none",
        smooth: true,
        areaStyle: { color: "rgba(56,189,248,.14)" },
        silent: true
      },
      {
        id: "p95Lo",
        type: "line",
        data: pLoRef.current,
        yAxisIndex: 1,
        stack: "p95band",
        lineStyle: { width: 0 },
        symbol: "none",
        smooth: true,
        areaStyle: { color: "rgba(56,189,248,.14)" },
        silent: true
      },
      // p95
      {
        id: "p95",
        name: "p95",
        type: "line",
        data: p95Ref.current,
        yAxisIndex: 1,
        smooth: true,
        showSymbol: false,
        lineStyle: { width: 2, color: "#60a5fa", shadowBlur: 14, shadowColor: "rgba(96,165,250,.35)" },
        animationDurationUpdate: 300,
        animationEasingUpdate: "cubicOut"
      },
      // Req/s
      {
        id: "req",
        name: "Req/s",
        type: "line",
        data: reqRef.current,
        smooth: true,
        showSymbol: false,
        lineStyle: { width: 2, color: "#22d3ee", shadowBlur: 12, shadowColor: "rgba(34,211,238,.38)" },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0,0,0,1,[
            {offset:0, color:"rgba(34,211,238,.22)"},
            {offset:1, color:"rgba(34,211,238,0)"}
          ])
        },
        animationDurationUpdate: 300,
        animationEasingUpdate: "cubicOut"
      },
      // Error %
      {
        id: "err",
        name: "Error %",
        type: "bar",
        data: errRef.current,
        yAxisIndex: 0,
        barWidth: 6,
        itemStyle: { color: "#fb7185", shadowBlur: 6, shadowColor: "rgba(251,113,133,.28)", borderRadius: 3 },
        animationDurationUpdate: 250
      }
    ],
    // petit zoom interne (scroll)
    dataZoom: [{ type: "inside", xAxisIndex: 0, filterMode: "weakFilter" }]
  }), [title]);

  // Ticker temps réel
  React.useEffect(() => {
    if (!inst) return; // attend l'instance prête

    let i = xsRef.current[xsRef.current.length - 1];
    const tick = () => {
      i += 1;
      const lastReq = reqRef.current.at(-1) ?? 250;
      const lastErr = errRef.current.at(-1) ?? 2;
      const lastP95 = p95Ref.current.at(-1) ?? 180;

      const nr = lastReq + (Math.random()*14 - 7);
      const ne = Math.max(0, lastErr + (Math.random()*0.2 - 0.1));
      const np = lastP95 + (Math.random()*8 - 4);

      xsRef.current.push(i);
      reqRef.current.push(nr);
      errRef.current.push(ne);
      p95Ref.current.push(np);
      pHiRef.current.push(np + 18);
      pLoRef.current.push(np - 18);

      // longueur fixe
      [xsRef, reqRef, errRef, p95Ref, pHiRef, pLoRef].forEach(r => { if (r.current.length > len) r.current.shift(); });

      inst.setOption({
        xAxis: [{ data: xsRef.current }],
        series: [
          { id: "p95Hi", data: pHiRef.current },
          { id: "p95Lo", data: pLoRef.current },
          { id: "p95",   data: p95Ref.current },
          { id: "req",   data: reqRef.current },
          { id: "err",   data: errRef.current }
        ]
      });
    };

    const id = setInterval(tick, 900);
    return () => clearInterval(id);
  }, [inst]);

   return <ReactECharts ref={chartRef} onChartReady={onChartReady} option={option} style={{ height: 360 }} />;
}



/* ------------------------------------------------------------------ *
 * 1) 3D BAR – Clients par type × statut
 * ------------------------------------------------------------------ */
/* ------------------------------------------------------------------ *
 * NEW — Clients par type & statut (barres groupées animées)
 * ------------------------------------------------------------------ */
function ChartClientsByTypeStatus() {
  const { types, statuts, values } = DATA.clientsByTypeStatus;

  // couleurs par statut
  const colors = [C.indigo, C.emerald, C.amber, C.rose];

  // données par statut (un tableau par série)
  const perStatus = statuts.map((_, sIdx) => types.map((_, tIdx) => values[tIdx][sIdx]));

  // séries: pour chaque statut -> 2 séries (barre + capuchon “3D”)
  const series = [];
  statuts.forEach((name, sIdx) => {
    const col = colors[sIdx];

    // barre principale
    series.push({
      name,
      type: "bar",
      data: perStatus[sIdx],
      barWidth: 20,
      barGap: 0.14,
      roundCap: true,
      showBackground: true,
      backgroundStyle: { color: "rgba(15, 23, 42, 0.03)", borderRadius: [6, 6, 0, 0] },
      itemStyle: {
        borderRadius: [8, 8, 0, 0],
        shadowBlur: 10,
        shadowColor: col + "66",
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: col },
          { offset: 0.5, color: col + "cc" },
          { offset: 1, color: col + "66" },
        ]),
      },
      label: {
        show: true,
        position: "top",
        color: "#334155",
        fontSize: 11,
        formatter: ({ value }) => value,
      },
      // animations d’apparition et de mise à jour
      animationDuration: 1000,
      animationDelay: (i) => i * 70 + sIdx * 120,
      animationEasing: "elasticOut",
      animationDurationUpdate: 700,
      animationDelayUpdate: (i) => i * 40 + sIdx * 80,
      animationEasingUpdate: "cubicOut",
      emphasis: {
        focus: "series",
        itemStyle: { shadowBlur: 18, shadowColor: col + "99" },
      },
      // transition fluide quand tu changes les données/filtre
      universalTransition: true,
    });

 
  });

  const option = {
    grid: { top: 64, left: 48, right: 24, bottom: 42 },
    legend: {
      top: 8,
      icon: "roundRect",
      itemWidth: 12,
      textStyle: { color: "#334155", fontWeight: 600 },
    },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow", shadowStyle: { color: "rgba(99,102,241,0.06)" } },
      formatter: (params) => {
        // ne prendre qu’une fois chaque série (ignorer la série capuchon)
        const rows = params.filter((p, i) => p.seriesType === "bar");
        const type = rows[0]?.axisValue;
        const lines = rows.map((p) => {
          const col = colors[p.seriesIndex]; // index parmi les barres (sans cap)
          return `<span style="display:inline-block;width:10px;height:10px;background:${col};border-radius:50%;margin-right:6px"></span>${p.seriesName}: <b>${p.data}</b>`;
        });
        const total = rows.reduce((acc, p) => acc + (p.data || 0), 0);
        return `<b>${type}</b><br/>${lines.join("<br/>")}<br/><span style="color:#64748b">Total: ${total}</span>`;
      },
    },
    xAxis: {
      type: "category",
      data: types,
      axisTick: { show: false },
      axisLabel: { color: "#1f2937", fontWeight: 700 },
      axisLine: { lineStyle: { color: "#e5e7eb" } },
    },
    yAxis: {
      type: "value",
      splitLine: { lineStyle: { color: "#eef2ff" } },
      axisLabel: { color: "#64748b" },
    },
    series,
    // petite ambiance “parallaxe” sur le survol
    graphic: [
      {
        type: "rect",
        right: 0,
        top: 0,
        style: {
          fill: new echarts.graphic.LinearGradient(1, 0, 0, 1, [
            { offset: 0, color: "rgba(99,102,241,0.03)" },
            { offset: 1, color: "rgba(14,165,233,0.00)" },
          ]),
        },
        shape: { width: "100%", height: "100%" },
        silent: true,
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: 400 }} />;
}



/* ------------------------------------------------------------------ *
 * 2) Courbe lissée + projection (zone dégradée)
 * ------------------------------------------------------------------ */
function ChartRevenus() {
  const { mois, mrr, forecast } = DATA.revenus12m;
  const allLabels = [...mois, "Mar+", "Avr+", "Mai+"]; // labels prévision
  const allValues = [...mrr, ...forecast];             // concat réel + prévision

  // barres fines/projection (pour “relief”)
  const bars = new Array(allValues.length).fill(1);

  // réf pour animer le curseur
  const { ref: chartRef, inst, onChartReady } = useEchartsReady();
  const option = {
    grid: { top: 48, left: 48, right: 20, bottom: 40 },
    backgroundColor: "#fff",
    legend: { top: 8, data: ["MRR", "Prévision"], textStyle: { color: "#334155", fontWeight: 600 } },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "line",
        lineStyle: { color: C.indigo, width: 1, type: "dashed" },
        shadowStyle: { color: "rgba(99,102,241,0.06)" },
      },
      formatter: (p) => {
        const name = p[0].axisValue;
        const mrrP = p.find(x => x.seriesName === "MRR")?.value ?? "—";
        const fP   = p.find(x => x.seriesName === "Prévision")?.value ?? "—";
        return `<b>${name}</b><br/>MRR: <b>${mrrP} DT</b><br/>Prévision: <b>${fP} DT</b>`;
      }
    },

    // Petite texture “colonne” très douce derrière (barres projectives)
    xAxis: {
      type: "category",
      data: allLabels,
      boundaryGap: false,
      axisTick: { show: false },
      axisLine: { lineStyle: { color: "#e5e7eb" } },
      axisLabel: { color: "#111827", fontWeight: 700 }
    },
    yAxis: {
      type: "value",
      axisLabel: { formatter: "{value} DT", color: "#64748b" },
      splitLine: { lineStyle: { color: "#eef2ff" } }
    },

    series: [
      // 0) barres projetées (super light)
      {
        name: "Relief",
        type: "bar",
        data: bars.map((_, i) => allValues[i] || 0),
        barWidth: 8,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(99,102,241,.18)" },
            { offset: 1, color: "rgba(99,102,241,0)" },
          ]),
        },
        emphasis: { disabled: true },
        z: 0,
      },

      // 1) MRR
      {
        name: "MRR",
        type: "line",
        smooth: true,
        data: [...mrr, null, null, null],  // on “réserve” la place des mois prévision
        symbol: "circle",
        symbolSize: 8,
        z: 3,
        lineStyle: { width: 4, color: C.indigo, shadowBlur: 16, shadowColor: C.indigo + "66" },
        itemStyle:  { color: "#fff", borderColor: C.indigo, borderWidth: 3 },
        areaStyle: {
          // dégradé + ombre = “faux 3D”
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: C.indigo + "99" },
            { offset: .5, color: C.indigo + "33" },
            { offset: 1, color: "rgba(99,102,241,0.05)" },
          ]),
          shadowColor: C.indigo + "44",
          shadowBlur: 24,
        },
        animationDuration: 900,
        animationEasing: "cubicOut",
      },

      // 2) Prévision
      {
        name: "Prévision",
        type: "line",
        smooth: true,
        data: new Array(mrr.length).fill(null).concat(forecast),
        symbol: "circle",
        symbolSize: 6,
        z: 2,
        lineStyle: { width: 3, color: C.sky, type: "dashed", shadowBlur: 8, shadowColor: C.sky + "66" },
        itemStyle:  { color: C.sky },
        areaStyle: { opacity: 0 },
        animationDuration: 900,
        animationDelay: 150,
      },

      // 3) Curseur animé (ripple)
      {
        name: "Live",
        type: "effectScatter",
        coordinateSystem: "cartesian2d",
        zlevel: 4,
        symbolSize: 12,
        showEffectOn: "render",
        rippleEffect: { brushType: "stroke", scale: 3, period: 3 },
        itemStyle: { color: C.indigo },
        data: [[allLabels[0], allValues[0]]], // sera mis à jour par setInterval
        tooltip: { show: false },
      },
    ],

    // 4) Bande “gloss” (shimmer) qui traverse la zone
    graphic: [{
      type: "rect",
      right: -120, top: 0, bottom: 0, z: 1,
      shape: { width: 120, height: "100%" },
      style: {
        fill: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
          { offset: 0, color: "rgba(255,255,255,0)" },
          { offset: .5, color: "rgba(255,255,255,.35)" },
          { offset: 1, color: "rgba(255,255,255,0)" },
        ])
      },
      keyframeAnimation: {
        duration: 5000,
        loop: true,
        keyframes: [
          { percent: 0,   right: -120 },
          { percent: 1.0, right: "100%" },
        ],
      },
      silent: true,
    }],
  };

  // Animation temps réel du curseur (pas de GL, step discret mois par mois)
  React.useEffect(() => {
    if (!inst) return;

    let i = 0;
    const path = allLabels.map((lab, idx) => [lab, allValues[idx]]);
    const timer = setInterval(() => {
      i = (i + 1) % path.length;
      inst.setOption({
        series: [
          {}, {}, {},
          { data: [path[i]] } // met à jour l’effectScatter
        ]
      });
    }, 800); // vitesse

    return () => clearInterval(timer);
  }, [inst, allLabels.join("|")]);

   return <ReactECharts ref={chartRef} onChartReady={onChartReady} option={option} style={{ height: 380 }} />;}


/* ------------------------------------------------------------------ *
 * 3) Double Gauge – Rétention & Churn
 * ------------------------------------------------------------------ */
function ChartRetention() {
  const { retention, churn } = DATA.retention;
 const { ref, inst, onChartReady } = useEchartsReady();

  // --- réglages d'espacement & de teinte de la piste ---
  const CENTER_L = ["25%", "64%"];   // plus à gauche  => + d'espace
  const CENTER_R = ["75%", "64%"];   // plus à droite  => + d'espace
  const RIM_RADIUS = "76%";          // un peu plus petit (avant 78%)
  const TRACK_RADIUS = "70%";        // piste (progress) plus petite (avant 72%)
  const TRACK_WIDTH = 14;
  const TRACK_BG = "rgba(100,116,139,.32)"; // <- plus foncé qu'avant
  const TICK_COLOR = "rgba(100,116,139,.38)"; // graduations un peu plus dark

  const noteLabel = (v, isRetention) => {
    if (isRetention) {
      if (v >= 90) return "Excellent";
      if (v >= 80) return "Très bon";
      if (v >= 70) return "Correct";
      return "À améliorer";
    } else {
      if (v <= 8)  return "Très faible";
      if (v <= 12) return "Sous contrôle";
      if (v <= 20) return "Élevé";
      return "Critique";
    }
  };

  const makeGauge = (center, color, value, title, seriesKey) => {
    const base = {
      type: "gauge",
      startAngle: 200,
      endAngle: -20,
      min: 0, max: 100,
      center,
      pointer: { show: false },
      axisLabel: { show: false }, axisTick: { show: false }, splitLine: { show: false },
      title: { show: true, color: "#475569", fontSize: 12, offsetCenter: [0, "-42%"], text: title },
      detail: { show: false },
      data: [{ value, name: title }],
      tooltip: { show: false },
    };

    // anneau externe
    const rim = {
      ...base,
      radius: RIM_RADIUS,
      z: 0,
      title: { show: false },
      axisLine: {
        lineStyle: {
          width: 16,
          color: [[1, new echarts.graphic.LinearGradient(0,0,1,1,[
            {offset:0,   color:"rgba(15,23,42,.10)"},
            {offset:.55, color:"rgba(148,163,184,.18)"},
            {offset:1,   color:"rgba(255,255,255,.75)"},
          ])]],
          shadowBlur: 14, shadowColor: "rgba(0,0,0,.08)",
        }
      }
    };

    // graduations
    const ticks = {
      ...base,
      radius: TRACK_RADIUS,
      z: 1,
      splitNumber: 5,
      axisLine: { lineStyle: { width: TRACK_WIDTH, color: [[1, "rgba(0,0,0,0)"]] } },
      axisTick:  { show: true, distance: -TRACK_WIDTH, length: 7, lineStyle: { color: TICK_COLOR, width: 1 } },
      splitLine: { show: true, distance: -TRACK_WIDTH, length: 18, lineStyle: { color: "rgba(100,116,139,.3)", width: 1 } },
    };

    // piste + valeur (tooltip ici)
    const prog = {
      ...base,
      radius: TRACK_RADIUS,
      z: 2,
      name: seriesKey,
      tooltip: { show: true },
      progress: {
        show: true, roundCap: true, width: TRACK_WIDTH,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0,0,0,1,[
            {offset:0, color},
            {offset:1, color: echarts.color.modifyHSL ? echarts.color.modifyHSL(color,0,0.02,0.28) : color}
          ]),
          shadowBlur: 18, shadowColor: color + "77",
        },
      },
      // piste grise (plus dark)
      axisLine: { lineStyle: { width: TRACK_WIDTH, color: [[1, TRACK_BG]] } },
      detail: {
        show: true,
        valueAnimation: true,
        fontSize: 20, fontWeight: 800, color,
        offsetCenter: [0, "30%"],
        formatter: "{value}%",
      },
      emphasis: { itemStyle: { shadowBlur: 26, shadowColor: color + "aa" } },
    };

    // gloss-cap
    const glossCap = {
      ...base,
      radius: TRACK_RADIUS,
      z: 3,
      progress: { show: true, roundCap: true, width: 5, itemStyle: { color: "#fff", shadowBlur: 10, shadowColor: color + "aa" } },
      axisLine: { lineStyle: { width: 5, color: [[1, "rgba(0,0,0,0)"]] } },
    };

    // aiguille
    const pointer = {
      ...base,
      z: 4,
      radius: "66%",
      pointer: {
        show: true,
        icon: "path://M0,0 L6,0 L0,70 L-6,0 Z",
        length: "66%", width: 6,
        itemStyle: { color, shadowBlur: 8, shadowColor: color + "66" },
      },
      axisLine: { lineStyle: { width: 0 } },
      anchor: { show: true, showAbove: true, size: 10, itemStyle: { color: "#fff", borderColor: color, borderWidth: 2 } },
      detail: { show: false }, title: { show: false },
    };

    return [rim, ticks, prog, glossCap, pointer];
  };

  const option = {
    title: {
      text: "Engagement clients — Rétention vs Taux de churn",
      left: "center", top: 6,
      textStyle: { fontSize: 13, fontWeight: 700, color: "#334155" }
    },
    tooltip: {
      trigger: "item",
      confine: true,
      backgroundColor: "rgba(15,23,42,.95)",
      borderColor: "rgba(148,163,184,.3)",
      borderWidth: 1,
      textStyle: { color: "#e2e8f0", fontSize: 12 },
      formatter: (p) => {
        const isRetention = p.seriesName === "Retention";
        const label = isRetention ? "Rétention des clients" : "Taux de churn";
        const v = Number(p.value ?? p.data?.value ?? 0);
        const note = noteLabel(v, isRetention);
        return `
          <div style="min-width:160px">
            <div style="font-weight:700;margin-bottom:4px">${label}</div>
            <div style="display:flex;align-items:center;gap:8px">
              <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${p.color}"></span>
              <span><b>${v.toFixed(1)}%</b> — ${note}</span>
            </div>
          </div>`;
      },
      position: (pt, params, dom, rect, size) =>
        [pt[0] - size.contentSize[0] / 2, pt[1] + 10],
    },
    series: [
      ...makeGauge(CENTER_L, C.emerald, retention, "Rétention des clients", "Retention"),
      ...makeGauge(CENTER_R, C.rose,    churn,     "Taux de churn",        "Churn"),
    ]
  };

  // breathing + mouvement de l’aiguille
  React.useEffect(() => {
    if (!inst) return;
    let t = 0;
    const baseRet = retention, baseChurn = churn;
    const id = setInterval(() => {
      t += 0.25;
      const d = Math.sin(t) * 0.6;
      const v1 = Math.max(0, Math.min(100, +(baseRet + d).toFixed(1)));
      const v2 = Math.max(0, Math.min(100, +(baseChurn + d).toFixed(1)));
      inst.setOption({
        // indices: [0=rimR,1=tickR,2=progR,3=capR,4=ptrR, 5=rimC,6=tickC,7=progC,8=capC,9=ptrC]
        series: [
          {}, {}, { data: [{ value: v1, name: "Rétention des clients" }] }, {}, { data: [{ value: v1 }] },
          {}, {}, { data: [{ value: v2, name: "Taux de churn" }] }, {}, { data: [{ value: v2 }] },
        ]
      });
    }, 700);
    return () => clearInterval(id);
 }, [inst, retention, churn]);

  return <ReactECharts ref={ref} onChartReady={onChartReady} option={option} style={{ height: 300 }} />;}





/* ------------------------------------------------------------------ *
 * 4) Stack 100% – Taux de paiement (Payé vs Impayé)
 * ------------------------------------------------------------------ */
function ChartPaiement() {
  const { mois, paye, impaye } = DATA.paiement;
  const ref = React.useRef(null);

  // deux séries (couleurs proches de ton exemple)
  const SERIES = [
    { name: "Payé",   color: C.sky },    // bleu cyan
    { name: "Impayé", color: C.violet }, // violet
  ];

  // données [catIndex, valeur]
  const toPairs = (arr) => arr.map((v, i) => [i, v]);

  // --- rendu d’un “cube” 2.5D (avant + côté + dessus) ---
  const renderCuboid = (params, api) => {
    const cat = api.value(0);
    const val = api.value(1);

    // coordonnées en px
    const xBase = api.coord([cat, 0])[0];
    const y0    = api.coord([cat, 0])[1];
    const yVal  = api.coord([cat, val])[1];

    const band  = api.size([1, 0])[0];           // largeur de catégorie
    const bw    = band * 0.26;                    // largeur barre
    const depth = bw * 0.45;                      // profondeur 3D
    const topH  = depth * 0.60;                   // “hauteur” du dessus

    const isA   = params.seriesIndex === 0;       // 0=Payé, 1=Impayé
    const off   = (isA ? -1 : 1) * bw * 0.55;     // décalage gauche/droite

    const left  = xBase + off - bw / 2;
    const right = left + bw;

    const base  = SERIES[params.seriesIndex].color;
    const front = echarts.color.lift(base, -0.05);
    const side  = echarts.color.lift(base, -0.22);
    const top   = echarts.color.lift(base,  0.10);

    // polygones (px)
    const pFront = [
      [left,  y0],   [right,  y0],
      [right, yVal], [left,   yVal],
    ];
    const pSide = [
      [right,        y0],
      [right+depth,  y0 - topH],
      [right+depth,  yVal - topH],
      [right,        yVal],
    ];
    const pTop = [
      [left,        yVal],
      [right,       yVal],
      [right+depth, yVal - topH],
      [left+depth,  yVal - topH],
    ];

    // groupe avec 3 faces
    return {
      type: "group",
      children: [
        { // face avant
          type: "polygon",
          shape: { points: pFront },
          style: api.style({
            fill: front,
            shadowBlur: 12,
            shadowColor: base + "66",
          }),
          emphasis: { style: { shadowBlur: 18 } },
        },
        { // face côté droit
          type: "polygon",
          shape: { points: pSide },
          style: { fill: side },
        },
        { // face du dessus
          type: "polygon",
          shape: { points: pTop },
          style: { fill: top, opacity: 0.95 },
        },
      ],
    };
  };

  const option = {
    grid: { top: 40, left: 54, right: 34, bottom: 44 },
    legend: {
      top: 8,
      icon: "roundRect",
      itemWidth: 12,
      textStyle: { color: "#334155", fontWeight: 600 },
      data: SERIES.map(s => s.name),
    },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter: (list) => {
        const m = list[0].axisValue;
        const p = list.find(x => x.seriesName === "Payé")?.value?.[1] ?? 0;
        const i = list.find(x => x.seriesName === "Impayé")?.value?.[1] ?? 0;
        return `<b>${m}</b><br/>Payé: <b>${p}%</b><br/>Impayé: <b>${i}%</b>`;
      },
    },
    xAxis: {
      type: "category",
      data: mois,
      axisTick: { show: false },
      axisLabel: { color: "#0f172a", fontWeight: 700 },
      axisLine: { lineStyle: { color: "#e5e7eb" } },
    },
    yAxis: {
      type: "value",
      max: 100,
      axisLabel: { formatter: "{value}%", color: "#64748b" },
      splitLine: { lineStyle: { color: "#eef2ff" } },
    },
    series: [
      {
        name: "Payé",
        type: "custom",
        renderItem: renderCuboid,
        encode: { x: 0, y: 1, tooltip: [0, 1] },
        data: toPairs(paye),
        animationDuration: 1000,
        animationDelay: (i) => i * 80,
        z: 2,
      },
      {
        name: "Impayé",
        type: "custom",
        renderItem: renderCuboid,
        encode: { x: 0, y: 1, tooltip: [0, 1] },
        data: toPairs(impaye),
        animationDuration: 1000,
        animationDelay: (i) => i * 80 + 120,
        z: 3,
      },
    ],
  };

  return <ReactECharts ref={ref} option={option} style={{ height: 340 }} />;
}


/* ------------------------------------------------------------------ *
 * 5) Radial Bars – Tickets par priorité
 * ------------------------------------------------------------------ */
function ChartTicketsRadial() {
  const { labels, values } = DATA.tickets; // ["Haute","Moyenne","Basse"]
  const colors = [C.rose, C.amber, C.indigo];
  const radii  = [0.78, 0.60, 0.42];       // en fraction du conteneur
  const width  = [16,   16,   16];

  // fabrique un anneau: rim (fond), progress (valeur), cap (gloss)
  const makeRing = (i, name, val, col) => {
    const base = {
      type: "gauge",
      startAngle: 230, endAngle: -50,
      min: 0, max: Math.max(...values, 1),
      splitNumber: 0,
      pointer: { show: false },
      axisLabel: { show: false }, axisTick: { show: false }, splitLine: { show: false },
      title:  { show: false },           // << on enlève les titres centraux
      detail: { show: false },           // << on enlève les valeurs au centre
      data: [{ value: val, name }],
      animationDuration: 900,
      animationDelay: i * 150,
      animationEasing: "cubicOut"
    };

    // 1) rim (plus sombre qu’avant)
    const rim = {
      ...base,
      radius: `${radii[i] * 100}%`,
      z: 0,
      axisLine: {
        lineStyle: {
          width: width[i],
          color: [[1, new echarts.graphic.LinearGradient(0, 0, 1, 1, [
            { offset: 0.00, color: "rgba(15,23,42,.14)" },  // plus dark
            { offset: 0.55, color: "rgba(100,116,139,.22)" },
            { offset: 1.00, color: "rgba(255,255,255,.70)" }
          ])]],
          shadowBlur: 14,
          shadowColor: "rgba(2,6,23,.14)"
        }
      },
      tooltip: { show: false }
    };

    // 2) progress (faux 3D)
    const progress = {
      ...base,
      radius: `${radii[i] * 100}%`,
      z: 1,
      name, // pour le tooltip
      progress: {
        show: true, roundCap: true, width: width[i],
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: col },
            { offset: 1, color: echarts.color.lift(col, -0.2) }
          ]),
          shadowBlur: 16,
          shadowColor: col + "77"
        }
      },
      axisLine: { lineStyle: { width: width[i], color: [[1, "rgba(226,232,240,.55)"]] } },
      emphasis: { itemStyle: { shadowBlur: 26, shadowColor: col + "aa" } }
    };

    // 3) cap (gloss)
    const cap = {
      ...base,
      radius: `${radii[i] * 100}%`,
      z: 2,
      progress: { show: true, roundCap: true, width: 6, itemStyle: { color: "#fff", shadowBlur: 10, shadowColor: col + "aa" }},
      axisLine: { lineStyle: { width: 6, color: [[1, "rgba(0,0,0,0)"]] } },
      tooltip: { show: false }
    };

    return [rim, progress, cap];
  };

  const series = [];
  labels.forEach((name, i) => series.push(...makeRing(i, name, values[i], colors[i])));

  const option = {
    tooltip: {
      trigger: "item",
      confine: true,
      backgroundColor: "rgba(15,23,42,.95)",
      borderColor: "rgba(148,163,184,.3)",
      borderWidth: 1,
      textStyle: { color: "#e2e8f0", fontSize: 12 },
      formatter: (p) => {
        const idx = Math.floor(p.seriesIndex / 3);
        const col = colors[idx];
        const v = Number(p.value ?? p.data?.value ?? 0);
        const name = labels[idx];
        return `
          <div style="display:flex;align-items:center;gap:8px">
            <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${col}"></span>
            <b>${name}</b> : ${v}
          </div>`;
      }
    },
    series,
    // Balayage lumineux (tourne en continu)
    graphic: labels.map((_, i) => ({
      type: "arc",
      shape: {
        cx: "50%", cy: "62%",
        r: radii[i] * 145,          // rayon px approx (145 ≈ moitié de 290px de hauteur)
        startAngle: 0, endAngle: Math.PI / 3
      },
      style: {
        fill: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
          { offset: 0, color: "rgba(255,255,255,0)" },
          { offset: .5, color: "rgba(255,255,255,.30)" },
          { offset: 1, color: "rgba(255,255,255,0)" }
        ])
      },
      z: 3,
      keyframeAnimation: {
        duration: 4000 + i * 500,
        loop: true,
        keyframes: [
          { percent: 0,  rotation: 0,     origin: ["50%","62%"] },
          { percent: 1,  rotation: Math.PI * 2, origin: ["50%","62%"] }
        ]
      }
    }))
  };

  // Pulse en temps réel (respiration)
  const ref = React.useRef(null);
  React.useEffect(() => {
    const inst = ref.current?.getEchartsInstance?.();
    if (!inst) return;
    const base = [...values];
    let t = 0;
    const id = setInterval(() => {
      t += 0.25;
      const d = Math.sin(t) * 0.6;
      // progress sont aux index 1,4,7 (triplets rim/prog/cap)
      inst.setOption({
        series: [
          {}, { data: [{ value: +(base[0] + d).toFixed(1) }] }, {},
          {}, { data: [{ value: +(base[1] + d).toFixed(1) }] }, {},
          {}, { data: [{ value: +(base[2] + d).toFixed(1) }] }, {},
        ]
      });
    }, 800);
    return () => clearInterval(id);
  }, [values.join("|")]);

  return <ReactECharts ref={ref} option={option} style={{ height: 300 }} />;
}



/* ------------------------------------------------------------------ *
 * 6) Calendar Heatmap – Utilisation quotidienne
 * ------------------------------------------------------------------ */
// Courbe animée : Demandes IA par type (Garderies / Crèches / Écoles)
// Courbe animée en temps réel : Demandes IA par type
function ChartIaRequestsByType({
  title = "Demandes IA par type (mensuel)",
  mois  = ["Sep","Oct","Nov","Déc","Jan","Fév"],
  garderies = [120, 140, 180, 150, 210, 190],
  creches   = [ 90, 110, 160, 130, 180, 175],
  ecoles    = [ 70,  95, 120, 100, 150, 165],
  unit = "req",
  windowSize = 12,       // longueur max de la fenêtre affichée
  tickMs = 1200,         // vitesse du “temps réel”
  live = true,           // désactiver pour figer
}) {
  const COL = { garderies: "#3b82f6", creches: "#fb6a4a", ecoles: "#60e1e0" };
 const { ref: chartRef, inst, onChartReady } = useEchartsReady();

  // ======== State mutable (sans re-render React) ========
  const xRef  = React.useRef([...mois]);
  const gRef  = React.useRef([...garderies]);
  const cRef  = React.useRef([...creches]);
  const eRef  = React.useRef([...ecoles]);

  // Génère le label du prochain mois à partir du dernier (FR court)
  const nextMonth = React.useCallback((last) => {
    const map = ["Jan","Fév","Mar","Avr","Mai","Jun","Jul","Aoû","Sep","Oct","Nov","Déc"];
    const i = map.indexOf(last.replace("+",""));
    if (i === -1) return last + "+";           // fallback
    const n = (i + 1) % 12;
    // quand on boucle, on ajoute un petit “+” pour montrer l’avancée
    return map[n] + (n === 0 ? "+" : "");
  }, []);

  const fmt = (v) => `${v} ${unit}`;

  const option = {
    title: { text: title, left: "center", top: 6, textStyle: { fontSize: 13, fontWeight: 700, color: "#334155" } },
    grid: { top: 72, left: 52, right: 24, bottom: 40 },
    legend: {
      top: 30, icon: "circle", itemWidth: 8, textStyle: { color: "#334155" },
      data: ["Garderies", "Crèches", "Écoles"]
    },
    tooltip: {
      trigger: "axis", confine: true,
      axisPointer: { type: "line", lineStyle: { color: "rgba(2,6,23,.15)", width: 1 } },
      formatter: (ps) => {
        const m = ps[0].axisValue;
        const g = ps.find(x => x.seriesName==="Garderies")?.value ?? "—";
        const c = ps.find(x => x.seriesName==="Crèches")?.value ?? "—";
        const e = ps.find(x => x.seriesName==="Écoles")?.value ?? "—";
        return `<b>${m}</b><br/>Garderies : <b>${fmt(g)}</b><br/>Crèches : <b>${fmt(c)}</b><br/>Écoles : <b>${fmt(e)}</b>`;
      }
    },
    // Axes en tableaux = updates stables
    xAxis: [{ type: "category", boundaryGap: true, data: xRef.current,
      axisTick: { show: false }, axisLine: { lineStyle: { color: "#e5e7eb" } }, axisLabel: { color: "#0f172a" } }],
    yAxis: [{ type: "value", axisLabel: { color: "#64748b", formatter: fmt }, splitLine: { lineStyle: { color: "#eef2ff" } } }],
    series: [
      // Lignes (ids stables)
      { id: "G", name: "Garderies", type: "line", smooth: 0.25, data: gRef.current, showSymbol: true, symbolSize: 6,
        lineStyle: { width: 3, color: COL.garderies }, itemStyle: { color: COL.garderies } },
      { id: "C", name: "Crèches",   type: "line", smooth: 0.25, data: cRef.current, showSymbol: true, symbolSize: 6,
        lineStyle: { width: 3, color: COL.creches },   itemStyle: { color: COL.creches } },
      { id: "E", name: "Écoles",    type: "line", smooth: 0.25, data: eRef.current, showSymbol: true, symbolSize: 6,
        lineStyle: { width: 3, color: COL.ecoles },    itemStyle: { color: COL.ecoles } },

      // “curseurs” ripple (toujours sur le dernier point)
      { id: "GlowG", name: "GlowG", type: "effectScatter", coordinateSystem: "cartesian2d", zlevel: 3,
        symbolSize: 10, rippleEffect: { brushType: "stroke", scale: 2.6, period: 3 }, itemStyle: { color: COL.garderies },
        data: [[xRef.current.at(-1), gRef.current.at(-1)]], tooltip: { show: false } },
      { id: "GlowC", name: "GlowC", type: "effectScatter", coordinateSystem: "cartesian2d", zlevel: 3,
        symbolSize: 10, rippleEffect: { brushType: "stroke", scale: 2.6, period: 3 }, itemStyle: { color: COL.creches },
        data: [[xRef.current.at(-1), cRef.current.at(-1)]], tooltip: { show: false } },
      { id: "GlowE", name: "GlowE", type: "effectScatter", coordinateSystem: "cartesian2d", zlevel: 3,
        symbolSize: 10, rippleEffect: { brushType: "stroke", scale: 2.6, period: 3 }, itemStyle: { color: COL.ecoles },
        data: [[xRef.current.at(-1), eRef.current.at(-1)]], tooltip: { show: false } },
    ],
    graphic: [{
      type: "rect", left: -120, top: 0, bottom: 0, z: 0,
      shape: { width: 120, height: "100%" },
      style: { fill: new echarts.graphic.LinearGradient(0,0,1,0,[
        {offset:0, color:"rgba(255,255,255,0)"}, {offset:0.5, color:"rgba(255,255,255,.25)"}, {offset:1, color:"rgba(255,255,255,0)"} ])},
      keyframeAnimation: { duration: 4200, loop: true, keyframes: [{percent:0,left:-120},{percent:1,left:"100%"}] },
      silent: true
    }]
  };

  // ======== Ticker “temps réel” ========
  React.useEffect(() => {
    if (!live || !inst) return;

    const step = () => {
      // 1) calcule le prochain label (mois)
      const lastLabel = xRef.current.at(-1);
      const nextLabel = nextMonth(lastLabel);

      // 2) random-walks doux (tu peux remplacer par tes vraies valeurs)
      const nG = Math.max(0, (gRef.current.at(-1) ?? 100) + (Math.random()*20 - 10));
      const nC = Math.max(0, (cRef.current.at(-1) ?? 100) + (Math.random()*20 - 10));
      const nE = Math.max(0, (eRef.current.at(-1) ?? 100) + (Math.random()*20 - 10));

      xRef.current.push(nextLabel);
      gRef.current.push(Math.round(nG));
      cRef.current.push(Math.round(nC));
      eRef.current.push(Math.round(nE));

      // 3) garde une fenêtre glissante
      const trim = (arr) => { while (arr.length > windowSize) arr.shift(); };
      [xRef.current, gRef.current, cRef.current, eRef.current].forEach(trim);

      // 4) mise à jour incrémentale
      inst.setOption({
        xAxis: [{ data: xRef.current }],
        series: [
          { id: "G", data: gRef.current },
          { id: "C", data: cRef.current },
          { id: "E", data: eRef.current },
          { id: "GlowG", data: [[xRef.current.at(-1), gRef.current.at(-1)]] },
          { id: "GlowC", data: [[xRef.current.at(-1), cRef.current.at(-1)]] },
          { id: "GlowE", data: [[xRef.current.at(-1), eRef.current.at(-1)]] },
        ]
      });
      // Tooltip auto sur le dernier point (série “Garderies” ici)
      inst.dispatchAction({ type: "showTip", seriesIndex: 0, dataIndex: gRef.current.length - 1 });
    };

    const id = setInterval(step, tickMs);
    return () => clearInterval(id);
 }, [live, tickMs, windowSize, nextMonth, inst]);

  return <ReactECharts ref={chartRef} onChartReady={onChartReady} option={option} style={{ height: 320 }} />;
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


     <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm relative">
  <MultiTimeseries title="Performance IA — débit, erreurs et p95" />
  <InfoHint
    title="Performance IA"
    html="
      <div style='text-align:left'>
        <b>Req/s</b> : nombre de requêtes traitées par seconde (débit).<br/>
        <b>Error %</b> : part de requêtes en erreur (barres).<br/>
        <b>p95</b> : 95e centile de latence (ms) avec bande de variation.
      </div>
    "
  />
</div>


    <div className="grid grid-cols-1 gap-5 xl:grid-cols-1">
     

      <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm relative">
  <ChartIaRequestsByType
    title="Temps moyen de réponse IA"
    mois={["Sep","Oct","Nov","Déc","Jan","Fév"]}
    garderies={[820,780,910,760,720,690]}
    creches={[900,860,980,830,790,750]}
    ecoles={[760,740,820,700,680,650]}
    unit="ms"
  />
  <InfoHint
    title="Temps de réponse"
    html="
      <div style='text-align:left'>
        Courbes mensuelles du <b>temps moyen de réponse</b> de l'IA (en ms)
        pour <b>Garderies</b>, <b>Crèches</b> et <b>Écoles</b>. Plus bas = mieux.
        Le halo animé marque le dernier point observé.
      </div>
    "
  />
</div>

      </div>
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
       <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm relative">
  <div className="mb-2 text-sm font-bold text-slate-600">Clients par type & statut</div>
  <ChartClientsByTypeStatus />
  <InfoHint
    title="Répartition des clients"
    html="
      <div style='text-align:left'>
        Barres groupées par type d'établissement (Crèches/Garderies/Écoles).<br/>
        Couleurs = <b>statut d'abonnement</b> (Actif, Essai, Retard, Suspendu).<br/>
        Le total par type est affiché dans l'infobulle.
      </div>
    "
  />
</div>

  
<div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm relative">
  <div className="mb-2 text-sm font-bold text-slate-600">Revenus mensuels & prévision</div>
  <ChartRevenus />
  <InfoHint
    title="MRR & Prévision"
    html="
      <div style='text-align:left'>
        Ligne pleine = <b>MRR observé</b> (kDT).<br/>
        Ligne en pointillé = <b>prévision</b> sur les prochains mois.<br/>
        La texture en colonne ajoute du relief visuel.
      </div>
    "
  />
</div>

      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm relative">
  <div className="mb-2 text-sm font-bold text-slate-600">Rétention vs Churn</div>
  <ChartRetention />
  <InfoHint
    title="Engagement des clients"
    html="
      <div style='text-align:left'>
        Deux jauges : <b>Rétention</b> (taux de clients conservés) et <b>Churn</b> (perdus).<br/>
        Les anneaux montrent la progression, l'aiguille indique la valeur instantanée.
      </div>
    "
  />
</div>


        <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm relative">
  <div className="mb-2 text-sm font-bold text-slate-600">Taux de paiement (100%)</div>
  <ChartPaiement />
  <InfoHint
    title="Taux de paiement"
    html="
      <div style='text-align:left'>
        Barres 2.5D empilées par mois montrant la part <b>Payé</b> vs <b>Impayé</b> (sur 100%).<br/>
        Idéalement, la section Payé doit rester la plus haute possible.
      </div>
    "
  />
</div>

      </div>

      {/* 🔽 Nouvelle section : historique des actions */}
      <HistoryTable />
    </div>
  );
}
