package tn.kidora.spring.kidorabackoffice.services.serviceImpl;

import lombok.AllArgsConstructor;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
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
import tn.kidora.spring.kidorabackoffice.config.JwtUtils;
import tn.kidora.spring.kidorabackoffice.dto.RegisterDto;
import tn.kidora.spring.kidorabackoffice.dto.Client.UserRegistreDto;
import tn.kidora.spring.kidorabackoffice.entities.Client.RoleUsers;
import tn.kidora.spring.kidorabackoffice.entities.Role;

import tn.kidora.spring.kidorabackoffice.entities.User;
import tn.kidora.spring.kidorabackoffice.entities.Client.Users;
import tn.kidora.spring.kidorabackoffice.repositories.Client.ClientRepo;
import tn.kidora.spring.kidorabackoffice.repositories.UserRepository;
import tn.kidora.spring.kidorabackoffice.services.AuthService;
@AllArgsConstructor
@Service
public class AuthServiceImpl implements  AuthService{
    
    public final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;
   private final ClientRepo clientRepo;

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
        user.setRegion(dto.getRegion());
        return userRepository.save(user);}
    //Registre Client
    @Override
    public Users registerClient(UserRegistreDto dto) {
        if(clientRepo.existsByEmail(dto.getEmail())){
            throw new RuntimeException("Email already registered!");
        }
        System.out.println("RegisterClient called with DTO: " +dto);

        // Créer l'entité Users
        Users user = new Users();
        user.setNom(dto.getNom());
        user.setPrenom(dto.getPrenom());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole(dto.getRole());  // RoleUsers: ROLE_PARENT ou ROLE_EDUCATEUR
        user.setStatutClient(dto.getStatutClient());
        // Champs optionnels selon le rôle
        if (dto.getRole() == RoleUsers.PARENT) {
            user.setProfession(dto.getProfession());
            user.setRelation(dto.getRelation());
            user.setNumTel(dto.getNumTel());
            user.setAdresse(dto.getAdresse());
        } else if (dto.getRole() == RoleUsers.EDUCATEUR) {
            user.setSpecialisation(dto.getSpecialisation());
            user.setExperience(dto.getExperience());
            user.setDisponibilite(dto.getDisponibilite());
            user.setClasse(dto.getClasse());
        }
        // ✅ Gérer l'image de profil si envoyée
        if (dto.getImageFile() != null && !dto.getImageFile().isEmpty()) {
            try {
                String uploadDir = "uploads/users/";
                File directory = new File(uploadDir);
                if (!directory.exists()) {
                    directory.mkdirs();
                }

                // Nom unique du fichier
                String fileName = System.currentTimeMillis() + "_" + dto.getImageFile().getOriginalFilename();
                Path filePath = Paths.get(uploadDir, fileName);

                // Copier le fichier sur le disque
                Files.copy(dto.getImageFile().getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                // Enregistrer le chemin relatif dans l'entité
                user.setImageUrl("/" + uploadDir + fileName);

            } catch (IOException e) {
                throw new RuntimeException("Erreur lors du téléchargement de l'image : " + e.getMessage(), e);
            }
        }
        user.setActive(true);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        // Sauvegarder l'utilisateur dans la base

        return  clientRepo.save(user);
    }

    public Map<String,Object> login(String email, String password) {
        User user = userRepository.findByEmail(email);
        if (user != null) {
            try {
                Authentication authentication = authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(email, password)
                );
                if (authentication.isAuthenticated()) {
                    String token = jwtUtils.generateToken(user.getId(), email, user.getRole().toString());
                    Map<String, Object> authData = new HashMap<>();
                    authData.put("token", token);
                    authData.put("type", "Bearer");
                    return authData;
                }
            } catch (AuthenticationException e) {
                throw new RuntimeException("Email ou mot de passe incorrect");
            }
        }
        Users client = clientRepo.findByEmail(email);
        if (client != null && passwordEncoder.matches(password, client.getPassword())) {
            String token = jwtUtils.generateToken(client.getId(), email, "CLIENT");
            Map<String, Object> authData = new HashMap<>();
            authData.put("token", token);
            authData.put("type", "Bearer");
            return authData;
        }
        throw new RuntimeException("Email ou mot de passe incorrect");
    }

    @Override
    public List<User> getAllUsersExceptSuperAdmin() {
        return userRepository.findAll()
                .stream().filter(user->user.getRole() !=Role.SUPER_ADMIN)
                .collect(Collectors.toList());

    }


    @Override
    public User updateAdminProfile(String email,  String newEmail,String nom, String tel,String newPassword,MultipartFile imageFile) {
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
        if (newEmail != null && !newEmail.isEmpty() && !newEmail.equals(email)) {
            // Vérifier si le nouvel email n'est pas déjà utilisé
            if (userRepository.findByEmail(newEmail) != null) {
                throw new RuntimeException("L'adresse e-mail est déjà utilisée !");
            }
            user.setEmail(newEmail);
        }
        if (newPassword != null && !newPassword.isEmpty()) {
            //  Assure-toi d’utiliser ton encodeur BCryptPasswordEncoder
            String encodedPassword = passwordEncoder.encode(newPassword);
            user.setPassword(encodedPassword);
        }
        if (imageFile != null && !imageFile.isEmpty()) {
            try {
                String uploadDir = System.getProperty("user.dir") + "/uploads/";

                File directory = new File(uploadDir);
                if (!directory.exists()) {
                    directory.mkdirs();
                }
                String fileName = System.currentTimeMillis() + "_" + imageFile.getOriginalFilename();
                Path filePath = Paths.get(uploadDir + fileName);
                Files.write(filePath, imageFile.getBytes());
                String fileUrl = "http://localhost:8080/uploads/" + fileName;
                user.setImageUrl(fileUrl);

            } catch (IOException e) {
                throw new RuntimeException("Erreur lors de l'enregistrement de l'image", e);
            }
        }
        userRepository.save(user);
        return user;
    }


    @Override
    public void deleteUserById(String id) {
        userRepository.deleteById(id);
    }

    @Override
    public User getUserById(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable avec l'ID : " + id));
    }

    @Override
    public User updateAdminProfileById(String id, String newEmail, String newPassword,Role newRole) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable !"));

        if (newEmail != null && !newEmail.isEmpty() && !newEmail.equals(user.getEmail())) {
            if (userRepository.findByEmail(newEmail) != null) {
                throw new RuntimeException("L'adresse e-mail est déjà utilisée !");
            }
            user.setEmail(newEmail);
        }
        if (newPassword != null && !newPassword.isEmpty()) {
            String encodedPassword = passwordEncoder.encode(newPassword);
            user.setPassword(encodedPassword);
        }
        // Mettre à jour le rôle si fourni
        if (newRole != null) {
            user.setRole(newRole);
        }
        userRepository.save(user);
        return user;
    }

    @Override
    public User updateSuperAdminPassword(String email, String oldPassword, String newPassword) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("Utilisateur introuvable !");
        }
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("Ancien mot de passe incorrect !");
        }

        // Encoder et mettre à jour le nouveau mot de passe
        String encodedNewPassword = passwordEncoder.encode(newPassword);
        user.setPassword(encodedNewPassword);

        userRepository.save(user);

        return user;
    }

    @Override
    public List<User> getAllUsersByRegion(String region) {
        List<User> users = userRepository.findByRegion(region);
        return users;
    }




}

