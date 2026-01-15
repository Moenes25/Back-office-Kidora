package tn.kidora.spring.kidorabackoffice.controllers.Client;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.kidora.spring.kidorabackoffice.dto.Client.ClasseRequestDto;
import tn.kidora.spring.kidorabackoffice.dto.Client.ClasseResponseDto;
import tn.kidora.spring.kidorabackoffice.services.serviceImpl.Client.ClasseService;
import tn.kidora.spring.kidorabackoffice.utils.Constants;

import java.util.List;

@RestController
@RequestMapping(Constants.APP_ROOT +"/classes")
@RequiredArgsConstructor
public class ClasseController {
    private final ClasseService classesService;

    @PostMapping( Constants.AJOUTER_CLASSE)
    public ResponseEntity<ClasseResponseDto> ajouterClasse(@RequestBody ClasseRequestDto dto) {
        ClasseResponseDto savedClasse = classesService.ajouterClasse(dto);
        return ResponseEntity.ok(savedClasse);
    }
    @GetMapping(  Constants.GET_ALL_CLASSES)
    public ResponseEntity<List<ClasseResponseDto>> getAllClasses() {
        List<ClasseResponseDto> classes = classesService.getAllClasses();
        return ResponseEntity.ok(classes);
    }
}
