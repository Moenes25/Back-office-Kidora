package tn.kidora.spring.kidorabackoffice.services.serviceImpl.Client;

import tn.kidora.spring.kidorabackoffice.entities.Client.Absence;
import tn.kidora.spring.kidorabackoffice.entities.Client.StatutAbsence;

public interface AbsenceService {
    Absence marquerStatut(String idEnfant, StatutAbsence statut);
    long getNombrePresentsAujourdhui();
    long getNombreAbsentsAujourdhui();
}
