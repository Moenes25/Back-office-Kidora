package tn.kidora.spring.kidorabackoffice.repositories.Client;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import tn.kidora.spring.kidorabackoffice.entities.Client.RoleUsers;
import tn.kidora.spring.kidorabackoffice.entities.Client.Users;
import tn.kidora.spring.kidorabackoffice.entities.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClientRepo extends MongoRepository<Users,String> {
    boolean existsByEmail(String email);

    List<Users> findByRole(RoleUsers role);
    Optional<Users> findByEmail(String email);
    String Id(String id);
}
