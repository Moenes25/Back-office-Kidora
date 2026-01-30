package tn.kidora.spring.kidorabackoffice.entities.Client;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@Document(collection = "absence")
public class Absence {
    @Id
    private String id ;


    private String date;


    private String heure;

    private StatutAbsence statut;

    @DBRef
    private Enfants enfants;


    @DBRef
    private Users EDUCATEUR; // l'éducateur qui a marqué l'absence ou la présence




}
