package tn.kidora.spring.kidorabackoffice.services.serviceImpl;


import java.util.Collections;
import java.util.Optional;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import tn.kidora.spring.kidorabackoffice.entities.User;
import tn.kidora.spring.kidorabackoffice.entities.Client.Users;
import tn.kidora.spring.kidorabackoffice.repositories.UserRepository;
import tn.kidora.spring.kidorabackoffice.repositories.Client.ClientRepo;

@Slf4j
@Service
@AllArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;
    private final ClientRepo clientRepo;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
          // Nettoyer l'email (trim seulement pour garder la casse originale)
          String cleanEmail = (email != null) ? email.trim() : null;
          log.debug("Recherche de l'utilisateur avec l'email: {}", cleanEmail);
          
          // Chercher d'abord dans UserRepository (admins) avec l'email exact
          User user = userRepository.findByEmail(cleanEmail);  
          if(user != null){
              log.debug("Utilisateur trouvé dans UserRepository: {}", user.getEmail());
              return new org.springframework.security.core.userdetails.User(
                user.getEmail(), user.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
              );
          }
          
          log.debug("Utilisateur non trouvé dans UserRepository, recherche dans ClientRepo...");
          
          // Si pas trouvé, chercher dans ClientRepo (clients/parents/éducateurs) avec l'email exact
          Optional<Users> clientOpt = clientRepo.findByEmail(cleanEmail);
          
          // Si pas trouvé avec l'email exact, essayer une recherche insensible à la casse
          if(clientOpt.isEmpty()){
              log.warn("Utilisateur non trouvé avec l'email exact: {}, tentative avec recherche insensible à la casse", cleanEmail);
              Optional<Users> clientCaseInsensitive = clientRepo.findAll().stream()
                      .filter(u -> u.getEmail() != null && u.getEmail().trim().equalsIgnoreCase(cleanEmail))
                      .findFirst();
              
              if(clientCaseInsensitive.isPresent()){
                  log.info("Utilisateur trouvé avec recherche insensible à la casse: {}", clientCaseInsensitive.get().getEmail());
                  clientOpt = clientCaseInsensitive;
              }
          }
          
          if(clientOpt.isEmpty()){
              log.error("Utilisateur non trouvé avec l'email: {} dans UserRepository et ClientRepo", cleanEmail);
              throw new UsernameNotFoundException("Utilisateur non trouvé avec l'email: " + cleanEmail + 
                      ". Veuillez vous inscrire via /api/client/register");
          }
          
          Users client = clientOpt.get();
          log.debug("Utilisateur trouvé dans ClientRepo: {} avec le rôle: {}", client.getEmail(), client.getRole());
          String role = (client.getRole() != null) 
                  ? client.getRole().name() 
                  : "PARENT";
          
          return new org.springframework.security.core.userdetails.User(
            client.getEmail(), client.getPassword(),
            Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role))
          );
    }
}