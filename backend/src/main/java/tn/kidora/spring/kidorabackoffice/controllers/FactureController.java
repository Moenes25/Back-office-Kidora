package tn.kidora.spring.kidorabackoffice.controllers;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.kidora.spring.kidorabackoffice.dto.FactureRequestDTO;
import tn.kidora.spring.kidorabackoffice.dto.FactureResponseDto;
import tn.kidora.spring.kidorabackoffice.entities.Facture;
import tn.kidora.spring.kidorabackoffice.services.FactureService;
import tn.kidora.spring.kidorabackoffice.utils.Constants;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping(Constants.APP_ROOT + Constants.FACTURE)
@Slf4j
public class FactureController {

    private final FactureService factureService;

    @PostMapping(Constants.ADD_FACTURE)
    public ResponseEntity<Facture> creerFacture(@RequestBody FactureRequestDTO dto) {
        Facture facture = factureService.creerFacture(dto);
        return ResponseEntity.ok(facture);
    }
    @GetMapping(Constants.FACTURE_TOTAL)
    public ResponseEntity<Long> totalFactures() {
        return ResponseEntity.ok(factureService.totalFactures());
    }

    @GetMapping(Constants.FACTURE_TOTAL_PAYEES)
    public ResponseEntity<Long> totalFacturesPayees() {
        return ResponseEntity.ok(factureService.totalFacturesPayees());
    }
    @GetMapping(Constants.FACTURE_TOTAL_IMPAYEES)
    public ResponseEntity<Long> totalFacturesImpaye() {
        return ResponseEntity.ok(factureService.totalFacturesImpaye());
    }
    @GetMapping(Constants.FACTURE_ALL )
    public ResponseEntity<List<FactureResponseDto>> getAllFactures() {
        return ResponseEntity.ok(factureService.getAllFactures());
    }
    @GetMapping(Constants.FACTURE_BY_ID)
    public ResponseEntity<FactureResponseDto> getFactureById(@PathVariable String id) {
        return ResponseEntity.ok(factureService.getFactureById(id));
    }
   /* @PostMapping("/{id}/send-email")
    public ResponseEntity<String> envoyerFactureDepuisFront(
            @PathVariable String id,
            @RequestParam("file") MultipartFile file) {

        factureService.envoyerFactureDepuisFront(id, file);
        return ResponseEntity.ok("Facture envoyée avec succès !");
    }
    }*/

}
