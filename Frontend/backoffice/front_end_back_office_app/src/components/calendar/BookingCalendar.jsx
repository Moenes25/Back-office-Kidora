import React, { useMemo, useState } from "react";

// utils
const pad = (n) => String(n).padStart(2, "0");
const toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const addMonths = (date, n) => { const d = new Date(date); d.setMonth(d.getMonth() + n); return d; };
const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
const endOfMonth   = (d) => new Date(d.getFullYear(), d.getMonth() + 1, 0);

function getMonthMatrix(current) {
  const first = startOfMonth(current);
  const last  = endOfMonth(current);
  const startIdx = (first.getDay() + 6) % 7; // Lundi=0
  const daysInMonth = last.getDate();
  const cells = [];
  for (let i = 0; i < startIdx; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(current.getFullYear(), current.getMonth(), d));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

// Palette par "accent"
const ACCENTS = {
  sky:     { base: "text-sky-700",     chip: "bg-sky-100 text-sky-700 ring-sky-200",     ring: "ring-sky-400",    hover: "hover:bg-sky-50",     bgHalo: "#0ea5e91a" },
  indigo:  { base: "text-indigo-700",  chip: "bg-indigo-100 text-indigo-700 ring-indigo-200", ring: "ring-indigo-400", hover: "hover:bg-indigo-50",  bgHalo: "#4f46e51a" },
  emerald: { base: "text-emerald-700", chip: "bg-emerald-100 text-emerald-700 ring-emerald-200", ring: "ring-emerald-400", hover: "hover:bg-emerald-50", bgHalo: "#10b9811a" },
  amber:   { base: "text-amber-700",   chip: "bg-amber-100 text-amber-700 ring-amber-200",   ring: "ring-amber-400",  hover: "hover:bg-amber-50",   bgHalo: "#f59e0b1a" },
};

// props ajoutées (optionnelles):
// - accent: "sky" | "indigo" | "emerald" | "amber"
// - cellSize: nombre en px (taille des cases)
export default function BookingCalendar({
  availability = {},
  markedCounts = {},
  minDate = new Date(),
  maxMonths = 6,
  onConfirm,
  onDayClick,
  onAddSlots,
  accent = "sky",
  cellSize = 52,
}) {
  const theme = ACCENTS[accent] ?? ACCENTS.sky;
  const [cursor, setCursor] = useState(startOfMonth(minDate));
  const [selectedISO, setSelectedISO] = useState(null);
  const todayISO = toISO(new Date());

  const matrix = useMemo(() => getMonthMatrix(cursor), [cursor]);
  const canPrev = cursor > startOfMonth(minDate);
  const canNext = cursor < startOfMonth(addMonths(minDate, maxMonths));
  const monthLabel = cursor.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });

  const isDisabled = (d) => {
    if (!d) return true;
    const sameMonth = d.getMonth() === cursor.getMonth();
    const min = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
    return !sameMonth || +d < +min;
  };

  const slotsForSelected = selectedISO ? (availability[selectedISO] || []) : [];

  return (
    <div
      className="
        rounded-3xl border border-black/10 bg-white/90 p-4
        shadow-[0_10px_25px_-10px_rgba(0,0,0,0.25)]
        backdrop-blur transition-shadow
        hover:shadow-[0_16px_40px_-12px_rgba(0,0,0,0.3)]
      "
      style={{ ["--cell"]: `${cellSize}px` }}
    >
      {/* Header sticky */}
      <div className="sticky -top-4 z-10 -mx-4 mb-3 rounded-t-3xl bg-gradient-to-b from-white/80 to-white/30 px-4 pt-3 pb-2 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <h4 className="text-base font-extrabold capitalize">{monthLabel}</h4>
          <div className="flex items-center gap-2">
            <button
              className="h-9 w-9 rounded-full border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-40 pressable"
              onClick={() => setCursor(addMonths(cursor, -1))}
              disabled={!canPrev}
              aria-label="Mois précédent"
            >
              ‹
            </button>
            <button
              className="h-9 w-9 rounded-full border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-40 pressable"
              onClick={() => setCursor(addMonths(cursor, 1))}
              disabled={!canNext}
              aria-label="Mois suivant"
            >
              ›
            </button>
          </div>
        </div>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
        {["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"].map((d) => (
          <div key={d} className="px-2 py-1 text-center">{d}</div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-1">
        {matrix.map((d, i) => {
          if (!d) return <div key={i} className="h-[var(--cell)] rounded-xl" />;

          const iso = toISO(d);
          const disabled = isDisabled(d);
          const selected = selectedISO === iso;
          const hasAppt = (markedCounts[iso] || 0) > 0;
          const hasAvail = (availability[iso]?.length || 0) > 0;
          const isToday = iso === todayISO;
          const weekend = [6, 0].includes(d.getDay()); // sam(6) dim(0)

          let classes =
            "relative grid place-items-center h-[var(--cell)] rounded-xl border text-sm font-semibold transition-all duration-150 " +
            (disabled
              ? "border-transparent text-gray-300 cursor-not-allowed"
              : `border-gray-200 ${theme.hover} hover:border-gray-300 active:scale-[.985]`);

          // weekend tint
          if (!disabled && weekend) classes += " bg-gray-50/60";

          // jour occupé -> teinte + fine halo
          if (!disabled && hasAppt)
            classes += " bg-sky-50/70 text-sky-900";

          // sélection -> anneau + glow
          if (selected)
            classes += ` ring-2 ${theme.ring} ring-offset-1 ring-offset-white shadow-sm`;

          // today -> petit marqueur coin haut gauche
          const todayMark = isToday && !selected;

          return (
            <button
              key={iso}
              disabled={disabled}
              onClick={() => {
                setSelectedISO(iso);
                onDayClick?.({ dateISO: iso, hasAppt });
              }}
              className={classes}
            >
              <span className="pointer-events-none select-none">{d.getDate()}</span>

              {/* marqueur Today */}
              {todayMark && (
                <span className="absolute left-1 top-1 h-1.5 w-1.5 rounded-full bg-rose-500" />
              )}

              {/* halo subtil au hover */}
              <span
                className="pointer-events-none absolute -inset-3 -z-10 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-40"
                style={{ background: theme.bgHalo }}
              />

              {/* Pastille: dispo (vert) ou nb rdv (accent) */}
              {(hasAppt || hasAvail) && (
                <span
                  className={[
                    "absolute bottom-1 right-1 rounded-full px-1.5 text-[10px] font-bold ring-1",
                    hasAppt ? theme.chip : "bg-emerald-100 text-emerald-700 ring-emerald-200",
                    selected ? "opacity-90" : "opacity-100",
                  ].join(" ")}
                >
                  {hasAppt ? markedCounts[iso] : availability[iso].length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between">
        <div className="text-xs text-gray-500">
          {selectedISO
            ? `${slotsForSelected.length} créneau(x) le ${new Date(selectedISO).toLocaleDateString("fr-FR")}`
            : "Sélectionnez une date."}
        </div>

        <div className="flex items-center gap-2">
          {/* reset + ripple */}
          <button
            className="relative overflow-hidden rounded-xl border px-3 py-1.5 text-sm font-semibold hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
            onClick={() => { setSelectedISO(null); setCursor(startOfMonth(minDate)); }}
            onMouseDown={(e) => {
              const r = document.createElement("span");
              const d = Math.max(e.currentTarget.clientWidth, e.currentTarget.clientHeight);
              r.style.width = r.style.height = d + "px";
              r.style.left = e.nativeEvent.offsetX - d/2 + "px";
              r.style.top  = e.nativeEvent.offsetY - d/2 + "px";
              r.className = "pointer-events-none absolute rounded-full bg-black/10 animate-ripple";
              e.currentTarget.appendChild(r);
              r.addEventListener("animationend", () => r.remove());
            }}
          >
            Réinitialiser
          </button>

          <button
            disabled={!selectedISO}
            onClick={() => selectedISO && onAddSlots?.({ dateISO: selectedISO })}
            className={
              "rounded-xl px-3 py-1.5 text-sm font-semibold border transition-all " +
              (selectedISO
                ? `border-sky-500 ${theme.base} hover:bg-sky-50`
                : "border-gray-200 text-gray-400 cursor-not-allowed")
            }
          >
            Ajouter horaires
          </button>

          <button
            disabled={!selectedISO}
            onClick={() => selectedISO && onConfirm?.({ dateISO: selectedISO })}
            className={
              "rounded-xl px-3 py-1.5 text-sm font-bold transition-all " +
              (selectedISO ? "bg-sky-500 text-white hover:brightness-110"
                           : "bg-gray-200 text-gray-500 cursor-not-allowed")
            }
          >
            Planifier ici
          </button>
        </div>
      </div>

      {/* keyframes pour ripple + helpers */}
      <style>{`
        @keyframes ripple { to { transform: scale(2.6); opacity: 0 } }
        .animate-ripple { animation: ripple .45s ease-out }
        .pressable { transition: transform .18s ease, box-shadow .24s ease, background .24s ease }
        .pressable:active { transform: translateY(1px) scale(.995) }
        @media (prefers-reduced-motion: reduce) {
          .pressable { transition: none !important }
          .animate-ripple { animation: none !important }
        }
      `}</style>
    </div>
  );
}
