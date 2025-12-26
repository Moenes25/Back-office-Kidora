package tn.kidora.spring.kidorabackoffice.dto.Client;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class EnfantRequestDto {
    private String nom;
    private String prenom;
    private Integer age;
    private String classe;
    private MultipartFile imageFile;

}
