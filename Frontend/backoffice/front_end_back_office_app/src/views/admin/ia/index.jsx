// src/views/admin/ia.jsx
/* eslint-disable */
import React, { useMemo, useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import { motion } from "framer-motion";

/* ====================== THEME & WRAPPERS ======================= */
const NeonPanel = ({ title, subtitle, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
    className="relative rounded-2xl p-4 bg-slate-900/80 border border-cyan-400/10 shadow-[0_12px_40px_rgba(0,0,0,.35)]"
  >
    <div className="pointer-events-none absolute -inset-px rounded-2xl ring-1 ring-white/5" />
    <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl" />
    {(title || subtitle) && (
      <div className="mb-3">
        <h3 className="text-cyan-100 font-semibold">{title}</h3>
        {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
      </div>
    )}
    <div className="relative">{children}</div>
  </motion.div>
);

const axisDark = {
  axisLine: { lineStyle: { color: "rgba(148,163,184,.25)" } },
  axisTick: { show: false },
  axisLabel: { color: "rgba(226,232,240,.85)" },
  splitLine: { lineStyle: { color: "rgba(148,163,184,.12)" } },
};

const cardBg = { background: "linear-gradient(180deg,rgba(8,47,73,.55),rgba(2,6,23,.65))" };

/* =========================== KPIs ============================== */
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

function KpiSpark({ label, unit = "", color = "#22d3ee" }) {
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

  const option = useMemo(() => ({
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
  }), [data, color]);

  return (
    <div className="rounded-xl p-3 border border-cyan-400/10 shadow-inner" style={cardBg}>
      <div className="flex items-baseline justify-between">
        <span className="text-slate-300 text-xs">{label}</span>
        <span className="text-cyan-300 text-xs">{unit}</span>
      </div>
      <div className="mt-1 text-2xl font-extrabold tracking-tight text-cyan-100">
        {value}<span className="ml-1 text-sm text-cyan-300">{unit}</span>
      </div>
      <div className="mt-2 h-10">
        <ReactECharts option={option} style={{ height: 40 }} notMerge />
      </div>
    </div>
  );
}

/* ====================== BIG TIME SERIES ========================= */
function MultiTimeseries() {
  const len = 120;
  const xs = Array.from({ length: len }, (_, i) => i);
  const base = 250;
  const req = xs.map((i) => base + Math.sin(i / 6) * 40 + (Math.random() * 30 - 15));
  const err = xs.map((i) => 1.2 + Math.abs(Math.sin(i / 11)) * 1.8 + Math.random() * 0.6);
  const p95 = xs.map((i) => 180 + Math.sin(i / 7) * 25 + Math.random() * 18);
  const p95Low = p95.map((v) => v - 18);
  const p95High = p95.map((v) => v + 18);

  const option = useMemo(() => ({
    backgroundColor: "transparent",
    tooltip: { trigger: "axis", axisPointer: { type: "cross" } },
    grid: { left: 40, right: 24, top: 24, bottom: 28 },
    xAxis: { type: "category", data: xs, ...axisDark },
    yAxis: [
      { type: "value", name: "req/s", position: "left", ...axisDark },
      { type: "value", name: "ms", position: "right", ...axisDark },
    ],
    legend: {
      data: ["Req/s", "Error %", "p95", "p95 band"],
      textStyle: { color: "rgba(226,232,240,.9)" },
      top: 0,
    },
    series: [
      { name: "p95 band", type: "line", data: p95High, lineStyle: { width: 0 }, symbol: "none",
        areaStyle: { color: "rgba(56,189,248,.12)" }, stack: "p95band", emphasis: { disabled: true }, smooth: true, yAxisIndex: 1 },
      { type: "line", data: p95Low, lineStyle: { width: 0 }, symbol: "none",
        areaStyle: { color: "rgba(56,189,248,.12)" }, stack: "p95band", emphasis: { disabled: true }, smooth: true, yAxisIndex: 1 },
      { name: "p95", type: "line", data: p95, yAxisIndex: 1, smooth: true, showSymbol: false,
        lineStyle: { width: 2, color: "#60a5fa", shadowBlur: 14, shadowColor: "rgba(96,165,250,.35)" } },
      { name: "Req/s", type: "line", data: req, smooth: true, showSymbol: false,
        lineStyle: { width: 2, color: "#22d3ee", shadowBlur: 12, shadowColor: "rgba(34,211,238,.38)" },
        areaStyle: { color: new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:"rgba(34,211,238,.25)"},{offset:1,color:"rgba(34,211,238,0)"}]) } },
      { name: "Error %", type: "bar", data: err, yAxisIndex: 0, barWidth: 6,
        itemStyle: { color: "#fb7185", shadowBlur: 8, shadowColor: "rgba(251,113,133,.3)", borderRadius: 3 } },
    ],
  }), []);

  return <ReactECharts option={option} style={{ height: 360 }} notMerge />;
}

