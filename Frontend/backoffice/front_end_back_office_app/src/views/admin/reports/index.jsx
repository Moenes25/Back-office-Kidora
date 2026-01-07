/* eslint-disable */
import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import { useMotionValue, useTransform, animate, motion } from "framer-motion";
import { FiActivity, FiUsers, FiPieChart, FiBarChart2, FiTrendingUp } from "react-icons/fi";
import { FiBriefcase, FiEdit3, FiHeart } from "react-icons/fi";
import DashboardCharts from "components/DashboardCharts";

/* ───────────────────────── helpers ───────────────────────── */

function useInterval(cb, delay){ const r=useRef(cb); useEffect(()=>{r.current=cb},[cb]); useEffect(()=>{ if(delay==null) return; const id=setInterval(()=>r.current(),delay); return()=>clearInterval(id)},[delay])}
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
const rand=(min,max)=>Math.random()*(max-min)+min;

// style axes (clair)
const axisLight = {
  axisLine:{ show:true, lineStyle:{ color:"#e2e8f0", width:1 }},
  axisTick:{ show:false },
  axisLabel:{ color:"#475569" },
  splitLine:{ show:true, lineStyle:{ color:"rgba(2,6,23,.06)" } },
};

/* ───────────────────── Progress Pills (upgrade) ───────────────────── */

