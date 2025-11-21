package tn.kidora.spring.kidorabackoffice.entities;


import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Etablissement {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    Integer idEtablissment;
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

}
