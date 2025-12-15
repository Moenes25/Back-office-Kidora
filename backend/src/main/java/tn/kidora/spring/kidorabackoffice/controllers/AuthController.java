package tn.kidora.spring.kidorabackoffice.controllers;


import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.multipart.MultipartFile;
import tn.kidora.spring.kidorabackoffice.dto.LoginDto;
import tn.kidora.spring.kidorabackoffice.dto.RegisterDto;
import tn.kidora.spring.kidorabackoffice.entities.Role;
import tn.kidora.spring.kidorabackoffice.entities.Status;
import tn.kidora.spring.kidorabackoffice.entities.User;
import tn.kidora.spring.kidorabackoffice.repositories.UserRepository;
import tn.kidora.spring.kidorabackoffice.services.AuthService;
import tn.kidora.spring.kidorabackoffice.services.serviceImpl.AuthServiceImpl;
import tn.kidora.spring.kidorabackoffice.services.serviceImpl.OptService;
import tn.kidora.spring.kidorabackoffice.utils.Constants;

@RestController
@RequestMapping(Constants.APP_ROOT+Constants.AUTH)
@AllArgsConstructor
@Slf4j
public class AuthController {
    public  final OptService optService;
    AuthService authService;
    UserRepository userRepository;
    @PostMapping(Constants.REGISTER)
    public ResponseEntity<String> register(@RequestBody RegisterDto dto) {
        try{
            User savedUser = authService.register(dto);
            return ResponseEntity.ok(savedUser.getPassword());
        }catch (RuntimeException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Unexpected error: " + e.getMessage());
        }

    }


    @PostMapping(Constants.LOGIN)
    public ResponseEntity<?> login(@RequestBody LoginDto loginDto) {
         try {
            Map<String, Object> authData = authService.login(
                loginDto.getEmail(), 
                loginDto.getPassword()
            );
            return ResponseEntity.ok(authData);
         } catch(RuntimeException e){
            log.error("Erreur connexion: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());

         }
        }
   @GetMapping(Constants.ALL)
    public List<User> getAllUsersExceptSuperAdmin() {
        return authService.getAllUsersExceptSuperAdmin();
    }

    @PutMapping(value = Constants.UPDATE_PROFILE, consumes = {"multipart/form-data"})
    public User updateAdminProfile(
            @RequestParam("email") String email,
            @RequestParam(required = false) String newEmail,
            @RequestParam(value = "nom", required = false) String nom,
            @RequestParam(value = "tel", required = false) String tel,
            @RequestParam(required = false) String newPassword,
            @RequestParam(value = "imageFile", required = false) MultipartFile imageFile
            ) {
        return authService.updateAdminProfile(email,newEmail, nom, tel, newPassword,imageFile);
    }
    @GetMapping("/uploads/{filename:.+}")
    public ResponseEntity<Resource> getFile(@PathVariable String filename) throws IOException {
        Path file = Paths.get(System.getProperty("user.dir") + "/uploads/").resolve(filename).normalize();
        Resource resource = new UrlResource(file.toUri());
        if (!resource.exists() || !resource.isReadable()) {
            return ResponseEntity.notFound().build();
        }
        String contentType = Files.probeContentType(file);
        if (contentType == null) contentType = "application/octet-stream";
        return ResponseEntity.ok().contentType(MediaType.parseMediaType(contentType)).body(resource);
    }
    @PutMapping(value = Constants.UPDATE + Constants.ID, consumes = {"multipart/form-data"})
    public User updateAdminProfileById(
            @PathVariable String id,
            @RequestParam(required = false) String newEmail,
            @RequestParam(required = false) String nom,
            @RequestParam(required = false) String tel,
            @RequestParam(required = false) String newPassword,
            @RequestParam(value = "imageFile", required = false) MultipartFile imageFile) {

        return authService.updateAdminProfileById(id, newEmail, nom, tel, newPassword, imageFile);
    }


    @DeleteMapping(Constants.DELETE_USER)
    public ResponseEntity<String> deleteUserById(@PathVariable("id") String id) {
        authService.deleteUserById(id);
        return ResponseEntity.ok("Utilisateur supprimé avec succès !");
    }

    // === OTP forgot/reset ===
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestParam String email) {
        try {
            optService.generateAndSendOtp(email);
            return ResponseEntity.ok("Code OTP envoyé à votre e-mail");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@RequestParam String email, @RequestParam String otp) {
        boolean valid = optService.verifyOtp(email, otp);
        return valid ? ResponseEntity.ok("OTP vérifié") :
                ResponseEntity.status(HttpStatus.BAD_REQUEST).body("OTP invalide ou expiré");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestParam String email, @RequestParam String newPassword) {
        User user = userRepository.findByEmail(email);
        if (user == null) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Utilisateur introuvable");
        System.out.println("Mot de passe avant encodage : " + newPassword);
        user.setPassword(new BCryptPasswordEncoder().encode(newPassword));
        userRepository.save(user);

        return ResponseEntity.ok("Mot de passe réinitialisé avec succès !");
    }
    @GetMapping(Constants.ID)
    public User getUserById( @PathVariable String id) {
        return authService.getUserById(id);
    }

    @GetMapping(Constants.ROLES)
    public List<String> getAllRoles() {
        return Arrays.stream(Role.values())
                .map(Enum::name)
                .collect(Collectors.toList());
    }
}

