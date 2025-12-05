// src/services/dashboardService.js
import api from "./api";

// Crèches actives
export const getCrecheActives = async () => {
  const response = await api.get("/etablissement/crecheactive");
  console.log("Crèches actives:", response.data); // <- ajoute ceci
  return response.data;
};

// Écoles actives
export const getEcoleActives = async () => {
  const response = await api.get("/etablissement/ecoleactive");
  return response.data;
};

// Garderies actives
export const getGarderieActives = async () => {
  const response = await api.get("/etablissement/garderieactive");
  return response.data;
};

// Etablissements abonnés ce mois
export const getEtablissementsCeMois = async () => {
  const response = await api.get("/etablissement/cemois");
  return response.data;
};
