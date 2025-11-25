package tn.kidora.spring.kidorabackoffice.repositories;

import tn.kidora.spring.kidorabackoffice.entities.Abonnement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.kidora.spring.kidorabackoffice.entities.StatutPaiement;

import java.util.List;

@Repository
public interface AbonnementRepository  extends JpaRepository<Abonnement,Long> {
    List<Abonnement> findByEtablissement_IdEtablissment(Integer idEtablissement);
    List<Abonnement> findByStatut(StatutPaiement statut);


}
