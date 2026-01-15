package tn.kidora.spring.kidorabackoffice.dto;

import lombok.Data;
import tn.kidora.spring.kidorabackoffice.entities.StatutFacture;
import tn.kidora.spring.kidorabackoffice.entities.Type_Etablissement;

import java.time.LocalDate;

@Data
public class PaiementHistoriqueDto {
    private String idFacture;
    private LocalDate date;
    private String nomEtablissement;
    private Type_Etablissement typeEtablissement;
    private String gouvernorat;
    private String email;
    private String libelleAbonnement;
    private StatutFacture statutFacture;
}
