// package tn.kidora.spring.kidorabackoffice.controllers;


// import lombok.AllArgsConstructor;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;
// import tn.kidora.spring.kidorabackoffice.dto.EvenementRequestDTO;
// import tn.kidora.spring.kidorabackoffice.dto.EvenementResponseDTO;
// import tn.kidora.spring.kidorabackoffice.entities.Type_Etablissement;
// import tn.kidora.spring.kidorabackoffice.services.EvenementService;
// import tn.kidora.spring.kidorabackoffice.utils.Constants;

// import java.time.LocalDate;
// import java.util.List;
// import java.util.Map;

// @RestController
// @AllArgsConstructor
// @RequestMapping(Constants.APP_ROOT + Constants.EVENEMENT)
// public class EventController {
//     private final EvenementService evenementService;
//     @PostMapping(Constants.SAVE)
//     public ResponseEntity<EvenementResponseDTO> ajouterEvenement(@RequestBody EvenementRequestDTO dto) {
//         return evenementService.ajouterEvenement(dto);
//     }
//     @GetMapping(Constants.ALL)
//     public ResponseEntity<List<EvenementResponseDTO>> getAllEvenements() {
//         return evenementService.getAllEvenements();
//     }
//     @GetMapping(Constants.EVENEMENT_BY_DATE)
//     public ResponseEntity<List<EvenementResponseDTO>> getEvenementsParDate(@PathVariable("date") String dateStr) {
//         LocalDate date = LocalDate.parse(dateStr);
//         return evenementService.getEvenementsParDate(date);
//     }
//     @PutMapping(Constants.EVENEMENT_UPDATE)
//     public ResponseEntity <EvenementResponseDTO> modifierEvenement(@PathVariable Long id, @RequestBody EvenementRequestDTO dto) {
//         EvenementResponseDTO response = evenementService.modifierEvenement(id, dto);
//         return ResponseEntity.ok(response);
//     }
//     @DeleteMapping(Constants.EVENEMENT_DELETE)
//     public ResponseEntity<String>supprimerEvenement(@PathVariable Long id) {
//         evenementService.supprimerEvenement(id);
//         return ResponseEntity.ok("Événement supprimé avec succès !");

//     }
//     @GetMapping(Constants.EVENEMENT_COUNT_BY_TYPE)
//     public ResponseEntity<Map<Type_Etablissement, Long>> getNombreEvenementParTypeEtablissement() {
//         Map<Type_Etablissement, Long> result = evenementService.getNombreEvenementParTypeEtablissement();
//         return ResponseEntity.ok(result);
//     }
// }
