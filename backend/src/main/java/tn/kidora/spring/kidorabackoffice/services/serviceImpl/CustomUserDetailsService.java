package tn.kidora.spring.kidorabackoffice.services.serviceImpl;


import java.util.Collections;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import tn.kidora.spring.kidorabackoffice.entities.User;
import tn.kidora.spring.kidorabackoffice.repositories.UserRepository;

@Service
@AllArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
          User user = userRepository.findByEmail(email);  
          if(user==null){
              throw new UsernameNotFoundException("User not found with email: " + email);
          }
          return new org.springframework.security.core.userdetails.User(
            user.getEmail(),user.getPassword(),
             Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
            );
      


    //    User user = userRepository.findByNom(username);
    //     if (user == null) {
    //         throw new UsernameNotFoundException("User not found with username: " + username);

    // }
    // return  new org.springframework.security.core.userdetails.User(user.getNom(), user.getPassword(),
    //  Collections.singletonList(new SimpleGrantedAuthority(user.getRole().name())));
    
}
}