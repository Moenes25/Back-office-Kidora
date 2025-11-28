// src/views/.../PaiementsPage.jsx
import React from "react";

import { FiCalendar, FiClock, FiLayers, FiCheckCircle } from "react-icons/fi";


/* ----------------------------- utils dates ----------------------------- */
const dayNames = ["DIM", "LUN", "MAR", "MER", "JEU", "VEN", "SAM"];
const monthNames = ["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];

const startOfWeek = (d) => {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const day = x.getDay();           // 0..6 (0 = dim)
  const diff = (day + 6) % 7;       // semaine qui commence LUNDI
  x.setDate(x.getDate() - diff);
  x.setHours(0,0,0,0);
  return x;
};
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const toISODate = (d) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
const fmtTime = (t) => t || ""; // "08:00"
// --- largeur d'une colonne (à ajuster) ---
const COL_MIN = 260; // px : mets 240 / 260 / 280 selon ce que tu veux
const COL_TEMPLATE = `repeat(7, minmax(${COL_MIN}px, 1fr))`;


/* -------------------------- palettes & helpers -------------------------- */

const colorByType = {
creches: {
  label: "Crèches",
  chip:  "bg-[#a78bfa] text-white",
  ring:  "ring-[#a78bfa]",
  accent:"from-[#a78bfa] to-[#8b5cf6]",  
  soft:  "bg-[#a78bfa]/10",
},

  garderies: {
    label: "Garderies",
    chip: "bg-amber-100 text-amber-800",
    ring: "ring-amber-300",
    accent: "from-amber-500 to-orange-500",
    soft: "bg-amber-50/70",
  },
  ecoles: {
    label: "Écoles",
    chip: "bg-emerald-100 text-emerald-700",
    ring: "ring-emerald-300",
    accent: "from-emerald-500 to-teal-500",
    soft: "bg-emerald-50/70",
  },
};

// Liste des établissements par type
const ORGS = {
  creches: [
    "Crèche Les Petits Pas",
    "Crèche Arc-en-ciel",
    "Crèche Les P’tits Loups",
  ],
  garderies: [
    "Garderie Le Nid",
    "Garderie Les Copains",
    "Garderie La Marelle",
  ],
  ecoles: [
    "École Pasteur",
    "École Victor Hugo",
    "École Jules Ferry",
  ],
};

const TYPES = ["creches","garderies","ecoles"];

/* ------------------------------- Modale ------------------------------- */
function Modal({ open, onClose, onSubmit, onDelete, initial, defaultType, defaultDate }) {
 const [form, setForm] = React.useState(
  initial ?? {
    title: "",
    type:  defaultType ?? "creches",
    org:   (ORGS[defaultType ?? "creches"]?.[0] ?? ""), // ← nouveau
    date:  defaultDate ?? toISODate(new Date()),
    start: "", end: "", desc: ""
  }
);


React.useEffect(() => {
  if (!open) return;
  setForm(
    initial ?? {
      title: "",
      type:  defaultType ?? "creches",
      org:   (ORGS[defaultType ?? "creches"]?.[0] ?? ""),
      date:  defaultDate ?? toISODate(new Date()),
      start: "", end: "", desc: ""
    }
  );
}, [open, initial, defaultType, defaultDate]);
React.useEffect(() => {
  setForm((f) => {
    const list = ORGS[f.type] ?? [];
    if (!list.length) return f;
    // si le nom actuel n'appartient pas au nouveau type, on met le 1er de la liste
    return list.includes(f.org) ? f : { ...f, org: list[0] };
  });
}, [form.type]); // oui, on écoute le type courant


  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-[560px] max-w-[92vw] rounded-3xl bg-white p-6 shadow-2xl
                      [transform:translateZ(0)] animate-[pop_.28s_cubic-bezier(.2,0,0,1)_both]">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-xl font-extrabold">Créer / éditer un évènement</h3>
          <button onClick={onClose} className="rounded-lg px-2 py-1 text-sm text-gray-500 hover:bg-gray-100">✕</button>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <label className="grid gap-1 text-sm">
            <span className="font-semibold">Titre</span>
            <input
              className="rounded-xl border border-black/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Ex: Sortie sciences"
            />
          </label>

{/* Type & Nom (même ligne) + Date (ligne suivante) */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
  {/* Type */}
  <label className="grid gap-1 text-sm">
    <span className="font-semibold">Type</span>
    <select
      className="rounded-xl border border-black/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
      value={form.type}
      onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
    >
      <option value="creches">Crèches</option>
      <option value="garderies">Garderies</option>
      <option value="ecoles">Écoles</option>
    </select>
  </label>

  {/* Nom (dépend du type) */}
  <label className="grid gap-1 text-sm">
    <span className="font-semibold">Nom</span>
    <select
      className="rounded-xl border border-black/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
      value={form.org}
      onChange={(e) => setForm((f) => ({ ...f, org: e.target.value }))}
    >
      {(ORGS[form.type] ?? []).map((n) => (
        <option key={n} value={n}>{n}</option>
      ))}
    </select>
  </label>

  {/* Date (pleine largeur sous Type/Nom) */}
  <label className="grid gap-1 text-sm md:col-span-2">
    <span className="font-semibold">Date</span>
    <input
      type="date"
      className="rounded-xl border border-black/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
      value={form.date}
      onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
    />
  </label>
</div>



          <div className="grid grid-cols-2 gap-3">
            <label className="grid gap-1 text-sm">
              <span className="font-semibold">Début</span>
              <input
                type="time"
                className="rounded-xl border border-black/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                value={form.start}
                onChange={(e) => setForm((f) => ({ ...f, start: e.target.value }))}
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="font-semibold">Fin</span>
              <input
                type="time"
                className="rounded-xl border border-black/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                value={form.end}
                onChange={(e) => setForm((f) => ({ ...f, end: e.target.value }))}
              />
            </label>
          </div>

          <label className="grid gap-1 text-sm">
            <span className="font-semibold">Description (optionnel)</span>
            <textarea
              rows={3}
              className="resize-none rounded-xl border border-black/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              value={form.desc}
              onChange={(e) => setForm((f) => ({ ...f, desc: e.target.value }))}
              placeholder="Détails, lieu, matériel…"
            />
          </label>
        </div>

        <div className="mt-5 flex items-center justify-between">
          {initial && (
            <button
              onClick={() => onDelete?.(initial)}
              className="rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-bold text-red-600 hover:bg-red-100"
            >
              Supprimer
            </button>
          )}
          <div className="ml-auto flex gap-2">
            <button onClick={onClose} className="rounded-xl border border-black/10 px-3 py-1.5 text-sm font-semibold hover:bg-gray-50">
              Annuler
            </button>
            <button
              onClick={() => onSubmit(form)}
              className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-600 px-3 py-1.5 text-sm font-bold text-white shadow-md hover:shadow-lg hover:brightness-110"
            >
              {initial ? "Enregistrer" : "Créer"}
            </button>
          </div>
        </div>
      </div>

      {/* animations locales */}
      <style>{`
        @keyframes pop{0%{opacity:0;transform:translateY(8px) scale(.98)}70%{opacity:1;transform:translateY(-2px) scale(1.01)}100%{opacity:1;transform:translateY(0) scale(1)}}
      `}</style>
    </div>
  );
}

/* ---------------------------- carte d’évènement ---------------------------- */
/* utils d’affichage */
const fmtDateShort = (iso) => {
  // "2025-12-09" -> "9 déc."
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" }).replace(".", "");
};
const initials = (name="") =>
  name.trim().split(/\s+/).slice(0,2).map(s=>s[0]?.toUpperCase()||"").join("") || "•";

/* ---------------------------- carte d’évènement (nouvelle) ---------------------------- */
function EventCard({ ev, onEdit }) {
  const c = colorByType[ev.type] ?? colorByType.creches;

  // évite l’effet “bord qui décale” : ligne décorative fine, décalée d’1px et overflow-hidden
  return (
    <button
      onClick={() => onEdit(ev)}
      className={[
        "group relative w-full rounded-2xl border border-black/5 bg-white p-3 text-left overflow-hidden",
        "shadow-[0_12px_30px_-18px_rgba(2,6,23,.25)] transition",
        "hover:-translate-y-0.5 hover:shadow-[0_22px_45px_-18px_rgba(2,6,23,.28)]",
        "ring-1", c.ring
      ].join(" ")}
    >
      {/* halo subtil au survol */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: "radial-gradient(160px 90px at 18% -10%, rgba(255,255,255,.55), transparent 60%)" }}
      />

      {/* ligne décorative gauche (fine et décalée pour ne pas “manger” la carte) */}
      <span
        aria-hidden
        className={"absolute left-1 top-0 h-full w-[4px] rounded-l-2xl bg-gradient-to-b " + c.accent}
      />
     

      {/* En-tête : type + date à gauche, heures à droite */}
     
{/* En-tête : type + date (sans heures) */}
<div className="mb-1.5 flex items-center gap-2">
  <span
    className={["rounded-full px-2 py-0.5 text-[10px] font-bold whitespace-nowrap", c.chip].join(" ")}
  >
    {colorByType[ev.type]?.label ?? "Type"}
  </span>

 
</div>
 {ev.date && (
    <div className="mb-2">
    <span
      className="truncate rounded-full border border-black/10 bg-gray-50 px-2 py-0.5 text-[11px] text-gray-600 max-w-[120px]"
      title={fmtDateShort(ev.date)}
    >
      {fmtDateShort(ev.date)}
    </span>
    </div>
  )}

{/* Heures (sous l'en-tête) */}
{(ev.start || ev.end) && (
  <div className="mb-2">
    <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-black/10 bg-gray-50 px-0 py-0.5 text-[11px] font-semibold text-gray-600">
      {/* petite icône horloge optionnelle */}
      <svg width="12" height="12" viewBox="0 0 24 24" className="opacity-60">
        <path fill="currentColor" d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2m1 10.59l3.3 1.9l-.5.86L11 13V7h1z"/>
      </svg>
      {ev.start ? fmtTime(ev.start) : ""}{ev.start && ev.end ? " — " : ""}{ev.end ? fmtTime(ev.end) : ""}
    </span>
  </div>
)}

{/* Nom de l’établissement (sous les heures) */}

{ev.org && (
  <div className="mb-2">
    <span
      className={["inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1", c.soft, c.ring].join(" ")}
    >
      {ev.org}
    </span>
  </div>
)}



      {/* Titre */}
      <div className="text-[15px] font-extrabold leading-snug tracking-tight text-slate-900">
        {ev.title}
      </div>

      {/* Description (optionnelle) */}
      {ev.desc && (
        <div className="mt-1 text-[12px] leading-5 text-slate-500 line-clamp-3">
          {ev.desc}
        </div>
      )}

      {/* Invités / puces en bas */}
      <div className="mt-3 flex items-center justify-between hidden">
        {/* Avatars (ou initiales) – prend ev.guests = [{name, color?}] */}
        <div className="flex -space-x-2">
          {(ev.guests ?? []).slice(0,4).map((g, i) => (
            <span
              key={i}
              title={g.name}
              className="inline-grid h-7 w-7 place-items-center rounded-full border border-white text-[11px] font-bold shadow-sm"
              style={{ background: g.color || "#f1f5f9", color: "#0f172a" }}
            >
              {initials(g.name)}
            </span>
          ))}
          {ev.guests && ev.guests.length > 4 && (
            <span className="inline-grid h-7 w-7 place-items-center rounded-full border border-white bg-slate-100 text-[11px] font-bold text-slate-700 shadow-sm">
              +{ev.guests.length - 4}
            </span>
          )}
        </div>

        {/* petit “grip” fantôme à droite (rappel drag) */}
        <div className="h-8 w-24 rounded-xl border border-black/5 bg-gradient-to-b from-white to-slate-50/60" />
      </div>
    </button>
  );
}
function KPI({ title, value, icon, gradient }) {
  return (
    <div className="
      relative overflow-hidden rounded-2xl border border-white/50 bg-white/70 backdrop-blur-md
      shadow-[0_14px_48px_rgba(2,6,23,.12)] min-h-[120px]
    ">
      {/* film de couleur - SOUS le contenu */}
      <div className="absolute inset-0 opacity-25 z-0" style={{ background: gradient }} />

      {/* petits effets - SOUS le contenu */}
      <div className="pointer-events-none absolute -top-6 -right-6 h-28 w-28 rounded-full bg-white/60 blur-2xl kpi-float z-0" />
      <div className="pointer-events-none absolute -left-1/3 -top-1/2 h-[220%] w-1/3 rotate-[14deg] bg-white/40 blur-md kpi-shine z-0" />

      {/* CONTENU - AU-DESSUS */}
      <div className="relative z-10 flex items-center gap-3 p-4">
        <div
          className="grid h-12 w-12 place-items-center rounded-xl text-white shadow-lg ring-1 ring-white/50"
          style={{ background: gradient }}
        >
          {icon}
        </div>
        <div>
          <div className="text-3xl font-extrabold tracking-tight text-slate-900">
            {Number.isFinite(value) ? value : 0}
          </div>
          <div className="mt-0.5 text-xs font-medium text-slate-600">{title}</div>
        </div>
      </div>
    </div>
  );
}


