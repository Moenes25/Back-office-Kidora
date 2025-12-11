package tn.kidora.spring.kidorabackoffice.repositories;


// import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import tn.kidora.spring.kidorabackoffice.entities.User;

import java.util.Optional;
@Repository

public interface UserRepository extends MongoRepository<User,String> {

    boolean existsByEmail(String email);
    User findByEmail(String email);
    Optional<User> findById(String id);
    void deleteById(String id);
}

