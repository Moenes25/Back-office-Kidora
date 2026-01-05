// src/components/AlertsPanel.jsx
import React, { useRef,  useState } from "react";
import { MdOutlinePayment, MdOutlineSupportAgent } from "react-icons/md";
import { IoPauseCircleOutline } from "react-icons/io5";

/* ===== Tilt 3D subtil + halo ===== */
function useTilt() {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    const px = x / r.width - 0.5, py = y / r.height - 0.5;
    el.style.setProperty("--rx", `${(-py * 6).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(px * 9).toFixed(2)}deg`);
    el.style.setProperty("--gx", `${x}px`);
    el.style.setProperty("--gy", `${y}px`);
  };
  const onLeave = () => {
    const el = ref.current; if (!el) return;
    el.style.setProperty("--rx", `0deg`);
    el.style.setProperty("--ry", `0deg`);
    el.style.setProperty("--gx", `-1000px`);
    el.style.setProperty("--gy", `-1000px`);
  };
  return { ref, onMove, onLeave };
}

/* ===== Carte ===== */
function AlertCard({ title, tone="red", subtitle, count, items, ariaLabel, href, onViewAll, compact=false, className="" }) {
  const { ref, onMove, onLeave } = useTilt();
const [pageIndex, setPageIndex] = useState(0);
const itemsPerPage = 3;
const pageCount = Math.ceil(items.rows.length / itemsPerPage);
const currentItems = items.rows.slice(
  pageIndex * itemsPerPage,
  (pageIndex + 1) * itemsPerPage
);
  const toneMap = {
    red: {
      side: "from-red-500 to-rose-600",
      text: "text-red-800",
      chip: "bg-red-50 text-red-700 ring-1 ring-red-200",
      icon: "text-red-600",
      shadow: "0 12px 28px -16px rgba(239,68,68,.35), 0 22px 48px -24px rgba(239,68,68,.28)",
      glow: "rgba(239,68,68,.18)",
      accent: "#ef4444",
    },
    amber: {
      side: "from-amber-500 to-orange-500",
      text: "text-amber-800",
      chip: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
      icon: "text-amber-600",
      shadow: "0 12px 28px -16px rgba(245,158,11,.35), 0 22px 48px -24px rgba(245,158,11,.28)",
      glow: "rgba(245,158,11,.18)",
      accent: "#f59e0b",
    },
    indigo: {
      side: "from-indigo-500 to-violet-500",
      text: "text-indigo-800",
      chip: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200",
      icon: "text-indigo-600",
      shadow: "0 12px 28px -16px rgba(99,102,241,.35), 0 22px 48px -24px rgba(99,102,241,.28)",
      glow: "rgba(99,102,241,.18)",
      accent: "#6366f1",
    },
  };
  const t = toneMap[tone] ?? toneMap.red;

  const Wrapper = href ? "a" : "article";
  const wrapperProps = href
    ? { href, rel: "noreferrer", target: "_self" }
    : { role: "region", "aria-label": ariaLabel || title };

  return (
    <Wrapper
      {...wrapperProps}
      tabIndex={0}
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={[
        "relative grid grid-cols-[10px,1fr] overflow-hidden rounded-3xl bg-white/90 backdrop-blur-xl border border-black/5",
        "transform-gpu transition-transform duration-300 [transform-style:preserve-3d] perspective-[1200px]",
        "hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-black/10",
        className,               
      ].join(" ")}
      style={{ boxShadow: t.shadow }}
    >
      {/* 1) trait latéral (ton) */}
      <div className={`bg-gradient-to-b ${t.side}`} />

      {/* 2) bordure dégradée animée (masquée vers l’intérieur) */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-3xl"
        style={{
          padding: 1,
          background:
            "linear-gradient(90deg, rgba(255,255,255,.6), rgba(0,0,0,.05), rgba(255,255,255,.4))",
          WebkitMask:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />

      {/* 3) halo qui suit la souris */}
      <span
        aria-hidden
        className="absolute inset-0 pointer-events-none rounded-3xl opacity-0 md:opacity-100"
        style={{
          background:
            "radial-gradient(220px 160px at var(--gx,-1000px) var(--gy,-1000px), rgba(255,255,255,.55), transparent 60%)",
          transition: "opacity .25s ease",
        }}
      />

      {/* 4) léger grain pour la matière */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-[.06] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='.25'/></svg>\")",
          backgroundSize: "200px 200px",
        }}
      />

      {/* contenu */}
      <div className="relative p-5">
    {/* badge statut (absolu) */}
<div className="absolute right-4 top-4 [transform:translateZ(40px)] pl-4">
  <span
    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${t.chip}`}
  >
    <span className="h-1.5 w-1.5 rounded-full bg-current" />
    {subtitle}
  </span>
</div>

{/* header */}
<div className="[transform:translateZ(60px)] flex items-start gap-3 pr-[112px]">
  <div className="grid h-12 w-12 place-items-center rounded-xl bg-white/80 border border-black/5 shadow-sm transition duration-300 group-hover:-translate-y-0.5">
    <div className="transition-transform duration-500 group-hover:-rotate-3">
      {items.icon}
    </div>
  </div>

  {/* titre + count */}
  <div className="min-w-0 max-w-full">
    <h3
      className={`text-sm font-extrabold leading-5 ${t.text} 
                  whitespace-normal break-words [hyphens:auto]`}
    >
      {title}
    </h3>
    <p className={`mt-0.5 ${compact ? "text-xl" : "text-3xl"} font-black leading-none`}>
      {count}
    </p>
    <p className="mt-1 text-[11px] uppercase tracking-wide text-gray-400">Total</p>
  </div>
</div>


        {/* séparateur */}
        <div className="mt-4 h-px w-full bg-gradient-to-r from-black/0 via-black/10 to-black/0 translate-z-[30px]" />

        {/* liste */}
       <ul className="translate-z-[40px] mt-3 space-y-2 text-sm leading-5">
  {currentItems.map((row, i) => (
    <li key={i} className="flex items-center justify-between">
      <span className="flex min-w-0 items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: t.accent }} />
        <span className="truncate">{row.left}</span>
      </span>
      <span className={`ml-2 whitespace-nowrap text-xs font-semibold ${t.text}`}>
        {row.right}
      </span>
    </li>
  ))}
       </ul>

       {pageCount > 1 && (
<div className="mt-4 flex justify-center gap-2 translate-z-[25px]">
  {Array.from({ length: pageCount }).map((_, i) => (
    <button
      key={i}
      onClick={() => setPageIndex(i)}
      className={`h-3 w-3 rounded-full border-2 transition ${
        i === pageIndex
          ? "bg-gray-800  dark:bg-white border-gray-800dark:border-white"
          : "bg-transparent border-gray/800 dark:border-white/20"
      }`}
      aria-label={`Page ${i + 1}`}
    />
  ))}
</div>

)}



  
      </div>

      {/* Motion safety */}
      <style>{`
        @media (prefers-reduced-motion: reduce){
          [transform-style] { transform: none !important }
        }
      `}</style>
    </Wrapper>
  );
}

/* ===== Panneau ===== */
export default function AlertsPanel({ alerts, stacked = false }) {
  const { latePayments = [], inactiveClients = [], priorityTickets = [] } = alerts || {};

 const cls = stacked
    ? "grid grid-cols-1 gap-5 auto-rows-[minmax(0,1fr)]"
    : "grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3";
  return (
      <div className={cls}>
      <AlertCard
        className="h-full"                           // <= s’étire dans la ligne
        title="Clients en retard de paiement"
        tone="red"
        subtitle="Urgent"
        count={latePayments.length}
        ariaLabel="Alertes: retards de paiement"
        items={{
          icon: <MdOutlinePayment className="h-7 w-7 text-red-600" />,
          rows: latePayments.map(c => ({ left: c.name, right: `${c.days} j · ${c.amount}` })),
        }}
      />
      <AlertCard
        className="h-full"
        title="Clients inactifs"
        tone="amber"
        subtitle="Surveiller"
        count={inactiveClients.length}
        ariaLabel="Alertes: clients inactifs"
        items={{
          icon: <IoPauseCircleOutline className="h-7 w-7 text-amber-600" />,
          rows: inactiveClients.map(c => ({ left: c.name, right: `${c.days} j` })),
        }}
      />
      <AlertCard
        className="h-full"
        title="Tickets support prioritaires"
        tone="indigo"
        subtitle="Haute prio"
        count={priorityTickets.length}
        ariaLabel="Alertes: tickets prioritaires"
        items={{
          icon: <MdOutlineSupportAgent className="h-7 w-7 text-indigo-600" />,
          rows: priorityTickets.map(t => ({ left: `${t.id} • ${t.client}`, right: t.age })),
        }}
      />
    </div>
  );
}

