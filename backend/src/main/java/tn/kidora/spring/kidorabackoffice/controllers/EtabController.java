package tn.kidora.spring.kidorabackoffice.controllers;

import lombok.AllArgsConstructor;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import tn.kidora.spring.kidorabackoffice.dto.AbonnementResponseDTO;
import tn.kidora.spring.kidorabackoffice.dto.DonneesCroissanceDTo;
import tn.kidora.spring.kidorabackoffice.dto.Etab_Dto;
import tn.kidora.spring.kidorabackoffice.dto.EtablissementRequestDTO;
import tn.kidora.spring.kidorabackoffice.dto.EtablissementUpdateDTO;
import tn.kidora.spring.kidorabackoffice.entities.Etablissement;
import tn.kidora.spring.kidorabackoffice.entities.StatutPaiement;
import tn.kidora.spring.kidorabackoffice.services.AbonnementService;
import tn.kidora.spring.kidorabackoffice.services.EtabService;
import tn.kidora.spring.kidorabackoffice.utils.Constants;
import tn.kidora.spring.kidorabackoffice.entities.Type_Etablissement;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@AllArgsConstructor
@RequestMapping(Constants.APP_ROOT + Constants.ETABLISSEMENT)
public class EtabController {
    private final EtabService etabService;
    private final AbonnementService abonnementService;
    @PostMapping(Constants.SAVE)
    public ResponseEntity <Etab_Dto> addEtablissement(@RequestBody EtablissementRequestDTO dto) {
        // Etablissement saved= etabService.addEtablissement(dto);
        return etabService.addEtablissement(dto);
    }
    @PutMapping(Constants.UPDATE + Constants.ID)
    public ResponseEntity<Etab_Dto> updateEtablissement( @PathVariable Integer id, @RequestBody EtablissementUpdateDTO dto) {
         return etabService.updateEtablissement(id, dto);
        
    }
    @DeleteMapping(Constants.DELETE + Constants.ID)
    public ResponseEntity<?> deleteEtablissement(@PathVariable Integer id) {
        try{
             etabService.deleteEtablissement(id);
        return ResponseEntity.ok("Etablissement supprimé avec succès !");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping(Constants.ALL)
    public  ResponseEntity<List<Etab_Dto>> getAllEtablissements() {
        return etabService.getAllEtablissements();
    }

    @GetMapping(Constants.BY_TYPE)
    public  ResponseEntity<List<Etab_Dto>> getAllEtablissementsByType(@RequestParam("type") Type_Etablissement type) {
        return etabService.getAllEtablissementsByType(type);
    }

    @GetMapping(Constants.By_REGION)
    public  ResponseEntity<List<Etab_Dto>> getEtablissementsByRegion(@RequestParam("region") String region) {
        return etabService.getEtablissementsByRegion(region);
    }
    @GetMapping(Constants.ACTIVE)
    public  ResponseEntity<List<Etab_Dto>> getActiveEtablissements() {
        return etabService.getActiveEtablissements();
    }


    // activer ou désactiver l'etablissement
    @PatchMapping(Constants.TOOGLE_STATUS + Constants.ID)
    public ResponseEntity<Etab_Dto> toggleEtablissementStatus(@PathVariable Integer id) {
        return etabService.toggleEtablissementStatus(id);
    }

    @GetMapping(Constants.CEMOIS)
    public ResponseEntity<List<Etab_Dto>> getEtablissementsAbonnesCeMois() {
        return etabService.getEtablissementsAbonnesCeMois();
    }

    @GetMapping(Constants.ECOLE_ACTIVE)
    public ResponseEntity<List<Etab_Dto>> getEcoleActive() {
        ResponseEntity<List<Etab_Dto>> response = etabService.getActiveEtablissements();
        if (response.getBody().isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(Collections.emptyList());
        }
        List<Etab_Dto>  etablissementsDtos = response.getBody().stream()
                                                           .filter(etab -> etab.getType().equals(Type_Etablissement.ECOLE))
                                                           .collect(Collectors.toList());
        return ResponseEntity.status(HttpStatus.OK).body(etablissementsDtos);
    }
    @GetMapping(Constants.CRECHE_ACTIVE)
    public ResponseEntity<List<Etab_Dto>> getCrecheActive() {
       ResponseEntity<List<Etab_Dto>> response = etabService.getActiveEtablissements();
        if (response.getBody().isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(Collections.emptyList());
        }
        List<Etab_Dto>  etablissementsDtos = response.getBody().stream()
                                                           .filter(etab -> etab.getType().equals(Type_Etablissement.CRECHE))
                                                           .collect(Collectors.toList());
        return ResponseEntity.status(HttpStatus.OK).body(etablissementsDtos);
    }
    @GetMapping(Constants.GARDERIE_ACTIVE)
    public ResponseEntity<List<Etab_Dto>> getGarderieActive() {
        ResponseEntity<List<Etab_Dto>> response = etabService.getActiveEtablissements();
        if (response.getBody().isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(Collections.emptyList());
        }
        List<Etab_Dto>  etablissementsDtos = response.getBody().stream()
                                                           .filter(etab -> etab.getType().equals(Type_Etablissement.GARDERIE))
                                                           .collect(Collectors.toList());
        return ResponseEntity.status(HttpStatus.OK).body(etablissementsDtos);
    }
    @GetMapping(Constants.CROISSANCE)
    public ResponseEntity<List<DonneesCroissanceDTo>>obtenirCroissanceMensuelle() {
        List<DonneesCroissanceDTo> donnees = etabService.obtenirCroissanceMensuelle();
        if (donnees.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(Collections.emptyList());
        }

        return ResponseEntity.ok(donnees);
    }

   @GetMapping(Constants.EN_ESSAYE)
    public ResponseEntity<List<Etab_Dto>> getEtablissementsStatutEssaye() {
        List<AbonnementResponseDTO> abonnementResponseDTOs = this.abonnementService.getByStatut(StatutPaiement.ESSAYE.toString()).getBody();
        if (abonnementResponseDTOs.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(Collections.emptyList());
        }
        List<Etab_Dto> etablissementsDTOs = abonnementResponseDTOs.stream()
                 .map(abnmt -> abnmt.getEtablissement())
                 .distinct()
                 .collect(Collectors.toList());
        return ResponseEntity.status(HttpStatus.OK).body(etablissementsDTOs);

    }
    
    @GetMapping(Constants.EN_RETARD)
    public ResponseEntity<List<Etab_Dto>> getEtablissementsStatutEnRetarddePaiement() {
        List<AbonnementResponseDTO> abonnementResponseDTOs = this.abonnementService.getByStatut(StatutPaiement.RETARD.toString()).getBody();
        if (abonnementResponseDTOs.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(Collections.emptyList());
        }
        List<Etab_Dto> etablissementsDTOs = abonnementResponseDTOs.stream()
                 .map(abnmt -> abnmt.getEtablissement())
                 .distinct()
                 .collect(Collectors.toList());
        return ResponseEntity.status(HttpStatus.OK).body(etablissementsDTOs);
    }

   
}
