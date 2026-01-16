package tn.kidora.spring.kidorabackoffice.dto.Client;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;
import tn.kidora.spring.kidorabackoffice.entities.Client.RoleUsers;
import tn.kidora.spring.kidorabackoffice.entities.Client.StatutClient;

import java.util.List;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ClientUpdateDto {
    String nom;
    String prenom;
    String email;
    String password;
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
    List<String> classesIds;  // Pour permettre la mise à jour de plusieurs classes

    RoleUsers role;
    StatutClient statutClient ;

}
