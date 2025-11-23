import React, { useEffect, useMemo, useState, useCallback } from "react";
import BookingCalendar from "./BookingCalendar";
import { FiX, FiEdit2, FiTrash2, FiChevronDown } from "react-icons/fi";
import Swal from "sweetalert2";


/* ---------- Modal générique ---------- */
function Modal({ open, onClose, children, title }) {
  if (!open) return null;

  return (
    <div className="absolute inset-0 z-50 grid place-items-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/30 backdrop-blur-sm animate-fade-in"
      />

      {/* Panel */}
      <div className="relative w-full max-w-md rounded-2xl border border-black/10 bg-white shadow-xl ring-1 ring-black/5 animate-pop-in">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h3 className="text-base font-bold">{title}</h3>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-lg hover:bg-gray-100 active:scale-95 transition"
          >
            <FiX />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>

      {/* animations */}
      <style>{`
        @keyframes pop-in {
          0%   { opacity: 0; transform: translateY(12px) scale(.96) }
          60%  { opacity: 1; transform: translateY(-2px) scale(1.01) }
          100% { opacity: 1; transform: translateY(0) scale(1) }
        }
        @keyframes fade-in { from { opacity: 0 } to { opacity: 1 } }
        .animate-pop-in { animation: pop-in .22s cubic-bezier(.2,0,0,1) both }
        .animate-fade-in { animation: fade-in .18s linear both }
      `}</style>
    </div>
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
function AppointmentCard({ appt, onEdit, onDelete }) {
  const { id, dateISO, time, type, placeId, subject } = appt;
  const place = DIRECTORY[type].find((p) => p.id === placeId)?.name || "Établissement";
  return (
     <div
      className="
        group relative rounded-2xl border border-black/10 bg-white p-4 transition-all
        hover:-translate-y-0.5
        shadow-[0_2px_4px_rgba(0,0,0,0.4),0_7px_13px_-3px_rgba(0,0,0,0.3),inset_0_-3px_0_rgba(0,0,0,0.2)]
        hover:shadow-[0_4px_8px_rgba(0,0,0,0.45),0_12px_20px_-5px_rgba(0,0,0,0.35),inset_0_-3px_0_rgba(0,0,0,0.25)]
      "
    >
      <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">{TYPE_LABEL[type]}</div>
      <div className="mt-1 text-base font-bold text-gray-900">{place}</div>
      <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
        <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-2.5 py-1 font-semibold text-sky-700 ring-1 ring-sky-200">
          {new Date(dateISO).toLocaleDateString("fr-FR")}
        </span>
        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-700 ring-1 ring-emerald-200">
          {time}
        </span>
      </div>
      <div className="mt-2 text-sm text-gray-600">{subject}</div>
      <div className="absolute right-3 top-3 flex items-center gap-1">
        <button onClick={() => onEdit(id)} className="grid h-8 w-8 place-items-center rounded-lg text-gray-600 hover:bg-gray-100" aria-label="Modifier">
          <FiEdit2 />
        </button>
        <button onClick={() => onDelete(id)} className="grid h-8 w-8 place-items-center rounded-lg text-rose-600 hover:bg-rose-50" aria-label="Supprimer">
          <FiTrash2 />
        </button>
      </div>
    </div>
  );
}

/* ---------- Modal “Détail du jour” (clic sur case déjà occupée) ---------- */
function DayModal({ open, onClose, dateISO, items, onEdit, onDelete, onAdd }) {
  if (!open) return null;
  const label = new Date(dateISO).toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "2-digit" });
  return (
    <Modal open={open} onClose={onClose} title={`Rendez-vous du ${label}`}>
      {items.length === 0 ? (
        <div className="text-sm text-gray-500">Aucun rendez-vous ce jour.</div>
      ) : (
        <div className="grid gap-2">
          {items.map((a) => {
            const place = DIRECTORY[a.type].find((p) => p.id === a.placeId)?.name || "Établissement";
            return (
              <div key={a.id} className="flex items-start justify-between rounded-xl border border-gray-200 p-3">
                <div>
                  <div className="text-sm font-semibold">{a.subject}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {TYPE_LABEL[a.type]} · {place} · <span className="font-semibold">{a.time}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => onEdit(a.id)} className="grid h-8 w-8 place-items-center rounded-lg text-gray-700 hover:bg-gray-100">
                    <FiEdit2 />
                  </button>
                  <button onClick={() => onDelete(a.id)} className="grid h-8 w-8 place-items-center rounded-lg text-rose-600 hover:bg-rose-50">
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-4 flex justify-end">
        <button onClick={onAdd} className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-bold text-white hover:brightness-110">
          Ajouter un RDV
        </button>
      </div>
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
    <aside className="rounded-2xl border border-black/10 bg-white p-5  max-h-[580px] overflow-auto   shadow-[0_30px_90px_rgba(0,0,0,0.4)]
  hover:shadow-[0_36px_110px_rgba(0,0,0,0.45)] transition-shadow">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-lg font-extrabold">📌 Rendez-vous planifiés</h4>
        <span className="text-xs rounded-full bg-black/5 px-2 py-1">
          {apptsSorted.length} au total
        </span>
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
    <Modal
      open={modalOpen}
      onClose={() => { setModalOpen(false); setEditId(null); }}
      title={editId ? "Modifier le rendez-vous" : "Planifier un rendez-vous"}
    >
      {modalDate && (
        <AppointmentForm
          dateISO={modalDate}
          slots={modalSlots}
          initial={editId ? appts.find((x) => x.id === editId) : null}
          onSubmit={handleSave}
          onCancel={() => { setModalOpen(false); setEditId(null); }}
        />
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


