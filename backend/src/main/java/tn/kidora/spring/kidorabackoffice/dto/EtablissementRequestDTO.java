package tn.kidora.spring.kidorabackoffice.dto;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Data;
import tn.kidora.spring.kidorabackoffice.entities.Type_Etablissement;

@Data
public class EtablissementRequestDTO {
    String nomEtablissement;
    String adresse_complet;
    String region;
    String telephone ;
    String url_localisation;
    @Enumerated(EnumType.STRING)
    Type_Etablissement type;
    String email;
    String password ;
    Boolean isActive;

     Integer userId;
}
