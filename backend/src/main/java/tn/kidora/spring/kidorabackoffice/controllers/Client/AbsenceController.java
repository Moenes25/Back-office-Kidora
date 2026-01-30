package tn.kidora.spring.kidorabackoffice.controllers.Client;


import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import tn.kidora.spring.kidorabackoffice.entities.Client.Absence;
import tn.kidora.spring.kidorabackoffice.entities.Client.StatutAbsence;
import tn.kidora.spring.kidorabackoffice.services.serviceImpl.Client.AbsenceService;
import tn.kidora.spring.kidorabackoffice.utils.Constants;

@RestController

@AllArgsConstructor
public class AbsenceController {
    private final AbsenceService absenceService;

    @PostMapping(Constants.MARQUER_ABSENCE)
    public ResponseEntity<Absence> marquerStatut(
            @RequestParam String idEnfant,
            @RequestParam StatutAbsence statut) {
        Absence absence = absenceService.marquerStatut(idEnfant, statut);
        return ResponseEntity.ok(absence);
    }
    @GetMapping(Constants.NOMBRE_PRESENTS_AUJOURDHUI)
    public ResponseEntity<Long> getNombrePresentsAujourdhui() {
        long nombrePresents = absenceService.getNombrePresentsAujourdhui();
        return ResponseEntity.ok(nombrePresents);
    }
    @GetMapping(Constants.NOMBRE_ABSENTS_AUJOURDHUI)
    public ResponseEntity<Long> getNombreAbsentsAujourdhui() {
        long nombreAbsents = absenceService.getNombreAbsentsAujourdhui();
        return ResponseEntity.ok(nombreAbsents);
    }
}
