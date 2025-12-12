// src/services/dashboardService.js
import api from "./api";

// 🏫 Nombre d’établissements
export const getTotalEtablissements = async () => {
  try {
    const response = await api.get("/etablissement/all");
    return response.data.length;
  } catch (error) {
    console.error("Erreur lors de la récupération des établissements:", error);
    return 0;
  }
};

// 👨‍👩‍👧 Nombre de parents
export const getTotalParents = async () => {
  try {
    const response = await api.get("/auth/total-parents");
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération du total des parents:", error);
    return 0;
  }
};

// 👶 Nombre d’enfants
export const getTotalChildren = async () => {
  try {
    const response = await api.get("/auth/total-children");
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération du total des enfants:", error);
    return 0;
  }
};

// 💰 Chiffre d’affaire total
export const getChiffreAffaireTotal = async () => {
  try {
    const res = await api.get("/abonnement/chiffre-affaire-total");
    return res.data;
  } catch (e) {
    console.error("Erreur:", e);
    return 0;
  }
};

export const getTotalActivities = async () => {
  try {
    const res = await api.get("/total-activities");
    return res.data;
  } catch (error) {
    console.error("Erreur lors de la récupération du total des activités:", error);
    return 0;
  }
};

// 🟠 Récupérer les abonnements en retard
export const fetchAbonnementsEnRetard = async () => {
  try {
    const res = await api.get("/abonnement/en-retard");
    return res.data;
  } catch (err) {
    console.error("Erreur fetchAbonnementsEnRetard :", err);
    return [];
  }
};

// 🔴 Récupérer les établissements inactifs
export const fetchEtablissementsInactifs = async () => {
  try {
    const res = await api.get("/etablissement/inactive");
    return res.data;
  } catch (err) {
    console.error("Erreur fetchEtablissementsInactifs :", err);
    return [];
  }
};
