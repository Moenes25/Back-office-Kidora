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





export async function getNextExpirationsByType() {
  try {
    const res = await api.get("/abonnement/all");
    const abonnements = res.data;

    const now = new Date();

    // Filtrer les abonnements valides avec fin de date et établissement associé
    const valides = abonnements.filter(abn =>
      abn?.dateFinAbonnement &&
      abn?.etablissement &&
      abn.etablissement?.type &&
      abn.etablissement?.nomEtablissement
    );

    // Grouper les abonnements par type d’établissement
    const groupes = { creches: [], garderies: [], ecoles: [] };

    for (const abn of valides) {
      const dateFin = new Date(abn.dateFinAbonnement);
      const type = abn.etablissement.type.toLowerCase(); // "CRECHE" -> "creche"
    const daysLeft = Math.ceil((dateFin - now) / (1000 * 60 * 60 * 24));

// Formater J-X (restant) ou J+X (passé)
let restant = "";
if (daysLeft > 0) {
  restant = `J-${daysLeft}`;
} else if (daysLeft === 0) {
  restant = "J-0"; // aujourd’hui
} else {
  restant = `J+${Math.abs(daysLeft)}`; // abonnement expiré
}

const data = {
  nom: abn.etablissement.nomEtablissement,
  licence: abn.statut === "PAYEE" ? "Licence Active" :
           abn.statut === "RETARD" ? "En retard" :
           abn.statut === "ESSAYE" ? "En essai" : "Inconnue",
  date: dateFin.toLocaleDateString("fr-FR"),
  restant,
  daysLeft,
};


      if (type === "creche") groupes.creches.push(data);
      else if (type === "garderie") groupes.garderies.push(data);
      else if (type === "ecole") groupes.ecoles.push(data);
    }

    // Trier par expiration la plus proche
    return {
      creches: groupes.creches.sort((a, b) => a.daysLeft - b.daysLeft)[0] || null,
      garderies: groupes.garderies.sort((a, b) => a.daysLeft - b.daysLeft)[0] || null,
      ecoles: groupes.ecoles.sort((a, b) => a.daysLeft - b.daysLeft)[0] || null,
    };

  } catch (err) {
    console.error("❌ Erreur chargement expirations :", err);
    return { creches: null, garderies: null, ecoles: null };
  }
}


export async function getTopEtablissements() {
  try {
    const resEtab = await api.get("/etablissement/all");
    const resAbn = await api.get("/abonnement/all");

    const etablissements = resEtab.data || [];
    const abonnements = resAbn.data || [];

    // Mapper les abonnements par id d’établissement
    const abnMap = {};
    for (const abn of abonnements) {
      const etabId = abn.etablissement?.idEtablissment;
      if (!etabId) continue;

      // On garde le dernier abonnement (par dateFinAbonnement)
      if (!abnMap[etabId] || new Date(abn.dateFinAbonnement) > new Date(abnMap[etabId].dateFinAbonnement)) {
        abnMap[etabId] = abn;
      }
    }

    // Créer les lignes dynamiques
    const fullData = etablissements
      .filter(e => e.type) // garde ceux avec un type
      .map(e => {
        const abn = abnMap[e.idEtablissment];
        const revenu = abn?.montantPaye ?? 0;
        const statut = abn?.statut ?? "INCONNU";

        // Traduction statut
        let licence = "Inconnue";
        if (statut === "PAYEE") licence = "Active";
        else if (statut === "RETARD") licence = "En alerte";
        else if (statut === "EXPIREE") licence = "Expirée";
        else if (statut === "ESSAYE") licence = "En essai";

        return {
          nom: e.nomEtablissement,
          ville: e.region,
          enfants: e.nombreEnfants ?? 0,
          revenue: `${revenu.toLocaleString("fr-TN")} DT`,
          revenuValeur: revenu,
          licence,
         type:
         e.type === "CRECHE" ? "creches" :
         e.type === "GARDERIE" ? "garderies" :
         e.type === "ECOLE" ? "ecoles" :
         "inconnu",

        };
      });

    return fullData;
  } catch (err) {
    console.error("❌ Erreur récupération top établissements :", err);
    return [];
  }
}
