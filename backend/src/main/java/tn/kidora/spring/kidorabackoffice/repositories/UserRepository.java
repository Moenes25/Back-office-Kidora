package tn.kidora.spring.kidorabackoffice.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;
import tn.kidora.spring.kidorabackoffice.entities.User;

import java.util.Optional;
@Repository
public interface UserRepository extends JpaRepository<User,Integer> {
    boolean existsByEmail(String email);
    User findByEmail(String email);
}

