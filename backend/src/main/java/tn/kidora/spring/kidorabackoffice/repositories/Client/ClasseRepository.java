package tn.kidora.spring.kidorabackoffice.repositories.Client;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import tn.kidora.spring.kidorabackoffice.entities.Client.Classes;

@Repository
public interface ClasseRepository  extends MongoRepository<Classes,String> {
}
