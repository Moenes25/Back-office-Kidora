package tn.kidora.spring.kidorabackoffice.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder //pour un constructeur par defaut
@ToString
@FieldDefaults(level = AccessLevel.PRIVATE)
public class User {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    Integer idUser;
    String nom ;
    @Column(nullable = false, unique = true)
    String email;
    String tel ;
    String password ;
    @Enumerated(EnumType.STRING)
    Role role ;
    @Enumerated(EnumType.STRING)
    Status status;

}