export function ProgressPills() {
  const BASE = [
    { icon:<FiUsers/>,      label:"Taux d’inscription",             value:55, grad:"linear-gradient(90deg,#7c3aed,#ec4899)" },
    { icon:<FiTrendingUp/>, label:"Taux d'assiduité hebdomadaire",  value:70, grad:"linear-gradient(90deg,#10b981,#84cc16)" },
    { icon:<FiBriefcase/>,  label:"Paiements à jour (familles)",     value:45, grad:"linear-gradient(90deg,#14b8a6,#60a5fa)" },
    { icon:<FiEdit3/>,      label:"Activités planifiées",            value:80, grad:"linear-gradient(90deg,#f59e0b,#f43f5e)" },
    { icon:<FiHeart/>,      label:"Satisfaction globale",            value:60, grad:"linear-gradient(90deg,#f472b6,#fb7185)" },
  ];

  // micro “respiration” autour de la valeur cible (±3%)
  const [vals, setVals] = useState(BASE.map(b => b.value));
  useEffect(() => {
    const id = setInterval(() => {
      setVals(v => v.map((x,i) => {
        const target = BASE[i].value + (Math.random()*6 - 3);
        return Math.max(0, Math.min(100, target));
      }));
    }, 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="space-y-6">
      {BASE.map((it,i)=>(
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10, scale:.98 }}
          animate={{ opacity: 1, y: 0, scale:1 }}
          transition={{ delay: i*0.05, type:"spring", stiffness:220, damping:20 }}
          whileHover={{ y:-3, scale:1.01 }}
          className="flex items-center gap-3"
        >
          <div className="h-12 w-12 grid place-items-center rounded-2xl bg-white shadow ring-1 ring-black/10 text-slate-700">
            <span className="text-xl">{it.icon}</span>
          </div>

          <div className="flex-1">
            <div className="relative rounded-2xl bg-white shadow-lg ring-1 ring-black/10 px-3 py-2 overflow-hidden">
              {/* halo doux */}
              <div className="pointer-events-none absolute -top-10 -left-10 h-24 w-24 rounded-full bg-sky-300/15 blur-2xl" />
              <div className="flex items-center gap-3 relative">
                <div className="text-[13px] font-semibold text-slate-700 min-w-[160px]">{it.label}</div>

                <div className="relative h-8 flex-1 rounded-full bg-slate-100 overflow-hidden">
                  {/* remplissage */}
                  <Fill widthPct={vals[i]} grad={it.grad} />
                  {/* shine oblique (balayage) */}
                  <motion.div
                    className="absolute inset-y-0 -left-1 w-1/3 rotate-12"
                    style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,.6),transparent)" }}
                    animate={{ x: ["-40%","140%"] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: i*0.12 }}
                  />
                  {/* pourcentage */}
                  <div className="absolute inset-y-0 right-2 grid place-items-center text-[13px] font-extrabold text-slate-700">
                    {Math.round(vals[i])}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
function Fill({ widthPct, grad }) {
  return (
    <motion.div
      animate={{ width: `${widthPct}%` }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      style={{ background: grad }}
      className="absolute left-0 top-0 bottom-0 rounded-full shadow-[inset_0_0_14px_rgba(255,255,255,.38),0_8px_18px_rgba(0,0,0,.14)]"
    />
  );
}
function Cap({ value }) {
  return (
    <motion.div
      className="absolute top-1/2 -translate-y-1/2 h-7 w-7 rounded-full"
      style={{
        left: `${Math.max(6, Math.min(97, value))}%`,
        translateX: "-50%",
        background: "radial-gradient(circle at 30% 30%, #fff, #e2e8f0 60%, #94a3b8 100%)",
        boxShadow: "0 6px 12px rgba(2,6,23,.25), inset 0 2px 6px rgba(255,255,255,.7)"
      }}
      whileHover={{ scale: 1.08 }}
      transition={{ type:"spring", stiffness:300, damping:18 }}
    />
  );
}

/* ───────────────────── Barres “3D prism” (upgrade) ───────────────────── */

export function Bars3DPrism() {
  const cats = ["2018","2019","2020","2021","2022","2023","2024"];
  const [vals, setVals] = useState([30,50,70,60,75,68,82]);

  useEffect(() => {
    const id = setInterval(() => {
      setVals(v => v.map(x => Math.max(0, Math.min(100, x + (Math.random()*4 - 2)))));
    }, 2200);
    return () => clearInterval(id);
  }, []);

  const option = useMemo(()=>({
    backgroundColor: "transparent",
    grid: { left: 46, right: 26, top: 48, bottom: 40 },
    xAxis: { type:"category", data: cats, axisLine:{lineStyle:{color:"#e2e8f0"}}, axisLabel:{color:"#475569"} },
    yAxis: { type:"value", max:100, axisLine:{show:false}, splitLine:{lineStyle:{color:"rgba(2,6,23,.08)"}}, axisLabel:{color:"#64748b"} },
    tooltip: { trigger:"item", formatter: p => `${p.name}: ${Math.round(vals[p.dataIndex])}%` },

    series: [{
      type: 'custom',
      animationDuration: 800,
      animationEasing: 'cubicOut',
      animationDelay: (idx) => idx*110,
      emphasis: { focus: 'self' },
      renderItem: (params, api) => {
        const i     = params.dataIndex;
        const xVal  = api.value(0);
        const yVal  = api.value(1);
        const top   = api.coord([xVal, yVal]);
        const base  = api.coord([xVal, 0]);
        const size  = api.size([1, 0]);
        const w     = Math.min(size[0]*0.5, 44);
        const d     = 12; // profondeur

        // faces
        const Ptop = [
          [top[0]-w/2,        top[1]-d],
          [top[0]+w/2,        top[1]-d],
          [top[0]+w/2 + d*0.9,top[1]],
          [top[0]-w/2 + d*0.9,top[1]],
        ];
        const Pfront = [
          [top[0]-w/2, top[1]-d],
          [top[0]+w/2, top[1]-d],
          [base[0]+w/2, base[1]-d],
          [base[0]-w/2, base[1]-d],
        ];
        const Pside = [
          [top[0]+w/2,        top[1]-d],
          [top[0]+w/2 + d*0.9,top[1]],
          [base[0]+w/2 + d*0.9, base[1]],
          [base[0]+w/2,       base[1]-d],
        ];

        const pal = [
          ['#f43f5e','#b91c1c'],
          ['#ec4899','#be185d'],
          ['#06b6d4','#0e7490'],
          ['#8b5cf6','#5b21b6'],
          ['#3b82f6','#1e40af'],
          ['#22c55e','#065f46'],
          ['#f59e0b','#b45309'],
        ][i % 7];
        const face  = echarts.color.lift(pal[0], -0.05);
        const side  = echarts.color.lift(pal[1], -0.05);
        const cap   = echarts.color.lift(pal[0],  0.15);

        // shine oblique
        const Shine = [
          [top[0]-w/2+6, top[1]-d+4],
          [top[0]-w/2+14, top[1]-d+8],
          [base[0]-w/2+20, base[1]-d-6],
          [base[0]-w/2+12, base[1]-d-10],
        ];

        return {
          type:'group',
          children:[
            {
              type:'polygon', shape:{ points:Pfront },
              style: api.style({ fill: face, shadowBlur:18, shadowColor:"rgba(2,6,23,.12)" }),
              styleEmphasis:{ fill: echarts.color.lift(face, .08) }
            },
            {
              type:'polygon', shape:{ points:Pside },
              style: api.style({ fill: side, shadowBlur:12, shadowColor:"rgba(2,6,23,.10)" }),
              styleEmphasis:{ fill: echarts.color.lift(side, .08) }
            },
            {
              type:'polygon', shape:{ points:Ptop },
              style: api.style({ fill: cap, shadowBlur:10, shadowColor:"rgba(2,6,23,.10)" }),
            },
            { type:'polygon', shape:{ points:Shine }, style:{ fill:'rgba(255,255,255,.35)' }, silent:true },
            { type:'text', style:{ text: Math.round(yVal)+'%', x: top[0], y: top[1]-18, textAlign:'center', textFill:'#0f172a', fontWeight:700 } }
          ]
        };
      },
      encode: { x:0, y:1 },
      data: cats.map((c,i)=>[c, vals[i]]),
      universalTransition: true
    }]
  }),[vals]);

  return (
    <div className="relative">
      <style>{`
        .tilt-3d{transition: transform .35s ease; transform-style: preserve-3d;}
        .tilt-3d:hover{ transform: perspective(1200px) rotateX(1.5deg) rotateY(-2deg) translateZ(0); }
      `}</style>
      <div className="tilt-3d">
        <ReactECharts option={option} style={{ height: 360 }} notMerge />
      </div>
    </div>
  );
}

/* ───────────────────── Pie 2.5D (upgrade) ───────────────────── */

export function Pie2_5D() {
  const [angle, setAngle] = useState(0);
  useEffect(()=>{ const id=setInterval(()=> setAngle(a => (a + 2) % 360), 60); return ()=>clearInterval(id); },[]);

  const data = [
    { name:"2012", value:10,  itemStyle:{ color:"#0ea5e9" } },
    { name:"2014", value:20,  itemStyle:{ color:"#1d4ed8" } },
    { name:"2016", value:20,  itemStyle:{ color:"#22d3ee" } },
    { name:"2018", value:50,  itemStyle:{ color:"#fb923c" } },
  ];

  const option = useMemo(()=>({
    tooltip: { trigger: 'item' },
    legend: { bottom: 0, textStyle:{ color:"#475569" } },
    graphic: [
      // glow central
      { type:'circle', left:'center', top:'40%', z:0, shape:{ r:50 }, style:{ fill:'rgba(255,255,255,.6)' } },
    ],
    series: [
      // ombre / profondeur
      {
        type: 'pie',
        radius: ['56%','76%'],
        center: ['50%','45%'],
        startAngle: angle,
        data: data.map(d => ({ ...d, itemStyle: { color: d.itemStyle.color, opacity:.22 } })),
        silent: true,
        label: { show:false },
        z: 1
      },
      // anneau supérieur
      {
        type: 'pie',
        radius: ['50%','70%'],
        center: ['50%','40%'],
        startAngle: angle,
        data,
        label: { color:"#334155", fontWeight:600 },
        itemStyle: { borderWidth:3, borderColor:'#fff', shadowBlur:14, shadowColor:'rgba(2,6,23,.16)' },
        emphasis:{ scale:true, scaleSize:4, itemStyle:{ shadowBlur:22, shadowColor:'rgba(2,6,23,.26)' } },
        z: 2
      }
    ]
  }),[angle]);

  return <ReactECharts option={option} style={{ height: 320 }} notMerge />;
}

/* ───────────────────── KPI Card ───────────────────── */

const Card = ({ title, subtitle, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
    className="rounded-2xl border border-black/5 bg-white p-4 shadow-[0_16px_48px_rgba(2,6,23,.10)] relative overflow-hidden"
  >
    <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-sky-200/20 blur-3xl" />
    {(title || subtitle) && (
      <div className="mb-2">
        <div className="text-slate-900 font-semibold">{title}</div>
        {subtitle && <div className="text-xs text-slate-500">{subtitle}</div>}
      </div>
    )}
    <div className="relative">{children}</div>
  </motion.div>
);

function MotionNumber({ value, className }) {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, v => Math.round(v));
  React.useEffect(() => {
    const controls = animate(mv, typeof value === "number" ? value : Number(String(value).replace(/\D/g,"")), { duration: 0.8, ease: "easeOut" });
    return () => controls.stop();
  }, [value]);
  return <motion.span className={className}>{rounded}</motion.span>;
}

const Kpi = ({ icon, label, value, grad }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -3, scale: 1.01 }}
    transition={{ type: "spring", stiffness: 260, damping: 20 }}
    className="relative overflow-hidden rounded-2xl border border-white/35 bg-white/65 shadow-[0_14px_48px_rgba(2,6,23,.12)] backdrop-blur-xl"
    style={{ minHeight: 120 }}
  >
    <div className="absolute inset-0" style={{ background: grad, opacity: 0.25 }} />
    <motion.div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white" style={{ filter: "blur(20px)", opacity: 0.35 }} animate={{ y: [0, 6, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
    <motion.div className="pointer-events-none absolute -inset-y-10 -left-10 w-1/3 rotate-12 bg-white/30" style={{ filter: "blur(10px)" }} animate={{ x: ["-120%", "130%"] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }} />
    <div className="relative flex items-center gap-4 px-5 py-4">
      <motion.div whileHover={{ rotate: -6 }} className="grid h-12 w-12 place-items-center rounded-xl text-white shadow-lg ring-1 ring-white/40" style={{ background: grad }}>
        {icon}
      </motion.div>
      <div className="min-w-0">
        <div className="flex items-baseline gap-2">
          <MotionNumber value={value} className="text-3xl font-extrabold tracking-tight text-slate-800" />
        </div>
        <div className="mt-0.5 text-xs font-medium text-slate-500">{label}</div>
      </div>
    </div>
    <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/55" />
  </motion.div>
);

/* ───────────────────── Charts (upgrade) ───────────────────── */

// 1) Ligne “live” avec points glow + ombre 3D
function LiveLine(){
  const make=()=>Array.from({length:60},(_,i)=>({name:i,value:Math.round(60+(i?0:rand(-10,10)))}));
  const [data,setData]=useState(make());
  useInterval(()=>{ setData(d=>{ const next=d.slice(1); const last=d[d.length-1]?.value??60; next.push({name:d.length,value:clamp(last+rand(-6,6),20,120)}); return next; }) },1200);

  const option=useMemo(()=>({
    grid:{ left:32, right:16, top:20, bottom:28 },
    xAxis:{ type:"category", boundaryGap:false, data:data.map((_,i)=>i), ...axisLight },
    yAxis:{ type:"value", min:0, max:140, splitNumber:4, ...axisLight },
    tooltip:{ trigger:"axis", axisPointer:{ type:"line" } },
    series:[
      // effet “glow” en tête
      {
        type:"effectScatter",
        coordinateSystem:"cartesian2d",
        data:[[data.length-1, data[data.length-1]?.value ?? 60]],
        symbolSize:10,
        itemStyle:{ color:"#06b6d4", shadowBlur:20, shadowColor:"rgba(6,182,212,.6)" },
        z:4
      },
      {
        type:"line",
        data:data.map(d=>d.value),
        smooth:true, showSymbol:false, symbol:"circle", symbolSize:5,
        lineStyle:{ width:3, color:"#06b6d4", shadowBlur:16, shadowColor:"rgba(6,182,212,.38)" },
        areaStyle:{ color:{ type:"linear", x:0,y:0,x2:0,y2:1, colorStops:[
          {offset:0,color:"rgba(6,182,212,.35)"},{offset:1,color:"rgba(6,182,212,.05)"}]}},
        animationDuration:600, animationDurationUpdate:600, animationEasing:"cubicOut",
        z:3
      }
    ]
  }),[data]);
  return <ReactECharts className="rounded-xl" option={option} style={{height:320}} notMerge/>;
}

// 2) Bar “3D” simple avec cap lumineux
function PulseBar(){
  const days=["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"];
  const [rows,setRows]=useState(days.map(()=>rand(60,98)));
  useInterval(()=>setRows(r=>r.map(v=>clamp(v+rand(-4,4),30,100))),1600);

  const option=useMemo(()=>({
    grid:{ left:38, right:18, top:28, bottom:30 },
    xAxis:{ type:"category", data:days, ...axisLight },
    yAxis:{ type:"value", min:0, max:100, ...axisLight },
    tooltip:{ trigger:"axis" },
    series:[
      {
        type:"bar", data:rows, barWidth:26,
        itemStyle:{
          color:new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:"#22d3ee"},{offset:1,color:"#3b82f6"}]),
          shadowBlur:22, shadowColor:"rgba(56,189,248,.35)", shadowOffsetY:6,
          borderRadius:[8,8,4,4]
        },
        emphasis:{ itemStyle:{ shadowBlur:28, shadowColor:"rgba(56,189,248,.6)" }},
        animationDurationUpdate:700
      },
      {
        type:"pictorialBar", data:rows, symbolSize:[26,10], symbolOffset:[0,-5],
        symbolPosition:"end", z:3,
        itemStyle:{ color:"#e0f2fe", opacity:.55, shadowBlur:10, shadowColor:"rgba(14,165,233,.45)" }
      }
    ]
  }),[rows]);
  return <ReactECharts option={option} style={{height:320}} notMerge/>;
}

