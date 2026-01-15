package tn.kidora.spring.kidorabackoffice.dto.Client;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;


@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EventDto {
     String id;
     String titre;
     String couleur;
   LocalDate dateDebut;
    LocalDate dateFin;
}
