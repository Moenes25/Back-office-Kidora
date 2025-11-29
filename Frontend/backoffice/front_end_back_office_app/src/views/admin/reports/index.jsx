/* eslint-disable */
import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import { motion } from "framer-motion";
import { FiActivity, FiUsers, FiPieChart, FiBarChart2, FiTrendingUp } from "react-icons/fi";

/* ----------------------------- helpers ----------------------------- */
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

/* ----------------------------- shell UI ----------------------------- */
// Card + KPI avec ombre plus marquée
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

const Kpi = ({ icon, label, value, grad }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
    className="relative overflow-hidden rounded-2xl border border-black/5 bg-white p-4 shadow-[0_16px_40px_rgba(2,6,23,.10)]"
  >
    <div className="absolute inset-0 opacity-12" style={{ background: grad }} />
    <div className="relative flex items-center gap-3">
      <div className="grid h-12 w-12 place-items-center rounded-xl text-white shadow-[0_10px_24px_rgba(99,102,241,.35)] ring-1 ring-white/60" style={{ background: grad }}>
        {icon}
      </div>
      <div>
        <div className="text-2xl font-extrabold text-slate-900">{value}</div>
        <div className="text-xs text-slate-500">{label}</div>
      </div>
    </div>
  </motion.div>
);

/* ----------------------------- charts ----------------------------- */
// 1) Ligne temps réel (axes visibles + ombre “3D”)
function LiveLine(){
  const make=()=>Array.from({length:60},(_,i)=>({name:i,value:Math.round(60+(i?0:rand(-10,10)))}));
  const [data,setData]=useState(make());
  useInterval(()=>{ setData(d=>{ const next=d.slice(1); const last=d[d.length-1]?.value??60; next.push({name:d.length,value:clamp(last+rand(-6,6),20,120)}); return next; }) },1200);

  const option=useMemo(()=>({
    grid:{ left:32, right:16, top:20, bottom:28 },
    xAxis:{ type:"category", boundaryGap:false, data:data.map((_,i)=>i), ...axisLight },
    yAxis:{ type:"value", min:0, max:140, splitNumber:4, ...axisLight },
    tooltip:{ trigger:"axis", axisPointer:{ type:"line" } },
    series:[{
      type:"line",
      data:data.map(d=>d.value),
      smooth:true, showSymbol:false, symbol:"circle", symbolSize:5,
      lineStyle:{ width:3, color:"#06b6d4", shadowBlur:14, shadowColor:"rgba(6,182,212,.35)" },
      areaStyle:{ color:{ type:"linear", x:0,y:0,x2:0,y2:1, colorStops:[
        {offset:0,color:"rgba(6,182,212,.35)"},{offset:1,color:"rgba(6,182,212,.05)"}]}},
      animationDuration:600, animationDurationUpdate:600, animationEasing:"cubicOut"
    }]
  }),[data]);
  return <ReactECharts className="rounded-xl" option={option} style={{height:240}} notMerge/>;
}

// 2) Bar “3D” : barre + cap brillant (pictorialBar) + ombres
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
      // corps
      {
        type:"bar", data:rows, barWidth:26,
        itemStyle:{
          color:new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:"#22d3ee"},{offset:1,color:"#3b82f6"}]),
          shadowBlur:20, shadowColor:"rgba(56,189,248,.35)", shadowOffsetY:6,
          borderRadius:[8,8,4,4]
        },
        animationDurationUpdate:700
      },
      // cap lumineux
      {
        type:"pictorialBar", data:rows, symbolSize:[26,10], symbolOffset:[0,-5],
        symbolPosition:"end", z:3,
        itemStyle:{ color:"#e0f2fe", opacity:.55, shadowBlur:8, shadowColor:"rgba(14,165,233,.45)" }
      }
    ]
  }),[rows]);
  return <ReactECharts option={option} style={{height:260}} notMerge/>;
}

