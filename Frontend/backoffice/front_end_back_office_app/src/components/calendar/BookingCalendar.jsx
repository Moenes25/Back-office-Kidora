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

  // Lundi=0 … Dimanche=6
  const startIdx = (first.getDay() + 6) % 7;
  const daysInMonth = last.getDate();

  const cells = [];
  for (let i = 0; i < startIdx; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(current.getFullYear(), current.getMonth(), d));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

/**
 * BookingCalendar
 * props:
 *  - availability: { 'YYYY-MM-DD': ['09:00','10:00', ...] }
 *  - markedCounts?: { 'YYYY-MM-DD': number }  // NB: nb de RDV existants par jour
 *  - minDate?: Date
 *  - maxMonths?: number
 *  - onConfirm?: ({ dateISO }) => void        // clic sur “Planifier ici”
 *  - onDayClick?: ({ dateISO, hasAppt }) => void // clic direct sur la case
 */
export default function BookingCalendar({
  availability = {},
  markedCounts = {},
  minDate = new Date(),
  maxMonths = 6,
  onConfirm,
  onDayClick,
  onAddSlots,
}) {
  const [cursor, setCursor] = useState(startOfMonth(minDate));
  const [selectedISO, setSelectedISO] = useState(null);

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
    <div className="rounded-2xl border border-black/10 bg-white p-4   shadow-[0_30px_90px_rgba(0,0,0,0.4)]
  hover:shadow-[0_36px_110px_rgba(0,0,0,0.45)] transition-shadow">
      {/* header */}
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-base font-extrabold capitalize">{monthLabel}</h4>
        <div className="flex items-center gap-2">
          <button
            className="h-8 w-8 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-40"
            onClick={() => setCursor(addMonths(cursor, -1))}
            disabled={!canPrev}
          >
            ‹
          </button>
          <button
            className="h-8 w-8 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-40"
            onClick={() => setCursor(addMonths(cursor, 1))}
            disabled={!canNext}
          >
            ›
          </button>
        </div>
      </div>

      {/* weekdays */}
      <div className="grid grid-cols-7 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
        {["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"].map((d) => (
          <div key={d} className="px-2 py-1 text-center">{d}</div>
        ))}
      </div>

      {/* days */}
      <div className="grid grid-cols-7 gap-1">
        {matrix.map((d, i) => {
          if (!d) return <div key={i} className="h-12 rounded-xl" />;

          const iso = toISO(d);
          const disabled = isDisabled(d);
          const selected = selectedISO === iso;
          const hasAppt = (markedCounts[iso] || 0) > 0;
          const hasAvail = (availability[iso]?.length || 0) > 0;

      
let classes =
  "relative h-12 rounded-xl border px-2 text-sm font-semibold transition-all duration-150 " +
  (disabled
    ? "border-transparent text-gray-300 cursor-not-allowed"
    : "border-gray-200 hover:border-sky-300 hover:bg-sky-50 hover:shadow-sm active:scale-[.98]");

// jour occupé -> bleu ciel + halo fin
if (!disabled && hasAppt)
  classes += " bg-sky-100/80 text-sky-900 border-sky-300 shadow-[0_0_0_2px_rgba(14,165,233,.08)]";

// jour sélectionné -> glow
if (selected)
  classes += " ring-2 ring-sky-400 ring-offset-1 ring-offset-white";


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
              <span>{d.getDate()}</span>

              {/* pastille: dispo ou nb rdv */}
              {(hasAppt || hasAvail) && (
                <span
                  className={[
                    "absolute bottom-1 right-1 rounded-full px-1.5 text-[10px] font-bold",
                    hasAppt
                      ? (selected ? "bg-sky-500/20 text-sky-800" : "bg-sky-100 text-sky-700 ring-1 ring-sky-200")
                      : (selected ? "bg-white/20 text-white" : "bg-emerald-100 text-emerald-700"),
                  ].join(" ")}
                >
                  {hasAppt ? markedCounts[iso] : availability[iso].length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* footer */}
      <div className="mt-3 flex items-center justify-between">
        <div className="text-xs text-gray-500">
          {selectedISO
            ? `${slotsForSelected.length} créneau(x) le ${new Date(selectedISO).toLocaleDateString("fr-FR")}`
            : "Sélectionnez une date."}
        </div>
        <div className="flex items-center gap-2">
<button
  className="relative overflow-hidden rounded-xl border px-3 py-1.5 text-sm font-semibold hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-300"
  onClick={() => {
  setSelectedISO(null);
  setCursor(startOfMonth(minDate));
}}

  onMouseDown={(e) => {
    const r = document.createElement('span');
    const d = Math.max(e.currentTarget.clientWidth, e.currentTarget.clientHeight);
    r.style.width = r.style.height = d + 'px';
    r.style.left = e.nativeEvent.offsetX - d/2 + 'px';
    r.style.top  = e.nativeEvent.offsetY - d/2 + 'px';
    r.className = "pointer-events-none absolute rounded-full bg-black/10 animate-ripple";
    e.currentTarget.appendChild(r);
    r.addEventListener('animationend', () => r.remove());
  }}
>
  Réinitialiser
</button>


<style>{`
  @keyframes ripple { to { transform: scale(2.5); opacity: 0 } }
  .animate-ripple { animation: ripple .45s ease-out }
`}</style>

          <button
             disabled={!selectedISO}
              onClick={() => onAddSlots?.({ dateISO: selectedISO })}
               className={
                 "rounded-xl px-3 py-1.5 text-sm font-semibold border transition-all " +
                  (selectedISO
                        ? "border-sky-500 text-sky-700 hover:bg-sky-50"
                          : "border-gray-200 text-gray-400 cursor-not-allowed")
                           }

                           >
                             Ajouter horaires
         </button>
          <button
            disabled={!selectedISO}
            onClick={() => onConfirm?.({ dateISO: selectedISO })}
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
    </div>
  );
}
