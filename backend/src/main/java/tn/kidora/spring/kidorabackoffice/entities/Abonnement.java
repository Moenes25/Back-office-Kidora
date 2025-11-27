package tn.kidora.spring.kidorabackoffice.entities;
import java.time.LocalDate;

import jakarta.persistence.*;
import lombok.Data;
@Entity
@Data
public class Abonnement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idAbonnement;
    private LocalDate dateDebutAbonnement;
    private LocalDate dateFinAbonnement;
    private Double montantPaye;
    private Double montantDu;
    @Enumerated(EnumType.STRING)
    private StatutPaiement statut;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "etablissement_id")
    private Etablissement etablissement;
}