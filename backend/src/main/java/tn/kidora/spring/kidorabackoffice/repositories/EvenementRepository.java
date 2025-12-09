package tn.kidora.spring.kidorabackoffice.repositories;

import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import org.springframework.data.repository.query.Param;
import tn.kidora.spring.kidorabackoffice.entities.Evenement;
import tn.kidora.spring.kidorabackoffice.entities.Type_Etablissement;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface EvenementRepository extends MongoRepository<Evenement, String>{
    List<Evenement> findByDate(LocalDate date);
    long countByDateAndType(LocalDate date, Type_Etablissement type);
    long countByType(Type_Etablissement type);





}
