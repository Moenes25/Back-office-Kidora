# API FastAPI
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import uvicorn

from models import (
    DashboardStats,
    RepartitionType,
    EvolutionMensuelle
)
from services import (
    calculate_dashboard_stats,
    get_etablissements_avec_abonnement,
    get_etablissements_sans_abonnement,
    get_repartition_par_type,
    get_repartition_statut_abonnement,
    get_evolution_mensuelle
)
from database import close_connection

# Créer l'application FastAPI
app = FastAPI(
    title="Kidora Analytics API",
    description="API pour les statistiques des établissements et abonnements",
    version="1.0.0"
)

# Configuration CORS (pour permettre les appels depuis le frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En production, spécifier les domaines autorisés
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============ ENDPOINTS ============

@app.get("/")
def root():
    """Endpoint de base pour vérifier que l'API fonctionne"""
    return {
        "message": "Kidora Analytics API",
        "status": "running",
        "version": "1.0.0"
    }

@app.get("/health")
def health_check():
    """Vérifier l'état de l'API"""
    return {"status": "ok"}

@app.get("/api/dashboard/stats", response_model=DashboardStats)
def get_dashboard_stats():
    """
    Récupère les statistiques globales du dashboard
    
    Returns:
        - Nombre total d'établissements
        - Établissements actifs/inactifs
        - Nombre d'abonnements
        - Montants payés et dus
        - Taux de paiement
    """
    try:
        stats = calculate_dashboard_stats()
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors du calcul des stats: {str(e)}")

@app.get("/api/etablissements/avec-abonnement")
def get_etabs_avec_abon():
    """
    Récupère la liste des établissements ayant au moins un abonnement
    """
    try:
        data = get_etablissements_avec_abonnement()
        return {"count": len(data), "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur: {str(e)}")

@app.get("/api/etablissements/sans-abonnement")
def get_etabs_sans_abon():
    """
    Récupère la liste des établissements sans abonnement
    """
    try:
        data = get_etablissements_sans_abonnement()
        return {"count": len(data), "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur: {str(e)}")

@app.get("/api/statistiques/repartition-type", response_model=List[RepartitionType])
def get_repartition_type():
    """
    Récupère la répartition des établissements par type
    """
    try:
        return get_repartition_par_type()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur: {str(e)}")

@app.get("/api/statistiques/repartition-statut-abonnement")
def get_repartition_statut():
    """
    Récupère la répartition des abonnements par statut
    """
    try:
        return get_repartition_statut_abonnement()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur: {str(e)}")

@app.get("/api/statistiques/evolution-mensuelle", response_model=List[EvolutionMensuelle])
def get_evolution():
    """
    Récupère l'évolution mensuelle du nombre d'abonnements
    """
    try:
        return get_evolution_mensuelle()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur: {str(e)}")

# Event handlers
@app.on_event("shutdown")
def shutdown_event():
    """Fermer la connexion MongoDB à l'arrêt"""
    close_connection()

# Lancer le serveur
if __name__ == "__main__":
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8000,
        reload=True  # Auto-reload en développement
    )