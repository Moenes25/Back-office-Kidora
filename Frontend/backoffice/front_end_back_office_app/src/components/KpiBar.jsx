// KpiBar.jsx
import React, { useMemo, useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { LuLineChart, LuPieChart, LuBarChart3 } from 'react-icons/lu';

import * as echarts from "echarts";
import {
  getRepartitionParType,
  getRepartitionParStatut,
  getEvolutionMensuelle
} from "services/dashboardService";


// --- Constantes FR & données
const MONTHS_FR = ['Jan','Fév','Mar','Avr','Mai','Juin','Juil','Aoû','Sep','Oct','Nov','Déc'];
const TYPE_LABELS = ['Garderies', 'Crèches', 'Écoles'];
const TYPE_COLORS = ['#60a5fa', '#a78bfa', '#34d399'];
const DAYS_FR = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];

// Base pour la ligne
const DATA_LINE = {
  Garderies: [12,15,14,18,20,22,24,23,19,17,16,18],
  Crèches:   [10,12,11,14,16,18,19,18,16,15,14,15],
  Écoles:    [ 3, 4, 4, 5,  6,  7,  8,  7,  6,  5,  5,  6],
};

// Données tickets (radar)
const DATA_BARS = {
  Garderies: [3,4,2,6,5,2,1],
  Crèches:   [4,5,3,7,6,3,2],
  Écoles:    [2,3,2,4,3,1,1],
};

// Donut: parts par année (exemple)
const totals2024 = TYPE_LABELS.map(n => DATA_LINE[n].reduce((a,b)=>a+b,0));
const SCALE_BY_YEAR = {
  '2023': [0.92, 1.05, 0.88],
  '2024': [1.00, 1.00, 1.00],
  '2025': [1.12, 0.95, 1.08],
};
const DONUT_BY_YEAR = Object.fromEntries(
  Object.entries(SCALE_BY_YEAR).map(([year, f]) => ([
    year, f.map((k,i)=>Math.round(totals2024[i]*k))
  ]))
);

/* =========================================================
 * Effets visuels globaux (CSS-in-JS)
 * =======================================================*/
function VisualFX() {
  return (
    <style>{`
      .card-aurora{
        position:relative;
        overflow:hidden;
        border-radius:1.25rem;
        background: radial-gradient(120% 100% at 0% 0%, rgba(99,102,241,.10), transparent 50%),
                    radial-gradient(120% 120% at 100% 0%, rgba(56,189,248,.12), transparent 55%),
                    radial-gradient(160% 140% at 50% 120%, rgba(168,85,247,.10), transparent 60%),
                    rgba(255,255,255,.82);
        backdrop-filter: blur(8px);
      }
      .card-aurora:before{
        content:""; position:absolute; inset:-30%;
        background: conic-gradient(from 180deg at 50% 50%,
          rgba(99,102,241,.18),rgba(168,85,247,.14),rgba(56,189,248,.18),rgba(99,102,241,.18));
        filter: blur(40px); animation: rotate 18s linear infinite;
        opacity:.25; pointer-events:none;
      }
      @keyframes rotate{ to{ transform: rotate(360deg) } }

      /* grain premium */
      .grain:after{
        content:""; position:absolute; inset:0; pointer-events:none; border-radius:inherit;
        mix-blend-mode: overlay; opacity:.04;
        background-image:url("data:image/svg+xml;utf8,\
<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'>\
<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter>\
<rect width='100%' height='100%' filter='url(#n)' opacity='.25'/></svg>");
        background-size:200px 200px;
      }

      /* halo interne pour le chart container */
    .chart-shell{
  position:relative;
  border-radius:1rem;
  background: linear-gradient(180deg, rgba(255,255,255,.9), rgba(255,255,255,.75));
  box-shadow:
    0 10px 30px -15px rgba(2,6,23,.35),
    0 8px 18px -12px rgba(2,6,23,.25),
    inset 0 1px 0 rgba(255,255,255,.6);
}
   .chart-shell:before{
  content:""; position:absolute; inset:0; border-radius:inherit;
  background: radial-gradient(60% 40% at 50% 0%, rgba(99,102,241,.18), transparent 70%);
  filter: blur(14px); opacity:.35; pointer-events:none;
}
/* --- AJOUT : override dark --- */
.dark .chart-shell{
  background: linear-gradient(180deg, rgba(10,19,38,.92), rgba(10,19,38,.86)); /* navy */
  box-shadow:
    0 10px 30px -15px rgba(0,0,0,.55),
    0 8px 18px -12px rgba(0,0,0,.45),
    inset 0 1px 0 rgba(255,255,255,.06);
}
.dark .chart-shell:before{
  background: radial-gradient(60% 40% at 50% 0%, rgba(255,255,255,.06), transparent 70%);
  filter: blur(16px);
  opacity:.22;
}

/* optionnel: grain/texte un peu moins “blanchi” en dark */
.dark .grain:after{ opacity:.05; mix-blend-mode: normal; }

      /* parallax léger */
      .tilt{ transform: perspective(1000px) rotateX(0) rotateY(0); transition: transform .35s ease }
      .tilt:hover{ transform: perspective(1000px) rotateX(1.3deg) rotateY(-1.3deg) }

      /* petits charts animés de fond */
      @keyframes wave { 0%{ transform: translateX(0) } 100%{ transform: translateX(-60%) } }
      .bg-charts{
        position:absolute; inset:0; pointer-events:none; overflow:hidden; border-radius:inherit;
      }
      .bg-spark{
        position:absolute; right:-20%; top:-10%; width:70%; height:60%; opacity:.25;
        animation: wave 12s linear infinite;
      }
      .bg-bars{
        position:absolute; left:-15%; bottom:-10%; width:60%; height:60%; opacity:.25;
        animation: wave 14s linear infinite reverse;
      }
    `}</style>
  );
}

