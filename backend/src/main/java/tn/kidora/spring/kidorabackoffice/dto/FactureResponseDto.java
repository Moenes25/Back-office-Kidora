package tn.kidora.spring.kidorabackoffice.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FactureResponseDto {
    private String idFacture;
    private String date;
    private String nomEtablissement;
    private String type;
    private String gouvernorat;
    private String email;
    private String statut;
}
