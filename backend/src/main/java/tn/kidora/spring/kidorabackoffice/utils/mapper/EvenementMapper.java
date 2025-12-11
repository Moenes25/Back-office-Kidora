package tn.kidora.spring.kidorabackoffice.utils.mapper;

import org.springframework.stereotype.Service;
import tn.kidora.spring.kidorabackoffice.dto.EvenementRequestDTO;
import tn.kidora.spring.kidorabackoffice.dto.EvenementResponseDTO;
import tn.kidora.spring.kidorabackoffice.entities.Etablissement;
import tn.kidora.spring.kidorabackoffice.entities.Evenement;

@Service
public class EvenementMapper {

    public Evenement toEntity(EvenementRequestDTO dto, Etablissement etab) {
        Evenement evenement = new Evenement();
        evenement.setTitre(dto.getTitre());
        evenement.setDescription(dto.getDescription());
        evenement.setDate(dto.getDate());
        evenement.setHeureDebut(dto.getHeureDebut());
        evenement.setHeureFin(dto.getHeureFin());
        evenement.setType(dto.getType());
        evenement.setEtablissement(etab);
        return evenement;
    }
    public EvenementResponseDTO toResponseDTO(Evenement evenement) {
        EvenementResponseDTO dto = new EvenementResponseDTO();
        dto.setIdEvenement(evenement.getIdEvenement());
        dto.setTitre(evenement.getTitre());
        dto.setDescription(evenement.getDescription());
        dto.setDate(evenement.getDate());
        dto.setHeureDebut(evenement.getHeureDebut());
        dto.setHeureFin(evenement.getHeureFin());
        dto.setType(evenement.getType());
        if (evenement.getEtablissement() != null) {
            dto.setNomEtablissement(evenement.getEtablissement().getNomEtablissement());
        }
        return dto;
    }

}
