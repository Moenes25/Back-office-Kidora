package tn.kidora.spring.kidorabackoffice.entities.Client;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
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
    private String username;
    private String email;
    private String password;
    private RoleUsers role;
    private String matricule;
    private boolean active;

    private String firstName;
    private String lastName;
    private String profileImage;

    private boolean canManageUsers;
    private boolean canManageSystem;
    private boolean canViewReports;

    private String specialization;
    private String qualification;
    private String experienceYears;
    private LocalDate hireDate;
    private String contractType;
    private double salary;
    private boolean available;

    private List<String> certifications;

    private boolean primaryContact;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
