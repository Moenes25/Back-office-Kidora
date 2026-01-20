package tn.kidora.spring.kidorabackoffice.controllers.Client;

import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tn.kidora.spring.kidorabackoffice.dto.Client.ClientUpdateDto;
import tn.kidora.spring.kidorabackoffice.dto.LoginDto;
import tn.kidora.spring.kidorabackoffice.dto.Client.UserRegistreDto;
import tn.kidora.spring.kidorabackoffice.dto.Client.ClasseResponseDto;
import tn.kidora.spring.kidorabackoffice.entities.Client.RoleUsers;
import tn.kidora.spring.kidorabackoffice.entities.Client.StatutClient;
import tn.kidora.spring.kidorabackoffice.entities.Client.Users;
import tn.kidora.spring.kidorabackoffice.services.AuthService;
import tn.kidora.spring.kidorabackoffice.services.serviceImpl.Client.ClientService;
import tn.kidora.spring.kidorabackoffice.services.serviceImpl.Client.ClasseService;
import tn.kidora.spring.kidorabackoffice.utils.Constants;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@AllArgsConstructor
@Slf4j
@RestController
@RequestMapping(Constants.APP_ROOT + Constants.CLIENT)
public class ClientController {

    private final  AuthService authService;
    private final ClientService clientService;
    private final ClasseService classeService;

    @PostMapping(value = Constants.CLIENT_REGISTER, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Users> registerClient(
            @RequestParam("nom") String nom,
            @RequestParam("prenom") String prenom,
            @RequestParam("email") String email,
            @RequestParam("password") String password,
            @RequestParam("role") RoleUsers role,
            @RequestParam(value = "numTel", required = false) String numTel,
            @RequestParam(value = "adresse", required = false) String adresse,
            @RequestParam(value = "profession", required = false) String profession,
            @RequestParam(value = "relation", required = false) String relation,
            @RequestParam(value = "specialisation", required = false) String specialisation,
            @RequestParam(value = "experience", required = false) Integer experience,
            @RequestParam(value = "disponibilite", required = false) String disponibilite,
            @RequestParam(value = "statutClient", required = false, defaultValue = "ACTIF") StatutClient statutClient,
            @RequestPart(value = "image", required = false) MultipartFile imageFile
    ) throws IOException {

        log.info("RegisterClient endpoint called.");

        UserRegistreDto dto = new UserRegistreDto();
        dto.setNom(nom);
        dto.setPrenom(prenom);
        dto.setEmail(email);
        dto.setPassword(password);
        dto.setRole(role);
        dto.setNumTel(numTel);
        dto.setAdresse(adresse);
        dto.setProfession(profession);
        dto.setRelation(relation);
        dto.setSpecialisation(specialisation);
        dto.setExperience(experience);
        dto.setDisponibilite(disponibilite);
        dto.setStatutClient(statutClient);
        dto.setImageFile(imageFile);
        Users savedUser = authService.registerClient(dto);

        return ResponseEntity.ok(savedUser);
    }


    @PostMapping(Constants.CLIENT_LOGIN)
    public ResponseEntity<Map<String,Object>> login(@RequestBody LoginDto dto){
        Map<String,Object> authData = authService.login(dto.getEmail(), dto.getPassword());
        return ResponseEntity.ok(authData);
}
    @DeleteMapping(Constants.DELETE_CLIENT+"/{clientId}")
    public ResponseEntity<String> deleteClient(@PathVariable String clientId) {
        clientService.deleteClient(clientId);
        return ResponseEntity.ok("Client supprimé avec succès");
    }
    @PutMapping(value = Constants.update_CLIENT + "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Users> updateClientProfile(
            @PathVariable String id,
            @RequestParam(value = "nom", required = false) String nom,
            @RequestParam(value = "prenom", required = false) String prenom,
            @RequestParam(value = "numTel", required = false) String numTel,
            @RequestParam(value = "adresse", required = false) String adresse,
            // Champs parent
            @RequestParam(value = "profession", required = false) String profession,
            @RequestParam(value = "relation", required = false) String relation,
            // Champs éducateur
            @RequestParam(value = "specialisation", required = false) String specialisation,
            @RequestParam(value = "experience", required = false) Integer experience,
            @RequestParam(value = "disponibilite", required = false) String disponibilite,
            @RequestParam(value = "statutClient", required = false) StatutClient statutClient,

            @RequestParam(value = "imageFile", required = false) MultipartFile imageFile
    ) {

        ClientUpdateDto dto = new ClientUpdateDto();
        dto.setNom(nom);
        dto.setPrenom(prenom);
        dto.setNumTel(numTel);
        dto.setAdresse(adresse);

        dto.setProfession(profession);
        dto.setRelation(relation);

        dto.setSpecialisation(specialisation);
        dto.setExperience(experience);
        dto.setDisponibilite(disponibilite);
        dto.setImageFile(imageFile);
        dto.setStatutClient(statutClient);

        Users updatedUser = clientService.updateProfile(id, dto);

        return ResponseEntity.ok(updatedUser);
    }
    @GetMapping(Constants.ALL_CLIENTS)
    public ResponseEntity<List<Users>> getAllClients() {
        return ResponseEntity.ok(clientService.getAllClients());
    }
    @GetMapping(Constants.ALL_PARENTS)
    public ResponseEntity<List<Users>> getAllParents() {
        return ResponseEntity.ok(clientService.getParents());
    }
    @GetMapping(Constants.ALL_EDUCATEURS)
    public ResponseEntity<List<Users>> getAllEducateurs() {
        return ResponseEntity.ok(clientService.getEducateurs());
    }

    
    @GetMapping("/classes/all")
    public ResponseEntity<List<ClasseResponseDto>> getAllClasses() {
        return ResponseEntity.ok(classeService.getAllClasses());

    }
}