// 3) Jauge + axes “fantômes” (scatter transparent) pour afficher X/Y
function SatisfactionGauge({ value=86, label="Satisfaction éducateurs" }){
  const [v,setV]=useState(value);
  useInterval(()=>setV(x=>clamp(x+rand(-1.5,1.5),72,98)),1800);

  const option=useMemo(()=>({
    // grid + axes décoratifs (0..100)
    grid:{ left:36, right:36, top:12, bottom:36 },
    xAxis:{ type:"value", min:0, max:100, ...axisLight },
    yAxis:{ type:"value", min:0, max:100, ...axisLight },
    series:[
      // point invisible pour forcer le rendu des axes
      { type:"scatter", data:[[0,0]], symbolSize:0, silent:true },
      // la jauge réelle
      {
        type:"gauge", radius:"78%", center:["50%","58%"],
        startAngle:210, endAngle:-30, min:0, max:100, splitNumber:5,
        axisLine:{ lineStyle:{ width:18, color:[[0.5,"#ef4444"],[0.8,"#f59e0b"],[1,"#10b981"]], shadowBlur:12, shadowColor:"rgba(15,23,42,.15)"} },
        pointer:{ itemStyle:{ color:"#334155" } },
        axisTick:{ show:false }, splitLine:{ show:false },
        axisLabel:{ color:"#64748b" },
        detail:{ valueAnimation:true, fontSize:28, color:"#0f172a", offsetCenter:[0,"25%"], formatter:(val)=>`${Math.round(val)}%` },
        title:{ show:true, color:"#64748b", offsetCenter:[0,"75%"], fontSize:12, text:label },
        data:[{ value:v }],
        animationDuration:800, animationDurationUpdate:800
      }
    ]
  }),[v,label]);
  return <ReactECharts option={option} style={{height:300}} notMerge/>;
}

// 4) Donut en rotation + axes “fantômes” (même technique)
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
        data:[
          { value:40, name:"Crèches",   itemStyle:{ color:"#6366f1" } },
          { value:32, name:"Garderies", itemStyle:{ color:"#06b6d4" } },
          { value:28, name:"Écoles",    itemStyle:{ color:"#10b981" } },
        ]
      }
    ],
    tooltip:{ trigger:"item" }
  }),[angle]);
  return <ReactECharts option={option} style={{height:280}} notMerge/>;
}

// 5) Radar compétences (relief renforcé)
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
  return <ReactECharts option={option} style={{height:300}}/>;
}

// 6) Aire sparkline -> vraie “mini area” avec axes visibles + ombre
function AreaSpark(){
  const [data,setData]=useState(()=>Array.from({length:40},()=>100+rand(-30,30)));
  useInterval(()=>setData(d=>{ const next=d.slice(1); next.push(clamp(next[next.length-1]+rand(-6,6),60,160)); return next; }),1200);

  const option=useMemo(()=>({
    grid:{ left:36, right:16, top:16, bottom:28 },
    xAxis:{ type:"category", data:data.map((_,i)=>i), ...axisLight },
    yAxis:{ type:"value", ...axisLight },
    series:[{
      type:"line", data, smooth:true, showSymbol:false,
      lineStyle:{ color:"#7c3aed", width:3, shadowBlur:12, shadowColor:"rgba(124,58,237,.35)" },
      areaStyle:{ color:{ type:"linear", x:0,y:0,x2:0,y2:1, colorStops:[
        {offset:0,color:"rgba(124,58,237,.26)"},{offset:1,color:"rgba(124,58,237,.04)"}]}},
      animationDurationUpdate:600
    }]
  }),[data]);
  return <ReactECharts option={option} style={{height:300}}/>;
}

/* ----------------------------- page ----------------------------- */
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
        <Kpi icon={<FiActivity/>} label="Présence moyenne" value="89%" grad="linear-gradient(135deg,#06b6d4,#3b82f6)" />
        <Kpi icon={<FiTrendingUp/>} label="Retards moyens" value="5%" grad="linear-gradient(135deg,#f59e0b,#ef4444)" />
        <Kpi icon={<FiUsers/>} label="Enfants suivis" value="1 240" grad="linear-gradient(135deg,#14b8a6,#22c55e)" />
        <Kpi icon={<FiBarChart2/>} label="Établissements actifs" value="41" grad="linear-gradient(135deg,#8b5cf6,#06b6d4)" />
        <Kpi icon={<FiPieChart/>} label="Satisfaction familles" value="92%" grad="linear-gradient(135deg,#60a5fa,#22d3ee)" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <Card title="Trafic en temps réel" subtitle="Utilisateurs connectés (défilement en continu)">
          <LiveLine />
        </Card>
        <Card title="Présence par jour" >
          <PulseBar />
        </Card>

        <Card title="Satisfaction éducateurs" >
          <SatisfactionGauge value={86} label="Score éducateurs" />
        </Card>
        <Card title="Répartition par type" >
          <SpinningDonut />
        </Card>

        <Card title="Compétences (moyennes)" >
          <RadarSkills />
        </Card>
        <Card title="Tendance revenus (mini)" >
          <AreaSpark />
        </Card>
      </div>
    </div>
  );
}
