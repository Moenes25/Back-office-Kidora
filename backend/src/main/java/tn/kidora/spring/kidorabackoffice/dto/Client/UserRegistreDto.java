package tn.kidora.spring.kidorabackoffice.dto.Client;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;
import tn.kidora.spring.kidorabackoffice.entities.Client.RoleUsers;
import tn.kidora.spring.kidorabackoffice.entities.Client.StatutClient;

import java.util.List;

@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
public class UserRegistreDto {
    String nom;
    String prenom;
    String email;
    String password;

    String profession;
    String relation;
    String numTel;
    String adresse;

    String specialisation;
    Integer experience;
    String disponibilite;
    RoleUsers role;
    MultipartFile imageFile;
    String imageUrl;
    StatutClient statutClient;
    List<String> classesIds;

}
