package tn.kidora.spring.kidorabackoffice.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.kidora.spring.kidorabackoffice.entities.Etablissement;
import tn.kidora.spring.kidorabackoffice.entities.User;

@Repository
public interface Etablissement_Repository extends JpaRepository<Etablissement,Integer> {
}
