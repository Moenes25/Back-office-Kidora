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
  const id = f.id || f.idFacture || f.reference || "";
  const dateRaw = f.dateFacture || f.date || null;

  // si le backend renvoie un sous-objet etablissement
  const etabObj = f.etablissement || {};
  // sinon, les champs aplatis
  const nomEtab = etabObj.nomEtablissement || f.nomEtablissement || "";
  const region  = etabObj.region || f.gouvernorat || "";
  const email   = etabObj.email  || f.email || "";
  const telephone   = etabObj.telephone   || f.telephone  || "";
  const typeRaw = etabObj.type   || f.type || "";

  // 2) Formatage
  const date = fmtFrDate(dateRaw);
  const typeSlug = enumToTypeSlug(typeRaw);
  const statusLabel = enumToStatusLabel(f.statutFacture || f.statut);

  return {
    id,
    date,
    client: nomEtab,
    type: typeSlug || "creche",
    region,
    email,
    telephone,
    status: statusLabel || "impayée",
    avatarColor: pickAvatarGradient(nomEtab || id),

    // 💰 MONTANTS
    montantHT: Number(f.montantHT ?? 0),
    montantTVA: Number(f.montantTVA ?? 0),
    timbreFiscal: Number(f.timbreFiscal ?? 1),
    montantTTC: Number(f.montantTTC ?? f.montant ?? 0),
    nombreEnfants: Number(f.nombreEnfants ?? 0),

    methode: f.methode,
    reference: f.reference,
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
  const { data } = await api.get(`${ROOT}/${id}`); // DTO backend

  // ---- infos de base depuis le DTO ----
  const idFacture = data.id || data.idFacture || data.reference || "";
  const dateRaw = data.dateFacture || data.date || null;

  const nomEtab = data.nomEtablissement || "";
  const email = data.email || "";
  const telephone = data.telephone || "";
  const region = data.gouvernorat || "";
  const typeRaw = data.type || "CRECHE";
  const statusRaw = data.statut || data.statutFacture || "IMPAYEE";

  // ---- formatage ----
  const date = dateRaw
    ? new Date(dateRaw).toLocaleString("fr-FR")
    : "";

  const type = enumToTypeSlug(typeRaw);
  const status = enumToStatusLabel(statusRaw);
  const avatarColor = pickAvatarGradient(nomEtab + idFacture);

  // ---- récupérer etablissement & abonnement (optionnel) ----
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

  // ---- row FINAL (PROPRE) ----
  return {
    id: idFacture,
    date,
    client: etab?.nomEtablissement || nomEtab,
    email: etab?.email || email,
    telephone: etab?. telephone || telephone,
    region: etab?.region || region,
    type,
    status,
    avatarColor,

    // 💰 FINANCIER (depuis backend)
    montantHT: Number(data.montantHT ?? 0),
    montantTVA: Number(data.montantTVA ?? 0),
    timbreFiscal: Number(data.timbreFiscal ?? 1),
    montantTTC: Number(data.montantTTC ?? 0),
    nombreEnfants: Number(data.nombreEnfants ?? 0),

    raw: data,
    _etab: etab,
    _abo: abo,
  };
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




