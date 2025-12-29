package tn.kidora.spring.kidorabackoffice.utils.mapper;

import org.springframework.stereotype.Service;

import tn.kidora.spring.kidorabackoffice.dto.AbonnementRequestDTO;
import tn.kidora.spring.kidorabackoffice.dto.AbonnementResponseDTO;
import tn.kidora.spring.kidorabackoffice.dto.Etab_Dto;
import tn.kidora.spring.kidorabackoffice.entities.Abonnement;

@Service
public class AbonnementMapper {

    public Abonnement toEntity(AbonnementRequestDTO dto) {
        Abonnement abonnement = new Abonnement();
        abonnement.setDateDebutAbonnement(dto.getDateDebutAbonnement());
        abonnement.setDateFinAbonnement(dto.getDateFinAbonnement());
        abonnement.setMontantDu(dto.getMontantDu());
        abonnement.setMontantTotal(dto.getMontantTotal());
        abonnement.setStatut(dto.getStatut());
        abonnement.setFormule(dto.getFormule());
       
        return abonnement;
    
    }

    public AbonnementResponseDTO toResponseDTO(Abonnement abonnement) {
        AbonnementResponseDTO abonnementResponseDTO = new AbonnementResponseDTO();
        abonnementResponseDTO.setIdAbonnement(abonnement.getIdAbonnement());
        abonnementResponseDTO.setDateDebutAbonnement(abonnement.getDateDebutAbonnement());
        abonnementResponseDTO.setDateFinAbonnement(abonnement.getDateFinAbonnement());
        abonnementResponseDTO.setMontantDu(abonnement.getMontantDu());
        abonnementResponseDTO.setMontantTotal(abonnement.getMontantTotal());
        abonnementResponseDTO.setStatut(abonnement.getStatut());
        abonnementResponseDTO.setFormule(abonnement.getFormule());
        if (abonnement.getEtablissement() != null) {
            Etab_Dto etabDto = new Etab_Dto();
            etabDto.setIdEtablissment(abonnement.getEtablissement().getIdEtablissment());
            etabDto.setNomEtablissement(abonnement.getEtablissement().getNomEtablissement());
            etabDto.setAdresse_complet(abonnement.getEtablissement().getAdresse_complet());
            etabDto.setRegion(abonnement.getEtablissement().getRegion());
            etabDto.setTelephone(abonnement.getEtablissement().getTelephone());
            etabDto.setUrl_localisation(abonnement.getEtablissement().getUrl_localisation());
            etabDto.setType(abonnement.getEtablissement().getType());
            etabDto.setEmail(abonnement.getEtablissement().getEmail());
            etabDto.setIsActive(abonnement.getEtablissement().getIsActive());
            if (abonnement.getEtablissement().getUser() != null) {
                // etabDto.setUserId(abonnement.getEtablissement().getUser().getIdUser());
                etabDto.setUserNom(abonnement.getEtablissement().getUser().getNom());
                etabDto.setUserEmail(abonnement.getEtablissement().getUser().getEmail());
                
            }
            abonnementResponseDTO.setEtablissement(etabDto);
           
            
        }
        return abonnementResponseDTO;
    
    }
    
}
