import React from "react";
import { MdOutlineCalendarToday, MdBarChart } from "react-icons/md";
import Card from "components/card";
import LineChart from "components/charts/LineChart";
import {
  crechesByRegionData,
  crechesByRegionOptions,
} from "variables/charts";

const TotalSpent = () => {
  return (
    <Card
      extra="
        relative overflow-hidden
        !p-[20px]
        text-center
        bg-white/80 dark:bg-navy-800
        shadow-lg backdrop-blur-xl
        transform transition-all duration-300
        hover:-translate-y-1 hover:shadow-2xl hover:scale-[1.01]
        group
      "
    >
      {/* Glow effect on hover */}
      <div
        className="
          absolute inset-0 pointer-events-none
          bg-gradient-to-br from-brand-500/5 via-transparent to-brand-500/10
          opacity-0 group-hover:opacity-100
          transition-all duration-500
        "
      ></div>

      {/* HEADER BUTTONS */}
      <div className="flex justify-between">
        {/* Left glossy button */}
        <button
          className="
            linear mt-1 flex items-center justify-center gap-2 p-2
            rounded-lg bg-lightPrimary dark:bg-navy-700/80
            text-gray-600 dark:text-white
            transition-all duration-300
            hover:bg-brand-500 hover:text-white hover:scale-105
            shadow-inner
          "
        >
          <MdOutlineCalendarToday className="text-lg" />
          <span className="text-sm font-medium">
            Répartition par région
          </span>
        </button>

        {/* Right glowing button */}
        <button
          className="
            relative flex items-center justify-center p-2 rounded-lg
            bg-lightPrimary dark:bg-navy-700/80 text-brand-500
            shadow-md transition-all duration-300
            hover:scale-110 hover:shadow-brand-500/40 hover:shadow-lg
          "
        >
          {/* small glow */}
          <span className="absolute inset-0 rounded-lg bg-brand-500/10 blur-md opacity-0 hover:opacity-100 transition duration-300"></span>

          <MdBarChart className="h-6 w-6 relative z-[2]" />
        </button>
      </div>

      {/* TEXT + CHART BLOCK */}
      <div className="flex h-full w-full flex-row justify-between mt-2">
        {/* LEFT TEXT BLOCK */}
        <div className="flex flex-col text-left">
          <p
            className="
              mt-[20px] text-3xl font-extrabold
              text-transparent bg-gradient-to-r from-navy-700 to-brand-500
              bg-clip-text dark:from-white dark:to-brand-400
              transition-all duration-300 group-hover:translate-y-[-2px]
            "
          >
            4 régions
          </p>

          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Répartition des crèches
          </p>
        </div>

        {/* LINE CHART */}
        <div
          className="
            h-full w-full pr-2
            transform transition-all duration-300
            group-hover:scale-[1.03]
          "
        >
         <LineChart
  options={{
    ...crechesByRegionOptions,
    stroke: { curve: "smooth", width: 4 },
    colors: ["#4c6fff"],
    markers: { size: 5, colors: "#fff", strokeWidth: 2 },
    tooltip: { theme: "dark" },
    grid: { borderColor: "rgba(0,0,0,0.08)" },
  }}
  series={crechesByRegionData}
/>

        </div>
      </div>
    </Card>
  );
};

export default TotalSpent;