// 3) Jauge améliorée
function SatisfactionGauge({ value=86, label="Satisfaction éducateurs" }){
  const [v,setV]=useState(value);
  useInterval(()=>setV(x=>clamp(x+rand(-1.5,1.5),72,98)),1800);

  const option=useMemo(()=>({
    grid:{ left:36, right:36, top:12, bottom:36 },
    xAxis:{ type:"value", min:0, max:100, ...axisLight },
    yAxis:{ type:"value", min:0, max:100, ...axisLight },
    series:[
      { type:"scatter", data:[[0,0]], symbolSize:0, silent:true },
      {
        type:"gauge", radius:"78%", center:["50%","58%"],
        startAngle:210, endAngle:-30, min:0, max:100, splitNumber:5,
        axisLine:{ lineStyle:{
          width:18,
          color:[[0.5,"#ef4444"],[0.8,"#f59e0b"],[1,"#10b981"]],
          shadowBlur:14, shadowColor:"rgba(15,23,42,.18)"
        }},
        pointer:{ itemStyle:{ color:"#334155", shadowBlur:6, shadowColor:"rgba(2,6,23,.25)" } },
        axisTick:{ show:false }, splitLine:{ show:false },
        axisLabel:{ color:"#64748b" },
        detail:{ valueAnimation:true, fontSize:28, color:"#0f172a", offsetCenter:[0,"25%"], formatter:(val)=>`${Math.round(val)}%` },
        title:{ show:true, color:"#64748b", offsetCenter:[0,"75%"], fontSize:12, text:label },
        data:[{ value:v }],
        animationDuration:800, animationDurationUpdate:800
      }
    ]
  }),[v,label]);
  return <ReactECharts option={option} style={{height:320}} notMerge/>;
}

