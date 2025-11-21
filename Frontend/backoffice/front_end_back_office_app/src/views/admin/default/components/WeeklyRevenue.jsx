import Card from "components/card";
import BarChart from "components/charts/BarChart";
import {
  crechesMonthlyData,
  crechesMonthlyOptions,
} from "variables/charts";
import { MdBarChart } from "react-icons/md";

const WeeklyRevenue = () => {
  return (
    <Card
      extra="
        relative flex flex-col w-full overflow-hidden
        rounded-3xl py-6 px-4 text-center
        bg-white/80 dark:bg-navy-800/80
        backdrop-blur-xl shadow-lg
        transform transition-all duration-300
        hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1
        group
      "
    >
      {/* Glow gradient */}
      <div
        className="
          absolute inset-0 pointer-events-none
          bg-gradient-to-br from-brand-500/10 via-transparent to-brand-500/5
          opacity-0 group-hover:opacity-100
          transition-all duration-500
        "
      />

      {/* Header */}
      <div className="mb-auto flex items-center justify-between px-4">
        <h2
          className="
            text-xl font-extrabold
            bg-gradient-to-r from-navy-700 to-brand-500
            bg-clip-text text-transparent
            dark:from-white dark:to-brand-400
            group-hover:tracking-wide transition-all duration-300
          "
        >
          Nouvelles crèches par mois
        </h2>

        {/* glossy round button */}
        <button
          className="
            relative flex items-center justify-center p-2 rounded-xl
            bg-lightPrimary dark:bg-navy-700/70 text-brand-500
            shadow-md transition-all duration-300
            hover:scale-110 hover:shadow-brand-500/40 hover:shadow-xl
            active:scale-95
          "
        >
          <span className="absolute inset-0 bg-brand-500/10 blur-md rounded-xl opacity-0 group-hover:opacity-80 transition"></span>
          <MdBarChart className="h-6 w-6 relative z-[2]" />
        </button>
      </div>

      {/* Chart */}
      <div className="mt-4 md:mt-12">
        <div
          className="
            h-[250px] xl:h-[350px] w-full
            transform transition duration-500
            group-hover:scale-[1.03]
          "
        >
          <BarChart
            chartData={crechesMonthlyData}
            chartOptions={{
              ...crechesMonthlyOptions,
              plotOptions: {
                bar: {
                  borderRadius: 8,
                  columnWidth: "40%",
                },
              },
              fill: {
                type: "gradient",
                gradient: {
                  shade: "light",
                  type: "vertical",
                  shadeIntensity: 0.3,
                  opacityFrom: 0.9,
                  opacityTo: 0.5,
                  stops: [0, 100],
                },
              },
              colors: ["#4c6fff"],
              grid: {
                borderColor: "rgba(0,0,0,0.08)",
                strokeDashArray: 4,
              },
              tooltip: { theme: "dark" },
            }}
          />
        </div>
      </div>
    </Card>
  );
};

export default WeeklyRevenue;