/* ==================== CANDLE + VOLUME ============================ */
function CandlesVolume() {
  const n = 90;
  const dates = Array.from({ length: n }, (_, i) => i);
  const ohlc = [], volumes = [];
  let prev = 50;
  for (let i = 0; i < n; i++) {
    const open = prev;
    const change = (Math.random() - 0.5) * 3;
    const close = Math.max(35, open + change);
    const high = Math.max(open, close) + Math.random() * 2.5;
    const low = Math.min(open, close) - Math.random() * 2.5;
    ohlc.push([open, close, low, high]);
    volumes.push(400 + Math.round(Math.random() * 400));
    prev = close;
  }
  const option = useMemo(() => ({
    tooltip: { trigger: "axis" },
    grid: [{ left: 40, right: 12, top: 18, height: 210 }, { left: 40, right: 12, top: 260, height: 60 }],
    xAxis: [
      { type: "category", data: dates, ...axisDark, boundaryGap: true },
      { type: "category", data: dates, ...axisDark, gridIndex: 1, boundaryGap: true },
    ],
    yAxis: [{ scale: true, ...axisDark }, { gridIndex: 1, ...axisDark }],
    dataZoom: [{ type: "inside", xAxisIndex: [0, 1], start: 35, end: 100 }],
    series: [
      { type: "candlestick", name: "Coût", data: ohlc,
        itemStyle: { color: "#10b981", color0: "#ef4444", borderColor: "#10b981", borderColor0: "#ef4444", shadowBlur: 8, shadowColor: "rgba(0,0,0,.2)" },
        animationDuration: 600 },
      { type: "bar", name: "Volume", xAxisIndex: 1, yAxisIndex: 1, data: volumes, barWidth: 6,
        itemStyle: { color: new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:"#38bdf8"},{offset:1,color:"#0ea5e9"}]),
        borderRadius:[3,3,0,0] } },
    ],
  }), []);
  return <ReactECharts option={option} style={{ height: 330 }} notMerge />;
}

/* ========== (NEW) CIRCULAR HEATMAP: HEURE × JOUR ================ */
function CircularWorkload() {
  const hours = Array.from({ length: 24 }, (_, i) => `${i}h`);
  const days = ["Dim","Lun","Mar","Mer","Jeu","Ven","Sam"];

  // 7 séries (anneaux), 24 valeurs chacune
  const makeDay = (dIdx) =>
    hours.map((_, h) => {
      const base = dIdx >= 1 && dIdx <= 5 && h >= 8 && h <= 18 ? 65 : 22;
      return Math.round(base + Math.random() * 35);
    });

  const series = days.map((day, dIdx) => ({
    name: day,
    type: "bar",
    coordinateSystem: "polar",
    stack: "work",
    data: makeDay(dIdx),
    roundCap: true,
    barCategoryGap: "5%",
    emphasis: { focus: "series" }
  }));

  const option = useMemo(() => ({
    angleAxis: {
      type: "category",
      data: hours,
      startAngle: 90,
      axisLabel: { color: "rgba(226,232,240,.85)" },
      axisLine: { lineStyle: { color: "rgba(148,163,184,.25)" } },
      axisTick: { show: false },
    },
    radiusAxis: {
      type: "category",
      data: days,
      z: 10,
      axisLabel: { color: "rgba(226,232,240,.85)" },
      axisLine: { lineStyle: { color: "rgba(148,163,184,.25)" } },
      axisTick: { show: false },
    },
    polar: {},
    tooltip: { trigger: "item", formatter: (p) => `${p.seriesName} • ${p.name}: ${p.value}` },
    visualMap: {
      type: "continuous",
      min: 0, max: 100,
      text: ["Charge",""],
      textStyle: { color: "rgba(226,232,240,.85)" },
      inRange: { color: ["#0ea5e9", "#60a5fa", "#a78bfa"] },
      left: 0, bottom: 0
    },
    series,
  }), []);
  return <ReactECharts option={option} style={{ height: 280 }} notMerge />;
}

