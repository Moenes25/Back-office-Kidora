package tn.kidora.spring.kidorabackoffice.services.serviceImpl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import tn.kidora.spring.kidorabackoffice.config.JwtUtils;
import tn.kidora.spring.kidorabackoffice.dto.RegisterDto;
import tn.kidora.spring.kidorabackoffice.entities.Role;
import tn.kidora.spring.kidorabackoffice.entities.User;
import tn.kidora.spring.kidorabackoffice.repositories.UserRepository;
import tn.kidora.spring.kidorabackoffice.services.AuthService;
@AllArgsConstructor
@Service
public class AuthServiceImpl implements  AuthService{
    
    public final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;

    @Override
    public User register(RegisterDto dto) {
        if(userRepository.existsByEmail(dto.getEmail())){
            throw new RuntimeException("Email is already registred!");
        }
        Role role = dto.getRole();
        if (role == null) {
            throw new RuntimeException("Role must be provided by the super admin");
        }
        if(role == Role.SUPER_ADMIN){
            throw new RuntimeException("Cannot create a super admin via this endpoint");
        }
        User user = new User();
        user.setNom((dto.getNom()));
        user.setEmail(dto.getEmail());
        user.setTel((dto.getTel()));
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole(dto.getRole());
        return userRepository.save(user);}

    public Map<String,Object> login(String email, String password) {
        try{
            Authentication authentication = authenticationManager.authenticate(
                new  UsernamePasswordAuthenticationToken(email, password)
            );
            if (authentication.isAuthenticated()) {
                String token = jwtUtils.generateToken(email);
                User user = userRepository.findByEmail(email);
                Map<String,Object> authData  = new HashMap<>();
                authData.put("token", token);
                authData.put("type", "Bearer");
                // authData.put("user", user);
                return authData;
            
            }
            throw new RuntimeException("Authentification échouée");
        } catch(AuthenticationException e){
            throw new RuntimeException("Email ou mot de passe incorrect");
        }
    }

    @Override
    public List<User> getAllUsersExceptSuperAdmin() {
        return userRepository.findAll()
                .stream().filter(user->user.getRole() !=Role.SUPER_ADMIN)
                .collect(Collectors.toList());

    }


    @Override
    public User updateAdminProfile(String email, String nom, String tel, MultipartFile imageFile) {
        User user = userRepository.findByEmail(email);
       // System.out.println("Email reçu : '" + email + "'");
        if (user == null) {
            throw new RuntimeException("Utilisateur introuvable !");
        }
        if (nom != null && !nom.isEmpty()) {
            user.setNom(nom);
        }
        if (tel != null && !tel.isEmpty()) {
            user.setTel(tel);
        }
        if (imageFile != null && !imageFile.isEmpty()) {
            user.setImageUrl(imageFile.getOriginalFilename());

        }
        userRepository.save(user);
        return user;
    }

    @Override
    public void deleteUserById(String id) {
        userRepository.deleteById(id);
    }


}

