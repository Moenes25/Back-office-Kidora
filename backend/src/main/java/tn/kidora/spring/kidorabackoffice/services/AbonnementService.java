package tn.kidora.spring.kidorabackoffice.services;

import org.springframework.http.ResponseEntity;
import tn.kidora.spring.kidorabackoffice.dto.AbonnementRequestDTO;
import tn.kidora.spring.kidorabackoffice.dto.AbonnementResponseDTO;

import java.util.List;

public interface AbonnementService {
    ResponseEntity<AbonnementResponseDTO> addAbonnement(AbonnementRequestDTO dto);
     ResponseEntity<AbonnementResponseDTO> updateAbonnement(Long id, AbonnementRequestDTO dto);
     ResponseEntity<Void> deleteAbonnement(Long id);
     ResponseEntity<List<AbonnementResponseDTO>> getAllAbonnements();
    ResponseEntity<List<AbonnementResponseDTO>> getAbonnementsByEtablissement(Integer etablissementId);
    ResponseEntity<List<AbonnementResponseDTO>> getByStatut(String statut);


}
