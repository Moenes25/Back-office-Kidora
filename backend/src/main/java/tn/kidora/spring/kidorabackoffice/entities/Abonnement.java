 package tn.kidora.spring.kidorabackoffice.entities;
 import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

@Document(collection = "abonnements")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Abonnement {
    @Id
    private String idAbonnement;
    private LocalDate dateDebutAbonnement;
    private LocalDate dateFinAbonnement;
    private Double montantPaye;
    private Double montantDu;

    private StatutPaiement statut;
    private FormuleAbonnement formule ;
    // Informations de facture (1 facture pour cet abonnement)
   // private String referenceFacture;
   // private LocalDate dateFacture;
  //  private StatutFacture statutFacture;
    //private boolean envoyee;


    @DocumentReference
   private Etablissement etablissement;
}

