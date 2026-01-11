package tn.kidora.spring.kidorabackoffice.services;

import tn.kidora.spring.kidorabackoffice.dto.FactureRequestDTO;
import tn.kidora.spring.kidorabackoffice.dto.FactureResponseDto;
import tn.kidora.spring.kidorabackoffice.entities.Facture;

import java.util.List;

public interface FactureService {
    Facture creerFacture(FactureRequestDTO dto);
    long totalFactures();            // nombre total
    long totalFacturesPayees();      // nombre payées
    long totalFacturesImpaye();      // nombre impayées
    List<FactureResponseDto> getAllFactures();
    public FactureResponseDto getFactureById(String id);

}
