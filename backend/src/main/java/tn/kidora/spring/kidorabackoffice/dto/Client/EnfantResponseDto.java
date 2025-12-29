package tn.kidora.spring.kidorabackoffice.dto.Client;

import lombok.Data;

@Data
public class EnfantResponseDto {
    private String idEnfant;
    private String nom;
    private String prenom;
    private Integer age;
    private String classe;
    private String imageUrl;
    private String parentId;
}
