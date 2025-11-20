package tn.kidora.spring.kidorabackoffice.controllers;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import tn.kidora.spring.kidorabackoffice.config.JwtUtils;
import tn.kidora.spring.kidorabackoffice.entities.User;
import tn.kidora.spring.kidorabackoffice.repositories.UserRepository;
import tn.kidora.spring.kidorabackoffice.utils.Constants;
import org.springframework.web.bind.annotation.PostMapping;


@RestController
@RequestMapping(Constants.APP_ROOT + Constants.AUTH)
@AllArgsConstructor
@Slf4j
public class AuthController {
 
    public final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;


    @PostMapping(Constants.REGISTER)
    public ResponseEntity<?> register(@RequestBody User user) {
        if (userRepository.findByNom(user.getNom()) != null) {
            return ResponseEntity.badRequest().body("User already exists");
            
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return  ResponseEntity.ok(userRepository.save(user));
    }
    @PostMapping(Constants.LOGIN)
    public ResponseEntity<?> login(@RequestBody User user) {
        try{
            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword()));
            if (authentication.isAuthenticated()) {
               Map<String, Object> authData = new HashMap<>();
               authData.put("token", jwtUtils.generateToken(user.getEmail()));
               authData.put("type", "Bearer");
               return ResponseEntity.ok(authData);
            }
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
            } catch(AuthenticationException e) {
                log.error(e.getMessage());
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
            }

        }
        
    }
    

