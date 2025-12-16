package tn.kidora.spring.kidorabackoffice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@AllArgsConstructor
@Data
@NoArgsConstructor
public class DonneesCroissanceDTo {
    private String mois;
    private Integer nombreGarderies;
    private Integer nombreCreches;
    private Integer nombreEcoles;

}
