package tn.kidora.spring.kidorabackoffice.repositories;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import tn.kidora.spring.kidorabackoffice.entities.Etablissement;
import tn.kidora.spring.kidorabackoffice.entities.User;
import tn.kidora.spring.kidorabackoffice.entities.Type_Etablissement;

@Repository
public interface Etablissement_Repository extends MongoRepository<Etablissement,String> {

    Optional<Etablissement> findById(String id);

    List<Etablissement> findByType(Type_Etablissement type);
    List<Etablissement> findByRegion(String region);
    boolean existsByEmail(String email);
    List<Etablissement> findByIsActiveTrue();
    List<Etablissement> findByIsActiveFalse();
    // @Query("SELECT DISTINCT e FROM Etablissement e JOIN e.abonnements a "+
    //        "WHERE YEAR(a.dateDebutAbonnement) = YEAR(CURRENT_DATE)"+
    //        "AND MONTH(a.dateDebutAbonnement) = MONTH(CURRENT_DATE)"
    //       )
    // List<Etablissement> findEtablissementsAbonnesCeMois();


 
    @Aggregation(pipeline = {
        "{ '$lookup': { " +
        "    'from': 'abonnements', " +
        "    'localField': '_id', " +
        "    'foreignField': 'etablissement.$id', " +
        "    'as': 'abonnements' " +
        "} }",
        "{ '$unwind': { 'path': '$abonnements', 'preserveNullAndEmptyArrays': false } }",
        "{ '$match': { " +
        "    'abonnements.dateDebutAbonnement': { " +
        "        '$gte': ?0, " +
        "        '$lt': ?1 " +
        "    } " +
        "} }",
        "{ '$project': { 'abonnements': 0 } }" // Optionnel: exclut le champ abonnements du résultat
    })
    List<Etablissement> findEtablissementsAbonnesCeMois(Date debutMois, Date finMois);
}

