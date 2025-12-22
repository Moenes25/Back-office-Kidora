package tn.kidora.spring.kidorabackoffice.dto;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
public class UserRegistreDto {
    String username;
    String email;
    String password;
    String firstName;
    String lastName;
   /* String specialization;
    String qualification;
    String profileImage;
    String experienceYears;
    String contractType;*/

}
