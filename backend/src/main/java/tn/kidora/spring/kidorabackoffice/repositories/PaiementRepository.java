package tn.kidora.spring.kidorabackoffice.repositories;
import org.springframework.data.mongodb.repository.MongoRepository;

import tn.kidora.spring.kidorabackoffice.entities.Paiement;

public interface PaiementRepository extends MongoRepository<Paiement, String> {
    
}
