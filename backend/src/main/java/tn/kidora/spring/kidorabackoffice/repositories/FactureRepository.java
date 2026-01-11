package tn.kidora.spring.kidorabackoffice.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import tn.kidora.spring.kidorabackoffice.entities.Facture;
import tn.kidora.spring.kidorabackoffice.entities.StatutFacture;

@Repository
public interface FactureRepository extends MongoRepository<Facture, String> {
    long countByStatutFacture(StatutFacture statutFacture);
}
