// src/services/factureService.js
import api from "./api";

// Si ton axios a déjà baseURL = Constants.APP_ROOT, la racine suffit :
const ROOT = "/factures";

// ---------- MAPPINGS (backend -> UI) ----------
const TYPE_MAP = { CRECHE: "creche", GARDERIE: "garderie", ECOLE: "ecole" };
const STATUS_LABEL = {
  PAYEE: "Payée",
  IMPAYEE: "impayée",
  EN_ATTENTE: "impayée", // on la range côté "à payer"
  ANNULEE: "annulée",
};

function enumToTypeSlug(enumVal) {
  if (!enumVal) return "";
  return TYPE_MAP[String(enumVal).toUpperCase()] || String(enumVal).toLowerCase();
}
function enumToStatusLabel(enumVal) {
  if (!enumVal) return "";
  return STATUS_LABEL[String(enumVal).toUpperCase()] || String(enumVal);
}

// petit util pour date -> "fr-FR"
function fmtFrDate(d) {
  try {
    const dd = d ? new Date(d) : null;
    return dd && !isNaN(dd) ? dd.toLocaleString("fr-FR") : "";
  } catch { return ""; }
}


export function pickAvatarGradient(seed = "") {
  const grads = [
    "from-fuchsia-500 to-orange-400",
    "from-sky-500 to-cyan-400",
    "from-amber-400 to-red-400",
    "from-emerald-400 to-teal-500",
    "from-indigo-500 to-violet-500",
    "from-rose-500 to-orange-400",
    "from-cyan-400 to-emerald-400",
    "from-amber-400 to-lime-400",
  ];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return grads[h % grads.length];
}


// --------- Transformer FactureResponseDto -> row UI ---------
function mapFactureToRow(f) {
  if (!f) return null;

  // 1) Support des 2 schémas
  const id      = f.id || f.idFacture || f.reference || "";
  const dateRaw = f.dateFacture || f.date || null;

  // si le backend renvoie un sous-objet etablissement
  const etabObj = f.etablissement || {};
  // sinon, les champs aplatís
  const nomEtab = etabObj.nomEtablissement || f.nomEtablissement || "";
  const region  = etabObj.region            || f.gouvernorat       || "";
  const email   = etabObj.email             || f.email             || "";
  const typeRaw = etabObj.type              || f.type              || "";

  // 2) Enum -> affichage
  const typeSlug    = enumToTypeSlug(typeRaw);             // CRECHE|GARDERIE|ECOLE -> creche|...
  const statusLabel = enumToStatusLabel(f.statutFacture || f.statut);

  return {
    id,
    date: fmtFrDate(dateRaw) || (typeof dateRaw === "string" ? dateRaw : ""),
    client: nomEtab,
    type: typeSlug || "creche",
    region,
    email,
    status: statusLabel || "impayée",
    avatarColor: pickAvatarGradient(nomEtab || id),

    // champs bruts si besoin ailleurs
    methode: f.methode,
    reference: f.reference,
    montant: f.montant,
    raw: f,
  };
}


// ========================= API =========================
export async function getFactures() {
  const { data } = await api.get(`${ROOT}/all`);
  const list = Array.isArray(data) ? data : [];
  return list.map(mapFactureToRow).filter(Boolean);
}

export async function getFactureById(id) {
  const { data } = await api.get(`${ROOT}/${id}`);
  return mapFactureToRow(data);
}

// dto: { etablissementId, methode, statutFacture }
export async function createFacture(dto) {
  const { data } = await api.post(`${ROOT}/add/facture`, dto);
  return mapFactureToRow(data);
}

// Totaux (optionnel pour tes tuiles KPI)
export async function getTotals() {
  const [t, p, i] = await Promise.all([
    api.get(`${ROOT}/total`),
    api.get(`${ROOT}/total/payees`),
    api.get(`${ROOT}/total/impayees`),
  ]);
  return {
    total: Number(t?.data) || 0,
    payees: Number(p?.data) || 0,
    impayees: Number(i?.data) || 0,
  };
}

// Pas exposé par le backend actuel
export async function deleteFacture(/*id*/) {
  throw new Error("DELETE non exposé par le backend (ajoute un endpoint pour persister la suppression).");
}
export async function updateFacture(/*id, dto*/) {
  throw new Error("PUT/PATCH non exposé par le backend (ajoute un endpoint pour persister la modification).");
}


 export async function getEtablissementById(id) {
  const { data } = await api.get(`/etablissement/${id}`);
  return data; // { idEtablissement, nomEtablissement, email, region, type, ... }
}

export async function getAbonnementByEtablissement(etabId) {
  const { data } = await api.get(`/abonnement/byetablissement/${etabId}`);
  return data; // { idAbonnement, formule, montantTotal, montantDu, dateDebutAbonnement, ... }
}

// retourne la facture mappée + les objets etab & abo
export async function getFactureFull(id) {
  const { data } = await api.get(`${ROOT}/${id}`); // dto backend
  // ---- extrait l'id etab quelle que soit la forme ----
  const etabId =
    data?.etablissement?.idEtablissment ||
    data?.etablissement?.idEtablissement ||
    data?.idEtablissment ||
    data?.idEtablissement ||
    data?.etablissementId ||
    null;

  let etab = null, abo = null;
  if (etabId) {
    try { etab = await getEtablissementById(etabId); } catch {}
    try { abo  = await getAbonnementByEtablissement(etabId); } catch {}
  }

  // construit une “row” compatible avec ta UI + garde les bruts
  const row = {
    id: data.id || data.idFacture || data.reference || "",
    date: (data.dateFacture || data.date) ? new Date(data.dateFacture || data.date).toLocaleString("fr-FR") : "",
    // côté preview on prendra d'abord les infos “etab”
    client:  etab?.nomEtablissement || data.nomEtablissement || "",
    email:   etab?.email            || data.email || "",
    region:  etab?.region           || data.gouvernorat || "",
    type:    (etab?.type || data.type || "CRECHE").toString().toLowerCase(),
    status:  (data.statutFacture || data.statut || "IMPAYEE").toUpperCase() === "PAYEE" ? "Payée" : "impayée",
    avatarColor: pickAvatarGradient((etab?.nomEtablissement || "") + (data.id || "")),
    raw: data,
    _etab: etab,
    _abo:  abo,
  };

  return row;
}


// ---- Totaux pour KPI ----
export async function getTotalsStats() {
  const [t, p, i] = await Promise.all([
    api.get(`${ROOT}/total`),
    api.get(`${ROOT}/total/payees`),
    api.get(`${ROOT}/total/impayees`),
  ]);
  return {
    total: Number(t?.data) || 0,
    payees: Number(p?.data) || 0,
    impayees: Number(i?.data) || 0,
    // envoyees: Number(e?.data) || 0, // si un jour tu ajoutes /total/envoyees
  };
}