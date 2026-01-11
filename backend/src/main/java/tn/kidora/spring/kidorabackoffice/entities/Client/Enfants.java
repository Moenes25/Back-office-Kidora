package tn.kidora.spring.kidorabackoffice.entities.Client;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@Document(collection = "Enfants")
public class Enfants {
    @Id
    private  String idEnfant;
    private  String nom;
    private  String prenom;
    private  Integer age;

    private String imageUrl;

    @DBRef
    private Classes classe;

    @DBRef
    private Users parent; // référence vers le parent
    @DBRef
    private Users admin; // référence vers l'admin


}
