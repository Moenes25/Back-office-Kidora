package tn.kidora.spring.kidorabackoffice.dto.Client;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class EducateurClasseResponseDTO {
    private String id;
    private String educateurId;
    private String educateurNom;
    private String educateurPrenom;
    private String classeId;
    private String classeNom;
    private LocalDateTime dateAssignation;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}