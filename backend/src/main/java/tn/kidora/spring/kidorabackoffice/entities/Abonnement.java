package tn.kidora.spring.kidorabackoffice.entities;
import java.time.LocalDate;


import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;

@Data
public class Abonnement {
    @Id
    private String idAbonnement;
    private LocalDate dateDebutAbonnement;
    private LocalDate dateFinAbonnement;
    private Double montantPaye;
    private Double montantDu;

    private StatutPaiement statut;

   @DBRef
   private Etablissement etablissement;
}