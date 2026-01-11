package tn.kidora.spring.kidorabackoffice.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

import java.util.Date;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "factures")
public class Facture {
    @Id
    private String id;
    private Date dateFacture;
    private double montant;
    private MethodePaiement methode;
    private String reference;
    private  StatutFacture statutFacture;
    @DocumentReference
    private Abonnement abonnement;
    @DocumentReference
    private Etablissement etablissement;
}
