package tn.kidora.spring.kidorabackoffice.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import tn.kidora.spring.kidorabackoffice.entities.User;

public interface UserRepository extends JpaRepository<User, Integer> {
    User findByNom(String username);
    User findByEmail(String email);

    
} 
