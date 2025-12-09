package tn.kidora.spring.kidorabackoffice.entities;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class Evenement {

    @Id
    String idEvenement;

    String titre;
    String description;

    LocalDate date;
    LocalTime heureDebut;
    LocalTime heureFin;

    Type_Etablissement type;

    @DBRef
    Etablissement etablissement;

}
