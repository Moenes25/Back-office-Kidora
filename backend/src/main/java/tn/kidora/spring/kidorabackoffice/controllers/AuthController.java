package tn.kidora.spring.kidorabackoffice.controllers;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

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

        user.setPassword(new BCryptPasswordEncoder().encode(newPassword));
        userRepository.save(user);

        return ResponseEntity.ok("Mot de passe réinitialisé avec succès !");
    }

}

