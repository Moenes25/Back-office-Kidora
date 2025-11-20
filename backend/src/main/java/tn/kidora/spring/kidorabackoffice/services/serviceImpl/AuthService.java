package tn.kidora.spring.kidorabackoffice.services.serviceImpl;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import tn.kidora.spring.kidorabackoffice.dto.RegisterDto;
import tn.kidora.spring.kidorabackoffice.entities.Role;
import tn.kidora.spring.kidorabackoffice.entities.User;
import tn.kidora.spring.kidorabackoffice.repositories.UserRepository;
@AllArgsConstructor
@Service
public class AuthService implements  AuthServiceImpl{
    private final UserRepository userRepository;

    @Override
    public void register(RegisterDto dto) {
        if(userRepository.existsByEmail(dto.getEmail())){
            throw new RuntimeException("Email is already registred!");
        }
        Role role = dto.getRole();
        if (role == null) {
            throw new RuntimeException("Role must be provided by the super admin");
        }
        User user = new User();
        user.setNom((dto.getNom()));
        user.setEmail(dto.getEmail());
        user.setTel((dto.getTel()));
        user.setPassword(dto.getPassword());
        user.setRole(dto.getRole());
        userRepository.save(user);}
}

