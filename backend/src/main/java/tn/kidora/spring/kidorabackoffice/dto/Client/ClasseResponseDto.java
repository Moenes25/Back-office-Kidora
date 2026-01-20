package tn.kidora.spring.kidorabackoffice.dto.Client;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import tn.kidora.spring.kidorabackoffice.entities.Client.TrancheAge;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClasseResponseDto {

    private String id ;
    private String nom_classe;
    private String description_classe;
    private TrancheAge trancheAge;
    private String couleur_classe;
    private Integer capacite;
    private String salle;
    private String created_by_id;
    private String created_by_nom ;

}
