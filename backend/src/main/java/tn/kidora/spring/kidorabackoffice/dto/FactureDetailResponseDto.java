package tn.kidora.spring.kidorabackoffice.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FactureDetailResponseDto {
   // Identification
    private String idFacture;
    private String date;

    // Établissement
    private String nomEtablissement;
    private String type;
    private String gouvernorat;
    private String email;
    private String telephone;
    // Détails financiers
    private double montantHT;
    private double montantTVA;
    private double timbreFiscal;
    private double montantTTC;
    private String methode;
    private int nombreEnfants;
    private String statut;
}
