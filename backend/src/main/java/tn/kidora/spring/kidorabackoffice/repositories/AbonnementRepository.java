package tn.kidora.spring.kidorabackoffice.repositories;


import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import tn.kidora.spring.kidorabackoffice.entities.Abonnement;

import org.springframework.stereotype.Repository;
import tn.kidora.spring.kidorabackoffice.entities.StatutPaiement;

import java.util.List;
import java.util.Map;

@Repository
public interface AbonnementRepository  extends MongoRepository<Abonnement,String> {
    List<Abonnement> findByEtablissement_IdEtablissment(String idEtablissement);
    List<Abonnement> findByStatut(StatutPaiement statut);
    @Aggregation(pipeline = {
            "{ $match: { $expr: { $eq: [ { $year: '$dateDebutAbonnement' }, ?0 ] } } }",
            "{ $lookup: { from: 'etablissement', localField: 'etablissement', foreignField: '_id', as: 'etab' } }",
            "{ $unwind: '$etab' }",
            "{ $group: { _id: '$etab.type', nombre: { $sum: 1 } } }",
            "{ $project: { _id: 0, type: '$_id', nombre: 1 } }"
    })
    List<Map<String, Object>> getRepartitionParTypeEtablissement(int annee);

    

}
