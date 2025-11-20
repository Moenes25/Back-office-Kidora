package tn.kidora.spring.kidorabackoffice.controllers;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tn.kidora.spring.kidorabackoffice.dto.RegisterDto;
import tn.kidora.spring.kidorabackoffice.services.serviceImpl.AuthService;

@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
public class AuthController {

    AuthService authService;
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterDto dto) {
        try{
            authService.register(dto);
            return ResponseEntity.ok("User created successfully!");
        }catch (RuntimeException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Unexpected error: " + e.getMessage());
        }

    }
}
