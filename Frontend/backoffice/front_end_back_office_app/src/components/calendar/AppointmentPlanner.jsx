import React, { useEffect, useMemo, useState, useCallback } from "react";
import BookingCalendar from "./BookingCalendar";
import { FiX, FiEdit2, FiTrash2, FiChevronDown } from "react-icons/fi";
import Swal from "sweetalert2";


/* ---------- Modal générique ---------- */


function Modal({ open, onClose, children, title, size = "xl" }) {
  if (!open) return null;

  const sizes = {
    sm: "max-w-md",   // ~28rem
    md: "max-w-lg",   // ~32rem
    lg: "max-w-2xl",  // ~42rem
    xl: "max-w-3xl",  // ~48rem
    full: "w-[min(90vw,1000px)]", // fluide jusqu'à 1000px
  };

  return (
    <div
      className="absolute inset-0 z-50 grid place-items-center p-4"
      style={{ perspective: "1200px" }} // profondeur 3D
    >
      {/* Backdrop avec vignette douce */}
      <button
        onClick={onClose}
        aria-label="Fermer le modal"
        className="absolute inset-0 animate-fade-in"
        style={{
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          background:
            "radial-gradient(80% 120% at 50% 20%, rgba(0,0,0,.38), rgba(0,0,0,.42))",
        }}
      />

      {/* Panel */}
      <div
        className={`
          relative w-full ${sizes[size]}
          rounded-3xl border border-black/10 bg-white/95
          ring-1 ring-black/5 overflow-hidden flex flex-col
          animate-pop-in will-change-transform
        `}
        // Ombres 3D + léger tilt d'entrée
        style={{
          transformStyle: "preserve-3d",
          boxShadow:
            "0 28px 70px -24px rgba(2,6,23,.35), 0 16px 30px -20px rgba(2,6,23,.28), inset 0 -1px 0 rgba(2,6,23,.04)",
        }}
        onMouseMove={(e) => {
          // micro-parallaxe (safe, désactivée si prefers-reduced-motion)
          const el = e.currentTarget;
          if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
          const rect = el.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;
          el.style.transform = `rotateX(${(-y * 2).toFixed(2)}deg) rotateY(${(x * 2).toFixed(2)}deg) translateZ(0)`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateZ(0)";
        }}
      >
        {/* highlight supérieur */}
        <span className="pointer-events-none absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-white to-transparent opacity-80" />
        {/* arête basse 3D */}
        <span
          className="pointer-events-none absolute inset-x-4 bottom-0 h-3 rounded-b-3xl"
          style={{
            background: "linear-gradient(to bottom, rgba(0,0,0,.05), rgba(0,0,0,.12))",
            filter: "blur(8px)",
            opacity: 0.6,
          }}
        />

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b bg-white/70 backdrop-blur-sm">
          <h3 className="text-base font-extrabold tracking-tight">{title}</h3>
          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-lg text-gray-600 hover:bg-gray-100 active:scale-95 transition"
          >
            <FiX />
          </button>
        </div>

        {/* Body (scrollable) */}
        <div className="p-5 overflow-y-auto max-h-[72vh]">
          {children}
        </div>
      </div>

      {/* Animations / safety motion */}
      <style>{`
        @keyframes pop-in {
          0%   { opacity: 0; transform: translateY(14px) scale(.965) rotateX(2deg); }
          60%  { opacity: 1; transform: translateY(-2px) scale(1.005) rotateX(0); }
          100% { opacity: 1; transform: translateY(0) scale(1) rotateX(0); }
        }
        @keyframes fade-in { from { opacity: 0 } to { opacity: 1 } }
        .animate-pop-in { animation: pop-in .28s cubic-bezier(.2,0,0,1) both }
        .animate-fade-in { animation: fade-in .22s linear both }
        @media (prefers-reduced-motion: reduce) {
          .animate-pop-in { animation: none !important }
          .animate-fade-in { animation: none !important }
        }
      `}</style>
    </div>
  );
}