/* =========================================================
 * Card avec décor animé (aurora + petits charts)
 * =======================================================*/
function ChartCard({ title, icon, right, children, className = "" }) {
  return (
    <div
      className={`grain tilt p-5 shadow-[0_28px_70px_-24px_rgba(2,6,23,.28),0_16px_40px_-24px_rgba(2,6,23,.22)] ${className} h-full flex flex-col dark:bg-navy-800 dark:text-white`}
    >
      <div className="relative z-[1] mb-3 flex items-center justify-between gap-3 ">
        <h3 className="text-lg font-extrabold flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          <span>{title}</span>
        </h3>
        {right ? <div className="shrink-0 ">{right}</div> : null}
      </div>

      {/* le chart doit prendre tout l’espace restant */}
      <div className="chart-shell relative z-[1] p-0 flex-1 min-h-0 ">
        {children}
      </div>
    </div>
  );
}



/* ============================
 * 1) Courbe
 * ============================ */
function TechLine({ height = 450 }) {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    getEvolutionMensuelle().then((data) => {
      setChartData(data || []);
    });
  }, []);

  const formatMonth = (dateStr) => {
    const mois = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    const [year, month] = dateStr.split('-');
    return `${mois[parseInt(month, 10) - 1]} ${year}`;
  };

  const option = useMemo(() => ({
    animationDurationUpdate: 1200,
    backgroundColor: 'transparent',

    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: '#1e293b',
      borderColor: '#0ea5e9',
      borderWidth: 1,
      textStyle: { color: '#f8fafc' }
    },

    grid: {
      left: 50,
      right: 30,
      bottom: 60,
      top: 40,
      containLabel: true,
    },

    xAxis: {
      type: 'category',
      name: 'Mois',
      nameLocation: 'middle',
      nameGap: 85,
      nameTextStyle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#94a3b8'
      },
      axisLabel: {
        fontSize: 12,
        color: '#334155' ,
        rotate: 45
      },
      axisLine: {
        lineStyle: { color: '#94a3b8' }
      },
      data: chartData.map(item => formatMonth(item.mois)),
    },

    yAxis: {
      type: 'value',
      name: "Abonnements",
      nameLocation: 'middle',
      nameGap: 50,
      nameTextStyle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#94a3b8'
      },
      axisLabel: { color: '#334155' },
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: '#475569'
        }
      }
    },

    series: [
      {
        name: "Abonnements mensuels",
        type: 'bar',
        data: chartData.map(item => item.nombre_abonnements),
        barWidth: '50%',
        itemStyle: {
          borderRadius: [6, 6, 0, 0],
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#0ea5e9' },
            { offset: 1, color: '#6366f1' }
          ]),
          shadowColor: 'rgba(0,0,0,0.2)',
          shadowBlur: 10
        },
        label: {
          show: true,
          position: 'top',
          color: '#f8fafc',
          fontWeight: 'bold'
        },
        emphasis: {
          itemStyle: {
            color: '#fbbf24',
            shadowBlur: 20,
            shadowColor: '#f59e0b'
          }
        },
        animationDelay: idx => idx * 100
      }
    ]
  }), [chartData]);

  return <ReactECharts option={option} style={{ height }} notMerge />;
}






