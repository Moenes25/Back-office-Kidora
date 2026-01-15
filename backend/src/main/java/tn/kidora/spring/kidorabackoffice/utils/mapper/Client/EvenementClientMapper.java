package tn.kidora.spring.kidorabackoffice.utils.mapper.Client;

import org.springframework.stereotype.Service;
import tn.kidora.spring.kidorabackoffice.dto.Client.EventDto;
import tn.kidora.spring.kidorabackoffice.entities.Evenement;
@Service
public class EvenementClientMapper {
    public static EventDto toDto(Evenement entity) {
        EventDto dto = new EventDto();
        dto.setId(entity.getIdEvenement());
        dto.setTitre(entity.getTitre());
        dto.setCouleur(entity.getCouleur());
        dto.setDateDebut(entity.getDateDebut());
        dto.setDateFin(entity.getDateFin());
        return dto;
    }

    public static Evenement  toEntity(EventDto dto) {
        Evenement  entity = new Evenement ();
        entity.setIdEvenement(dto.getId());
        entity.setTitre(dto.getTitre());
        entity.setCouleur(dto.getCouleur());
        entity.setDateDebut(dto.getDateDebut());
        entity.setDateFin(dto.getDateFin());
        return entity;
    }
}
