package tn.kidora.spring.kidorabackoffice.utils.mapper.Client;

import org.springframework.stereotype.Service;

import tn.kidora.spring.kidorabackoffice.dto.Client.EducateurClasseResponseDTO;
import tn.kidora.spring.kidorabackoffice.entities.Client.EducateurClasse;

@Service
public class EducateurClasseMapper {
    public EducateurClasseResponseDTO mapToResponseDTO(EducateurClasse assignation) {
        EducateurClasseResponseDTO dto = new EducateurClasseResponseDTO();
        dto.setId(assignation.getId());
        dto.setEducateurId(assignation.getEducateur().getId());
        dto.setEducateurNom(assignation.getEducateur().getNom());
        dto.setEducateurPrenom(assignation.getEducateur().getPrenom());
        dto.setClasseId(assignation.getClasse().getId());
        dto.setClasseNom(assignation.getClasse().getNom_classe());
        dto.setDateAssignation(assignation.getDateAssignation());
        dto.setCreatedAt(assignation.getCreatedAt());
        dto.setUpdatedAt(assignation.getUpdatedAt());
        
        return dto;
    }
}
