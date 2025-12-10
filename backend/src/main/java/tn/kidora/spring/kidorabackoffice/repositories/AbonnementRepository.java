// package tn.kidora.spring.kidorabackoffice.repositories;

// import org.springframework.data.jpa.repository.Query;
// import org.springframework.data.repository.query.Param;
// import tn.kidora.spring.kidorabackoffice.entities.Abonnement;
// import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.stereotype.Repository;
// import tn.kidora.spring.kidorabackoffice.entities.StatutPaiement;

// import java.util.List;
// import java.util.Map;

// @Repository
// public interface AbonnementRepository  extends JpaRepository<Abonnement,Long> {
//     List<Abonnement> findByEtablissement_IdEtablissment(Integer idEtablissement);
//     List<Abonnement> findByStatut(StatutPaiement statut);

//     @Query("SELECT e.type AS type, COUNT(a) AS nombre " +
//             "FROM Abonnement a JOIN a.etablissement e " +
//             "WHERE YEAR(a.dateDebutAbonnement) = :annee " +
//             "GROUP BY e.type")
//     List<Map<String, Object>> getRepartitionParTypeEtablissement(@Param("annee") int annee);

    

// }