/* styles ultra-légers pour l’anim */
function KPIStyles() {
  return (
    <style>{`
      @keyframes kpiFloat { 0%{transform:translateY(0)} 50%{transform:translateY(6px)} 100%{transform:translateY(0)} }
      @keyframes kpiShine { 0%{transform:translateX(-40%)} 100%{transform:translateX(180%)} }
      .kpi-float{ animation: kpiFloat 4s ease-in-out infinite; }
      .kpi-shine{ animation: kpiShine 2.2s ease-in-out infinite; }
    `}</style>
  );
}


/* --------------------------------- page --------------------------------- */
export default function PaiementsPage() {
  // vue courante
  const [viewDate, setViewDate] = React.useState(new Date());

  // filtre type
  const [filterType, setFilterType] = React.useState("creches");

  // exemples dynamiques pour la semaine en cours (=> garderies/écoles visibles)
  const seedWeek = startOfWeek(new Date());
  const seed = (offset) => toISODate(addDays(seedWeek, offset));
const [events, setEvents] = React.useState(() => [
  { id: crypto.randomUUID(), type: "creches",   org: "Crèche Les Petits Pas", title: "Sortie sciences",   date: seed(1), start: "08:00", end: "14:00", desc: "Musée des sciences & techno." },
  { id: crypto.randomUUID(), type: "garderies", org: "Garderie Le Nid",       title: "Prépa Pâques",      date: seed(2), start: "06:00", end: "08:00", desc: "Organisation de la semaine." },
  { id: crypto.randomUUID(), type: "ecoles",    org: "École Pasteur",         title: "Réunion équipe",    date: seed(4), start: "08:00", end: "16:00", desc: "Bilan mensuel & RH." },
  { id: crypto.randomUUID(), type: "creches",   org: "Crèche Arc-en-ciel",    title: "Atelier extérieur", date: seed(1), start: "10:00", end: "12:00" },
]);


  // modale
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState(null);
  const [draftDate, setDraftDate] = React.useState(toISODate(new Date())); // pour pré-remplir

  const weekStart = startOfWeek(viewDate);
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const selectedMonth = monthNames[viewDate.getMonth()];
  const selectedYear = viewDate.getFullYear();

  const filtered = events.filter((e) => e.type === filterType);

  const openNew = (dateISO) => {
    setEditing(null);
    setDraftDate(dateISO);
    setOpen(true);
  };

  const submit = (form) => {
    if (editing) {
      setEvents((arr) => arr.map((e) => (e.id === editing.id ? { ...editing, ...form } : e)));
    } else {
      setEvents((arr) => arr.concat([{ id: crypto.randomUUID(), ...form }]));
    }
    setOpen(false);
  };

  const remove = (ev) => {
    setEvents((arr) => arr.filter((e) => e.id !== ev.id));
    setOpen(false);
  };
// bornes de la semaine courante (inchangé)
const weekStartISO = toISODate(weekStart);
const weekEndISO   = toISODate(addDays(weekStart, 6));
const todayISO     = toISODate(new Date());

// Tous les évènements de la semaine affichée (inchangé)
const weekEvents = React.useMemo(() => {
  return events.filter(e => (e.date || "") >= weekStartISO && (e.date || "") <= weekEndISO);
}, [events, weekStartISO, weekEndISO]);

// ➜ AJOUT : évènements visibles (semaine + type sélectionné)
const visibleWeekEvents = React.useMemo(() => {
  return weekEvents.filter(e => e.type === filterType);
}, [weekEvents, filterType]);

// ➜ Utilitaires de durée (inchangé)
const minutesFrom = (e) => {
  if (!e.start || !e.end) return 0;
  const [sh, sm] = e.start.split(":").map(Number);
  const [eh, em] = e.end.split(":").map(Number);
  return Math.max(0, (eh*60+em) - (sh*60+sm));
};

// ➜ KPIs recalculés sur la vue visible
const totalHours       = Math.round(visibleWeekEvents.reduce((acc, ev) => acc + minutesFrom(ev), 0) / 60);
const typeLabel        = colorByType[filterType]?.label ?? "Type";
const countForType     = visibleWeekEvents.length;                        // était weekEvents.filter(...)
const todayCount       = visibleWeekEvents.filter(e => e.date === todayISO).length;

// (Optionnel) si tu veux que le sélecteur de type montre les comptes de la **semaine courante** et pas “tous temps” :
const countsThisWeek = React.useMemo(() => {
  const c = { creches: 0, garderies: 0, ecoles: 0 };
  weekEvents.forEach(e => { c[e.type] = (c[e.type] || 0) + 1; });
  return c;
}, [weekEvents]);


  // helpers
  const goToday = () => setViewDate(new Date());
  const prevWeek = () => setViewDate((d) => addDays(d, -7));
  const nextWeek = () => setViewDate((d) => addDays(d, 7));

  // compteurs par type (affichés dans le sélecteur)
  const counts = React.useMemo(() => {
    const c = { creches: 0, garderies: 0, ecoles: 0 };
    events.forEach((e) => { c[e.type] = (c[e.type] || 0) + 1; });
    return c;
  }, [events]);

  return (
    <div className="p-6 relative">

      <KPIStyles />

<div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
  <KPI title="Évènements (semaine)" value={visibleWeekEvents.length} icon={<FiCalendar className="text-2xl" />} gradient="linear-gradient(135deg,#6366f1,#06b6d4)" />
  <KPI title="Aujourd’hui"           value={todayCount}              icon={<FiClock className="text-2xl" />}    gradient="linear-gradient(135deg,#f59e0b,#ef4444)" />
  <KPI title={typeLabel}             value={countForType}            icon={<FiLayers className="text-2xl" />}   gradient="linear-gradient(135deg,#10b981,#22d3ee)" />
  <KPI title="Heures planifiées"     value={totalHours}              icon={<FiCheckCircle className="text-2xl" />} gradient="linear-gradient(135deg,#64748b,#94a3b8)" />
</div>


      {/* halo fond */}
      <div className="pointer-events-none absolute inset-x-0 -top-24 bottom-0 -z-10 opacity-60 blur-3xl"
           style={{ background: "radial-gradient(900px 420px at 10% -10%, rgba(99,102,241,.15), transparent 60%)" }} />

      {/* Header / barre d’actions */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-2xl font-extrabold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
            {selectedMonth} {selectedYear}
          </div>
          <div className="mt-1 flex items-center gap-2 text-sm">
            <button onClick={prevWeek} className="rounded-lg border border-black/10 px-2 py-1 hover:bg-gray-50">‹</button>
            <button onClick={goToday} className="rounded-lg border border-black/10 px-2 py-1 font-semibold hover:bg-gray-50">Aujourd’hui</button>
            <button onClick={nextWeek} className="rounded-lg border border-black/10 px-2 py-1 hover:bg-gray-50">›</button>
          </div>
        </div>

        {/* Sélecteur de type stylé (3 pastilles) */}
        <div className="flex items-center gap-3">
         <div className="flex items-center gap-1 rounded-2xl border border-black/10 bg-white px-1 py-1 shadow-sm">

            {TYPES.map((t) => {
              const active = t === filterType;
              const meta = colorByType[t];
              return (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={[
                    "relative mx-1 flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-semibold transition",
                    active ? "bg-gradient-to-r " + meta.accent + " text-white shadow-sm" : "text-gray-700 hover:bg-gray-50"
                  ].join(" ")}
                >
                  <span className="inline-block h-2 w-2 rounded-full bg-white/70 ring-2 ring-white/50" />
                  {meta.label}
                  <span className={"ml-1 rounded-full px-2 text-[11px] font-bold " + (active ? "bg-white/20" : "bg-black/5")}>
                    {counts[t] || 0}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => { setEditing(null); setDraftDate(toISODate(new Date())); setOpen(true); }}
            className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-600 px-6 py-2 text-sm font-bold text-white shadow-sm hover:shadow-md hover:brightness-110"
          >
            + New event
          </button>
        </div>
      </div>

      {/* Grille hebdo */}
     <div className="rounded-3xl border border-black/10 bg-white p-3 shadow-[0_24px_70px_-25px_rgba(2,6,23,.25)]">
        {/* entêtes jours */}
        <div className="grid grid-cols-7 gap-3 px-1">
          {days.map((d, i) => {
            const isToday = toISODate(d) === toISODate(new Date());
            return (
              <div key={i} className="pb-2">
                <div className={[
                  "flex h-16 flex-col items-center justify-center rounded-2xl border border-black/10 text-center",
                  isToday ? "bg-gradient-to-br from-indigo-50 to-sky-50 ring-1 ring-indigo-200" : "bg-white",
                ].join(" ")}>
                  <div className="text-[11px] font-bold uppercase tracking-wide text-gray-500">{dayNames[d.getDay()]}</div>
                  <div className={["text-xl font-black", isToday ? "text-indigo-600" : ""].join(" ")}>{d.getDate()}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* colonnes */}
        <div className="mt-3 grid grid-cols-7 gap-3">
          {days.map((d, i) => {
            const iso = toISODate(d);
            const dayEvents = filtered
              .filter((e) => e.date === iso)
              .sort((a, b) => (a.start || "").localeCompare(b.start || ""));

            const meta = colorByType[filterType];

            return (
              <div key={i}
                   className={[
                     "min-h-[520px] rounded-2xl p-2",
                     "bg-white/60 backdrop-blur-sm border border-black/5 shadow-inner",
                     "relative overflow-hidden",
                   ].join(" ")}>
                {/* bande douce en haut de chaque colonne (couleur du type) */}
                <span className={"absolute left-0 right-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r " + meta.accent} />

                {/* bouton + en haut */}
                <button
                  onClick={() => openNew(iso)}
                  className="mb-2 grid h-10 w-full place-items-center rounded-xl border border-dashed border-black/10 bg-white text-sm text-gray-500 hover:bg-gray-50"
                >
                  +
                </button>

                <div className="space-y-3">
                  {dayEvents.map((ev) => (
                    <EventCard key={ev.id} ev={ev} onEdit={(e) => { setEditing(e); setDraftDate(e.date); setOpen(true); }} />
                  ))}
                </div>

                {/* bouton en bas façon “+ new event” */}
                <button
                  onClick={() => openNew(iso)}
                  className={"mt-3 w-full rounded-2xl border px-3 py-3 text-sm font-bold " +
                    "border-black/10 bg-gradient-to-r " + meta.accent + " text-white shadow-sm hover:shadow-md"}
                >
                  + new event
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modale */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        initial={editing}
        onSubmit={submit}
        onDelete={remove}
        defaultType={filterType}   // ← préremplit le type selon l’onglet courant
        defaultDate={draftDate}    // ← préremplit la date selon la colonne cliquée
      />
    </div>
  );
}
