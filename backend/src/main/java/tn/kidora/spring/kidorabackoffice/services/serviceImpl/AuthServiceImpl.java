package tn.kidora.spring.kidorabackoffice.services.serviceImpl;

import java.util.HashMap;
import java.util.Map;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import tn.kidora.spring.kidorabackoffice.config.JwtUtils;
import tn.kidora.spring.kidorabackoffice.dto.RegisterDto;
import tn.kidora.spring.kidorabackoffice.entities.Role;
import tn.kidora.spring.kidorabackoffice.entities.User;
import tn.kidora.spring.kidorabackoffice.repositories.UserRepository;
import tn.kidora.spring.kidorabackoffice.services.AuthService;

@AllArgsConstructor
@Service
public class AuthServiceImpl implements AuthService {

    public final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;

    @Override
    public User register(RegisterDto dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email is already registred!");
        }
        Role role = dto.getRole();
        if (role == null) {
            throw new RuntimeException("Role must be provided by the super admin");
        }
        if (role == Role.SUPER_ADMIN) {
            throw new RuntimeException("Cannot create a super admin via this endpoint");
        }
        User user = new User();
        user.setNom((dto.getNom()));
        user.setEmail(dto.getEmail());
        user.setTel((dto.getTel()));
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole(dto.getRole());
        return userRepository.save(user);
    }

    public Map<String, Object> login(String email, String password) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password)
            );
            if (authentication.isAuthenticated()) {
                String token = jwtUtils.generateToken(email);
                User user = userRepository.findByEmail(email);
                Map<String, Object> authData = new HashMap<>();
                authData.put("token", token);
                authData.put("type", "Bearer");
                // authData.put("user", user);
                //-----------------------------
                // authData.put("id", user.getIdUser());
                // authData.put("nom", user.getNom());
                // authData.put("email", user.getEmail());
                // authData.put("tel", user.getTel());
                // authData.put("role", user.getRole());
                //-----------------------------
                return authData;

            }
            throw new RuntimeException("Authentification échouée");
        } catch (AuthenticationException e) {
            throw new RuntimeException("Email ou mot de passe incorrect");
        }
    }

}
