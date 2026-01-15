package tn.kidora.spring.kidorabackoffice.utils.mapper.Client;

import org.springframework.stereotype.Service;
import tn.kidora.spring.kidorabackoffice.dto.Client.EnfantRequestDto;
import tn.kidora.spring.kidorabackoffice.dto.Client.EnfantResponseDto;
import tn.kidora.spring.kidorabackoffice.entities.Client.Classes;
import tn.kidora.spring.kidorabackoffice.entities.Client.Enfants;
import tn.kidora.spring.kidorabackoffice.entities.Client.Users;

@Service
public class EnfantMapper {
    public Enfants dtoToEntity(EnfantRequestDto dto,Classes classe)  {
        Enfants enfant = new Enfants();
        enfant.setNom(dto.getNom());
        enfant.setPrenom(dto.getPrenom());
        enfant.setAge(dto.getAge());
        enfant.setClasse(classe);
        return enfant;
    }
    public EnfantResponseDto entityToDto(Enfants enfant) {
        EnfantResponseDto dto = new EnfantResponseDto();
        dto.setIdEnfant(enfant.getIdEnfant());
        dto.setNom(enfant.getNom());
        dto.setPrenom(enfant.getPrenom());
        dto.setAge(enfant.getAge());
       
        if (enfant.getClasse()!= null) {
            dto.setClasse(enfant.getClasse().getNom_classe());
        }

        dto.setImageUrl(enfant.getImageUrl());
        
        if (enfant.getParent() != null) {
            dto.setParentId(enfant.getParent().getId());
            
        }
        
        // dto.setParentId(enfant.getParent().getId());
        return dto;
    }

}
