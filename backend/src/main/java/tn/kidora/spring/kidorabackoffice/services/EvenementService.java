package tn.kidora.spring.kidorabackoffice.services;

import org.springframework.http.ResponseEntity;
import tn.kidora.spring.kidorabackoffice.dto.EvenementRequestDTO;
import tn.kidora.spring.kidorabackoffice.dto.EvenementResponseDTO;
import tn.kidora.spring.kidorabackoffice.entities.Type_Etablissement;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface EvenementService {
    ResponseEntity<EvenementResponseDTO> ajouterEvenement(EvenementRequestDTO dto);
    ResponseEntity<List<EvenementResponseDTO>> getAllEvenements();
    ResponseEntity<List<EvenementResponseDTO>> getEvenementsParDate(LocalDate date);
    public Map<Type_Etablissement, Long> getNombreEvenementParTypeEtablissement();
   void supprimerEvenement(Long id);
    public EvenementResponseDTO modifierEvenement(Long id, EvenementRequestDTO dto);
}