function ApptUIFX() {
  return (
    <style>{`
      @keyframes card-enter {
        0% { opacity: 0; transform: translateY(6px) scale(.98) }
        70%{ opacity: 1; transform: translateY(-2px) scale(1.01) }
        100%{ opacity: 1; transform: translateY(0) scale(1) }
      }
      @keyframes pulse-soft {
        0%,100% { transform: scale(1) }
        50%     { transform: scale(1.02) }
      }
      .animate-card-enter { animation: card-enter .24s cubic-bezier(.2,0,0,1) both }
      .pressable { transition: transform .18s ease, box-shadow .24s ease, background .24s ease }
      .pressable:active { transform: translateY(1px) scale(.998) }
      @media (prefers-reduced-motion: reduce) {
        .animate-card-enter { animation: none !important }
        .pressable { transition: none !important }
      }
    `}</style>
  );
}



/* ---------- annuaire d’exemple ---------- */
const DIRECTORY = {
  garderies: [
    { id: "g1", name: "Garderie Soleil" },
    { id: "g2", name: "Nounours" },
    { id: "g3", name: "Les Lutins" },
  ],
  creches: [
    { id: "c1", name: "Crèche Arc-en-ciel" },
    { id: "c2", name: "BabyLand" },
    { id: "c3", name: "Les Petits Anges" },
  ],
  ecoles: [
    { id: "e1", name: "École Horizon" },
    { id: "e2", name: "École Les Sources" },
  ],
};
const TYPE_LABEL = { garderies: "Garderie", creches: "Crèche", ecoles: "École" };



// Thème par type pour DayModal (couleurs + ombres 3D)
const DAY_THEME = {
  ecoles: {
    accent: "#10b981",
    gradFrom: "from-emerald-50",
    text: "text-emerald-700",
    ring: "ring-emerald-300",
    chip: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    shadow: "0 8px 18px -10px rgba(16,185,129,.35), 0 18px 42px -18px rgba(16,185,129,.25)",
    halo: "#10b98122",
  },
  creches: {
    accent: "#6366f1",
    gradFrom: "from-indigo-50",
    text: "text-indigo-700",
    ring: "ring-indigo-300",
    chip: "bg-indigo-50 text-indigo-700 ring-indigo-200",
    shadow: "0 8px 18px -10px rgba(99,102,241,.35), 0 18px 42px -18px rgba(99,102,241,.25)",
    halo: "#6366f122",
  },
  garderies: {
    accent: "#f59e0b",
    gradFrom: "from-amber-50",
    text: "text-amber-700",
    ring: "ring-amber-300",
    chip: "bg-amber-50 text-amber-700 ring-amber-200",
    shadow: "0 8px 18px -10px rgba(245,158,11,.35), 0 18px 42px -18px rgba(245,158,11,.25)",
    halo: "#f59e0b22",
  },
};


// Palette/thème par type (utilisé dans AppointmentCard)
const TYPE_THEME = {
  ecoles: {
    accent: "#10b981",
    chipBg: "bg-emerald-50",
    chipText: "text-emerald-700",
    chipRing: "ring-emerald-200",
  },
  creches: {
    accent: "#6366f1",
    chipBg: "bg-indigo-50",
    chipText: "text-indigo-700",
    chipRing: "ring-indigo-200",
  },
  garderies: {
    accent: "#f59e0b",
    chipBg: "bg-amber-50",
    chipText: "text-amber-700",
    chipRing: "ring-amber-200",
  },
};