/* ============================
 * Select année (donut seulement)
 * ============================ */
function YearSelect({ value, onChange, years }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      className="rounded-xl border border-black/10 bg-white/80 px-2 py-1 text-sm font-semibold shadow-sm hover:bg-white"
    >
      {years.map(y => <option key={y} value={y}>{y}</option>)}
    </select>
  );
}

/* ============================
 * 2) Donut avec % inside + centre propre
 * ============================ */

function TechDonut({ height = 450 }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    getRepartitionParType().then((res) => setData(res || []));
  }, []);
const option = useMemo(() => {
  const isDark =
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark");

  const text = isDark ? "#E5E7EB" : "#334155";
  const sub  = isDark ? "rgba(229,231,235,.7)" : "rgba(51,65,85,.7)";
  const border = isDark ? "rgba(255,255,255,.05)" : "rgba(0,0,0,0.05)";

  const rows = (data || [])
    .map((d, i) => ({
      name: d.type || `Type ${i + 1}`,
      value: d.count ?? d.value ?? 0,
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 1,
          y2: 1,
          colorStops: [
            { offset: 0, color: TYPE_COLORS[i % TYPE_COLORS.length] },
            { offset: 1, color: TYPE_COLORS[i % TYPE_COLORS.length] + 'AA' },
          ]
        },
        borderColor: border,
        borderWidth: 1,
        opacity: 0.95,
        shadowBlur: 15,
        shadowColor: 'rgba(0,0,0,0.08)'
      }
    }))
    .sort((a, b) => a.value - b.value);

  const total = rows.reduce((sum, r) => sum + r.value, 0);
    const icon = total > 10 ? '📈' : '📉';
  return {
    backgroundColor: 'transparent',
    animationDuration: 1000,
    animationEasing: 'elasticOut',

    tooltip: {
      trigger: 'item',
      backgroundColor: isDark ? "#1e293b" : "#f1f5f9",
      borderColor: isDark ? "#334155" : "#cbd5e1",
      borderWidth: 1,
      textStyle: { color: text, fontWeight: 600 },
      formatter: p => `
        <strong>${p.marker} ${p.name}</strong><br/>
        Valeur: ${p.value}<br/>
        Part: ${((p.value / Math.max(total, 1)) * 100).toFixed(1)}%
      `
    },

    legend: {
      left: 0,
      top: 8,
      orient: "vertical",
      itemWidth: 12,
      itemHeight: 12,
      itemGap: 6,
      icon: "roundRect",
      textStyle: { color: text, fontSize: 11, fontWeight: 600 },
    },
graphic: [
  {
    type: 'group',
    left: '80%',
    top: '13%',
    bounding: 'raw',
    children: [
      {
        type: 'rect',
        shape: {
          x: -80,
          y: -20,
          width: 160,
          height: 40,
          r: 20,
        },
        style: {
          fill: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 1,
            colorStops: [
              { offset: 0, color: isDark ? '#dbeafe' : '#dbeafe' },
              { offset: 1, color: isDark ? '#dbeafe' : '#dbeafe' },
            ],
          },
          shadowBlur: 20,
          shadowColor: isDark ? 'rgba(59,130,246,0.4)' : 'rgba(0,0,0,0.1)',
          opacity: 0.95,
        },
      },
      {
        type: 'text',
        style: {
          text: `📊 Total: ${total}`,
          fill: isDark ? '#f8fafc' : '#1e40af',
          fontSize: 15,
          fontWeight: 'bold',
          textAlign: 'center',
          textVerticalAlign: 'middle',
          textShadowColor: 'rgba(0,0,0,0.15)',
          textShadowBlur: 2,
        },
      },
    ],
  },
],




    series: [
      {
        name: "Répartition",
        type: "funnel",
        sort: "ascending",
        minSize: '10%',
        maxSize: '90%',
        gap: 6,
        top: '12%',
        bottom: '6%',
         left: '13%',
        width: '78%',

        label: {
          show: true,
          position: 'inside',
          formatter: (p) => `{n|${p.name}}\n{v|${p.value}}`,
          rich: {
            n: {
              color: "#fff",
              fontWeight: 700,
              fontSize: 13,
              lineHeight: 18,
              textShadowColor: "#00000033",
              textShadowBlur: 2
            },
            v: {
              color: "#f8fafc",
              fontWeight: 600,
              fontSize: 12,
            }
          }
        },
        labelLine: { show: false },
        emphasis: {
          itemStyle: {
            opacity: 1,
            shadowBlur: 20,
            shadowColor: '#38bdf8'
          }
        },
        data: rows,
      }
    ]
  };
}, [data]);


  return <ReactECharts option={option} style={{ height }} notMerge />;
}





