// src/components/AlertsPanel.jsx
import React, { useRef } from "react";
import { MdOutlinePayment, MdOutlineSupportAgent } from "react-icons/md";
import { IoTimeSharp, IoPauseCircleOutline } from "react-icons/io5";

/* Tilt 3D subtil (ne cache jamais le contenu) */
function useTilt() {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const px = (x / r.width) * 2 - 1;
    const py = (y / r.height) * 2 - 1;
    el.style.setProperty("--rx", `${(-py * 6).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(px * 9).toFixed(2)}deg`);
    el.style.setProperty("--gx", `${x}px`);
    el.style.setProperty("--gy", `${y}px`);
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", `0deg`);
    el.style.setProperty("--ry", `0deg`);
    el.style.setProperty("--gx", `-1000px`);
    el.style.setProperty("--gy", `-1000px`);
  };
  return { ref, onMove, onLeave };
}

function AlertCard({ title, tone = "red", subtitle, count, items, ariaLabel }) {
  const { ref, onMove, onLeave } = useTilt();

  const toneMap = {
    red: {
      side: "bg-gradient-to-b from-red-500 to-rose-600",
      text: "text-red-800",
      chip: "bg-red-50 text-red-700 border-red-200",
      icon: "text-red-600",
      glow: "rgba(239,68,68,0.18)",
      ring: "focus:ring-red-300",
    },
    amber: {
      side: "bg-gradient-to-b from-amber-500 to-orange-500",
      text: "text-amber-800",
      chip: "bg-amber-50 text-amber-800 border-amber-200",
      icon: "text-amber-600",
      glow: "rgba(245,158,11,0.18)",
      ring: "focus:ring-amber-300",
    },
    indigo: {
      side: "bg-gradient-to-b from-indigo-500 to-violet-500",
      text: "text-indigo-800",
      chip: "bg-indigo-50 text-indigo-700 border-indigo-200",
      icon: "text-indigo-600",
      glow: "rgba(99,102,241,0.18)",
      ring: "focus:ring-indigo-300",
    },
  };
  const t = toneMap[tone] ?? toneMap.red;

  return (
    <article
      role="region"
      aria-label={ariaLabel || title}
      tabIndex={0}
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={[
        "relative grid grid-cols-[8px,1fr] overflow-hidden rounded-2xl",
        "bg-white/90 dark:bg-white/5 backdrop-blur-xl",
        "border border-black/5 shadow-sm hover:shadow-xl",
        "transform-gpu will-change-transform transition-transform duration-300",
        "perspective-[1200px] [transform-style:preserve-3d]",
        "[transform:rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))] hover:scale-[1.01]",
        "focus:outline-none", t.ring,
      ].join(" ")}
      style={{ boxShadow: `0 6px 22px ${t.glow}` }}
    >
      {/* barre de sévérité à gauche */}
      <div className={`${t.side}`} />

      {/* glow qui suit la souris (très léger, pas de rayures) */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none rounded-2xl opacity-0 hover:opacity-100 transition-opacity"
        style={{
          background:
            "radial-gradient(180px 140px at var(--gx,-1000px) var(--gy,-1000px), rgba(255,255,255,0.55), transparent 60%)",
        }}
      />

      {/* contenu */}
      <div className="relative p-5">
        {/* badge statut en haut droite */}
        <div className="absolute right-4 top-4 [transform:translateZ(40px)] pl-4">
          <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${t.chip}`}>
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {subtitle}
          </span>
        </div>

        {/* header vertical : Titre + Count en dessous */}
        <div className="[transform:translateZ(60px)] flex items-start gap-3 pr-4">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/80 dark:bg-white/10 border border-black/5 shadow transition-transform duration-300 group-hover:-translate-y-0.5">
            <div className="transition-transform duration-500 group-hover:-rotate-3">
              {items.icon}
            </div>
          </div>

          <div className="min-w-0">
            <h3 className={`text-base font-extrabold leading-5 ${t.text}`}>{title}</h3>
            <p className="mt-1 text-2xl font-black leading-none">{count}</p>
            <p className="mt-1 text-xs text-gray-500">Total</p>
          </div>
        </div>

        {/* séparateur */}
        <div className="mt-4 h-px w-full bg-gradient-to-r from-black/0 via-black/10 to-black/0 [transform:translateZ(30px)]" />

        {/* liste (toujours visible) */}
        <ul className="[transform:translateZ(40px)] mt-3 space-y-2 text-sm leading-5">
          {items.rows.map((row, i) => (
            <li key={i} className="flex items-center justify-between">
              <span className="flex min-w-0 items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-black/30" />
                <span className="truncate">{row.left}</span>
              </span>
              <span className={`ml-2 whitespace-nowrap text-xs font-semibold ${t.text}`}>
                {row.right}
              </span>
            </li>
          ))}
        </ul>

        {/* footer (hover → légère translation) */}
        <div className="mt-4 flex justify-end [transform:translateZ(25px)]">
          <button
            type="button"
            className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-black/10 hover:translate-y-[-1px] hover:shadow-sm transition"
          >
            Voir tout
          </button>
        </div>
      </div>
    </article>
  );
}

/* panneau */
export default function AlertsPanel({ alerts }) {
  const { latePayments = [], inactiveClients = [], priorityTickets = [] } = alerts || {};

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      <AlertCard
        title="Clients en retard de paiement"
        tone="red"
        subtitle="Urgent"
        count={latePayments.length}
        ariaLabel="Alertes: retards de paiement"
        items={{
         icon: <MdOutlinePayment className="h-7 w-7 text-red-600" />,
          rows: latePayments.slice(0, 3).map((c) => ({
            left: c.name,
            right: `${c.days} j · ${c.amount}`,
          })),
        }}
      />
      <AlertCard
        title="Clients inactifs"
        tone="amber"
        subtitle="Surveiller"
        count={inactiveClients.length}
        ariaLabel="Alertes: clients inactifs"
        items={{
          icon: <IoPauseCircleOutline className="h-7 w-7 text-amber-600" />,
          rows: inactiveClients.slice(0, 3).map((c) => ({
            left: c.name,
            right: `${c.days} j`,
          })),
        }}
      />
      <AlertCard
        title="Tickets support prioritaires"
        tone="indigo"
        subtitle="Haute prio"
        count={priorityTickets.length}
        ariaLabel="Alertes: tickets prioritaires"
        items={{
           icon: <MdOutlineSupportAgent className="h-7 w-7 text-indigo-600" />,
          rows: priorityTickets.slice(0, 3).map((t) => ({
            left: `${t.id} • ${t.client}`,
            right: t.age,
          })),
        }}
      />
    </div>
  );
}
