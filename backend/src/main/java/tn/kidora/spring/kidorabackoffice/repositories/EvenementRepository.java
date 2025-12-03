package tn.kidora.spring.kidorabackoffice.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.kidora.spring.kidorabackoffice.entities.Evenement;

import java.time.LocalDate;
import java.util.List;

public interface EvenementRepository extends JpaRepository<Evenement, Long> {
    List<Evenement> findByDate(LocalDate date);


}
