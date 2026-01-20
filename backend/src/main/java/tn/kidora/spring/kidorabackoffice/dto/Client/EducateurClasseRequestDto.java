package tn.kidora.spring.kidorabackoffice.dto.Client;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class EducateurClasseRequestDto {
     private String educateurId;
     private String classeId;
     private LocalDateTime dateAssignation;
    
}