// 4) Donut animé
function SpinningDonut(){
  const [angle,setAngle]=useState(0);
  useInterval(()=>setAngle(a=>(a+2)%360),60);
  const option=useMemo(()=>({
    grid:{ left:36, right:36, top:14, bottom:36 },
    xAxis:{ type:"value", min:0, max:100, ...axisLight },
    yAxis:{ type:"value", min:0, max:100, ...axisLight },
    series:[
      { type:"scatter", data:[[0,0]], symbolSize:0, silent:true },
      {
        type:"pie", radius:["50%","70%"], startAngle:angle, avoidLabelOverlap:true,
        label:{ color:"#334155" },
        itemStyle:{ borderColor:"#fff", borderWidth:3, shadowBlur:14, shadowColor:"rgba(2,6,23,.12)" },
        emphasis:{ scale:true, scaleSize:4 },
        data:[
          { value:40, name:"Crèches",   itemStyle:{ color:"#6366f1" } },
          { value:32, name:"Garderies", itemStyle:{ color:"#06b6d4" } },
          { value:28, name:"Écoles",    itemStyle:{ color:"#10b981" } },
        ]
      }
    ],
    tooltip:{ trigger:"item" }
  }),[angle]);
  return <ReactECharts option={option} style={{height:320}} notMerge/>;
}

