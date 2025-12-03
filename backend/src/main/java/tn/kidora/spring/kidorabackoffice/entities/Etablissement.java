package tn.kidora.spring.kidorabackoffice.entities;


<<<<<<< HEAD
=======
import java.util.ArrayList;
import java.util.List;

>>>>>>> 271e7ff2abf48acd90ea951fd6ee6f27af243e62
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
    Integer nombreEducateurs;
    Integer nombreParents;
    Integer nombreEnfants;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false) 
    @ToString.Exclude
    User user; 

    @OneToMany(mappedBy = "etablissement", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @ToString.Exclude
    private List<Abonnement> abonnements = new ArrayList<>();
}
