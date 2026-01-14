# Logique métier
import pandas as pd
from typing import List, Dict
from database import get_database

def get_etablissements_data():
    """Récupère les données des établissements"""
    db = get_database()
    etabs = list(db.etablissements.find({}))
    return pd.DataFrame(etabs)

def get_abonnements_data():
    """Récupère les données des abonnements"""
    db = get_database()
    abon = list(db.abonnements.find({}))
    return pd.DataFrame(abon)

def calculate_dashboard_stats() -> Dict:
    """Calcule les statistiques globales du dashboard"""
    df_etabs = get_etablissements_data()
    df_abon = get_abonnements_data()
    
    # Convertir les IDs
    df_etabs["_id"] = df_etabs["_id"].astype(str)
    df_abon["etablissement"] = df_abon["etablissement"].apply(
        lambda x: str(x["$oid"]) if isinstance(x, dict) and "$oid" in x else str(x)
    )
    
    # Établissements avec abonnement
    etab_ids_with_abon = df_abon["etablissement"].unique()
    nb_avec_abon = len(etab_ids_with_abon)
    nb_sans_abon = len(df_etabs) - nb_avec_abon
    
    # Montants
    montant_paye = df_abon["montantPaye"].sum()
    montant_du = df_abon["montantDu"].sum()
    taux_paiement = (montant_paye / (montant_paye + montant_du) * 100) if (montant_paye + montant_du) > 0 else 0
    
    # Actifs/Inactifs
    active_counts = df_etabs["isActive"].value_counts()
    
    return {
        "total_etablissements": len(df_etabs),
        "etablissements_actifs": active_counts.get(True, 0),
        "etablissements_inactifs": active_counts.get(False, 0),
        "total_abonnements": len(df_abon),
        "etablissements_avec_abonnement": nb_avec_abon,
        "etablissements_sans_abonnement": nb_sans_abon,
        "montant_total_paye": float(montant_paye),
        "montant_total_du": float(montant_du),
        "taux_paiement": round(taux_paiement, 2)
    }

def get_etablissements_avec_abonnement() -> List[Dict]:
    """Retourne les établissements ayant au moins un abonnement"""
    df_etabs = get_etablissements_data()
    df_abon = get_abonnements_data()
    
    # Convertir les IDs
    df_etabs["_id"] = df_etabs["_id"].astype(str)
    df_abon["etablissement"] = df_abon["etablissement"].apply(
        lambda x: str(x["$oid"]) if isinstance(x, dict) and "$oid" in x else str(x)
    )
    
    # Merge
    df_merged = df_abon.merge(
        df_etabs,
        left_on="etablissement",
        right_on="_id",
        how="left",
        suffixes=("_abon", "_etab")
    )
    
    # Sélectionner les colonnes
    cols = ["nomEtablissement", "adresse_complet", "region", "type", "statut", "montantPaye", "dateDebutAbonnement", "dateFinAbonnement"]
    cols_existing = [c for c in cols if c in df_merged.columns]
    
    return df_merged[cols_existing].to_dict(orient="records")

def get_etablissements_sans_abonnement() -> List[Dict]:
    """Retourne les établissements sans abonnement"""
    df_etabs = get_etablissements_data()
    df_abon = get_abonnements_data()
    
    # Convertir les IDs
    df_etabs["_id"] = df_etabs["_id"].astype(str)
    etab_ids_with_abon = df_abon["etablissement"].apply(
        lambda x: str(x["$oid"]) if isinstance(x, dict) and "$oid" in x else str(x)
    ).unique()
    
    # Filtrer
    df_sans_abon = df_etabs[~df_etabs["_id"].isin(etab_ids_with_abon)]
    
    cols = ["nomEtablissement", "adresse_complet", "region", "type", "isActive"]
    cols_existing = [c for c in cols if c in df_sans_abon.columns]
    
    return df_sans_abon[cols_existing].to_dict(orient="records")

def get_repartition_par_type() -> List[Dict]:
    """Retourne la répartition des établissements par type"""
    df_etabs = get_etablissements_data()
    type_counts = df_etabs["type"].value_counts()
    total = len(df_etabs)
    
    result = []
    for type_etab, count in type_counts.items():
        result.append({
            "type": type_etab,
            "count": int(count),
            "percentage": round((count / total * 100), 2)
        })
    
    return result

def get_repartition_statut_abonnement() -> List[Dict]:
    """Retourne la répartition des abonnements par statut"""
    df_abon = get_abonnements_data()
    statut_counts = df_abon["statut"].value_counts()
    total = len(df_abon)
    
    result = []
    for statut, count in statut_counts.items():
        result.append({
            "statut": statut,
            "count": int(count),
            "percentage": round((count / total * 100), 2)
        })
    
    return result

def get_evolution_mensuelle() -> List[Dict]:
    """Retourne l'évolution mensuelle des abonnements"""
    df_abon = get_abonnements_data()
    
    df_abon["dateDebutAbonnement"] = pd.to_datetime(df_abon["dateDebutAbonnement"])
    
    abonnements_par_mois = (
        df_abon
        .groupby(df_abon["dateDebutAbonnement"].dt.to_period("M"))
        .size()
    )
    
    result = []
    for period, count in abonnements_par_mois.items():
        result.append({
            "mois": str(period),
            "nombre_abonnements": int(count)
        })
    
    return result