// 5) Radar compétences
function RadarSkills(){
  const ind=["Langage","Motricité","Autonomie","Créativité","Socio-émotion"];
  const [vals,setVals]=useState([78,84,72,88,81]);
  useInterval(()=>setVals(v=>v.map(x=>clamp(x+rand(-2,2),60,95))),2000);

  const option=useMemo(()=>({
    radar:{
      indicator:ind.map(name=>({name, max:100})),
      splitArea:{ areaStyle:{ color:["#fff"] } },
      axisName:{ color:"#334155" },
      splitLine:{ lineStyle:{ color:"rgba(2,6,23,.08)" } },
      axisLine:{ lineStyle:{ color:"rgba(2,6,23,.08)" } },
    },
    series:[{
      type:"radar", data:[{ value:vals }],
      areaStyle:{ color:"rgba(6,182,212,.35)", shadowBlur:16, shadowColor:"rgba(6,182,212,.25)" },
      lineStyle:{ color:"#06b6d4", width:3 },
      symbol:"circle", symbolSize:4, itemStyle:{ color:"#06b6d4", shadowBlur:8, shadowColor:"rgba(6,182,212,.6)" },
      animationDurationUpdate:800
    }]
  }),[vals]);
  return <ReactECharts option={option} style={{height:320}}/>;
}

