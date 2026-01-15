package tn.kidora.spring.kidorabackoffice.entities;


import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
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
    private String password;
    private Type_Etablissement type;
    private String email;
    private Boolean isActive;
    private Date dateDesactivation = null;
    @DocumentReference
    private User user; 
    
    @DocumentReference(lazy = false)
    private List<Abonnement> abonnements;

    private LocalDateTime createdAt;

}
