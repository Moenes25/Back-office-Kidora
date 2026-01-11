package tn.kidora.spring.kidorabackoffice.services;

import org.springframework.http.ResponseEntity;
import tn.kidora.spring.kidorabackoffice.dto.AbonnementRequestDTO;
import tn.kidora.spring.kidorabackoffice.dto.AbonnementResponseDTO;
import tn.kidora.spring.kidorabackoffice.dto.PaiementHistoriqueDto;

import java.util.List;
import java.util.Map;

public interface AbonnementService {
    ResponseEntity<AbonnementResponseDTO> addAbonnement(AbonnementRequestDTO dto);
     ResponseEntity<AbonnementResponseDTO> updateAbonnement(String id, AbonnementRequestDTO dto);
     ResponseEntity<Void> deleteAbonnement(String id);
     ResponseEntity<List<AbonnementResponseDTO>> getAllAbonnements();
    ResponseEntity<List<AbonnementResponseDTO>> getAbonnementsByEtablissement(String etablissementId);
    ResponseEntity<List<AbonnementResponseDTO>> getByStatut(String statut);
    List<Map<String, Object>> getRepartitionAnnuelle(int annee);
   // List<PaiementHistoriqueDto> getHistoriquePaiements();
    


}
