package tn.kidora.spring.kidorabackoffice.services.serviceImpl.Client;

import tn.kidora.spring.kidorabackoffice.dto.Client.EnfantRequestDto;
import tn.kidora.spring.kidorabackoffice.dto.Client.EnfantResponseDto;
import tn.kidora.spring.kidorabackoffice.dto.Client.EnfantUpdateDto;
import tn.kidora.spring.kidorabackoffice.entities.Client.Enfants;

import java.util.List;

public interface EnfantService {
    EnfantResponseDto ajouterEnfant(EnfantRequestDto dto, String parentId);
    void supprimerEnfant(String idEnfant);
    List<EnfantResponseDto> getAllEnfants();
    EnfantResponseDto updateEnfant(String idEnfant, EnfantUpdateDto dto);
    List<EnfantResponseDto> getEnfantsByParent(String parentId);

    long getNombreEnfants();


    List<EnfantResponseDto> getEnfantsByClasse(String classeId);
    

}
