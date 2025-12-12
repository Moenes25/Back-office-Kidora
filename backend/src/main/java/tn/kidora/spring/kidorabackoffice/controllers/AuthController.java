package tn.kidora.spring.kidorabackoffice.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import tn.kidora.spring.kidorabackoffice.dto.LoginDto;
import tn.kidora.spring.kidorabackoffice.dto.RegisterDto;
import tn.kidora.spring.kidorabackoffice.entities.User;
import tn.kidora.spring.kidorabackoffice.repositories.UserRepository;
import tn.kidora.spring.kidorabackoffice.services.AuthService;
import tn.kidora.spring.kidorabackoffice.services.serviceImpl.OptService;
import tn.kidora.spring.kidorabackoffice.utils.Constants;
// File serving endpoint

@RestController
@RequestMapping(Constants.APP_ROOT + Constants.AUTH)
@AllArgsConstructor
@Slf4j
public class AuthController {

    public final OptService optService;
    AuthService authService;
    UserRepository userRepository;

    @PostMapping(Constants.REGISTER)
    public ResponseEntity<String> register(@RequestBody RegisterDto dto) {
        try {
            User savedUser = authService.register(dto);
            return ResponseEntity.ok(savedUser.getPassword());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
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
        } catch (RuntimeException e) {
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
        return authService.updateAdminProfile(email, newEmail, nom, tel, newPassword, imageFile);
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
        return valid ? ResponseEntity.ok("OTP vérifié")
                : ResponseEntity.status(HttpStatus.BAD_REQUEST).body("OTP invalide ou expiré");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestParam String email, @RequestParam String newPassword) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Utilisateur introuvable");
        }
        System.out.println("Mot de passe avant encodage : " + newPassword);
        user.setPassword(new BCryptPasswordEncoder().encode(newPassword));
        userRepository.save(user);

        return ResponseEntity.ok("Mot de passe réinitialisé avec succès !");
    }

    @GetMapping(Constants.ID)
    public User getUserById(@PathVariable String id) {
        return authService.getUserById(id);
    }
}
