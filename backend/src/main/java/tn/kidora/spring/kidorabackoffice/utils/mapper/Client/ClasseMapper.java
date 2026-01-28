package tn.kidora.spring.kidorabackoffice.utils.mapper.Client;

import tn.kidora.spring.kidorabackoffice.dto.Client.ClasseRequestDto;
import tn.kidora.spring.kidorabackoffice.dto.Client.ClasseResponseDto;
import tn.kidora.spring.kidorabackoffice.entities.Client.Classes;

public class ClasseMapper {
    public static Classes toEntity(ClasseRequestDto dto) {
        if (dto == null) return null;

        return Classes.builder()
                .nom_classe(dto.getNom_classe())
                .description_classe(dto.getDescription_classe())
                .trancheAge(dto.getTrancheAge())
                .couleur_classe(dto.getCouleur_classe())
                .capacite(dto.getCapacite())
                .salle(dto.getSalle())
                .build();
    }

    // ✅ Mapper Entity → ResponseDto
    public static ClasseResponseDto toDto(Classes entity) {
        if (entity == null) return null;

        return ClasseResponseDto.builder()
                .id(entity.getId())
                .nom_classe(entity.getNom_classe())
                .description_classe(entity.getDescription_classe())
                .trancheAge(entity.getTrancheAge())
                .couleur_classe(entity.getCouleur_classe())
                .capacite(entity.getCapacite())
                .salle(entity.getSalle())
                .created_by_id(entity.getCreated_by().getId())
                .created_by_nom(entity.getCreated_by().getNom())


                .build();
    }
}
