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
import tn.kidora.spring.kidorabackoffice.services.AuthService;
import tn.kidora.spring.kidorabackoffice.services.serviceImpl.AuthServiceImpl;
import tn.kidora.spring.kidorabackoffice.utils.Constants;

@RestController
@RequestMapping(Constants.APP_ROOT+Constants.AUTH)
@AllArgsConstructor
@Slf4j
public class AuthController {

    AuthService authService;
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

}

