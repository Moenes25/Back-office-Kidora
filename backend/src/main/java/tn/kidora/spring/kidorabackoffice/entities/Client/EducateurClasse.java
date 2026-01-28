package tn.kidora.spring.kidorabackoffice.entities.Client;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@Document(collection = "educateur_classes")
public class EducateurClasse {
     @Id
    private String id;
    
    @DBRef
    private Users educateur;
    
    @DBRef
    private Classes classe;
    
    private LocalDateTime dateAssignation;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    
}
