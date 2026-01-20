package tn.kidora.spring.kidorabackoffice.entities.Client;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@Document(collection = "classes")
public class Classes {
    @Id
    private String id ;
    private String nom_classe;
    private String description_classe;
    private TrancheAge trancheAge;
    private String couleur_classe;
    private Integer capacite;
    private String salle;
    
    @DBRef
    private Users created_by;


}
