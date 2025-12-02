package tn.kidora.spring.kidorabackoffice.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import tn.kidora.spring.kidorabackoffice.entities.Evenement;
import tn.kidora.spring.kidorabackoffice.entities.Type_Etablissement;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface EvenementRepository extends JpaRepository<Evenement, Long> {
    List<Evenement> findByDate(LocalDate date);
    long countByDateAndType(LocalDate date, Type_Etablissement type);
    long countByType(Type_Etablissement type);
    @Query(
            value = """
          SELECT COUNT(*) FROM evenement e
          JOIN etablissement et ON e.id_etablissment = et.id_etablissment
         WHERE YEAR(e.date) = :year AND WEEK(e.date, 3) = :week AND (:type IS NULL OR et.type = :type) """, nativeQuery = true)
    long countEvenementSemaineParType(@Param("year") int year,
                                      @Param("week") int week,
                                      @Param("type") String type);


    @Query(value = """  
        SELECT 
        COALESCE(SUM(TIMESTAMPDIFF(MINUTE, e.heure_debut, e.heure_fin)) / 60, 0)
        FROM evenement e
        JOIN etablissement et ON e.id_etablissment = et.id_etablissment
        WHERE YEAR(e.date) = :year AND WEEK(e.date, 3) = :week
          AND (:type IS NULL OR et.type = :type) """, nativeQuery = true
    )
    double getTotalHeuresPlanifieesParType(@Param("year") int year,
                                           @Param("week") int week,
                                           @Param("type") String type);



}
