import api from "./api";



const TYPE_MAP = {
  creches: "CRECHE",
  garderies: "GARDERIE",
  ecoles: "ECOLE",
};

const REVERSE_TYPE_MAP = {
  CRECHE: "creches",
  GARDERIE: "garderies",
  ECOLE: "ecoles",
};

export async function getEventCountForWeek(type) {
  const res = await api.get("/evenement/countCurrentWeek", {
    params: { type: TYPE_MAP[type] },
  });
  return res.data;
}

export async function getEventCountToday(type) {
  const res = await api.get("/evenement/countToday", {
    params: { type: TYPE_MAP[type] },
  });
  return res.data;
}

export async function getEventCountByType(type) {
  const res = await api.get("/evenement/countByType", {
    params: { type: TYPE_MAP[type] },
  });
  return res.data;
}

export async function getTotalHeuresPlanifiees(type) {
  const res = await api.get("/evenement/totalHeuresPlanifiees", {
    params: { type: TYPE_MAP[type] },
  });
  return res.data;
}





function formatTime(t) {
  if (!t) return "";
  // Si déjà au bon format, on garde
  if (/^\d{2}:\d{2}$/.test(t)) return t;
  // Sinon on coupe (ex: "11:12:17.201" => "11:12")
  return t.split(":").slice(0, 2).join(":");
}

function toFullTimeFormat(t) {
  if (!t) return null;
  // "11:12" -> "11:12:00.000"
  return t.length === 5 ? `${t}:00.000` : t;
}

export async function fetchEvents() {
  const res = await api.get("/evenement/all");

  return res.data.map(ev => ({
    id: ev.idEvenement,
    title: ev.titre,
    desc: ev.description,
    date: ev.date,
    start: formatTime(ev.heureDebut),
    end: formatTime(ev.heureFin),
    type: REVERSE_TYPE_MAP[ev.type] ?? "creches",
    org: ev.idEtablissement,         // ✅ UTILISER L'ID ici
    orgName: ev.nomEtablissement     // (optionnel : pour affichage dans EventCard)
  }));
}



export async function addEvent(event) {
  const payload = {
    titre: event.title,
    description: event.desc,
    date: event.date,
    heureDebut: toFullTimeFormat(event.start),
    heureFin: toFullTimeFormat(event.end),
    type: TYPE_MAP[event.type],
    etablissementId: event.org,
  };

  console.log("🚀 Payload envoyé au backend :", payload); // ← ajoute cette ligne

  const res = await api.post("/evenement/save", payload);
  return res.data;
}




export async function updateEvent(event) {
  const payload = {
    titre: event.title,
    description: event.desc,
    date: event.date,
    heureDebut: toFullTimeFormat(event.start),
    heureFin: toFullTimeFormat(event.end),
    type: TYPE_MAP[event.type],
    etablissementId: event.org,
  };

  console.log("✏️ Payload UPDATE :", payload);

  const res = await api.put(`/evenement/update/${event.id}`, payload);
  return res.data;
}


export async function deleteEvent(eventId) {
  const res = await api.delete(`/evenement/delete/${eventId}`);
  return res.data;
}
export async function fetchEtablissementsByType(type) {
  const typeMap = {
    creches: "CRECHE",
    garderies: "GARDERIE",
    ecoles: "ECOLE",
  };

  const expectedType = typeMap[type];

  try {
    const res = await api.get("/etablissement/all");

    return res.data
      .filter(e => e.type === expectedType && e.isActive)
   .map(e => ({
  idEtablissement: e.idEtablissment ?? e.idEtablissement ?? e.idetablissement,
  nomEtablissement: e.nomEtablissement ?? e.nometablissement,
}))

  } catch (err) {
    console.error("❌ Erreur chargement établissements :", err);
    return [];
  }
}











