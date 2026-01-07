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

    // 🟠 Établissements inactifs AVEC nombre de jours
    const resInactifs = await api.get("/etablissement/inactivate-nbr-jrs");
    const inactiveClients = (resInactifs.data || []).map((etab) => ({
  name: etab.nomEtablissement,
  days: etab.joursInactivite ?? "?"
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
// dashboardService.js
export async function getCroissanceData() {
  try {
    const res = await api.get("/etablissement/croissance");
    const rawData = res.data || [];

    const moisMap = {
      janvier: 'Jan', février: 'Fév', mars: 'Mar', avril: 'Avr', mai: 'Mai', juin: 'Juin',
      juillet: 'Juil', août: 'Aoû', septembre: 'Sep', octobre: 'Oct', novembre: 'Nov', décembre: 'Déc'
    };

    const labels = rawData.map(d => moisMap[d.mois.toLowerCase()] || d.mois);
    const Garderies = rawData.map(d => d.nombreGarderies || 0);
    const Crèches = rawData.map(d => d.nombreCreches || 0);
    const Écoles = rawData.map(d => d.nombreEcoles || 0);

    return {
      labels,
      Garderies,
      Crèches,
      Écoles,
    };

  } catch (err) {
    console.error("❌ Erreur récupération croissance :", err);
    return {
      labels: [],
      Garderies: [],
      Crèches: [],
      Écoles: [],
    };
  }
}






/* ======================
   RÉPARTITION ANNUELLE
   ====================== */
export const getRepartitionAnnuelle = async (annee) => {
  const response = await api.get(`/abonnement/repartition-annuelle`, {
    params: { annee }
  });
  return response.data;
};



/* ====== IA: Evolution mensuelle (courbe) ====== */
export async function getIaEvolutionMensuelle() {
  try {
    const res = await api.get("/analytics/evolution-mensuelle");
    const data = res.data || [];

    // On accepte plusieurs conventions de clés pour être robustes
    const moisMap = {
      janvier: "Jan", février: "Fév", mars: "Mar", avril: "Avr", mai: "Mai", juin: "Juin",
      juillet: "Juil", août: "Aoû", septembre: "Sep", octobre: "Oct", novembre: "Nov", décembre: "Déc"
    };

    const labels = data.map(d => {
      const raw = (d.mois || d.month || "").toString().toLowerCase();
      return moisMap[raw] || d.mois || d.month || "";
    });

    const Garderies = data.map(d =>
      d.nombreGarderies ?? d.garderies ?? d.Garderies ?? 0
    );
    const Crèches = data.map(d =>
      d.nombreCreches ?? d.crèches ?? d.creches ?? d.Crèches ?? 0
    );
    const Écoles = data.map(d =>
      d.nombreEcoles ?? d.ecoles ?? d.Écoles ?? d.Ecoles ?? 0
    );

    return { labels, Garderies, Crèches, Écoles };
  } catch (e) {
    console.error("IA Evolution mensuelle (courbe) error:", e);
    return { labels: [], Garderies: [], Crèches: [], Écoles: [] };
  }
}

/* ====== IA: Répartition par type (donut) ====== */
export async function getIaRepartitionParType(params = {}) {
  try {
    // si l’IA n’accepte pas 'annee', retire params
    const res = await api.get("/analytics/repartition/type", { params });
    const raw = res.data || [];

    // On mappe vers l’ordre: Garderies / Crèches / Écoles
    // Le backend peut renvoyer [{type:"GARDERIE", nombre: 12}, ...]
    const norm = { GARDERIE: 0, CRECHE: 1, CRÈCHE: 1, ECOLE: 2, ÉCOLE: 2 };
    const out = [0, 0, 0];

    raw.forEach(it => {
      const t = (it.type || it.label || "").toString().toUpperCase();
      const i = norm[t];
      if (i != null) out[i] = Number(it.nombre ?? it.count ?? 0);
    });

    return out; // [garderies, creches, ecoles]
  } catch (e) {
    console.error("IA Répartition par type (donut) error:", e);
    return [0, 0, 0];
  }
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
  creches: groupes.creches.sort((a, b) => a.daysLeft - b.daysLeft),
  garderies: groupes.garderies.sort((a, b) => a.daysLeft - b.daysLeft),
  ecoles: groupes.ecoles.sort((a, b) => a.daysLeft - b.daysLeft),
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
        else if (statut === "SUSPENDU") licence = "Suspendu";
        else if (statut === "RESILE") licence = "Resile";

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
