package tn.kidora.spring.kidorabackoffice.entities;


import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

// import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Document(collection = "etablissements")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Etablissement {
    @Id
    private String idEtablissment;
    private String nomEtablissement;
    private String adresse_complet;
    private String region;
    private String telephone ;
    private String url_localisation;
    
    private Type_Etablissement type;
    private String email;
    private Boolean isActive;
    @DocumentReference
    private User user; 

    // @OneToMany(mappedBy = "etablissement", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    // @ToString.Exclude
    // private List<Abonnement> abonnements = new ArrayList<>();
}