/* ---------- Formulaire RDV ---------- */
function AppointmentForm({ dateISO, slots, initial = null, onSubmit, onCancel }) {
  const [type, setType] = useState(initial?.type || "garderies");
  const [placeId, setPlaceId] = useState(initial?.placeId || "");
  const [time, setTime] = useState(initial?.time || "");
  const [subject, setSubject] = useState(initial?.subject || "");

  useEffect(() => {
    const first = DIRECTORY[type][0]?.id || "";
    setPlaceId((prev) => (DIRECTORY[type].some((p) => p.id === prev) ? prev : first));
  }, [type]);

  const canSave = dateISO && time && placeId && subject.trim().length > 1;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!canSave) return;
        onSubmit({ type, placeId, time, subject: subject.trim() });
      }}
      className="grid gap-4"
    >
      <div className="text-sm text-gray-500">
        Date :{" "}
        <span className="font-semibold text-gray-900">
          {new Date(dateISO).toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "2-digit" })}
        </span>
      </div>

      <label className="text-sm font-semibold">Type d’établissement</label>
      <div className="relative">
        <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <select
          className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-3 py-2 pr-8 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-400"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="garderies">Garderie</option>
          <option value="creches">Crèche</option>
          <option value="ecoles">École</option>
        </select>
      </div>

      <label className="text-sm font-semibold">{TYPE_LABEL[type]}</label>
      <div className="relative">
        <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <select
          className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-3 py-2 pr-8 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-400"
          value={placeId}
          onChange={(e) => setPlaceId(e.target.value)}
        >
          {DIRECTORY[type].map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <label className="text-sm font-semibold">Créneau disponible</label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {slots.length === 0 ? (
          <div className="col-span-full text-xs text-gray-500">Aucun créneau pour cette date.</div>
        ) : (
          slots.map((s) => (
            <button
              type="button"
              key={s}
              onClick={() => setTime(s)}
              className={[
                "rounded-xl border px-3 py-2 text-sm font-semibold transition-all",
                time === s ? "bg-sky-600 text-white border-sky-600 shadow" : "bg-white hover:bg-sky-50 border-gray-200 text-gray-800",
              ].join(" ")}
            >
              {s}
            </button>
          ))
        )}
      </div>

      <label className="text-sm font-semibold">Sujet du rendez-vous</label>
      <input
        type="text"
        placeholder="Ex. Démonstration, réunion parents..."
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
      />

      <div className="mt-2 flex items-center justify-end gap-2">
        <button type="button" onClick={onCancel} className="rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-gray-50">
          Annuler
        </button>
        <button
          type="submit"
          disabled={!canSave}
          className={["rounded-xl px-4 py-2 text-sm font-bold transition-all", canSave ? "bg-sky-600 text-white hover:brightness-110 shadow" : "bg-gray-200 text-gray-500"].join(" ")}
        >
          Confirmer
        </button>
      </div>
    </form>
  );
}

/* ---------- Petite carte RDV ---------- */
function AvatarFromName({ name }) {
  const initials = name
    .split(" ")
    .map((w) => w[0]?.toUpperCase())
    .slice(0, 2)
    .join("");
  return (
    <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-gray-50 to-white text-[11px] font-extrabold text-gray-700 ring-1 ring-black/5 shadow-sm">
      {initials || "?"}
    </div>
  );
}

function AppointmentCard({ appt, onEdit, onDelete }) {
  const { id, dateISO, time, type, placeId, subject } = appt;
  const place = DIRECTORY[type].find((p) => p.id === placeId)?.name || "Établissement";
  const theme = TYPE_THEME[type] ?? TYPE_THEME.ecoles;

  return (
    <div
      className="
        group relative overflow-hidden rounded-2xl border border-black/10 bg-white/90
        p-4 pressable animate-card-enter
        shadow-[0_4px_10px_rgba(0,0,0,0.06),0_20px_35px_-20px_rgba(0,0,0,0.2)]
        hover:shadow-[0_10px_20px_rgba(0,0,0,0.07),0_30px_55px_-25px_rgba(0,0,0,0.28)]
        ring-1 ring-black/5 backdrop-blur
      "
      style={{
        // petite lueur directionnelle sur hover, teinte selon le type
        boxShadow:
          "0 4px 10px rgba(0,0,0,.06), 0 20px 35px -20px rgba(0,0,0,.2)",
      }}
    >
      {/* barre d'accent à gauche */}
      <span
        className="absolute inset-y-0 left-0 w-1.5"
        style={{ background: theme.accent }}
      />

      {/* halo doux au survol */}
      <span
        className="pointer-events-none absolute -inset-8 -z-10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-40"
        style={{ background: `${theme.accent}22` }}
      />

      <div className="flex items-start gap-3">
        <AvatarFromName name={place} />
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-bold uppercase tracking-wide text-gray-500">
            {TYPE_LABEL[type]}
          </div>
          <div className="mt-0.5 truncate text-base font-bold text-gray-900">
            {place}
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
            <span className={`inline-flex items-center rounded-full px-2.5 py-1 font-semibold ring-1 ${theme.chipBg} ${theme.chipText} ${theme.chipRing}`}>
              {new Date(dateISO).toLocaleDateString("fr-FR")}
            </span>
            <span className={`inline-flex items-center rounded-full px-2.5 py-1 font-semibold ring-1 ${theme.chipBg} ${theme.chipText} ${theme.chipRing}`}>
              {time}
            </span>
          </div>

          {subject && (
            <div className="mt-2 line-clamp-2 text-sm text-gray-600">{subject}</div>
          )}
        </div>

        {/* actions */}
        <div className="flex items-center gap-1 self-start">
          <button
            onClick={() => onEdit(id)}
            className="grid h-8 w-8 place-items-center rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            aria-label="Modifier"
            title="Modifier"
          >
            <FiEdit2 />
          </button>
          <button
            onClick={() => onDelete(id)}
            className="grid h-8 w-8 place-items-center rounded-lg text-rose-600 hover:bg-rose-50"
            aria-label="Supprimer"
            title="Supprimer"
          >
            <FiTrash2 />
          </button>
        </div>
      </div>
    </div>
  );
}


