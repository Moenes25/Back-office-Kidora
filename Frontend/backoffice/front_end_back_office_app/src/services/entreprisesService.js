import api from "./api";


// Récupérer toutes les entreprises avec leurs abonnements (statuts)
export async function getEntreprisesStats() {
  try {
    const [resEntreprises, resAbonnements] = await Promise.all([
      api.get("/etablissement/all"),
      api.get("/abonnement/all"),
    ]);

    const entreprises = resEntreprises.data || [];
    const abonnements = resAbonnements.data || [];

    // Lier chaque entreprise à son dernier abonnement
    const abnMap = {};
    for (const abn of abonnements) {
      const id = abn.etablissement?.idEtablissment;
      if (!id) continue;
      if (!abnMap[id] || new Date(abn.dateFinAbonnement) > new Date(abnMap[id].dateFinAbonnement)) {
        abnMap[id] = abn;
      }
    }

    // Compter par statut
    let total = entreprises.length;
    let actifs = 0;
    let essais = 0;
    let retards = 0;

    for (const e of entreprises) {
      const abn = abnMap[e.idEtablissment];
      const statut = abn?.statut;

      if (statut === "PAYEE") actifs++;
      else if (statut === "ESSAYE") essais++;
      else if (statut === "RETARD") retards++;
    }

    return { total, actifs, essais, retards };
  } catch (err) {
    console.error("❌ Erreur récupération statistiques entreprises :", err);
    return { total: 0, actifs: 0, essais: 0, retards: 0 };
  }
}


// 🔁 Récupérer tous les établissements
export async function getAllEtablissements() {
  try {
    const res = await api.get("/etablissement/all");
    return res.data || [];
  } catch (err) {
    console.error("Erreur fetch établissements :", err);
    return [];
  }
}

// ✅ Ajouter un établissement
export async function saveEtablissement(payload) {
  try {
    const res = await api.post("/etablissement/save", payload);
    return res.data;
  } catch (err) {
    console.error("Erreur ajout établissement :", err);
    throw err;
  }
}

// services/entreprisesService.js

export async function saveAbonnement(payload) {
  try {
    const res = await api.post("/abonnement/save", payload);
    return res.data;
  } catch (err) {
    console.error("Erreur ajout abonnement :", err);
    throw err;
  }
}


// ✏️ Modifier un établissement
export async function updateEtablissement(id, payload) {
  try {
    const res = await api.put(`/etablissement/update/${id}`, payload);
    console.log("Payload envoyé :", payload);


    return res.data;
  } catch (err) {
    console.error("Erreur update établissement :", err);
    throw err;
  }
}

export async function updateAbonnement(id, data) {
  return await api.put(`/abonnement/update/${id}`, data);

}


// 🗑️ Supprimer un établissement
export async function deleteEtablissement(id) {
  try {
    await api.delete(`/etablissement/delete/${id}`);
    return true;
  } catch (err) {
    console.error("Erreur suppression établissement :", err);
    return false;
  }
}

// utils/token.js
export function getUserFromToken() {
  const token = localStorage.getItem("token");

  if (!token) return null;

  try {
    const base64Payload = token.split('.')[1];
    const decoded = JSON.parse(atob(base64Payload));
    return decoded; // contient { id, username, role, sub, exp, ... }
  } catch (e) {
    console.error("Token parsing error:", e);
    return null;
  }
}




export async function registerClientAdmin({ nom, prenom = "", email, password, numTel = "", adresse = "", imageFile = null }) {
  const fd = new FormData();
  fd.append("nom", nom);
  fd.append("prenom", prenom);
  fd.append("email", email);
  fd.append("password", password);
  fd.append("role", "ADMIN"); // enum côté backend
  fd.append("numTel", numTel);
  fd.append("adresse", adresse);
  fd.append("profession", "");
  fd.append("relation", "");
  fd.append("specialisation", "");
  fd.append("experience", "");
  fd.append("disponibilite", "");
  if (imageFile) fd.append("imageFile", imageFile); // ✅ correspond au nom dans DTO


  const { data } = await api.post("/client/register", fd); // <-- /api/client/register
  return data;
}




export async function getEtabStats(idEtablissement) {
  try {
    const res = await api.get("/etablissement/count-by-role", {
      params: { idEtablissement }
    });
    return res.data || { parents: 0, educateurs: 0 };
  } catch (err) {
    console.error("Erreur récupération stats établissement :", err);
    return { parents: 0, educateurs: 0 };
  }
}
