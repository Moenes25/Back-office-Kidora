package tn.kidora.spring.kidorabackoffice.dto.Client;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;
import tn.kidora.spring.kidorabackoffice.entities.Client.RoleUsers;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ClientUpdateDto {
    String nom;
    String prenom;
    String numTel;
    String adresse;
    MultipartFile imageFile;

    // Champs Parent
    String profession;
    String relation;

    // Champs Éducatrice
    String specialisation;
    Integer experience;
    String disponibilite;
    String classe;

    RoleUsers role;

}
