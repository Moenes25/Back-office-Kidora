package tn.kidora.spring.kidorabackoffice.controllers.Client;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import tn.kidora.spring.kidorabackoffice.dto.Client.EducateurClasseRequestDto;
import tn.kidora.spring.kidorabackoffice.dto.Client.EducateurClasseResponseDTO;
import tn.kidora.spring.kidorabackoffice.services.serviceImpl.Client.EducateurClasseService;
import tn.kidora.spring.kidorabackoffice.utils.Constants;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequiredArgsConstructor
@RequestMapping(Constants.APP_ROOT + Constants.EDUCATEUR_CLASSE)
public class EducateurClasseController {
    
     private final EducateurClasseService educateurClasseService;

     @PostMapping(Constants.SAVE)
     public ResponseEntity<?>createEducateurClasse(@RequestBody EducateurClasseRequestDto dto) {
         try {
            EducateurClasseResponseDTO response = educateurClasseService.assignerEducateurAClasse(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
         
     }

     @GetMapping(Constants.ALL)
     public ResponseEntity<List<EducateurClasseResponseDTO>> getAllEducateurClasse() {
         return ResponseEntity.ok(educateurClasseService.getAllEducateurClasse());
     }

     @GetMapping(Constants.ID)
     public ResponseEntity<?> getEducateurClasseById(@PathVariable String id) {
        try {
            return ResponseEntity.ok(educateurClasseService.getAssignationById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } 
     }
     
     @PutMapping(Constants.ID)
      public ResponseEntity<?> updateEducateurClasse(
        @PathVariable String id,
        @RequestBody EducateurClasseRequestDto dto
      ){
          try {
            EducateurClasseResponseDTO response = educateurClasseService.updateEducateurClasse(id, dto);
            return ResponseEntity.ok(response);
          } catch (RuntimeException e) {
              return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
          }


      }

    @DeleteMapping(Constants.DELETE + Constants.ID)
    public ResponseEntity<?> deleteEducateurClasse(@PathVariable String id) {
        try {
            educateurClasseService.deleteEducateurClasse(id);
            return ResponseEntity.ok("Educateur Classe supprimé avec succès");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    
    @GetMapping(Constants.ID+Constants.CLASSES)
    public ResponseEntity<?> getClassesByEducateur(@PathVariable String id) {
        try {
            List<EducateurClasseResponseDTO> dtos = educateurClasseService.getClassesByEducateur(id);
            return ResponseEntity.ok(dtos);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping(Constants.ID+Constants.EDUCATEURS)
    public ResponseEntity<?> getEducateursByClasse(@PathVariable String id) {
        try {
            List<EducateurClasseResponseDTO> dtos = educateurClasseService.getEducateursByClasse(id);
            return ResponseEntity.ok(dtos);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

     
}