/* ========== (NEW) ANOMALY TIMELINE w/ RIPPLE & ZONES ============ */
function AnomalyTimeline() {
  const n = 160;
  const x = Array.from({ length: n }, (_, i) => i);
  const base = x.map(i => 80 + Math.sin(i/9)*10 + (Math.random()*8-4));

  // seuil & anomalies
  const threshold = 92;
  const anomalies = x.flatMap((t) => {
    const y = base[t] + (Math.random() > 0.93 ? 12 + Math.random()*12 : 0);
    return y > threshold ? [{ value: [t, y], score: (y-threshold)/20 }] : [];
  });

  const option = useMemo(() => ({
    grid: { left: 40, right: 16, top: 18, bottom: 28 },
    xAxis: { type: "value", ...axisDark },
    yAxis: { type: "value", ...axisDark },
    tooltip: { trigger: "axis" },
    legend: { data: ["Signal","Seuil","Anomalie"], textStyle: { color: "rgba(226,232,240,.85)" } },
    series: [
      // zone sous le seuil
      {
        type: "line", data: base, smooth: true, showSymbol: false, name: "Signal",
        lineStyle: { width: 2, color: "#22d3ee", shadowBlur: 10, shadowColor: "rgba(34,211,238,.35)" },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:"rgba(34,211,238,.25)"},{offset:1,color:"rgba(34,211,238,0)"}])
        }
      },
      // seuil
      {
        type: "line", name: "Seuil", data: x.map(() => threshold), showSymbol: false,
        lineStyle: { color: "#f59e0b", type: "dashed" }
      },
      // anomalies ripple
      {
        type: "effectScatter",
        name: "Anomalie",
        data: anomalies.map(a => a.value),
        symbolSize: (d) => 6 + Math.min(14, (d[1]-threshold)),
        rippleEffect: { brushType: "stroke", scale: 2.5 },
        itemStyle: { color: "#fb7185", shadowBlur: 12, shadowColor: "rgba(251,113,133,.45)" }
      },
      // bande rouge transparente au-dessus du seuil
      {
        type: "line",
        data: x.map(() => threshold + 60),
        lineStyle: { width: 0 },
        symbol: "none",
        stack: "danger",
        areaStyle: { color: "rgba(239,68,68,.08)" }
      },
      {
        type: "line",
        data: x.map(() => threshold),
        lineStyle: { width: 0 },
        symbol: "none",
        stack: "danger",
        areaStyle: { color: "rgba(239,68,68,.08)" }
      }
    ],
  }), []);
  return <ReactECharts option={option} style={{ height: 300 }} notMerge />;
}

/* ========== (NEW) THEMERIVER : MIX DE MODULES PAR MOIS ========= */
function ModuleStream() {
  const months = ["2025-01-01","2025-02-01","2025-03-01","2025-04-01","2025-05-01","2025-06-01","2025-07-01","2025-08-01","2025-09-01","2025-10-01","2025-11-01","2025-12-01"];
  const mods = ["Facturation","Présence","Messagerie","IA"];
  const rand = () => 40 + Math.round(Math.random()*60);

  const data = [];
  months.forEach((m) => {
    mods.forEach((name, i) => {
      // profils différents pour varier les bandes
      const bias = i===0 ? 15 : i===1 ? 0 : i===2 ? -10 : 20;
      data.push([m, rand()+bias, name]);
    });
  });

  const option = useMemo(() => ({
    tooltip: { trigger: "axis" },
    singleAxis: {
      type: "time",
      axisLabel: { color: "rgba(226,232,240,.85)" },
      axisLine: { lineStyle: { color: "rgba(148,163,184,.25)" } },
      splitLine: { show: true, lineStyle: { color: "rgba(148,163,184,.12)" } }
    },
    color: ["#38bdf8","#818cf8","#34d399","#f59e0b"],
    series: [
      {
        type: "themeRiver",
        data,
        label: { show: false },
        emphasis: { focus: "series" },
        itemStyle: { shadowBlur: 10, shadowColor: "rgba(0,0,0,.25)" }
      }
    ]
  }), []);
  return <ReactECharts option={option} style={{ height: 300 }} notMerge />;
}

