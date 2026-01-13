package tn.kidora.spring.kidorabackoffice.utils.mapper.Client;

import org.springframework.stereotype.Service;
import tn.kidora.spring.kidorabackoffice.dto.Client.EnfantRequestDto;
import tn.kidora.spring.kidorabackoffice.dto.Client.EnfantResponseDto;
import tn.kidora.spring.kidorabackoffice.entities.Client.Enfants;
import tn.kidora.spring.kidorabackoffice.entities.Client.Users;

@Service
public class EnfantMapper {
    public Enfants dtoToEntity(EnfantRequestDto dto)  {
        Enfants enfant = new Enfants();
        enfant.setNom(dto.getNom());
        enfant.setPrenom(dto.getPrenom());
        enfant.setAge(dto.getAge());
        enfant.setClasse(dto.getClasse());
        return enfant;
    }
    public EnfantResponseDto entityToDto(Enfants enfant) {
        EnfantResponseDto dto = new EnfantResponseDto();
        dto.setIdEnfant(enfant.getIdEnfant());
        dto.setNom(enfant.getNom());
        dto.setPrenom(enfant.getPrenom());
        dto.setAge(enfant.getAge());
        dto.setClasse(enfant.getClasse());
        dto.setImageUrl(enfant.getImageUrl());
        Users parent = enfant.getParent();
        if (parent != null) {
            dto.setParentId(parent.getId());
            
        }
        
        // dto.setParentId(enfant.getParent().getId());
        return dto;
    }

}
