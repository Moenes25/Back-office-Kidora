// src/services/dashboardService.js
import api from "./api";
import axios from "axios";

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


export const getChiffreAffairesTotal = async () => {
  try {
    const response = await api.get("/abonnement/all");
    const abonnements = response.data;

    // On additionne tous les `montantPaye` valides
    const total = abonnements.reduce((sum, abn) => {
      const montant = parseFloat(abn.montantPaye);
      return sum + (isNaN(montant) ? 0 : montant);
    }, 0);

    return total;
  } catch (error) {
    console.error("Erreur lors du calcul du chiffre d'affaires total :", error);
    return 0;
  }
};

// 🔔 Récupère les données pour AlertsPanel
export const getAlertsData = async () => {
  try {
    // 1️⃣ Abonnements en retard
    const resAbonnements = await api.get("/abonnement/all");

    const today = new Date();

    const latePayments = (resAbonnements.data || [])
      .filter(
        (ab) =>
          ab &&
          ab.statut === "RETARD" &&
          ab.etablissement &&
          ab.etablissement.nomEtablissement
      )
      .map((ab) => {
        let daysLate = "?";

        if (ab.dateFinAbonnement) {
          const dateFin = new Date(ab.dateFinAbonnement);
          const diff = today - dateFin;
          daysLate = diff > 0 ? Math.floor(diff / (1000 * 60 * 60 * 24)) : 0;
        }

        return {
          name: ab.etablissement.nomEtablissement,
          days: daysLate,
          amount: `${ab.montantDu ?? 0} DT`,
        };
      });

    // 2️⃣ Clients inactifs
    const resEtab = await api.get("/etablissement/all");

    const inactiveClients = (resEtab.data || [])
      .filter((etab) => etab && etab.isActive === false)
      .map((etab) => ({
        name: etab.nomEtablissement,
        days: "?"
      }));

    return {
      latePayments,
      inactiveClients
    };
  } catch (error) {
    console.error("Erreur lors du chargement des alertes :", error);
    return {
      latePayments: [],
      inactiveClients: []
    };
  }
};




/* ======================
   CROISSANCE
   ====================== */
export async function getCroissanceData() {
  const res = await api.get("/etablissement/croissance");
  const rawData = res.data;

  console.log("✅ Données reçues pour la croissance :", rawData);

  const months = [
    "janvier", "février", "mars", "avril", "mai", "juin",
    "juillet", "août", "septembre", "octobre", "novembre", "décembre"
  ];

  let garderies = [];
  let creches = [];
  let ecoles = [];

  months.forEach((mois) => {
    const found = rawData.find((d) => d.mois.toLowerCase() === mois);
    garderies.push(found?.nombreGarderies ?? 0);
    creches.push(found?.nombreCreches ?? 0);
    ecoles.push(found?.nombreEcoles ?? 0);
  });

  // ✅ Si toutes les valeurs sont à 0, injecter des données aléatoires (mock)
  const allZero = [...garderies, ...creches, ...ecoles].every((val) => val === 0);
  if (allZero) {
    console.warn("🔧 Injection de données fictives pour test.");
    garderies = months.map(() => Math.floor(Math.random() * 10));
    creches = months.map(() => Math.floor(Math.random() * 5));
    ecoles = months.map(() => Math.floor(Math.random() * 3));
  }

  return [
    { type: "GARDERIE", valeurs: garderies },
    { type: "CRECHE", valeurs: creches },
    { type: "ECOLE", valeurs: ecoles },
  ];
}




/* ======================
   RÉPARTITION ANNUELLE
   ====================== */
export async function getRepartitionAnnuelle(annee = 2024) {
 const res = await api.get("/etablissement/repartition-annuelle");
  return res.data;
}


export async function getAllAbonnements() {
  try {
    const res = await api.get("/abonnement/all");
    return res.data;
  } catch (err) {
    console.error("Erreur lors du chargement des abonnements :", err);
    return [];
  }
}
