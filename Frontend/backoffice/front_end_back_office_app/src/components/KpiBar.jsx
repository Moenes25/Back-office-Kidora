// src/components/charts/ApexChart.jsx
import React from "react";
import ReactApexChart from "react-apexcharts";

export default function ApexChart({ type = "line", series, options, height = 250 }) {
  return <ReactApexChart type={type} series={series} options={options} height={height} />;
}


// src/views/admin/default/chartPresets.js
export const MOTION = {
  chart: {
    animations: {
      enabled: true,
      easing: "easeinout",
      speed: 800,
      animateGradually: { enabled: true, delay: 120 },
      dynamicAnimation: { enabled: true, speed: 600 },
    },
    toolbar: { show: false },
    dropShadow: { enabled: true, top: 1, left: 0, blur: 3, opacity: 0.12 },
  },
  states: {
    hover:  { filter: { type: "lighten", value: 0.08 } },
    active: { filter: { type: "darken",  value: 0.25 } },
  },
};

export const lineOptions = {
  ...MOTION,
  chart: { ...MOTION.chart, type: "line" },
  stroke: { width: 3, curve: "smooth" },
  dataLabels: { enabled: false },
  xaxis: { categories: ["Jan","Fév","Mar","Avr","Mai","Juin","Juil","Août","Sep","Oct","Nov","Déc"] },
  grid: { borderColor: "rgba(0,0,0,.08)", strokeDashArray: 4 },
  colors: ["#60a5fa"],
};

export const areaOptions = {
  ...lineOptions,
  chart: { ...MOTION.chart, type: "area" },
  fill: {
    type: "gradient",
    gradient: { shadeIntensity: 0.25, opacityFrom: 0.9, opacityTo: 0.65, stops: [0, 90, 100] },
  },
  colors: ["#a78bfa"],
};

export const radarOptions = {
  ...MOTION,
  chart: { ...MOTION.chart, type: "radar" },
  stroke: { width: 2 },
  fill: { opacity: 0.2 },
  colors: ["#34d399"],
  xaxis: { categories: ["Qualité","Support","Prix","Fiabilité","Ux"] },
};

export const heatmapOptions = {
  ...MOTION,
  chart: { ...MOTION.chart, type: "heatmap" },
  dataLabels: { enabled: false },
  plotOptions: { heatmap: { shadeIntensity: 0.45, radius: 6, useFillColorAsStroke: false } },
  colors: ["#4c6fff"],
};

export const radialOptions = {
  ...MOTION,
  chart: { ...MOTION.chart, type: "radialBar" },
  plotOptions: {
    radialBar: {
      hollow: { size: "65%" },
      dataLabels: {
        name: { show: true, fontSize: "12px" },
        value: { formatter: (v) => `${Math.round(v)}%` },
      },
    },
  },
  colors: ["#10b981"],
};
