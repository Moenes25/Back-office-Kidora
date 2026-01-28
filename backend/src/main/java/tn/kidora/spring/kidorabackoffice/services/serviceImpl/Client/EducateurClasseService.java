package tn.kidora.spring.kidorabackoffice.services.serviceImpl.Client;

import java.util.List;

import tn.kidora.spring.kidorabackoffice.dto.Client.EducateurClasseRequestDto;
import tn.kidora.spring.kidorabackoffice.dto.Client.EducateurClasseResponseDTO;

public interface EducateurClasseService {
    EducateurClasseResponseDTO assignerEducateurAClasse(EducateurClasseRequestDto dto);
     List<EducateurClasseResponseDTO> getClassesByEducateur(String educateurId);
     List<EducateurClasseResponseDTO> getEducateursByClasse(String classeId);
     EducateurClasseResponseDTO updateEducateurClasse(String id, EducateurClasseRequestDto dto);
     void deleteEducateurClasse(String id);
     List<EducateurClasseResponseDTO> getAllEducateurClasse();
     EducateurClasseResponseDTO getAssignationById(String id);
}
