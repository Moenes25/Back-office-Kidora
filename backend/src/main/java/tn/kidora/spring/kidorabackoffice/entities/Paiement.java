package tn.kidora.spring.kidorabackoffice.entities;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "paiements")
public class Paiement {
    @Id
    private String id;
    private Date datePaiement;
    private double montant;
    private MethodePaiement methode; 
    private String reference;
    @DocumentReference
    private Abonnement abonnement;
    
}
