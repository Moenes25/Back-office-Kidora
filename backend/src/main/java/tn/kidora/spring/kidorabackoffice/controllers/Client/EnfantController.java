package tn.kidora.spring.kidorabackoffice.controllers.Client;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tn.kidora.spring.kidorabackoffice.dto.Client.EnfantRequestDto;
import tn.kidora.spring.kidorabackoffice.dto.Client.EnfantResponseDto;
import tn.kidora.spring.kidorabackoffice.entities.Client.Enfants;
import tn.kidora.spring.kidorabackoffice.services.serviceImpl.Client.EnfantService;
import tn.kidora.spring.kidorabackoffice.utils.Constants;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/enfants")
@RequiredArgsConstructor
public class EnfantController {
    private final EnfantService enfantService;
    @PostMapping(value=Constants.AJOUTER_ENFANT, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<EnfantResponseDto> ajouterEnfant(
            @RequestPart("enfant") String enfantJson,
            @RequestPart("image") MultipartFile imageFile,
            @RequestHeader("Parent-Id") String parentId ) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        EnfantRequestDto dto = mapper.readValue(enfantJson, EnfantRequestDto.class);
        dto.setImageFile(imageFile);
        EnfantResponseDto saved = enfantService.ajouterEnfant(dto,parentId);
        return ResponseEntity.ok(saved);
    }
    @PutMapping(path = Constants.UPDATE_ENFANT + "/{idEnfant}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<EnfantResponseDto> updateEnfant(
            @PathVariable String idEnfant,
            @RequestPart("enfant") String enfantJson,
            @RequestPart(value = "image", required = false) MultipartFile imageFile) throws IOException {

        ObjectMapper mapper = new ObjectMapper();
        EnfantRequestDto dto = mapper.readValue(enfantJson, EnfantRequestDto.class);
        dto.setImageFile(imageFile);

        EnfantResponseDto updated = enfantService.updateEnfant(idEnfant, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping(Constants.DELETE_ENFANT + "/{idEnfant}")
    public ResponseEntity<String> supprimerEnfant(@PathVariable String idEnfant) {
        enfantService.supprimerEnfant(idEnfant);
        return ResponseEntity.ok("Enfant supprimé avec succès");
    }
    @GetMapping(value=Constants.GETALLENFANT)
    public ResponseEntity<List<EnfantResponseDto>> getAllEnfants() {
        List<EnfantResponseDto> enfants = enfantService.getAllEnfants();
        return ResponseEntity.ok(enfants);
    }
    @GetMapping( Constants.GET_ANFANT_BYID_PARENT + "/{parentId}")
    public ResponseEntity<List<EnfantResponseDto>> getEnfantsByParent(@PathVariable String parentId) {
        List<EnfantResponseDto> enfants = enfantService.getEnfantsByParent(parentId);
        return ResponseEntity.ok(enfants);
    }
    @GetMapping(Constants.COUNT_ENFANT)
    public ResponseEntity<Long> getNombreEnfants() {
        long count = enfantService.getNombreEnfants();
        return ResponseEntity.ok(count);
    }

}