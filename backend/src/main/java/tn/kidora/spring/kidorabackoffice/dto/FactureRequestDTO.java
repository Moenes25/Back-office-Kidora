package tn.kidora.spring.kidorabackoffice.dto;

import lombok.Data;
import tn.kidora.spring.kidorabackoffice.entities.MethodePaiement;
import tn.kidora.spring.kidorabackoffice.entities.StatutFacture;

@Data
public class FactureRequestDTO {
    private String etablissementId;
    private MethodePaiement methode;
    private StatutFacture statutFacture;
}