/* ---------- Modal “Détail du jour” (clic sur case déjà occupée) ---------- */

function DayModal({ open, onClose, dateISO, items, onEdit, onDelete, onAdd }) {
  if (!open) return null;

  const dateObj = dateISO ? new Date(dateISO) : null;
  const labelLong = dateObj
    ? dateObj.toLocaleDateString("fr-FR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "2-digit",
      })
    : "";

  return (
    <Modal open={open} onClose={onClose} title={`Rendez–vous du ${labelLong}`}>
      {/* header décoratif fin */}
      <div className="mb-4">
        <div className="h-1 w-full rounded-full bg-gradient-to-r from-sky-300 via-indigo-300 to-emerald-300 opacity-70" />
      </div>

      {/* liste des RDV ou empty-state */}
      {(!items || items.length === 0) ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-300 bg-gray-50/60 p-8 text-center">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-white shadow">
            <span className="text-lg">📅</span>
          </div>
          <div className="text-sm text-gray-600">
            Aucun rendez-vous pour cette date.
          </div>
          <button
            onClick={onAdd}
            className="mt-1 rounded-xl bg-sky-600 px-4 py-2 text-sm font-bold text-white shadow hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-sky-300"
          >
            Ajouter un RDV
          </button>
        </div>
      ) : (
        <div className="grid gap-3">
          {items.map((a) => {
  const place =
    DIRECTORY[a.type].find((p) => p.id === a.placeId)?.name || "Établissement";
  const typeText = TYPE_LABEL[a.type];
  const t = DAY_THEME[a.type] || DAY_THEME.ecoles;

  return (
    <div
      key={a.id}
      className={`
        group relative overflow-hidden rounded-2xl border border-black/10 bg-white
        p-4 ring-1 ${t.ring}
      `}
      style={{
        // Ombres 3D colorées
        boxShadow: t.shadow,
      }}
    >
      {/* bande d’accent + halo subtil */}
      <span className="absolute inset-y-0 left-0 w-1.5" style={{ background: t.accent }} />
      <span
        className="pointer-events-none absolute -inset-10 -z-10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-40"
        style={{ background: t.halo }}
      />

      {/* arête 3D (bas) */}
      <span
        className="pointer-events-none absolute inset-x-2 bottom-0 h-[10px] rounded-b-2xl"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.05), rgba(0,0,0,0.12))",
          filter: "blur(6px)",
          opacity: 0.6,
        }}
      />

      {/* highlight supérieur très léger */}
      <span
        className={`pointer-events-none absolute inset-x-0 top-0 h-5 bg-gradient-to-b ${t.gradFrom} to-transparent opacity-80`}
      />

      <div className="flex items-start gap-3">
        {/* avatar initiales avec bord dégradé selon le type */}
        <div
          className={`
            grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${t.gradFrom} to-white
            text-xs font-extrabold ${t.text} ring-1 ring-black/5
          `}
        >
          {place
            .split(" ")
            .map((w) => w[0]?.toUpperCase())
            .slice(0, 2)
            .join("") || "?"}
        </div>

        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-gray-900">
            {a.subject || "Sans titre"}
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-600">
            <span className="text-gray-500">{typeText} · {place}</span>
            <span className={`rounded-full px-2 py-0.5 font-semibold ring-1 ${t.chip}`}>
              {a.time}
            </span>
          </div>
        </div>

        {/* actions */}
        <div className="flex items-center gap-1 self-start">
          <button
            onClick={() => onEdit(a.id)}
            className="grid h-8 w-8 place-items-center rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 active:scale-[.98]"
            aria-label="Modifier"
            title="Modifier"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M4 21h4l11-11a2.828 2.828 0 10-4-4L4 17v4z" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(a.id)}
            className="grid h-8 w-8 place-items-center rounded-lg text-rose-600 hover:bg-rose-50 active:scale-[.98]"
            aria-label="Supprimer"
            title="Supprimer"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M3 6h18M8 6v14a2 2 0 002 2h4a2 2 0 002-2V6M9 6V4a2 2 0 012-2h2a2 2 0 012 2v2" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
})}

        </div>
      )}

      {/* footer sticky */}
      <div className="sticky -mb-5 -mx-5 mt-5 flex items-center justify-end gap-2 rounded-b-2xl border-t border-black/10 bg-white/80 px-5 py-3 backdrop-blur-sm">
        <button
          onClick={onAdd}
          className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-bold text-white shadow hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-sky-300"
        >
          Ajouter un RDV
        </button>
        <button
          onClick={onClose}
          className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          Fermer
        </button>
      </div>

      {/* micro-animations */}
      <style>{`
        @media (prefers-reduced-motion:no-preference){
          .modal-card-enter{animation:modal-card .22s cubic-bezier(.2,0,0,1) both}
          @keyframes modal-card{0%{opacity:0;transform:translateY(6px) scale(.98)}70%{opacity:1;transform:translateY(-2px) scale(1.01)}100%{opacity:1;transform:translateY(0) scale(1)}}
        }
            @keyframes popCard{0%{opacity:0;transform:translateY(6px) scale(.98)}70%{opacity:1;transform:translateY(-2px) scale(1.01)}100%{opacity:1;transform:translateY(0) scale(1)}}
  .group{ animation: popCard .22s cubic-bezier(.2,0,0,1) both }
  .group:hover{ transform: translateY(-1px) }
  @media (prefers-reduced-motion: reduce){
    .group{ animation:none !important; transform:none !important }
  }
      `}</style>
    </Modal>
  );
}


