package tn.kidora.spring.kidorabackoffice.controllers;

import lombok.AllArgsConstructor;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.kidora.spring.kidorabackoffice.dto.Etab_Dto;
import tn.kidora.spring.kidorabackoffice.dto.EtablissementRequestDTO;
import tn.kidora.spring.kidorabackoffice.dto.EtablissementUpdateDTO;
import tn.kidora.spring.kidorabackoffice.entities.Etablissement;
import tn.kidora.spring.kidorabackoffice.services.EtabService;
import tn.kidora.spring.kidorabackoffice.utils.Constants;
import tn.kidora.spring.kidorabackoffice.entities.Type_Etablissement;

@RestController
@AllArgsConstructor
@RequestMapping(Constants.APP_ROOT + Constants.ETABLISSEMENT)
public class EtabController {
    private final EtabService etabService;
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




    

}
