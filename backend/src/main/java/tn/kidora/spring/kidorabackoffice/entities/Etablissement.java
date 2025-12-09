package tn.kidora.spring.kidorabackoffice.entities;


import java.util.ArrayList;
import java.util.List;


import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
@Data
public class Etablissement {
    @Id
    String idEtablissment;
    String nomEtablissement;
    String adresse_complet;
    String region;
    String telephone ;
    String url_localisation;

    Type_Etablissement type;
    String email;
    String password ;
    Boolean isActive;
    Integer nombreEducateurs;
    Integer nombreParents;
    Integer nombreEnfants;
   @DBRef
    User user;

    @DBRef
    private List<Abonnement> abonnements = new ArrayList<>();
}