/* ---------- Planner principal ---------- */
export default function AppointmentPlanner({ availability, minDate = new Date(), maxMonths = 6 }) {
  // RDV persistés
  const [appts, setAppts] = useState(() => {
    try { return JSON.parse(localStorage.getItem("kidora.appts") || "[]"); } catch { return []; }
  });
  useEffect(() => { localStorage.setItem("kidora.appts", JSON.stringify(appts)); }, [appts]);



 // === Disponibilités éditables localement ===
 const [avail, setAvail] = useState(() => ({ ...availability }));
 useEffect(() => { setAvail((prev) => ({ ...prev, ...availability })); }, [availability]);

 // état du modal "ajouter horaires"
 const [slotsOpen, setSlotsOpen] = useState(false);
 const [slotsDate, setSlotsDate] = useState(null);
 const [slotsDraft, setSlotsDraft] = useState([]); // tableau ["09:00", "10:30"]

  // Modals
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDate, setModalDate] = useState(null);
  const [modalSlots, setModalSlots] = useState([]);
  const [editId, setEditId] = useState(null);

  // Modal “jour”
  const [dayOpen, setDayOpen] = useState(false);
  const [dayISO, setDayISO] = useState(null);

  // RDV par date (pour marquage bleu & panneau agenda)
  const byDate = useMemo(() => {
    const map = {};
    for (const a of appts) {
      (map[a.dateISO] ||= []).push(a);
    }
    return map;
  }, [appts]);
  const markedCounts = useMemo(() => {
    const m = {};
    Object.keys(byDate).forEach((k) => (m[k] = byDate[k].length));
    return m;
  }, [byDate]);

  // callbacks calendrier
  const openForDate = ({ dateISO }) => {
    setEditId(null);
    setModalDate(dateISO);
    setModalSlots(avail[dateISO] || []);
    setModalOpen(true);
  };
  const handleDayClick = ({ dateISO, hasAppt }) => {
    if (hasAppt) {
      setDayISO(dateISO);
      setDayOpen(true);
    }
  };

  const handleEdit = (id) => {
    const a = appts.find((x) => x.id === id);
    if (!a) return;
    setEditId(id);
    setModalDate(a.dateISO);
    setModalSlots(avail[a.dateISO] || []);
    setModalOpen(true);
  };
  const handleDelete = async (id) => {
 const result = await Swal.fire({
  title: "Supprimer ce rendez-vous ?",
  text: "Cette action est irréversible.",
  icon: "warning",
  showCancelButton: true,
  confirmButtonText: "Oui, supprimer",
  cancelButtonText: "Annuler",
  reverseButtons: true,
  customClass: {
    popup: "rounded-2xl !p-6",
    title: "!text-lg !font-extrabold",
 confirmButton: "bg-emerald-600 text-white rounded-lg px-4 py-2 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-400",
cancelButton:  "bg-white text-gray-700 rounded-lg px-4 py-2 border border-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300",

  },
  buttonsStyling: false, // important pour que tailwind prenne le dessus
});


  if (result.isConfirmed) {
    setAppts((list) => list.filter((x) => x.id !== id));
    await Swal.fire({
      title: "Supprimé",
      text: "Le rendez-vous a été supprimé.",
      icon: "success",
      timer: 1400,
      showConfirmButton: false,
    });
  }
  else {
  Swal.fire({ title: "Annulé", icon: "info", timer: 900, showConfirmButton: false });
}

};
  const handleSave = ({ type, placeId, time, subject }) => {
    if (editId) {
      setAppts((l) => l.map((x) => (x.id === editId ? { ...x, type, placeId, time, subject } : x)));
    } else {
      const id = crypto.randomUUID?.() || Math.random().toString(36).slice(2);
      setAppts((l) => [...l, { id, dateISO: modalDate, type, placeId, time, subject }]);
    }
    setModalOpen(false);
    setEditId(null);
  };

  // tri global (agenda)
  const apptsSorted = useMemo(() => {
    return [...appts].sort((a, b) => +new Date(`${a.dateISO}T${a.time}`) - +new Date(`${b.dateISO}T${b.time}`));
  }, [appts]);

  // Pagination (2 éléments / page)