function StatutDonut({ height = 450 }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    getRepartitionParStatut().then((res) => setData(res || []));
  }, []);

  const option = useMemo(() => {
    const isDark =
      typeof document !== "undefined" &&
      document.documentElement.classList.contains("dark");

    const text = isDark ? "#E5E7EB" : "#334155";
    const sub  = isDark ? "rgba(229,231,235,.7)" : "rgba(51,65,85,.7)";
    const border = isDark ? "rgba(255,255,255,.08)" : "#fff";

    // couleurs par statut (fallback => TYPE_COLORS)
    const colorBy = (name, i) => {
      const n = (name || "").toLowerCase();
      if (n.includes("actif") || n.includes("active")) return "#34d399";
      if (n.includes("retard") || n.includes("alerte")) return "#f59e0b";
      if (n.includes("résili") || n.includes("suspend")) return "#ef4444";
      return TYPE_COLORS[i % TYPE_COLORS.length];
    };

    const rows = (data || []).map((d, i) => ({
      name: d.statut || `Statut ${i + 1}`,
      value: d.count ?? d.value ?? 0,
      itemStyle: {
        color: {
          type: "linear", x: 0, y: 0, x2: 1, y2: 1,
          colorStops: [
            { offset: 0, color: colorBy(d.statut, i) },
            { offset: 1, color: colorBy(d.statut, i) + "E6" },
          ],
        },
        borderColor: border,
        borderWidth: 2,
        shadowBlur: 14,
        shadowColor: isDark ? "rgba(0,0,0,.35)" : "rgba(15,23,42,.12)",
      },
    }));

    const total = rows.reduce((a, r) => a + r.value, 0);

    return {
      backgroundColor: "transparent",
      animationDuration: 900,
      color: rows.map((r) => r.itemStyle.color),
      tooltip: {
        trigger: "item",
        backgroundColor: isDark ? "rgba(15,23,42,.96)" : "rgba(255,255,255,.96)",
        borderColor: isDark ? "rgba(255,255,255,.08)" : "rgba(15,23,42,.08)",
        textStyle: { color: text, fontWeight: 600 },
        formatter: (p) =>
          `<div><b>${p.marker} ${p.name}</b></div>
           <div>Valeur: ${p.value}</div>
           <div>Part: ${p.percent}%</div>`,
      },

      legend: {
        left: 0, top: 8, orient: "vertical",
        itemWidth: 12, itemHeight: 12, itemGap: 6, icon: "roundRect",
        textStyle: { color: text, fontSize: 11, fontWeight: 600 },
        formatter: (name) => {
          const r = rows.find((x) => x.name === name);
          return `${name}  ${r ? r.value : ""}`;
        },
      },

      // total au centre
      graphic: [
        { type: "text", left: "57%", top: "42%",
          style: { text: String(total), fill: text, fontWeight: 700, fontSize: 24, textAlign: "center" } },
        { type: "text", left: "57%", top: "58%",
          style: { text: "Total", fill: sub, fontWeight: 700, fontSize: 12, textAlign: "center" } },
      ],

      series: [
     
        // anneau principal
        {
          name: "Statut",
          type: "pie",
          radius: ["40%", "78%"],         // donut plus épais
          center: ["60%", "50%"],
          startAngle: 105,                // angle de départ plus harmonieux
          padAngle: 2,                    // petits gaps entre tranches
          minAngle: 3,
          avoidLabelOverlap: true,
          stillShowZeroSum: false,
          itemStyle: { borderRadius: 6 }, // bords arrondis
          label: {
            show: true,
            formatter: (p) => `{n|${p.name}}\n{v|${p.percent}%}`,
            rich: {
              n: { color: text, fontWeight: 800, fontSize: 12, lineHeight: 16 },
              v: { color: sub,  fontWeight: 800, fontSize: 11 },
            },
          },
          labelLine: { length: 10, length2: 8, smooth: true, lineStyle: { opacity: .65 } },
          emphasis: {
            scale: true, scaleSize: 5,
            itemStyle: { shadowBlur: 24, shadowColor: "rgba(0,0,0,.28)" },
          },
          data: rows,
        },
        // anneau fin intérieur (accent)
        {
          name: "inner-accent",
          type: "pie",
          radius: ["36%", "38%"],
          center: ["60%", "50%"],
          silent: true,
          z: 1,
          label: { show: false },
          data: [{ value: 100, itemStyle: { color: isDark ? "rgba(255,255,255,.08)" : "rgba(15,23,42,.06)" } }],
        },
      ],
    };
  }, [data]);

  return <ReactECharts option={option} style={{ height }} notMerge />;
}





