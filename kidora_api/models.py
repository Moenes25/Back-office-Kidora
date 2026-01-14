# Modèles Pydantic
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class EtablissementStats(BaseModel):
    """Statistiques d'un établissement"""
    nomEtablissement: str
    adresse_complet: Optional[str] = None
    region: Optional[str] = None
    type: Optional[str] = None
    isActive: Optional[bool] = None
    nombre_abonnements: int = 0
    montant_total_paye: float = 0.0
    montant_total_du: float = 0.0

class AbonnementResponse(BaseModel):
    """Réponse pour un abonnement"""
    etablissement: str
    statut: str
    montantPaye: float
    montantDu: float
    dateDebutAbonnement: Optional[str] = None
    dateFinAbonnement: Optional[str] = None

class DashboardStats(BaseModel):
    """Statistiques globales du dashboard"""
    total_etablissements: int
    etablissements_actifs: int
    etablissements_inactifs: int
    total_abonnements: int
    etablissements_avec_abonnement: int
    etablissements_sans_abonnement: int
    montant_total_paye: float
    montant_total_du: float
    taux_paiement: float

class RepartitionType(BaseModel):
    """Répartition par type"""
    type: str
    count: int
    percentage: float

class EvolutionMensuelle(BaseModel):
    """Évolution mensuelle des abonnements"""
    mois: str
    nombre_abonnements: int