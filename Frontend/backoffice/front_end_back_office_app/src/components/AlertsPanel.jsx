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
function AlertCard({
  title,
  tone = "red",
  subtitle,
  count,
  items,
  ariaLabel,
  href,
  onViewAll,
  compact = false,
  className = "",
}) {
  const { ref, onMove, onLeave } = useTilt();
  const [pageIndex, setPageIndex] = React.useState(0);
  const rows = items?.rows || [];
  const itemsPerPage = 3;
  const pageCount = Math.ceil(rows.length / itemsPerPage) || 1;
  const currentItems = rows.slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage);

  const toneMap = {
    red:    { header: "bg-red-600",    text: "text-red-800",    chip: "bg-red-50 text-red-700 ring-1 ring-red-200",    accent: "#ef4444",  },
    amber:  { header: "bg-amber-500",  text: "text-amber-800",  chip: "bg-amber-50 text-amber-700 ring-1 ring-amber-200", accent: "#f59e0b" },
    indigo: { header: "bg-[#3b5edb]",  text: "text-indigo-800", chip: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200", accent: "#6366f1" },
  };
  const t = toneMap[tone] ?? toneMap.red;

  const Wrapper = href ? "a" : "article";
  const wrapperProps = href ? { href, rel: "noreferrer", target: "_self" } : { role: "region", "aria-label": ariaLabel || title };

  // Icône header : badge circulaire lisible
  const headerIcon = (
    <span className="inline-grid h-8 w-8 place-items-center rounded-full bg-white/20 ring-1 ring-white/30 shadow-sm">
      {/* on force la taille/couleur de l’icône fournie */}
      {React.cloneElement(items?.icon ?? <span />, { className: "h-5 w-5 text-white opacity-95" })}
    </span>
  );

  return (
    <Wrapper
      {...wrapperProps}
      tabIndex={0}
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={[
        "relative overflow-hidden rounded-3xl bg-white/90 dark:bg-navy-800 backdrop-blur-xl",
         "border border-black/5 dark:border-white/10",
        "transform-gpu transition-transform duration-300 [transform-style:preserve-3d] perspective-[1200px]",
        "hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-black/10",
        className,
      ].join(" ")}
    >
      {/* ===== Header style SectionCard ===== */}
      <div className={["flex items-center justify-between gap-3 px-4 py-3 text-white", t.header].join(" ")}>
        <span className="flex items-center gap-3">
          {headerIcon}
          <span className="text-sm font-semibold">{title}</span>
        </span>

        {subtitle && (
          <span className={["inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold", "bg-white/15 ring-1 ring-white/20"].join(" ")}>
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {subtitle}
          </span>
        )}
      </div>

      {/* ===== Body : on NE répète plus icône + titre ===== */}
      <div className="p-3 bg-transparent dark:bg-transparent dark:text-white">
        {/* Bloc valeur */}
     
<div className="flex justify-center mt-2 dark:text-white">
  <div className="text-center">
    <p className={`${compact ? "text-xl" : "text-3xl"} font-black leading-none`}>
      {count}
    </p>
    <p className="mt-1 text-[11px] uppercase tracking-wide text-gray-400">
      Total
    </p>
  </div>
</div>


        {/* Séparateur */}
        <div className="mt-2 h-px w-full bg-gradient-to-r from-black/0 via-black/10 to-black/0" />

        {/* Liste */}
        <ul className="mt-3 space-y-2 text-sm leading-5 ">
          {currentItems.map((row, i) => (
            <li key={i} className="flex items-center justify-between">
              <span className="flex min-w-0 items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: t.accent }} />
                <span className="truncate">{row.left}</span>
              </span>
              <span className={["ml-2 whitespace-nowrap text-xs font-semibold", t.text].join(" ")}>{row.right}</span>
            </li>
          ))}
        </ul>

        {/* Pagination si besoin */}
        {pageCount > 1 && (
          <div className="mt-4 flex justify-center gap-2">
            {Array.from({ length: pageCount }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPageIndex(i)}
                className={["h-3 w-3 rounded-full border-2 transition", i === pageIndex ? "bg-gray-800 border-gray-800" : "bg-transparent border-gray/800"].join(" ")}
                aria-label={`Page ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
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

