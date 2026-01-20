package tn.kidora.spring.kidorabackoffice.repositories.Client;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import tn.kidora.spring.kidorabackoffice.entities.Client.EducateurClasse;

public interface EducateurClasseRepository extends MongoRepository<EducateurClasse, String>  {
    

    List<EducateurClasse> findByEducateurId(String id);
    List<EducateurClasse> findByClasseId(String classeId);
    Optional<EducateurClasse> findByEducateurIdAndClasseId(String educateurId, String classeId);
    boolean existsByEducateurIdAndClasseId(String educateurId, String classeId);
}