/* ==================== TABLE ANALYTIQUE ========================== */
const InlineBar = ({ pct, color = "#22d3ee" }) => (
  <div className="h-2 w-full rounded bg-slate-800/70">
    <div className="h-full rounded" style={{ width: `${pct}%`, background: color }} />
  </div>
);
/* ========== BAR RACE (Top clients en direct) ========== */
function BarRaceTopClients() {
  const names = ["Crèche Les Anges","Horizon","MiniMonde","Arc-en-Ciel","Les P’tits Loups","Soleil","Étoile","Riviera"];
  const [vals, setVals] = useState(() => names.map(() => 40 + Math.round(Math.random()*60)));

  useEffect(() => {
    const id = setInterval(() => {
      setVals(v =>
        v.map((x,i)=> Math.max(10, x + (Math.random()*14-6) + (i%3===0?Math.random()*6:0)))
        .slice()
      );
    }, 900);
    return () => clearInterval(id);
  }, []);

  const sorted = [...names.map((n,i)=>({n,v:vals[i]}))].sort((a,b)=>b.v-a.v);
  const option = {
    grid: { left: 80, right: 20, top: 10, bottom: 20 },
    xAxis: { type: "value", ...axisDark },
    yAxis: { type: "category", inverse: true, data: sorted.map(s=>s.n), ...axisDark },
    animationDuration: 600,
    animationDurationUpdate: 600,
    series: [{
      type: "bar",
      realtimeSort: true,
      data: sorted.map(s=>s.v),
      barWidth: 12,
      label: { show: true, position: "right", color: "rgba(226,232,240,.95)" },
      itemStyle: {
        borderRadius: [6,6,6,6],
        color: (p)=>["#a78bfa","#7c3aed","#60a5fa","#22d3ee","#34d399","#f59e0b","#fb7185","#f472b6"][p.dataIndex%8],
        shadowBlur: 10, shadowColor: "rgba(0,0,0,.25)"
      }
    }]
  };
  return <ReactECharts option={option} style={{ height: 300 }} notMerge />;
}

/* ========== FORCE GRAPH (dépendances modules) ========== */
function ForceGraphModules() {
  const nodes = [
    { name: "Core",        category: 0, symbolSize: 70 },
    { name: "Facturation", category: 1, symbolSize: 50 },
    { name: "Présence",    category: 1, symbolSize: 48 },
    { name: "Messagerie",  category: 1, symbolSize: 46 },
    { name: "IA",          category: 2, symbolSize: 54 },
    { name: "Exports",     category: 3, symbolSize: 40 },
    { name: "Alertes",     category: 3, symbolSize: 42 },
  ];
  const links = [
    ["Core","Facturation"],["Core","Présence"],["Core","Messagerie"],["Core","IA"],
    ["Facturation","Exports"],["Présence","Alertes"],["IA","Alertes"],["Messagerie","IA"]
  ].map(([s,t])=>({ source:s, target:t, value: 1 }));

  const option = {
    tooltip: { trigger: "item" },
    legend: [{ data: ["Noyau","Biz","IA","Ops"], textStyle:{ color:"rgba(226,232,240,.85)" } }],
    series: [{
      type: "graph",
      layout: "force",
      roam: true,
      draggable: true,

      // ✅ afficher les labels en permanence
      label: {
        show: true,
        position: "inside",
        formatter: "{b}",
        color: "#e2e8f0",
        fontWeight: 700,
        // petit contour pour lire sur fond sombre
        textBorderColor: "rgba(2,6,23,.65)",
        textBorderWidth: 2
      },

      // (facultatif) éviter le chevauchement trop fort
      labelLayout: { hideOverlap: true },

      data: nodes.map(n => ({
        ...n,
        itemStyle: { color: ["#22d3ee","#7c3aed","#a78bfa","#60a5fa"][n.category] },
      })),
      categories: [{name:"Noyau"},{name:"Biz"},{name:"IA"},{name:"Ops"}],
      links,
      force: { repulsion: 1200, edgeLength: [80,160], friction: 0.2 },
      lineStyle: { color: "source", width: 2, curveness: 0.25, opacity: .7 },
      edgeSymbol: ["circle","arrow"], edgeSymbolSize: [4,10],

      // on garde le focus au survol, mais sans cacher les labels
      emphasis: { focus: "adjacency", label: { show: true } },

      animationDuration: 800,
      animationDurationUpdate: 800
    }]
  };

  return <ReactECharts option={option} style={{ height: 300 }} notMerge />;
}


