/* eslint-disable */
import React, { useEffect, useMemo, useState } from "react";
import { FiEye, FiEdit2, FiTrash2, FiPlus, FiX, FiUploadCloud, FiLock, FiUnlock, FiSearch , FiChevronLeft, FiChevronRight } from "react-icons/fi";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { FiUsers, FiUserCheck, FiUserX, FiGrid } from "react-icons/fi";


/* ====== Avatars statiques ====== */
const AVATARS = {
  "Lina Khelifi":
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=300&auto=format&fit=facearea&facepad=3",
  "Amine Rezgani":
    "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=300&auto=format&fit=facearea&facepad=3",
  "Yasmine Hachemi":
    "https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=300&auto=format&fit=facearea&facepad=3",
 "Sami Ben Ali": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=facearea&facepad=3",
"Meriem Trabelsi": "https://images.unsplash.com/photo-1524502397800-9f87f4d4c3f7?q=80&w=300&auto=format&fit=facearea&facepad=3",
 "Omar Fares": "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=300&auto=format&fit=facearea&facepad=3"
};

/* ====== Données démo ====== */
const teamMock = [
  { id: 1, name: "Lina Khelifi", role: "Responsable pédagogique", email: "lina@kidora.tn", avatar: AVATARS["Lina Khelifi"], cardBg: "" },
  { id: 2, name: "Amine Rezgani", role: "Administrateur technique",  email: "amine@kidora.tn", avatar: AVATARS["Amine Rezgani"], cardBg: "" },
  { id: 3, name: "Yasmine Hachemi", role: "Coach éducatif",          email: "yasmine@kidora.tn", avatar: AVATARS["Yasmine Hachemi"], cardBg: "" },
  { id: 4, name: "Sami Ben Ali", role: "Formateur",                   email: "sami@kidora.tn",    avatar: AVATARS["Sami Ben Ali"], cardBg: "" },
 { id: 5, name: "Meriem Trabelsi", role: "Coordinatrice",            email: "meriem@kidora.tn",  avatar: AVATARS["Meriem Trabelsi"], cardBg: "" },
 { id: 6, name: "Omar Fares", role: "Support technique",             email: "omar@kidora.tn",    avatar: AVATARS["Omar Fares"], cardBg: "" },
];

/* Utils */
const initials = (name = "") =>
  name.split(" ").filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join("");

