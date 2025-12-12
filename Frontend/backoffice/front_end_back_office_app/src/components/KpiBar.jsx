// KpiBar.jsx
import React, { useMemo, useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { LuLineChart, LuPieChart, LuBarChart3 } from 'react-icons/lu';
import { getCroissanceData, getRepartitionAnnuelle } from "services/dashboardService";


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
function ChartCard({ title, icon, right, children }) {
  return (
    <div className="card-aurora grain tilt p-5 shadow-[0_28px_70px_-24px_rgba(2,6,23,.28),0_16px_40px_-24px_rgba(2,6,23,.22)]">
      {/* décor animé */}
      <div className="bg-charts">
        {/* Sparkline animée (SVG) */}
        <svg className="bg-spark" viewBox="0 0 400 200" preserveAspectRatio="none">
          <defs>
            <linearGradient id="spark" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopOpacity="0.4" stopColor="#60a5fa"/>
              <stop offset="100%" stopOpacity="0.4" stopColor="#a78bfa"/>
            </linearGradient>
          </defs>
          <path d="M0,120 C40,80 80,140 120,100 C160,60 200,140 240,110 C280,80 320,140 360,120"
                fill="none" stroke="url(#spark)" strokeWidth="10" strokeLinecap="round"/>
        </svg>

        {/* Mini bar chart animé (SVG) */}
        <svg className="bg-bars" viewBox="0 0 400 200" preserveAspectRatio="none">
          <g transform="translate(20,20)">
            {Array.from({length:12}).map((_,i)=>(
              <rect key={i}
                x={i*28} y={Math.random()*80}
                width="18" height={60+Math.random()*60}
                rx="6" ry="6"
                fill={i%2? "#34d399" : "#60a5fa"}
                opacity="0.35">
                <animate attributeName="y" dur={`${6+i%5}s`} values="40;70;40" repeatCount="indefinite"/>
              </rect>
            ))}
          </g>
        </svg>
      </div>

      {/* header */}
      <div className="relative z-[1] mb-3 flex items-center justify-between gap-3">
        <h3 className="text-lg font-extrabold flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          <span>{title}</span>
        </h3>
        {right ? <div className="shrink-0">{right}</div> : null}
      </div>

      {/* chart container */}
      <div className="chart-shell relative z-[1] p-2">
        {children}
      </div>
    </div>
  );
}

/* ============================
 * 1) Courbe
 * ============================ */
function TechLine({ data, height = 300 }) {

  const series = useMemo(() =>
    Object.entries(data).map(([name, dataArr], idx) => ({
      name,
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 8,
      showSymbol: false,
      lineStyle: { width: 3, shadowBlur: 16, shadowColor: TYPE_COLORS[idx], shadowOffsetY: 6 },
      itemStyle: { color: TYPE_COLORS[idx] },
      areaStyle: {
        opacity: 0.25,
        color: { type:'linear', x:0,y:0,x2:0,y2:1,
          colorStops:[
            { offset:0, color: TYPE_COLORS[idx] },
            { offset:1, color:'rgba(0,0,0,0)' },
          ],
        },
      },
      data: dataArr,
      emphasis: { focus: 'series' },
      // petit effet ripple ponctuel via markPoint + animation
      markPoint: {
        symbol: 'circle', symbolSize: 0,
        label: { show: true, formatter: '⬤', color: TYPE_COLORS[idx], fontSize: 10 },
        data: [{ coord: ['Juin', dataArr[5] ?? 0] }],

      },
    })), [data]
  );

  const option = useMemo(() => ({
    animationDuration: 1000,
    animationEasing: 'cubicOut',
    grid: { left: 10, right: 10, bottom: 40, top: 30, containLabel: true },
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
    legend: { bottom: 0, textStyle: { fontWeight: 700 } },
    xAxis: {
      type: 'category', boundaryGap: false, data: MONTHS_FR,
      axisLine: { lineStyle: { color: 'rgba(0,0,0,.25)' } },
      axisLabel: { fontWeight: 600 },
    },
    yAxis: {
      type: 'value', axisLine: { show: false },
      splitLine: { lineStyle: { type: 'dashed', color: 'rgba(0,0,0,.1)' } },
    },
    series,
  }), [series]);

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
function TechDonut({ data, year, height = 300 }) {
   const totalAll = data.reduce((a, b) => a + b, 0)

  const option = useMemo(() => ({
    animationDuration: 900,
    tooltip: { trigger: 'item', formatter: ({ name, value, percent }) => `${name}: ${value} (${percent}%)` },
    legend: { bottom: 0 },
    graphic: [
      {
        type: 'group', left: 'center', top: 'center',
        children: [
          { type: 'text', style: { text: `${totalAll}`, fontSize: 28, fontWeight: 900, textAlign: 'center' }, top: -10, left: -14 },
          { type: 'text', style: { text: 'Total annuel', fontSize: 12, opacity: 0.7, textAlign: 'center' }, top: 16, left: -28 },
        ],
      },
    ],
    series: [
      {
        name: 'Répartition',
        type: 'pie',
        radius: ['55%','80%'],
        avoidLabelOverlap: false, minShowLabelAngle: 0, labelLayout: () => ({ hideOverlap: false }),
        itemStyle: { borderRadius: 12, borderColor: '#fff', borderWidth: 2, shadowBlur: 10, shadowColor: 'rgba(0,0,0,.15)' },
        label: {
          show: true, position: 'inside',
          formatter: ({ percent }) => `${Math.round(percent)}%`, fontWeight: 800,
        },
        labelLine: { show: false },
        emphasis: { scaleSize: 10, itemStyle: { shadowBlur: 18, shadowColor: 'rgba(0,0,0,.25)' } },
          data: TYPE_LABELS.map((label, i) => ({
        name: label,
        value: data[i],
        itemStyle: { color: TYPE_COLORS[i] },
      })),
      },
    ],
  }), [data, totalAll]);

   return <ReactECharts option={option} style={{ height }} notMerge  />;
}

/* ============================
 * 3) Radar tickets (avec glow + animation)
 * ============================ */
function TechRadarTickets({ height = 300 }) {
  const globalMax = Math.max(...TYPE_LABELS.flatMap((n)=>DATA_BARS[n])) * 1.4;

  const option = useMemo(() => ({
    animationDuration: 850,
    backgroundColor: 'transparent',
    color: TYPE_COLORS,
    tooltip: {
      trigger: "item",
      formatter: (p) => {
        const vals = p.value.map((v,i)=>`${DAYS_FR[i]}: ${v}`).join("<br/>");
        return `<b>${p.name}</b><br/>${vals}`;
      },
    },
    legend: { bottom: 0 },
    radar: {
      indicator: DAYS_FR.map((d) => ({ name: d, max: globalMax })),
      splitNumber: 5, radius: "70%", center: ["50%","50%"],
      axisName: { fontWeight: 700 },
      splitArea: { areaStyle: { color: ["#f8fafc","#eef2ff"] } },
      splitLine: { lineStyle: { type: "dashed", color: "rgba(0,0,0,.25)" } },
      axisLine: { lineStyle: { color: "rgba(0,0,0,.2)" } },
    },
    series: TYPE_LABELS.map((name, i) => ({
      name, type: "radar", symbol: "circle", symbolSize: 6,
      lineStyle: { width: 3, color: TYPE_COLORS[i] },
      areaStyle: { color: TYPE_COLORS[i], opacity: 0.14 },
      itemStyle: { color: TYPE_COLORS[i], shadowBlur: 10, shadowColor: TYPE_COLORS[i] },
      emphasis: { focus: "series" },
      data: [{ value: DATA_BARS[name], name }],
    })),
  }), [globalMax]);

  return <ReactECharts option={option} style={{ height }} notMerge />;
}

/* ============================
 * KpiBar
 * ============================ */
export default function KpiBar() {
  const [year, setYear] = useState('2024');
  const years = Object.keys(DONUT_BY_YEAR);

  const [croissance, setCroissance] = useState({
    Garderies: [],
    Crèches: [],
    Écoles: [],
  });

  const [repartition, setRepartition] = useState([0, 0, 0]);

useEffect(() => {
  async function fetchCharts() {
    try {
      const croissanceData = await getCroissanceData();
      const repartitionData = await getRepartitionAnnuelle(year);

      // ==========================
      // CROISSANCE
      // ==========================
      setCroissance({
        Garderies: croissanceData.find(d => d.type === "GARDERIE")?.valeurs ?? [],
        Crèches:   croissanceData.find(d => d.type === "CRECHE")?.valeurs ?? [],
        Écoles:    croissanceData.find(d => d.type === "ECOLE")?.valeurs ?? [],
      });

      // ==========================
      // RÉPARTITION
      // ==========================
      const map = { GARDERIE: 0, CRECHE: 0, ECOLE: 0 };

      repartitionData.forEach(item => {
        map[item.type] = item.count;
      });

      setRepartition([
        map.GARDERIE,
        map.CRECHE,
        map.ECOLE
      ]);

    } catch (err) {
      console.error("Erreur lors de la récupération des données", err);
    }
  }

  fetchCharts();
}, [year]);

  return (
    <>
      <VisualFX />
      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
        <ChartCard title="Croissance des inscriptions" icon={<LuLineChart className="h-5 w-5" />}>
         <TechLine data={croissance} height={300} />

        </ChartCard>

        <ChartCard
          title="Répartition annuelle"
          icon={<LuPieChart className="h-5 w-5" />}
          right={<YearSelect value={year} onChange={setYear} years={years} />}
        >
         <TechDonut data={repartition} year={year} height={300} />

        </ChartCard>

        <ChartCard title="Tickets par jour" icon={<LuBarChart3 className="h-5 w-5" />}>
          <TechRadarTickets height={300} />
        </ChartCard>
      </div>
    </>
  );
}
