package tn.kidora.spring.kidorabackoffice.dto;


import lombok.Data;
import tn.kidora.spring.kidorabackoffice.entities.Type_Etablissement;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class EvenementRequestDTO {
    private String titre;
    private String description;
    private LocalDate date;
    private LocalTime heureDebut;
    private LocalTime heureFin;
    private Type_Etablissement type;
    private String etablissementId;

}
