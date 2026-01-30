package tn.kidora.spring.kidorabackoffice.repositories.Client;

import org.springframework.data.mongodb.repository.MongoRepository;
import tn.kidora.spring.kidorabackoffice.entities.Client.Absence;
import tn.kidora.spring.kidorabackoffice.entities.Client.StatutAbsence;

import java.time.LocalDate;


public interface AbsenceRepository extends MongoRepository<Absence,String> {

    long countByStatutAndDate(StatutAbsence statut, String date);

}
