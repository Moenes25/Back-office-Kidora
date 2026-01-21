package tn.kidora.spring.kidorabackoffice.repositories.Client;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
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
    @Query(value = "{ 'role' : 'PARENT' }", count = true)
    long countParents();
    Optional<Users> findByEmailIgnoreCase(String email);
    // Nombre d'éducateurs par établissement
    @Query(value = "{ 'etablissement.$id': ?1, 'role': ?0 }", count = true)
    Long countEducateurByEtablissement(RoleUsers role, ObjectId etablissementId);

    // Nombre de parents par établissement
    @Query(value = "{ 'etablissement.$id': ?1, 'role': ?0 }", count = true)
    Long countParentByEtablissement(RoleUsers role, ObjectId etablissementId);
}
