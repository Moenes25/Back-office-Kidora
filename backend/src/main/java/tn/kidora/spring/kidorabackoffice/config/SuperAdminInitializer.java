package tn.kidora.spring.kidorabackoffice.config;

import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Configuration;
import lombok.RequiredArgsConstructor;
import tn.kidora.spring.kidorabackoffice.entities.Role;
import tn.kidora.spring.kidorabackoffice.entities.User;
import tn.kidora.spring.kidorabackoffice.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.logging.Level;
import java.util.logging.Logger;

@Configuration
@RequiredArgsConstructor
public class SuperAdminInitializer {
    
     private final  UserRepository userRepository;
     private final PasswordEncoder passwordEncoder;

     
     @Value("${super.admin.nom}")
     private String superAdminNom;
     @Value("${super.admin.email}")
     private String superAdminEmail;
     @Value("${super.admin.password}")
     private String superAdminPassword;
     @Value("${super.admin.tel}")
     private String superAdminTel;
     

     @PostConstruct
     public void init() {
        User existingUser = userRepository.findByEmail(superAdminEmail);
        if(existingUser == null){
            User superAdmin = User.builder()
                    .nom(superAdminNom)
                    .email(superAdminEmail)
                    .tel(superAdminTel)
                    .password(passwordEncoder.encode(superAdminPassword))
                    .role(Role.SUPER_ADMIN)
                    .build();
            userRepository.save(superAdmin);
        } else {
            boolean updated = false;
            if(!superAdminNom.equals(existingUser.getNom())){
                existingUser.setNom(superAdminNom);
                updated = true;
            }
            if(!superAdminTel.equals(existingUser.getTel())){
                existingUser.setTel(superAdminTel);
                updated = true;
            }
            if(!passwordEncoder.matches(superAdminPassword, existingUser.getPassword())){
                existingUser.setPassword(passwordEncoder.encode(superAdminPassword));
                updated = true;
            }
            if(updated){
                userRepository.save(existingUser);
            } else{
                Logger.getLogger(SuperAdminInitializer.class.getName()).log(Level.SEVERE, "Super admin already exists");
            }

        }

       
     }



}