/* ============================
 * 3) Radar tickets (avec glow + animation)
 * ============================ */
function TechPolarBars({ height = 300 }) {
  const option = useMemo(() => ({
    animationDuration: 850,
    color: TYPE_COLORS,
    legend: {
      left: 0, top: 8, orient: 'vertical',
      itemWidth: 12, itemHeight: 12, itemGap: 6,
      textStyle: { fontSize: 11 }
    },
    angleAxis: {
      type: 'category',
      data: DAYS_FR,
      axisLabel: { fontWeight: 700 },
      axisLine: { lineStyle: { color: 'rgba(0,0,0,.25)' } },
      axisTick: { show:false }
    },
    radiusAxis: {
      axisLine: { show:false },
      axisLabel: { color: '#64748b' },
      splitLine: { lineStyle: { type:'dashed', color:'rgba(0,0,0,.15)' } }
    },
    polar: { center: ['55%','52%'] }, // décale un peu pour laisser la légende
    tooltip: { trigger: 'item' },
    series: TYPE_LABELS.map((name, i) => ({
      name,
      type: 'bar',
      coordinateSystem: 'polar',
      data: (DATA_BARS[name] || []),
      roundCap: true,
      barWidth: 10,
      itemStyle: {
        color: TYPE_COLORS[i]
      },
      emphasis: { focus: 'series' }
    }))
  }), []);

  return <ReactECharts option={option} style={{ height }} notMerge />;
}





/* ============================
 * KpiBar
 * ============================ */
export default function KpiBar() {
  return (
    <>
      <VisualFX />
      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 md:grid-rows-2 md:auto-rows-[260px]">
        {/* 1) Evolution mensuelle */}
        <ChartCard
          className="md:row-span-2"
          title="Évolution mensuelle des établissements abonnés"
          icon={<LuLineChart className="h-5 w-5" />}
        >
          <TechLine height="100%" />
        </ChartCard>

        {/* 2) Répartition par type */}
        <ChartCard
          title="Répartition des établissements par type"
          icon={<LuPieChart className="h-5 w-5" />}
        >
          <TechDonut height={180} />
        </ChartCard>

        {/* 3) Répartition par Statut */}
        <ChartCard
          title="Répartition des abonnements par statut"
          icon={<LuPieChart className="h-5 w-5" />}
        >
          <StatutDonut height="100%" />
        </ChartCard>
      </div>
    </>
  );
}

