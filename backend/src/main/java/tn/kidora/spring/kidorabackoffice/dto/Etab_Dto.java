package tn.kidora.spring.kidorabackoffice.dto;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import tn.kidora.spring.kidorabackoffice.entities.Type_Etablissement;

import java.time.LocalDateTime;

@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
public class Etab_Dto {
    String idEtablissment;
    String nomEtablissement;
    String adresse_complet;
    String region;
    String telephone ;
    String url_localisation;
    Type_Etablissement type;
    String email;
    Boolean isActive;
    String userId;
    String userNom;
    String userEmail;
    String password;
    Integer nombreEducateurs;
    Integer nombreParents;
    Integer nombreEnfants;
     LocalDateTime createdAt;
}
