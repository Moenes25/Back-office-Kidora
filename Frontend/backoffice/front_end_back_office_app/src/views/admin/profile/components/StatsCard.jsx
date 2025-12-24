"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";

export default function StatsCard({
  label,
  value = 0,
  icon,
  accent = "#6366f1",
  progress = null,        // number | null
  highlight = false,      // true pour Activity Score
}) {
  const numericValue = Number(
    typeof value === "string" ? value.replace("%", "") : value
  );

  /* animated counter */
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));

  useEffect(() => {
    animate(count, numericValue, { duration: 0.8, ease: "easeOut" });
  }, [numericValue]);

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className={`
        relative rounded-xl px-4 py-3
        border backdrop-blur
        shadow-[0_10px_24px_-18px_rgba(0,0,0,0.25)]
        ${
          highlight
            ? "bg-gradient-to-br from-amber-50 to-white border-amber-200"
            : "bg-white border-slate-200"
        }
        dark:bg-slate-900 dark:border-white/10
      `}
    >
      {/* soft glow */}
      <span
        className="absolute -top-6 -right-6 h-20 w-20 rounded-full blur-2xl opacity-10"
        style={{ backgroundColor: accent }}
      />

      {/* CONTENT */}
      <div className="relative flex items-center gap-3">
        {/* ICON */}
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center
                     rounded-lg text-white shadow-sm"
          style={{ backgroundColor: accent }}
        >
          {icon}
        </div>

        {/* TEXT INLINE */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {label}
          </span>

          <span className="text-lg font-extrabold text-slate-900 dark:text-white">
            <motion.span>{rounded}</motion.span>
            {typeof value === "string" && "%"}
          </span>
        </div>
      </div>

      {/* PROGRESS BAR (OPTIONAL) */}
      {progress !== null && (
        <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{ backgroundColor: accent }}
          />
        </div>
      )}
    </motion.div>
  );
}
