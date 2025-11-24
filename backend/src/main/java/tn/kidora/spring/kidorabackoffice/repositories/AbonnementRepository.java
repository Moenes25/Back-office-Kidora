package tn.kidora.spring.kidorabackoffice.repositories;

import tn.kidora.spring.kidorabackoffice.entities.Abonnement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AbonnementRepository  extends JpaRepository<Abonnement,Long> {
    
}
