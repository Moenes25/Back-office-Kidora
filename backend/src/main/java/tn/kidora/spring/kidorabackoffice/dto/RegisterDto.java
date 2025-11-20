package tn.kidora.spring.kidorabackoffice.dto;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import tn.kidora.spring.kidorabackoffice.entities.Role;

@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
public class RegisterDto {

    String nom ;
    String email;
    String tel ;
    String password ;
    Role role;

}