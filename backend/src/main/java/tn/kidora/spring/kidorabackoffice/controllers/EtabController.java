package tn.kidora.spring.kidorabackoffice.controllers;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.kidora.spring.kidorabackoffice.dto.Etab_Dto;
import tn.kidora.spring.kidorabackoffice.entities.Etablissement;
import tn.kidora.spring.kidorabackoffice.services.EtabService;
import tn.kidora.spring.kidorabackoffice.utils.Constants;

@RestController
@AllArgsConstructor
@RequestMapping(Constants.APP_ROOT + Constants.ETABLISSEMENT)
public class EtabController {
    private final EtabService etabService;
    @PostMapping("/add")
    public ResponseEntity <Etablissement> addEtablissement(@RequestBody Etab_Dto dto) {
        Etablissement saved= etabService.addEtablissement(dto);
        return ResponseEntity.ok(saved);
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<Etablissement> updateEtablissement( @PathVariable Integer id, @RequestBody Etab_Dto dto) {
        Etablissement updated= etabService.updateEtablissement(id, dto);
        return ResponseEntity.ok(updated);
    }
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteEtablissement(@PathVariable Integer id) {
        etabService.deleteEtablissement(id);
        return ResponseEntity.ok("Etablissement supprimé avec succès !");
    }

}
