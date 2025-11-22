import React from "react";
import Card from "components/card";

/* 
  Tonalités avec backgrounds pro :
  - bg = couche “papier coloré” + dégradés radiaux/coniques subtils (glow)
  - ring/border = finesse + consistance
  - shadow = profondeur soft
*/
const TONES = {
  emerald: {
    card: [
      "!ring-1 !border",
      "ring-emerald-300/60 border-emerald-200/60",
      // couche papier + glow radiaux + lueur en coin
      "bg-[radial-gradient(1200px_120px_at_50%_-30%,rgba(16,185,129,0.10),transparent),radial-gradient(200px_180px_at_100%_0,rgba(16,185,129,.15),transparent),linear-gradient(180deg,rgba(255,255,255,.86),rgba(255,255,255,.86))]",
    ].join(" "),
    title: "text-emerald-700",
    value: "text-emerald-800",
    icon:  "text-emerald-700",
    chip:  "bg-emerald-600/18",
    shadow:"shadow-[0_10px_30px_rgba(16,185,129,.18)]",
  },
  indigo: {
    card: [
      "!ring-1 !border",
      "ring-indigo-300/60 border-indigo-200/60",
      "bg-[radial-gradient(1200px_120px_at_50%_-30%,rgba(79,70,229,0.10),transparent),radial-gradient(220px_200px_at_0%_0,rgba(99,102,241,.18),transparent),linear-gradient(180deg,rgba(255,255,255,.86),rgba(255,255,255,.86))]",
    ].join(" "),
    title: "text-indigo-700",
    value: "text-indigo-800",
    icon:  "text-indigo-700",
    chip:  "bg-indigo-600/18",
    shadow:"shadow-[0_10px_30px_rgba(99,102,241,.18)]",
  },
  sky: {
    card: [
      "!ring-1 !border",
      "ring-sky-300/60 border-sky-200/60",
      "bg-[radial-gradient(1200px_120px_at_50%_-30%,rgba(2,132,199,0.10),transparent),radial-gradient(240px_220px_at_100%_0,rgba(14,165,233,.22),transparent),linear-gradient(180deg,rgba(255,255,255,.86),rgba(255,255,255,.86))]",
    ].join(" "),
    title: "text-sky-700",
    value: "text-sky-900",
    icon:  "text-sky-700",
    chip:  "bg-sky-600/20",
    shadow:"shadow-[0_12px_36px_rgba(14,165,233,.22)]",
  },
  amber: {
    card: [
      "!ring-1 !border",
      "ring-amber-300/60 border-amber-200/60",
      "bg-[radial-gradient(1200px_120px_at_50%_-30%,rgba(245,158,11,0.10),transparent),radial-gradient(220px_200px_at_100%_0,rgba(251,191,36,.18),transparent),linear-gradient(180deg,rgba(255,255,255,.86),rgba(255,255,255,.86))]",
    ].join(" "),
    title: "text-amber-700",
    value: "text-amber-800",
    icon:  "text-amber-700",
    chip:  "bg-amber-600/18",
    shadow:"shadow-[0_10px_30px_rgba(245,158,11,.18)]",
  },
  slate: {
    card: [
      "!ring-1 !border",
      "ring-slate-300/60 border-slate-200/60",
      "bg-[radial-gradient(1200px_120px_at_50%_-30%,rgba(100,116,139,0.10),transparent),radial-gradient(220px_200px_at_0%_0,rgba(148,163,184,.20),transparent),linear-gradient(180deg,rgba(255,255,255,.86),rgba(255,255,255,.86))]",
    ].join(" "),
    title: "text-slate-700",
    value: "text-slate-800",
    icon:  "text-slate-700",
    chip:  "bg-slate-500/18",
    shadow:"shadow-[0_10px_30px_rgba(100,116,139,.16)]",
  },
};

const Widget = ({
  icon, title, subtitle,
  tone = "indigo",
  valueColored = true,
  animated = true,
  delay = 0,
  stacked = false,
}) => {
  const p = TONES[tone] ?? TONES.indigo;

  // Harmonise l’icône (taille + couleur)
  const forcedIcon = React.isValidElement(icon)
    ? React.cloneElement(icon, { className: ["h-7 w-7", p.icon].join(" ") })
    : icon;

  return (
    <Card
      extra={[
        "group relative overflow-hidden rounded-[20px] px-4 py-5",
        stacked ? "flex flex-col items-center justify-center text-center gap-3" : "!flex-row items-center",
        "transition-all duration-400 motion-ok",
        // 3D subtil au hover
        "hover:-translate-y-1 hover:rotate-[0.15deg]",
        // profondeur
        p.card, p.shadow,
        animated ? "animate-enter" : "",
        "grain", // texture fine
      ].join(" ")}
      style={animated ? { animationDelay: `${delay}ms` } : undefined}
    >
      {/* Shine diagonal au hover */}
      <div
        className={[
          "pointer-events-none absolute -inset-1 opacity-0",
          "group-hover:opacity-100 motion-ok",
          "bg-[linear-gradient(110deg,transparent,rgba(255,255,255,.5),transparent)]",
          "bg-[length:200%_100%] animate-shine"
        ].join(" ")}
      />

      {/* “Projecteur” doux dans l’angle bas-droit */}
      <div className="pointer-events-none absolute -right-8 -bottom-8 h-40 w-40 rounded-full bg-white/15 blur-2xl" />

      {/* Icône dans une pastille “verre” */}
      <div className={stacked ? "flex items-center justify-center" : "ml-4 flex h-[90px] w-auto items-center"}>
        <div
          className={[
            "relative grid h-12 w-12 place-items-center rounded-2xl shadow-inner",
            "transition-transform duration-500 motion-ok",
            "group-hover:scale-110 group-hover:rotate-1",
            "backdrop-blur-[2px] bg-white/30 ring-1 ring-white/40",
          ].join(" ")}
          style={{ boxShadow: "inset 0 0 28px rgba(255,255,255,.65)" }}
        >
          <div className={["absolute inset-0 rounded-2xl", p.chip].join(" ")} />
          <span className="relative animate-icon-float group-hover:animate-icon-pop motion-ok">
            {forcedIcon}
          </span>
        </div>
      </div>

      {/* Textes */}
      <div className={["min-w-0 flex flex-col justify-center", stacked ? "items-center text-center" : "ml-4"].join(" ")}>
        <p className={["text-sm font-semibold tracking-wide transition-transform duration-300 motion-ok group-hover:-translate-y-0.5", p.title].join(" ")}>
          {title}
        </p>
        <h4 className={["text-3xl font-extrabold leading-tight transition-transform duration-300 motion-ok group-hover:translate-y-0.5", valueColored ? p.value : "text-gray-900"].join(" ")}>
          {subtitle}
        </h4>
      </div>
    </Card>
  );
};

export default Widget;
