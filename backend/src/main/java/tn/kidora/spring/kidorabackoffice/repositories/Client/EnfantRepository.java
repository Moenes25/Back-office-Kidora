package tn.kidora.spring.kidorabackoffice.repositories.Client;

import org.springframework.data.mongodb.repository.MongoRepository;
import tn.kidora.spring.kidorabackoffice.entities.Client.Enfants;

import java.util.List;

public interface EnfantRepository extends MongoRepository<Enfants, String> {
    List<Enfants> findByParentId(String parentId);
    List<Enfants> findByClasseId(String classeId);
}
