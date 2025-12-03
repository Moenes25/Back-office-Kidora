package tn.kidora.spring.kidorabackoffice.controllers;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.kidora.spring.kidorabackoffice.dto.AbonnementRequestDTO;
import tn.kidora.spring.kidorabackoffice.dto.AbonnementResponseDTO;
import tn.kidora.spring.kidorabackoffice.services.AbonnementService;
import tn.kidora.spring.kidorabackoffice.utils.Constants;

import java.util.List;
import java.util.Map;

@AllArgsConstructor
@RestController
@RequestMapping(Constants.APP_ROOT + Constants.ABONNEMENT)
@FieldDefaults(level = AccessLevel.PRIVATE)
@Slf4j
public class AbonController {
    AbonnementService abonnementService;

    @PostMapping(Constants.SAVE)
    public ResponseEntity<AbonnementResponseDTO> addAbonnement( @RequestBody AbonnementRequestDTO dto) {
        return abonnementService.addAbonnement(dto);
    }
    @PutMapping(Constants.UPDATE + Constants.ID)
    public ResponseEntity<AbonnementResponseDTO> updateAbonnement(@PathVariable Long id,@RequestBody AbonnementRequestDTO dto) {
        return abonnementService.updateAbonnement(id, dto);
    }
    @DeleteMapping(Constants.DELETE + Constants.ID)
    public ResponseEntity<Void> deleteAbonnement(@PathVariable Long id) {
        return abonnementService.deleteAbonnement(id);
    }
    @GetMapping(Constants.ALL)
    public ResponseEntity<List<AbonnementResponseDTO>> getAllAbonnements() {
        return abonnementService.getAllAbonnements();
    }
    @GetMapping(Constants.BY_ETABLISSEMENT + Constants.ID)
    public ResponseEntity<List<AbonnementResponseDTO>> getAbonnementsByEtablissement(@PathVariable("id")  Integer etablissementId) {
        return abonnementService.getAbonnementsByEtablissement(etablissementId);
    }
    @GetMapping(Constants.BY_STATUS+ "/{statut}")
    public ResponseEntity<List<AbonnementResponseDTO>> getByStatut(@PathVariable String statut) {
        return abonnementService.getByStatut(statut);
    }
    @GetMapping(Constants.REPARTITION_ANNUELLE)
    public ResponseEntity<List<Map<String, Object>>>  getRepartitionAnnuelle( @RequestParam int annee) {
        return ResponseEntity.ok(abonnementService.getRepartitionAnnuelle(annee));
    }
}
