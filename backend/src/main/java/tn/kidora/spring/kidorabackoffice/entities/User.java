package tn.kidora.spring.kidorabackoffice.entities;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

// import jakarta.persistence.PreUpdate;
// import jakarta.persistence.*;
import lombok.*;




@Document(collection = "admins")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder //pour un constructeur par defaut
@ToString
public class User {
    @Id
    private String id;
    private String nom ;
    @Indexed(unique = true)
    private String email;
    private String tel ;
    private String password ;
    private Role role ;
    private Boolean isActive = true;
    @Field("created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Field("updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
    


    private String imageUrl;
    // Champs OTP
    String otp;
    LocalDateTime otpExpiration;


}