const PAGE_SIZE = 2;
const [page, setPage] = useState(1);

const totalPages = Math.max(1, Math.ceil(apptsSorted.length / PAGE_SIZE));
const start = (page - 1) * PAGE_SIZE;
const pageItems = apptsSorted.slice(start, start + PAGE_SIZE);

// Si la liste change (ajout/suppression), garde la page dans les bornes
useEffect(() => {
  if (page > totalPages) setPage(totalPages);
}, [apptsSorted, totalPages, page]);


   // === Editeur d'horaires (dans le composant !) ===
  const openSlotsEditor = useCallback(({ dateISO }) => {
    setSlotsDate(dateISO);
    setSlotsDraft([...(avail[dateISO] || [])]);
    setSlotsOpen(true);
  }, [avail]);

  const saveSlots = useCallback(() => {
    // normalise + déduplique + trie
    const clean = Array.from(
      new Set(
        slotsDraft
          .map((s) => s.trim())
          .filter((s) => /^\d{2}:\d{2}$/.test(s))
     )
    ).sort();
    setAvail((m) => ({ ...m, [slotsDate]: clean }));
  setSlotsOpen(false);
  }, [slotsDraft, slotsDate]);


 return (
  // 2 colonnes : [calendrier | rendez-vous planifiés]
 <div className="grid gap-6 md:grid-cols-[1fr,380px] relative">
    <ApptUIFX />

    {/* --- Colonne gauche : calendrier --- */}
    <div>
      <BookingCalendar
        availability={avail}
        markedCounts={markedCounts}      // bleu ciel si RDV
        minDate={minDate}
        maxMonths={maxMonths}
        onConfirm={openForDate}
        onDayClick={handleDayClick}
        onAddSlots={openSlotsEditor}
        
      />
    </div>

    {/* --- Colonne droite : exactement le même bloc "Rendez-vous planifiés" --- */}
    <aside
  className="
    relative rounded-2xl border border-black/10 bg-white/90 p-2 
    max-h-[580px] overflow-auto backdrop-blur
    shadow-[0_10px_25px_-10px_rgba(0,0,0,0.25)]
    hover:shadow-[0_16px_40px_-12px_rgba(0,0,0,0.3)]
    transition-shadow
  "
>
  {/* header sticky */}
  <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-2xl border-b border-black/10 bg-white/80 px-5 py-4 backdrop-blur-sm mb-2">
    <h4 className="text-base font-extrabold">📌 Rendez-vous planifiés</h4>
    <span className="text-xs rounded-full bg-black/5 px-2 py-1">{apptsSorted.length} au total</span>
  </div>

      {/* garde EXACTEMENT le même rendu de cartes */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
        {pageItems.map((a) => (
          <AppointmentCard
            key={a.id}
            appt={a}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
      {totalPages > 1 && (
  <div className="mt-4 flex items-center justify-between">
    <span className="text-xs text-gray-500">
      {apptsSorted.length === 0
        ? "Aucun rendez-vous"
        : `${start + 1}–${Math.min(start + PAGE_SIZE, apptsSorted.length)} sur ${apptsSorted.length}`}
    </span>

    <div className="flex items-center gap-1">
      <button
        onClick={() => setPage((p) => Math.max(1, p - 1))}
        disabled={page === 1}
        className="h-8 px-2 rounded-lg border text-sm disabled:opacity-40 hover:bg-gray-50"
        aria-label="Page précédente"
        title="Précédent"
      >
        ‹
      </button>

      {/* Petits index (1, 2, 3, …) – optionnel : montre maximum 5 boutons */}
      {Array.from({ length: totalPages }, (_, i) => i + 1)
        .slice(
          Math.max(0, Math.min(page - 3, totalPages - 5)),
          Math.max(5, Math.min(totalPages, page + 2))
        )
        .map((n) => (
          <button
            key={n}
            onClick={() => setPage(n)}
            className={[
              "h-8 min-w-8 px-3 rounded-lg border text-sm transition",
              n === page
                ? "bg-sky-600 text-white border-sky-600"
                : "bg-white text-gray-700 hover:bg-gray-50"
            ].join(" ")}
            aria-current={n === page ? "page" : undefined}
          >
            {n}
          </button>
        ))}

      <button
        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        disabled={page === totalPages}
        className="h-8 px-2 rounded-lg border text-sm disabled:opacity-40 hover:bg-gray-50"
        aria-label="Page suivante"
        title="Suivant"
      >
        ›
      </button>
    </div>
  </div>
)}

    </aside>

    {/* ---- Modal créer / éditer ---- */}
   {/* ---- Modal créer / éditer (style amélioré, logique inchangée) ---- */}
<Modal
  open={modalOpen}
  onClose={() => { setModalOpen(false); setEditId(null); }}
  title={editId ? "Modifier le rendez-vous" : "Planifier un rendez-vous"}
>
  {modalDate && (
    <div className="relative space-y-4">
      {/* Bandeau fin + résumé */}
      <div className="rounded-2xl border border-black/10 bg-white/90 p-4 ring-1 ring-black/5">
        <div className="mb-3 h-1 w-full rounded-full bg-gradient-to-r from-sky-400 via-indigo-400 to-emerald-400 opacity-70" />
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full bg-gray-50 px-3 py-1 font-semibold text-gray-700 ring-1 ring-gray-200">
            {new Date(modalDate).toLocaleDateString("fr-FR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}
          </span>
          <span className="rounded-full bg-sky-50 px-3 py-1 font-semibold text-sky-700 ring-1 ring-sky-200">
            {modalSlots.length} créneau(x) dispo
          </span>
          {editId && (
            <span className="rounded-full bg-amber-50 px-3 py-1 font-semibold text-amber-700 ring-1 ring-amber-200">
              Édition
            </span>
          )}
        </div>
      </div>

      {/* Carte formulaire avec effet 3D doux */}
      <div
        className="relative rounded-2xl border border-black/10 bg-white p-5 ring-1 ring-black/5"
        style={{ boxShadow: "0 10px 24px -12px rgba(2,6,23,.25), 0 34px 66px -24px rgba(2,6,23,.25)" }}
      >
        {/* highlight top */}
        <span className="pointer-events-none absolute inset-x-0 top-0 h-6 rounded-t-2xl bg-gradient-to-b from-gray-50 to-transparent" />
        {/* arête basse 3D */}
        <span
          className="pointer-events-none absolute inset-x-3 bottom-0 h-2 rounded-b-2xl"
          style={{ background: "linear-gradient(to bottom, rgba(0,0,0,.06), rgba(0,0,0,.12))", filter: "blur(6px)", opacity: .55 }}
        />
        {/* Formulaire (inchangé) */}
        <AppointmentForm
          dateISO={modalDate}
          slots={modalSlots}
          initial={editId ? appts.find((x) => x.id === editId) : null}
          onSubmit={handleSave}
          onCancel={() => { setModalOpen(false); setEditId(null); }}
        />
      </div>

      {/* Micro-animations (optionnel) */}
      <style>{`
        @keyframes popCard{0%{opacity:0;transform:translateY(6px) scale(.98)}70%{opacity:1;transform:translateY(-2px) scale(1.01)}100%{opacity:1;transform:translateY(0) scale(1)}}
        @media (prefers-reduced-motion:no-preference){
          .rounded-2xl{animation:popCard .22s cubic-bezier(.2,0,0,1)}
        }
      `}</style>
    </div>
  )}
</Modal>


    {/* ---- Modal “détails du jour” ---- */}
 <DayModal
  open={dayOpen}
  onClose={() => setDayOpen(false)}
  dateISO={dayISO}
  items={dayISO ? (byDate[dayISO] || []) : []}
  onEdit={(id) => { setDayOpen(false); handleEdit(id); }}
  onDelete={handleDelete}
  onAdd={() => { setDayOpen(false); openForDate({ dateISO: dayISO }); }}
/>


    {/* ---- Modal "Ajouter / éditer des horaires" ---- */}
<Modal
  open={slotsOpen}
  onClose={() => setSlotsOpen(false)}
  title={slotsDate ? `Horaires du ${new Date(slotsDate).toLocaleDateString("fr-FR")}` : "Horaires"}
>
  <div className="grid gap-3">
    <p className="text-sm text-gray-600">
      Ajoute des horaires au format <span className="font-semibold">HH:MM</span>.  
      Exemple&nbsp;: <code className="px-1 rounded bg-gray-50">09:00</code>, <code className="px-1 rounded bg-gray-50">10:30</code>
    </p>

    {/* zone liste des horaires */}
    <div className="flex flex-wrap gap-2">
      {slotsDraft.length === 0 ? (
        <span className="text-xs text-gray-500">Aucun horaire pour l’instant.</span>
      ) : (
        slotsDraft.map((s, i) => (
          <span key={i} className="inline-flex items-center gap-2 rounded-full border px-2 py-1 text-sm">
            {s}
            <button
              onClick={() => setSlotsDraft((arr) => arr.filter((_, idx) => idx !== i))}
              className="text-rose-600 hover:text-rose-700"
              aria-label={`Retirer ${s}`}
            >
              ×
            </button>
          </span>
        ))
      )}
    </div>

    {/* input ajouter */}
    <div className="flex items-center gap-2">
      <input
        type="text"
        placeholder="HH:MM"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            const v = e.currentTarget.value.trim();
            if (/^\d{2}:\d{2}$/.test(v)) {
              setSlotsDraft((arr) => [...arr, v]);
              e.currentTarget.value = "";
            }
          }
        }}
        className="w-28 rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
      />
      <button
        onClick={(e) => {
          const inp = e.currentTarget.previousSibling;
          if (inp && inp.value) {
            const v = inp.value.trim();
            if (/^\d{2}:\d{2}$/.test(v)) {
              setSlotsDraft((arr) => [...arr, v]);
              inp.value = "";
            }
          }
        }}
        className="rounded-xl border px-3 py-2 text-sm font-semibold hover:bg-gray-50"
      >
        Ajouter
      </button>
      <button
        onClick={() => setSlotsDraft([])}
        className="ml-auto rounded-xl border px-3 py-2 text-sm text-rose-600 hover:bg-rose-50"
      >
        Vider
      </button>
    </div>

    <div className="mt-2 flex justify-end gap-2">
      <button onClick={() => setSlotsOpen(false)} className="rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-gray-50">
        Annuler
      </button>
      <button onClick={saveSlots} className="rounded-xl px-4 py-2 text-sm font-bold bg-sky-600 text-white hover:brightness-110">
        Enregistrer
      </button>
    </div>
  </div>
</Modal>

  </div>



);

}


