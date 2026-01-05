// KpiBar.jsx
import React, { useMemo, useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { LuLineChart, LuPieChart, LuBarChart3 } from 'react-icons/lu';
import { getCroissanceData, getRepartitionAnnuelle  } from 'services/dashboardService';

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
function ChartCard({ title, icon, right, children, className = "" }) {
  return (
    <div
      className={`card-aurora grain tilt p-5 shadow-[0_28px_70px_-24px_rgba(2,6,23,.28),0_16px_40px_-24px_rgba(2,6,23,.22)] ${className} h-full flex flex-col`}
    >
      <div className="relative z-[1] mb-3 flex items-center justify-between gap-3">
        <h3 className="text-lg font-extrabold flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          <span>{title}</span>
        </h3>
        {right ? <div className="shrink-0">{right}</div> : null}
      </div>

      {/* le chart doit prendre tout l’espace restant */}
      <div className="chart-shell relative z-[1] p-2 flex-1 min-h-0">
        {children}
      </div>
    </div>
  );
}



/* ============================
 * 1) Courbe
 * ============================ */
function TechLine({ height = 300 }) {
  const [chartData, setChartData] = useState({ labels: [], Garderies: [], Crèches: [], Écoles: [] });

  useEffect(() => { getCroissanceData().then(setChartData); }, []);

  const option = useMemo(() => ({
    animationDuration: 900,
    grid: { left: 10, right: 10, bottom: 40, top: 20, containLabel: true },
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0, textStyle: { fontWeight: 700 } },
    xAxis: { type: 'category', boundaryGap: false, data: chartData.labels },
    yAxis: { type: 'value', splitLine: { lineStyle: { type: 'dashed', color: 'rgba(0,0,0,.12)' } } },
    series: [
      { name: 'Garderies', type: 'line', stack: 'total', smooth: true, showSymbol: false,
        areaStyle: { opacity: .35 }, lineStyle: { width: 0 }, itemStyle: { color: '#60a5fa' },
        data: chartData.Garderies },
      { name: 'Crèches',   type: 'line', stack: 'total', smooth: true, showSymbol: false,
        areaStyle: { opacity: .35 }, lineStyle: { width: 0 }, itemStyle: { color: '#a78bfa' },
        data: chartData.Crèches },
      { name: 'Écoles',    type: 'line', stack: 'total', smooth: true, showSymbol: false,
        areaStyle: { opacity: .35 }, lineStyle: { width: 0 }, itemStyle: { color: '#34d399' },
        data: chartData.Écoles },
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

function TechDonut({ year, height = 300 }) {
  const [totals, setTotals] = useState([0,0,0]);
  const totalAll = totals.reduce((a,b)=>a+b,0);

  useEffect(() => {
    (async () => {
      const data = await getRepartitionAnnuelle(year);
      const map = { GARDERIE: 0, CRECHE: 1, ECOLE: 2 };
      const ordered = [0,0,0];
      data.forEach(it => { const i = map[it.type?.toUpperCase()]; if (i!=null) ordered[i] = it.nombre; });
      setTotals(ordered);
    })();
  }, [year]);

  // ⬇️ centre X/Y unique pour la série ET le texte, avec Y légèrement au-dessus
  const CX = '60%';
  const CY = '46%'; // était '50%'

const option = useMemo(() => ({
  animationDuration: 900,
  tooltip: { trigger: 'item', formatter: p => `${p.name}: ${p.value} (${p.percent}%)` },
  legend: { left: 0, top: 8, orient: 'vertical', align: 'left',
    itemWidth: 12, itemHeight: 12, itemGap: 6, textStyle: { fontSize: 11 }
  },

  // ⬇️ on utilise "title" pour afficher le total en haut
  /*title: {
    show: true,
    left: '60%',   // aligné avec le donut
    top: 0,
    text: String(totalAll),
    subtext: 'Total',
    itemGap: 2,
    textAlign: 'center',
    textStyle: { fontSize: 28, fontWeight: 900, color: '#0f172a' },
    subtextStyle: { fontSize: 12, color: '#64748b' }
  },*/

  series: [{
    name: 'Répartition',
    type: 'pie',
    roseType: 'radius',
    radius: ['30%','80%'],
    center: ['60%','50%'],
    label: { show: true, formatter: '{b}\n{d}%', color: '#334155', fontWeight: 700 },
    labelLine: { length: 8, length2: 6, smooth: true },
    avoidLabelOverlap: true,
    labelLayout: { moveOverlap: 'shiftY', edgeDistance: 10 },
    itemStyle: { borderColor: '#fff', borderWidth: 2 },
    data: TYPE_LABELS.map((name, i) => ({ name, value: totals[i], itemStyle: { color: TYPE_COLORS[i] } }))
  }]
}), [totals, totalAll]);

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
  const [year, setYear] = useState('2024');
  const years = Object.keys(DONUT_BY_YEAR);

  return (
    <>
      <VisualFX />
      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 md:grid-rows-2 md:auto-rows-[260px]">
        {/* 1) grande ligne, span 2 rangées à gauche */}
        <ChartCard
          className="md:row-span-2" title="Croissance des inscriptions" icon={<LuLineChart className="h-5 w-5" />}
        >
         <TechLine height="100%" />
        </ChartCard>

        {/* 2) donut en haut à droite */}
        <ChartCard
          title="Répartition annuelle"
          icon={<LuPieChart className="h-5 w-5" />}
          right={<YearSelect value={year} onChange={setYear} years={years} />}
        >
          <TechDonut year={year}  height={160}  />
        </ChartCard>

        {/* 3) radar en bas à droite */}
        <ChartCard
          title="Tickets par jour"
          icon={<LuBarChart3 className="h-5 w-5" />}
        >
          <TechPolarBars height="100%" />
        </ChartCard>
      </div>
    </>
  );
}
