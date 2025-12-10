package tn.kidora.spring.kidorabackoffice.dto;

import java.time.LocalDate;

import lombok.Data;
import tn.kidora.spring.kidorabackoffice.entities.StatutPaiement;
@Data
public class AbonnementRequestDTO {
    private LocalDate dateDebutAbonnement;
    private LocalDate dateFinAbonnement;
    private Double montantPaye;
    private Double montantDu;
    private StatutPaiement statut;
    private String etablissementId;
    
}
