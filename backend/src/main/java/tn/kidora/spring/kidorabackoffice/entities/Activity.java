package tn.kidora.spring.kidorabackoffice.entities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
@Document(collection = "activity")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Activity {
    @Id
    private String id;
    private String entityName;    // "Etablissement", "Event", etc.
    private String recordName;    // nom de l'objet ajouté

    private String nomEtablissement;

    private String action;

    private String adminNom;

    private String adminImage;
    private String adminRegion;
    private Role adminRole;


    private LocalDateTime dateAction;
}
