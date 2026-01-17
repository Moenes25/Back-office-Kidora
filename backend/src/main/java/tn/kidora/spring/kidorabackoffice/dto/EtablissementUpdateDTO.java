package tn.kidora.spring.kidorabackoffice.dto;

// import jakarta.persistence.EnumType;
// import jakarta.persistence.Enumerated;
import lombok.Data;
import tn.kidora.spring.kidorabackoffice.entities.Type_Etablissement;

@Data
public class EtablissementUpdateDTO  {
    String nomEtablissement;
    String adresse_complet;
    String region;
    String telephone ;
    String url_localisation;
    String password ;
    // @Enumerated(EnumType.STRING)
    Type_Etablissement type;
    String email;
    Boolean isActive;
    String userId;
    String usersId;
    
}