// 6) Area sparkline
function AreaSpark(){
  const [data,setData]=useState(()=>Array.from({length:40},()=>100+rand(-30,30)));
  useInterval(()=>setData(d=>{ const next=d.slice(1); next.push(clamp(next[next.length-1]+rand(-6,6),60,160)); return next; }),1200);

  const option=useMemo(()=>({
    grid:{ left:36, right:16, top:16, bottom:28 },
    xAxis:{ type:"category", data:data.map((_,i)=>i), ...axisLight },
    yAxis:{ type:"value", ...axisLight },
    series:[{
      type:"line", data, smooth:true, showSymbol:false,
      lineStyle:{ color:"#7c3aed", width:3, shadowBlur:14, shadowColor:"rgba(124,58,237,.38)" },
      areaStyle:{ color:{ type:"linear", x:0,y:0,x2:0,y2:1, colorStops:[
        {offset:0,color:"rgba(124,58,237,.28)"},{offset:1,color:"rgba(124,58,237,.06)"}]}},
      animationDurationUpdate:600
    }]
  }),[data]);
  return <ReactECharts option={option} style={{height:300}}/>;
}

/* ───────────────────── Page ───────────────────── */

export default function ReportsAnimated(){
  return (
    <div className="space-y-5 p-3">
      <style>{`
        body { background:#f5f7fb; }
        .echarts-for-react, .echarts-for-react > div { border-radius: 12px; }
        .echarts-tooltip { border-radius:12px !important; }
      `}</style>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Kpi icon={<FiActivity className="text-2xl" />} label="Présence moyenne (%)" value={89} grad="linear-gradient(135deg,#06b6d4,#3b82f6)" />
        <Kpi icon={<FiTrendingUp className="text-2xl" />} label="Retards moyens (%)" value={5} grad="linear-gradient(135deg,#f59e0b,#ef4444)" />
        <Kpi icon={<FiUsers className="text-2xl" />} label="Enfants suivis" value={1240} grad="linear-gradient(135deg,#14b8a6,#22c55e)" />
        <Kpi icon={<FiBarChart2 className="text-2xl" />} label="Établissements actifs" value={41} grad="linear-gradient(135deg,#8b5cf6,#06b6d4)" />
        <Kpi icon={<FiPieChart className="text-2xl" />} label="Satisfaction familles (%)" value={92} grad="linear-gradient(135deg,#60a5fa,#22d3ee)" />
      </div>

      {/* charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <Card title="Progression des indicateurs">
          <ProgressPills />
        </Card>
        <Card title="Évolution par année ">
          <Bars3DPrism />
        </Card>
        <Card title="Répartition des inscriptions ">
          <Pie2_5D />
        </Card>
        <Card title="Suivi en temps réel des connexions">
          <LiveLine />
        </Card>
        <Card title="Présence quotidienne des enfants">
          <PulseBar />
        </Card>
        <Card title="Indice de satisfaction des éducateurs">
          <SatisfactionGauge value={86} label="Score des éducateurs" />
        </Card>
        <Card title="Répartition par type d'établissement">
          <SpinningDonut />
        </Card>
        <Card title="Tendance des revenus ">
          <AreaSpark />
        </Card>
      </div>
    </div>
  );
}