/* ========== GAUGES ANIMÉS (SLA / Santé / Coût) ========== */
function AnimatedGauges() {
  const [v, setV] = useState({ sla: 92, sante: 78, cout: 63 });
  useEffect(() => {
    const id = setInterval(() => {
      setV(x => ({
        sla: Math.min(100, Math.max(50, x.sla + (Math.random()*4-2))),
        sante: Math.min(100, Math.max(40, x.sante + (Math.random()*6-3))),
        cout: Math.min(100, Math.max(30, x.cout + (Math.random()*6-3)))
      }));
    }, 1400);
    return () => clearInterval(id);
  }, []);

  const mkGauge = (name, val, center, grad) => ({
    type: "gauge",
    center,
    radius: "75%",
    startAngle: 210,
    endAngle: -30,
    min: 0, max: 100,
    axisLine: {
      roundCap: true,
      lineStyle: {
        width: 14,
        color: [[1, grad]]
      }
    },
    progress: { show: true, roundCap: true, width: 14 },
    pointer: { show: true, length: "70%" },
    axisTick: { show: false },
    splitLine: { show: false },
    axisLabel: { show: false },
    detail: {
      valueAnimation: true,
      formatter: (p)=>`${Math.round(p)}%`,
      fontSize: 16, color: "#e2e8f0", offsetCenter: [0, "40%"]
    },
    title: { show: true, offsetCenter: [0, "64%"], color: "rgba(226,232,240,.8)" },
    data: [{ value: val, name }]
  });

  const option = {
    series: [
      mkGauge("SLA", v.sla, ["16.5%", "55%"], new echarts.graphic.LinearGradient(0,0,1,0,[{offset:0,color:"#22d3ee"},{offset:1,color:"#60a5fa"}])),
      mkGauge("Santé", v.sante, ["50%", "55%"], new echarts.graphic.LinearGradient(0,0,1,0,[{offset:0,color:"#7c3aed"},{offset:1,color:"#a78bfa"}])),
      mkGauge("Coût", v.cout, ["83.5%","55%"], new echarts.graphic.LinearGradient(0,0,1,0,[{offset:0,color:"#34d399"},{offset:1,color:"#86efac"}])),
    ]
  };
  return <ReactECharts option={option} style={{ height: 260 }} notMerge />;
}



/* =========================== PAGE =============================== */
export default function IACommandCenter() {
  return (
    <div className="p-2 overflow-x-hidden">
     
   

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <KpiSpark label="Requêtes / s" unit="" color="#22d3ee" />
        <KpiSpark label="Latence p95 (ms)" unit="ms" color="#60a5fa" />
        <KpiSpark label="Erreurs (%)" unit="%" color="#fb7185" />
        <KpiSpark label="Utilisateurs actifs" unit="" color="#34d399" />
      </div>

      {/* Row 1 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <NeonPanel title="Charge & Qualité (multi-séries)" subtitle="Req/s, erreurs, p95 + bande de confiance">
          <MultiTimeseries />
        </NeonPanel>
        <NeonPanel title="Coût vs Volume (Candle + Volume)" subtitle="Simulation type marché — lecture rapide des pics">
          <CandlesVolume />
        </NeonPanel>
      </div>

     {/* Row 2 — charts animés */}
<div className="grid grid-cols-1 xl:grid-cols-1 gap-4 mt-4">
  <NeonPanel title="Top établissements (bar race)" subtitle="Classement en temps réel">
    <BarRaceTopClients />
  </NeonPanel>
  <NeonPanel title="Dépendances modules (force graph)" subtitle="Physique + hover focus">
    <ForceGraphModules />
  </NeonPanel>
  <NeonPanel title="KPIs en jauges" subtitle="SLA • Santé • Coût (animés)">
    <AnimatedGauges />
  </NeonPanel>
</div>


  
    </div>
  );
}
