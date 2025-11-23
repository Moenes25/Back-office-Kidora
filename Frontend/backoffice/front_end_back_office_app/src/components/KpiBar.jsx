import React, { useEffect, useRef } from "react";

export default function AnimatedStatCard({
  title,
  value,
  suffix = "",
  color = "sky",
  series = [],
  trend = { delta: 0 },
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const can = canvasRef.current;
    if (!can) return;
    const ctx = can.getContext("2d");

    // reset
    ctx.clearRect(0, 0, can.width, can.height);

    // draw animated bars
    let progress = 0;
    const max = Math.max(...series, 100);

    function draw() {
      progress += 3;
      ctx.clearRect(0, 0, can.width, can.height);

      const barWidth = can.width / series.length;
      series.forEach((v, i) => {
        const h = (v / max) * can.height * (progress / 100);
        ctx.fillStyle = "rgba(135,206,235,0.55)";
        ctx.fillRect(i * barWidth, can.height - h, barWidth - 4, h);
      });

      if (progress < 100) requestAnimationFrame(draw);
    }
    draw();
  }, [series]);

  return (
    <div className="p-5 bg-white/70 backdrop-blur-md border border-black/5 shadow-md rounded-2xl hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-gray-600">{title}</h4>
        <span
          className={`text-sm font-medium ${
            trend.delta >= 0 ? "text-emerald-600" : "text-rose-600"
          }`}
        >
          {trend.delta >= 0 ? "▲" : "▼"} {trend.delta}%
        </span>
      </div>

      <div className="mt-2 flex items-end gap-2">
        <h2 className="text-3xl font-extrabold text-gray-900">
          {value}
          <span className="text-xl">{suffix}</span>
        </h2>
      </div>

      <canvas
        ref={canvasRef}
        width={320}
        height={70}
        className="mt-4 w-full"
      ></canvas>
    </div>
  );
}
