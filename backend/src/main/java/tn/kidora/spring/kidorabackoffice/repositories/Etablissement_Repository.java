package tn.kidora.spring.kidorabackoffice.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.kidora.spring.kidorabackoffice.entities.Etablissement;
import tn.kidora.spring.kidorabackoffice.entities.User;
import tn.kidora.spring.kidorabackoffice.entities.Type_Etablissement;

@Repository
public interface Etablissement_Repository extends JpaRepository<Etablissement,Integer> {
    List<Etablissement> findByType(Type_Etablissement type);
    List<Etablissement> findByRegion(String region);
    boolean existsByEmail(String email);
    List<Etablissement> findByIsActiveTrue();
}

