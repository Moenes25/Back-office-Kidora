package tn.kidora.spring.kidorabackoffice.entities.Client;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;


import java.time.LocalDateTime;
import java.util.List;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder //pour un constructeur par defaut
@ToString
@Document(collection = "users")
public class Users {

    @Id
    private String id;
    private String nom;
    private String prenom;
    private String email;
    private String password;
    private  String profession;
    private String relation; //mére, pére
    private String numTel;
    private String adresse;
    private RoleUsers role;
    private boolean active;
    private String specialisation;
    private Integer experience;
    private String disponibilite;
    private String classe;
    private String  imageUrl;
    private StatutClient statutClient;

    private boolean canManageUsers;
    private boolean canManageSystem;
    private boolean canViewReports;


    @DBRef
    private List<Enfants> enfants;


    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