/* ====== Carte ====== */
function UiverseCard({
  name, role, email, avatar, cardBg,
  onView, onEdit, onDelete, height = 360
}) {
  const DEFAULT_BG = "linear-gradient(135deg,#22d3ee 0%,#a78bfa 45%,#34d399 100%)";
  const bg = cardBg || DEFAULT_BG;

  return (
    <div className="uk-container">
      <div className="card_box" style={{ background: bg, "--h": `${height}px` }}>
        {/* Ruban rôle (couleur FIXE via CSS) */}
        <span className="uk-ribbon" data-role={role}></span>

        {/* Contenu */}
        <div className="cb-inner">
          <div className="cb-avatar big">
            {avatar ? <img src={avatar} alt={name} /> : <span>{initials(name)}</span>}
          </div>

          <div className="cb-name">{name}</div>
          <div className="cb-mail">{email}</div>

          <div className="cb-actions">
            <button className="cb-btn" title="Détails" onClick={onView}><FiEye /></button>
            <button className="cb-btn" title="Modifier" onClick={onEdit}><FiEdit2 /></button>
            <button className="cb-btn danger" title="Supprimer" onClick={onDelete}><FiTrash2 /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ====== Modale (Création / Édition) ====== */
function MemberFormModal({ open, title, initial, onClose, onSubmit }) {
  const [form, setForm] = useState({
    name: "", role: "", email: "", avatar: "",
    password: "", confirm: ""
  });
  const [showPwd, setShowPwd] = useState(false);

  useEffect(() => {
    if (open) {
      setForm({
        name: initial?.name || "",
        role: initial?.role || "",
        email: initial?.email || "",
        avatar: initial?.avatar || "",
        password: "",
        confirm: ""
      });
    }
  }, [open, initial]);

  if (!open) return null;

  const onFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setForm((v) => ({ ...v, avatar: url }));
  };

  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.role.trim()) return;
    if (form.password || form.confirm) {
      if (form.password.length < 6) { alert("Mot de passe : 6 caractères minimum."); return; }
      if (form.password !== form.confirm) { alert("Les mots de passe ne correspondent pas."); return; }
    }
    onSubmit(form);
  };

  return (
    <div className="uk-modal" onClick={onClose}>
      <div className="uk-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="uk-dialog-head">
          <h3>{title}</h3>
          <button className="uk-close" onClick={onClose}><FiX /></button>
        </div>

        <form onSubmit={submit} className="uk-form">
          <div className="frm-grid">
            <label>
              <span>Nom</span>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </label>
            <label>
              <span>Rôle</span>
              <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} required />
            </label>
            <label>
              <span>Email</span>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </label>

            <label>
              <span>Avatar — URL</span>
              <input value={form.avatar} onChange={(e) => setForm({ ...form, avatar: e.target.value })} placeholder="https://..." />
            </label>
            <div className="file-u">
              <span>ou Importer</span>
              <label className="file-btn">
                <FiUploadCloud /> Choisir un fichier
                <input type="file" accept="image/*" onChange={onFile} />
              </label>
              {form.avatar && <div className="file-preview"><img src={form.avatar} alt="preview" /></div>}
            </div>

            <label>
              <span>Mot de passe</span>
              <div className="pwd">
                <input
                  type={showPwd ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••"
                />
                <button type="button" onClick={() => setShowPwd(s => !s)}>{showPwd ? <FiUnlock/> : <FiLock/>}</button>
              </div>
            </label>
            <label>
              <span>Confirmer le mot de passe</span>
              <input
                type={showPwd ? "text" : "password"}
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                placeholder="••••••"
              />
            </label>
          </div>

          <div className="uk-actions-row">
            <button type="button" className="uk-btn ghost" onClick={onClose}>Annuler</button>
            <button type="submit" className="uk-btn primary"><FiPlus /> Enregistrer</button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ====== Modale Détails ====== */
function DetailsModal({ open, data, onClose, onEdit }) {
  if (!open || !data) return null;
  return (
    <div className="uk-modal" onClick={onClose}>
      <div className="uk-dialog details" onClick={(e) => e.stopPropagation()}>
        <div className="uk-dialog-head">
          <h3>Détails — {data.name}</h3>
          <button className="uk-close" onClick={onClose}><FiX /></button>
        </div>

        <div className="dt-body">
          <div className="cb-avatar huge">{data.avatar ? <img src={data.avatar} alt={data.name}/> : <span>{initials(data.name)}</span>}</div>
          <div className="dt-name">{data.name}</div>
          <div className="dt-role">{data.role}</div>
          <div className="dt-mail">{data.email}</div>
        </div>

        <div className="uk-actions-row">
          <button className="uk-btn ghost" onClick={onClose}>Fermer</button>
          <button className="uk-btn primary" onClick={onEdit}><FiEdit2/> Modifier</button>
        </div>
      </div>
    </div>
  );
}

/* ====== SweetAlert maison ====== */
function ConfirmDialog({ open, title, text, confirmLabel="Oui, supprimer", cancelLabel="Annuler", onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="sa-mask" onClick={onCancel}>
      <div className="sa-card" onClick={(e)=>e.stopPropagation()}>
        <div className="sa-icon">!</div>
        <div className="sa-title">{title}</div>
        {text && <div className="sa-text">{text}</div>}
        <div className="sa-actions">
          <button className="sa-btn ghost" onClick={onCancel}>{cancelLabel}</button>
          <button className="sa-btn danger" onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
function FilterBar({
  q, setQ,
  type, setType,
  status, setStatus,
  sortKey, setSortKey,
  sortDir, setSortDir,
  roleOptions = ["Tous"],
}) {
  return (
    <div className="filterbar">
      <div className="f-search">
        <FiSearch />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher par nom, rôle, email…"
        />
      </div>

      <div className="f-select">
        <span>Type</span>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          {roleOptions.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      <div className="f-select">
        <span>Statut</span>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option>Tous</option>
          <option>Actif</option>
          <option>Inactif</option>
        </select>
      </div>

      <div className="f-select f-sort">
        <span>Trier par</span>
        <select value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
          <option value="name">Nom</option>
          <option value="email">Email</option>
          <option value="role">Rôle</option>
        </select>
        <button
          className="dir"
          type="button"
          onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
          title={sortDir === "asc" ? "Ordre croissant" : "Ordre décroissant"}
        >
          {sortDir === "asc" ? "▲" : "▼"}
        </button>
      </div>
    </div>
  );
}
function MotionNumber({ value, className }) {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, v => Math.round(v));
  useEffect(() => {
    const controls = animate(mv, value, { duration: 0.8, ease: "easeOut" });
    return () => controls.stop();
  }, [value]);
  return <motion.span className={className}>{rounded}</motion.span>;
}

const KPI = ({ title, value, icon, gradient }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -3, scale: 1.01 }}
    transition={{ type: "spring", stiffness: 260, damping: 20 }}
    className="uk-kpi"
    style={{ minHeight: 120 }}
  >
    <div className="uk-kpi-bg" style={{ background: gradient }} />
    <motion.div
      className="uk-kpi-blob"
      animate={{ y: [0, 6, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="uk-kpi-shine"
      animate={{ x: ["-120%", "130%"] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
    />
    <div className="uk-kpi-content">
      <div className="uk-kpi-icon" style={{ background: gradient }}>{icon}</div>
      <div>
        <MotionNumber value={value} className="text-3xl font-extrabold tracking-tight text-slate-800" />
        <div className="mt-0.5 text-xs font-medium text-slate-500">{title}</div>
      </div>
    </div>
    <div className="uk-kpi-ring" />
  </motion.div>
);


/* ====== Page ====== */
export default function EquipeKidoraUiverse() {
  const [team, setTeam] = useState(teamMock);

  // Modales
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [current, setCurrent] = useState(null);

  // Sweet confirm
  const [askDelete, setAskDelete] = useState({ open:false, target:null });

  // Filtres
  // --- Filtres ---
const [q, setQ] = useState("");
const [type, setType] = useState("Tous");
const [status, setStatus] = useState("Tous");   // démo
const [sortKey, setSortKey] = useState("name");
const [sortDir, setSortDir] = useState("asc");

// options pour "Type" (basé sur vos rôles existants)
const roleOptions = useMemo(
  () => ["Tous", ...Array.from(new Set(team.map(t => t.role)))],
  [team]
);

// liste filtrée + triée
const filteredTeam = useMemo(() => {
  let rows = [...team];
  const qq = q.trim().toLowerCase();

  if (qq) {
    rows = rows.filter(r =>
      r.name.toLowerCase().includes(qq) ||
      r.email.toLowerCase().includes(qq) ||
      r.role.toLowerCase().includes(qq)
    );
  }
  if (type !== "Tous") rows = rows.filter(r => r.role === type);
  // status: vous pourrez brancher une vraie valeur plus tard si besoin

  rows.sort((a,b) => {
    const A = (a[sortKey] || "").toString().toLowerCase();
    const B = (b[sortKey] || "").toString().toLowerCase();
    if (A < B) return sortDir === "asc" ? -1 : 1;
    if (A > B) return sortDir === "asc" ?  1 : -1;
    return 0;
  });

  return rows;
}, [team, q, type, status, sortKey, sortDir]);
// --- Pagination (3 cartes / page) ---
const PAGE_SIZE = 3;
const [page, setPage] = useState(1);
const pageCount = Math.max(1, Math.ceil(filteredTeam.length / PAGE_SIZE));
const pageStart = (page - 1) * PAGE_SIZE;
const pagedTeam = filteredTeam.slice(pageStart, pageStart + PAGE_SIZE);
// remettre sur la page 1 quand on filtre/tri/modifie la liste
useEffect(() => { setPage(1); }, [q, type, status, sortKey, sortDir, team.length]);

  const openDetailsFor = (m) => { setCurrent(m); setOpenDetails(true); };
  const openEditFor = (m) => { setCurrent(m); setOpenEdit(true); };

  const addMember = (f) => {
    const avatar = f.avatar || AVATARS[f.name] || "";
    setTeam((t) => [{ id: Math.max(0, ...t.map(x => x.id)) + 1, ...f, avatar }, ...t]);
    setOpenAdd(false);
  };
  const updateMember = (f) => {
    setTeam((t) => t.map(x => x.id === current.id ? { ...x, ...f } : x));
    setOpenEdit(false);
  };

  const stats = useMemo(() => {
  const total = team.length;
  const withAvatar = team.filter(t => !!t.avatar).length;
  const noAvatar = total - withAvatar;
  const uniqueRoles = new Set(team.map(t => t.role)).size;
  return { total, withAvatar, noAvatar, uniqueRoles };
}, [team]);


  const askRemove = (m) => setAskDelete({ open:true, target:m });
  const confirmRemove = () => {
    const m = askDelete.target;
    setTeam(t => t.filter(x => x.id !== m.id));
    setAskDelete({ open:false, target:null });
  };

  return (
    <div className="uk-wrap">
      <StyleOnce />

      {/* Statistiques de l'équipe */}
<div className="uk-kpi-grid">
  <KPI
    title="Membres au total"
    value={stats.total}
    icon={<FiUsers className="text-2xl" />}
    gradient="linear-gradient(135deg,#6366f1,#06b6d4)"
  />
  <KPI
    title="Avec avatar"
    value={stats.withAvatar}
    icon={<FiUserCheck className="text-2xl" />}
    gradient="linear-gradient(135deg,#10b981,#22d3ee)"
  />
  <KPI
    title="Sans avatar"
    value={stats.noAvatar}
    icon={<FiUserX className="text-2xl" />}
    gradient="linear-gradient(135deg,#fb923c,#ef4444)"
  />
  <KPI
    title="Rôles uniques"
    value={stats.uniqueRoles}
    icon={<FiGrid className="text-2xl" />}
    gradient="linear-gradient(135deg,#64748b,#94a3b8)"
  />
</div>

    <div className="uk-header">
  <button className="uk-addbtn" onClick={() => setOpenAdd(true)}>
    <FiPlus /> Ajouter un membre
  </button>
</div>




<FilterBar
  q={q} setQ={setQ}
  type={type} setType={setType}
  status={status} setStatus={setStatus}
  sortKey={sortKey} setSortKey={setSortKey}
  sortDir={sortDir} setSortDir={setSortDir}
  roleOptions={roleOptions}
/>

<div className="uk-grid">
  {pagedTeam.map((m) => (
      <UiverseCard
            key={m.id}
            name={m.name}
            role={m.role}
            email={m.email}
            avatar={m.avatar}
            cardBg={m.cardBg}
            onView={() => openDetailsFor(m)}
            onEdit={() => openEditFor(m)}
            onDelete={() => askRemove(m)}
          />
  ))}
</div>

<div className="uk-pagination">
  <div className="uk-pagination-info">
    {filteredTeam.length} membre(s) • page {page} / {pageCount}
  </div>
  <div className="uk-pagination-actions">
    <button
      className="pg-btn"
      disabled={page === 1}
      onClick={() => setPage(p => Math.max(1, p - 1))}
      aria-label="Précédent"
    >
      <FiChevronLeft />
    </button>

    {Array.from({ length: pageCount }, (_, i) => i + 1).map(n => (
      <button
        key={n}
        className={`pg-btn num ${n === page ? "active" : ""}`}
        onClick={() => setPage(n)}
      >
        {n}
      </button>
    ))}

    <button
      className="pg-btn"
      disabled={page === pageCount}
      onClick={() => setPage(p => Math.min(pageCount, p + 1))}
      aria-label="Suivant"
    >
      <FiChevronRight />
    </button>
  </div>
</div>



    

      <MemberFormModal
        open={openAdd}
        title="Ajouter un membre"
        onClose={() => setOpenAdd(false)}
        onSubmit={addMember}
      />
      <MemberFormModal
        open={openEdit}
        title={`Modifier ${current?.name || ""}`}
        initial={current}
        onClose={() => setOpenEdit(false)}
        onSubmit={updateMember}
      />
      <DetailsModal
        open={openDetails}
        data={current}
        onClose={() => setOpenDetails(false)}
        onEdit={() => { setOpenDetails(false); setOpenEdit(true); }}
      />

      <ConfirmDialog
        open={askDelete.open}
        title="Supprimer ce membre ?"
        text={askDelete.target ? `${askDelete.target.name} sera supprimé définitivement.` : ""}
        onCancel={()=>setAskDelete({open:false,target:null})}
        onConfirm={confirmRemove}
      />
    </div>
  );
}

/* ====== Styles ====== */
function StyleOnce() {
  useEffect(() => {
    if (document.getElementById("uk-uiverse-css")) return;
    const s = document.createElement("style");
    s.id = "uk-uiverse-css";
    s.innerHTML = `
/* Page + header */
.uk-wrap{position:relative;padding:24px;min-height:100vh;box-sizing:border-box;overflow:hidden}
.uk-header{position:relative;z-index:2;display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}
.uk-addbtn{display:inline-flex;margin-bottom:8px;align-items:center;gap:10px;padding:12px 16px;border-radius:16px;border:0;background:linear-gradient(135deg,#4f46e5,#06b6d4);color:#fff;font:800 14px/1 ui-sans-serif;box-shadow:0 10px 24px rgba(79,70,229,.35);transition:.2s}
.uk-addbtn:hover{transform:translateY(-1px);box-shadow:0 16px 36px rgba(79,70,229,.45)}

/* Barre de filtres */
.filterbar{
  display:grid; grid-template-columns: 1.2fr .8fr .6fr .8fr; gap:12px;
  background:#fff; border:1px solid rgba(2,6,23,.06); border-radius:14px; padding:10px;
  box-shadow:0 10px 24px rgba(2,6,23,.06); margin-bottom:22px;
}
.f-search{display:flex; align-items:center; gap:8px; border:1px solid rgba(2,6,23,.08); border-radius:12px; padding:10px 12px; background:#f8fafc}
.f-search svg{opacity:.6}
.f-search input{border:0; outline:0; background:transparent; width:100%}
.f-select{display:flex; align-items:center; gap:8px; border:1px solid rgba(2,6,23,.08); border-radius:12px; padding:8px 10px; background:#fff}
.f-select span{font:700 12px ui-sans-serif; color:#64748b}
.f-select select{border:0; outline:0; background:transparent; font:700 13px ui-sans-serif}
.f-sort{justify-content:space-between}
.f-sort .dir{border:1px solid rgba(2,6,23,.1); border-radius:10px; background:#fff; width:34px; height:34px}

/* Grille: 3 colonnes */
.uk-grid{position:relative;z-index:1;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:28px}
@media (max-width:1100px){ .uk-grid{grid-template-columns:repeat(2,minmax(0,1fr));} }
@media (max-width:640px){ .uk-grid{grid-template-columns:1fr;} }

/* Carte Uiverse */
.uk-container{display:flex;align-items:center;justify-content:center;width:100%}
.card_box{
  width:100%; height:var(--h,360px); border-radius:28px;
  background:linear-gradient(135deg,#22d3ee,#a78bfa,#34d399);
  position:relative; box-shadow:0 30px 60px rgba(2,6,23,.22);
  cursor:pointer; transition:transform .25s ease, box-shadow .25s ease;
}
.card_box:hover{transform:translateY(-4px); box-shadow:0 44px 86px rgba(2,6,23,.28)}

/* Ruban rôle — violet → cyan */
.uk-ribbon{position:absolute;overflow:hidden;width:190px;height:190px;top:-18px;left:-18px;display:flex;align-items:center;justify-content:center;pointer-events:none}
.uk-ribbon::before{
  content: attr(data-role);
  position:absolute;width:170%;height:50px;
  background:linear-gradient(45deg, #7c3aed 0%, #06b6d4 60%, #7c3aed 100%);
  transform:rotate(-45deg) translateY(-24px);
  display:flex;align-items:center;justify-content:center;color:#fff;
  font:800 12px/1 ui-sans-serif;letter-spacing:.09em;text-transform:uppercase;
  box-shadow:0 5px 10px rgba(0,0,0,.23);
}
.uk-ribbon::after{content:'';position:absolute;width:10px;height:10px;bottom:0;left:0;z-index:-1;box-shadow:170px -170px rgba(0,0,0,.15)}

/* Contenu carte (TEXTE PLUS GRAND) */
.cb-inner{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:22px;gap:12px}
.cb-avatar{
  width:72px;height:72px;border-radius:50%;
  display:grid;place-items:center;
  background:transparent;
  border:3px solid rgba(255,255,255,.95);
  box-shadow:0 6px 16px rgba(0,0,0,.18);
  overflow:hidden;
  color:#fff;
}
.cb-avatar.big{width:92px;height:92px}
.cb-avatar.huge{width:130px;height:130px}
.cb-avatar img{width:100% !important;height:100% !important;object-fit:cover;display:block;border-radius:inherit}
.cb-avatar span{font:900 24px/1 ui-sans-serif;letter-spacing:.6px}
.cb-name{color:#fff;font:900 20px/1.2 ui-sans-serif;text-align:center;margin-top:10px;text-shadow:0 1px 0 rgba(0,0,0,.15)}
.cb-mail{color:rgba(255,255,255,.98);font:800 14px/1.35 ui-sans-serif;text-align:center}

/* Actions */
.cb-actions{position:absolute;left:14px;right:14px;bottom:14px;display:flex;gap:12px;justify-content:center}
.cb-btn{
  width:40px;height:40px;display:grid;place-items:center;border-radius:12px;border:1px solid rgba(255,255,255,.28);
  background:rgba(255,255,255,.16);color:#fff;font-size:18px;backdrop-filter:blur(3px);
  transition:transform .18s ease, background .18s ease, box-shadow .18s ease;
}
.cb-btn:hover{transform:translateY(-2px);background:rgba(255,255,255,.22);box-shadow:0 8px 16px rgba(0,0,0,.15)}
.cb-btn.danger{background:rgba(244,63,94,.22);border-color:rgba(244,63,94,.35)}
.cb-btn.danger:hover{background:rgba(244,63,94,.32)}

/* Modales + formulaire + détails */
.uk-modal{position:fixed;inset:0;z-index:50;display:grid;place-items:center;background:rgba(2,6,23,.32);backdrop-filter:blur(4px);animation:fade .15s ease-out both}
@keyframes fade{from{opacity:0}to{opacity:1}}
.uk-dialog{width:min(720px,92vw);background:linear-gradient(180deg,rgba(255,255,255,.95),#fff);border:1px solid rgba(2,6,23,.08);border-radius:20px;padding:18px;box-shadow:0 20px 60px rgba(0,0,0,.25);animation:pop .22s cubic-bezier(.2,.8,.2,1) both}
.uk-dialog.details{width:min(520px,92vw)}
@keyframes pop{from{opacity:0;transform:translateY(8px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}
.uk-dialog-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}
.uk-dialog-head h3{margin:0;font:900 18px/1.2 ui-sans-serif}
.uk-close{border:0;background:#eef2ff;border-radius:10px;width:34px;height:34px;display:grid;place-items:center}

.uk-form{display:block;margin-top:8px}
.frm-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}
@media (max-width:640px){ .frm-grid{grid-template-columns:1fr} }
.uk-form label{display:grid;gap:6px;font:700 12px/1.2 ui-sans-serif;color:#475569}
.uk-form input{padding:11px 12px;border-radius:12px;border:1px solid rgba(2,6,23,.12);font:600 14px/1.2 ui-sans-serif;outline:none}
.uk-form input:focus{box-shadow:0 0 0 4px rgba(99,102,241,.18)}
.file-u{display:flex;align-items:center;gap:10px}
.file-btn{display:inline-flex;align-items:center;gap:8px;padding:10px 12px;border-radius:12px;border:1px dashed rgba(2,6,23,.25);cursor:pointer}
.file-btn input{display:none}
.file-preview img{width:44px;height:44px;border-radius:10px;object-fit:cover}
.pwd{display:flex;align-items:center;gap:8px}
.pwd input{flex:1}
.pwd button{width:40px;height:40px;border-radius:10px;border:1px solid rgba(2,6,23,.1);background:#fff;display:grid;place-items:center}

.uk-actions-row{display:flex;justify-content:flex-end;gap:10px;margin-top:12px}
.uk-btn{display:inline-flex;align-items:center;gap:8px;padding:11px 14px;border-radius:12px;border:1px solid rgba(2,6,23,.1);font:800 13px ui-sans-serif}
.uk-btn.primary{background:linear-gradient(135deg,#4f46e5,#06b6d4);color:#fff;border:0}
.uk-btn.ghost{background:#fff}

.dt-body{display:grid;justify-items:center;padding:10px 8px 2px}
.cb-avatar.huge span{font-size:28px}
.dt-name{font:900 18px/1.1 ui-sans-serif;margin-top:8px}
.dt-role{font:800 12px/1 ui-sans-serif;color:#475569;margin-top:4px;text-transform:uppercase;letter-spacing:.06em}
.dt-mail{font:700 12px/1.4 ui-sans-serif;margin-top:6px;color:#334155}

/* SweetAlert maison */
.sa-mask{position:fixed;inset:0;background:rgba(2,6,23,.45);backdrop-filter:blur(2px);display:grid;place-items:center;z-index:60;animation:fade .12s ease-out both}
.sa-card{width:min(420px,92vw);background:#fff;border-radius:18px;border:1px solid rgba(2,6,23,.08);box-shadow:0 18px 50px rgba(0,0,0,.25);padding:18px;text-align:center;animation:pop .18s ease-out both}
.sa-icon{width:48px;height:48px;margin:0 auto 8px;background:linear-gradient(135deg,#ef4444,#f59e0b);color:#fff;border-radius:999px;display:grid;place-items:center;font:900 20px ui-sans-serif;box-shadow:0 10px 20px rgba(239,68,68,.35)}
.sa-title{font:900 18px ui-sans-serif;margin-top:4px}
.sa-text{margin-top:6px;color:#475569;font:600 13px/1.5 ui-sans-serif}
.sa-actions{display:flex;justify-content:center;gap:10px;margin-top:12px}
.sa-btn{padding:10px 14px;border-radius:12px;border:1px solid rgba(2,6,23,.1);font:800 13px ui-sans-serif}
.sa-btn.ghost{background:#fff}
.sa-btn.danger{background:linear-gradient(135deg,#ef4444,#f59e0b);color:#fff;border:0}
/* --- Barre de filtres --- */
.filterbar{
  display:grid;
  grid-template-columns: 1.2fr .8fr .6fr .8fr;
  gap:12px;
  background:#fff;
  border:1px solid rgba(2,6,23,.06);
  border-radius:14px;
  padding:10px;
  box-shadow:0 10px 24px rgba(2,6,23,.06);
  margin-bottom:35px;
}
.f-search{
  display:flex; align-items:center; gap:8px;
  border:1px solid rgba(2,6,23,.08);
  border-radius:12px; padding:10px 12px;
  background:#f8fafc;
}
.f-search svg{opacity:.6}
.f-search input{border:0; outline:0; background:transparent; width:100%}

.f-select{
  display:flex; align-items:center; gap:8px;
  border:1px solid rgba(2,6,23,.08);
  border-radius:12px; padding:8px 10px; background:#fff;
}
.f-select span{font:700 12px ui-sans-serif; color:#64748b}
.f-select select{border:0; outline:0; background:transparent; font:700 13px ui-sans-serif}

.f-sort{justify-content:space-between}
.f-sort .dir{
  border:1px solid rgba(2,6,23,.1);
  border-radius:10px; background:#fff;
  width:34px; height:34px;
}

/* Focus halo élégant sur la recherche */
.filterbar .f-search:has(input:focus){
  box-shadow: 0 8px 24px rgba(2,6,23,.12), 0 0 0 4px rgba(99,102,241,.18);
}

/* Responsive */
@media (max-width: 1024px){
  .filterbar{ grid-template-columns: 1fr 1fr; }
}
@media (max-width: 640px){
  .filterbar{ grid-template-columns: 1fr; }
}

/* Pagination */
.uk-pagination{
  display:flex; align-items:center; justify-content:space-between;
  margin-top:16px; gap:12px; padding:8px 4px;
}
.uk-pagination-info{font:700 12px/1.2 ui-sans-serif; color:#64748b}
.uk-pagination-actions{display:flex; align-items:center; gap:6px}
.pg-btn{
  min-width:36px; height:36px; padding:0 10px;
  display:inline-flex; align-items:center; justify-content:center;
  border-radius:10px; border:1px solid rgba(2,6,23,.1);
  background:#fff; box-shadow:0 6px 14px rgba(2,6,23,.08);
  font:800 13px ui-sans-serif; transition:.15s ease;
}
.pg-btn:hover{transform:translateY(-1px); box-shadow:0 10px 22px rgba(2,6,23,.12)}
.pg-btn:disabled{opacity:.45; transform:none; box-shadow:none; cursor:not-allowed}
.pg-btn.num.active{
  background:linear-gradient(135deg,#4f46e5,#06b6d4); color:#fff; border-color:transparent;
  box-shadow:0 10px 24px rgba(79,70,229,.35);
}

/* ---- KPI grid (comme la page support) ---- */
.uk-kpi-grid{
  display:grid; gap:16px; grid-template-columns: repeat(1,minmax(0,1fr));
  margin-bottom:18px;
}
@media (min-width:640px){ .uk-kpi-grid{ grid-template-columns: repeat(2,minmax(0,1fr)); } }
@media (min-width:1024px){ .uk-kpi-grid{ grid-template-columns: repeat(4,minmax(0,1fr)); } }

.uk-kpi{
  position:relative; overflow:hidden; border-radius:18px;
  border:1px solid rgba(255,255,255,.55);
  background: rgba(255,255,255,.7); backdrop-filter: blur(10px);
  box-shadow: 0 14px 48px rgba(2,6,23,.12);
}
.uk-kpi-bg{ position:absolute; inset:0; opacity:.25; }
.uk-kpi-blob{ position:absolute; right:-28px; top:-28px; width:110px; height:110px; border-radius:999px; background:#fff; filter:blur(22px); opacity:.35; pointer-events:none; }
.uk-kpi-shine{ position:absolute; left:-10%; top:-40%; width:33%; height:200%; transform:rotate(12deg); background:rgba(255,255,255,.35); filter:blur(10px); pointer-events:none; }
.uk-kpi-content{ position:relative; display:flex; align-items:center; gap:14px; padding:16px 18px; }
.uk-kpi-icon{
  display:grid; place-items:center; width:48px; height:48px; border-radius:12px; color:#fff;
  box-shadow: 0 10px 20px rgba(0,0,0,.15); border:1px solid rgba(255,255,255,.45);
}
.uk-kpi-ring{ position:absolute; inset:0; border-radius:18px; pointer-events:none; box-shadow: inset 0 0 0 1px rgba(255,255,255,.55); }



`;
    document.head.appendChild(s);
  }, []);
  return null;
}
