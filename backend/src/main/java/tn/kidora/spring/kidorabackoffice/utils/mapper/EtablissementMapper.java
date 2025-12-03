package tn.kidora.spring.kidorabackoffice.utils.mapper;

import org.springframework.stereotype.Service;

import tn.kidora.spring.kidorabackoffice.dto.Etab_Dto;
import tn.kidora.spring.kidorabackoffice.dto.EtablissementRequestDTO;
import tn.kidora.spring.kidorabackoffice.entities.Etablissement;

@Service
public class EtablissementMapper {

    public  Etab_Dto EntityToEtab_Dto(Etablissement etab){
        Etab_Dto etabDto = new Etab_Dto();
        etabDto.setIdEtablissment(etab.getIdEtablissment());
        etabDto.setNomEtablissement(etab.getNomEtablissement());
        etabDto.setAdresse_complet(etab.getAdresse_complet());
        etabDto.setRegion(etab.getRegion());
        etabDto.setTelephone(etab.getTelephone());
        etabDto.setUrl_localisation(etab.getUrl_localisation());
        etabDto.setType(etab.getType());
        etabDto.setEmail(etab.getEmail());
        etabDto.setIsActive(etab.getIsActive());
<<<<<<< HEAD
=======
        etabDto.setNombreEducateurs(etab.getNombreEducateurs());
        etabDto.setNombreParents(etab.getNombreParents());
        etabDto.setNombreEnfants(etab.getNombreEnfants());
>>>>>>> 271e7ff2abf48acd90ea951fd6ee6f27af243e62

        if (etab.getUser() != null) {
            etabDto.setUserId(etab.getUser().getIdUser());
            etabDto.setUserNom(etab.getUser().getNom());
            etabDto.setUserEmail(etab.getUser().getEmail());
            
        }
        return etabDto;
    }

     public Etablissement toEntity(EtablissementRequestDTO requestDTO) {
        return Etablissement.builder()
                .nomEtablissement(requestDTO.getNomEtablissement())
                .adresse_complet(requestDTO.getAdresse_complet())
                .region(requestDTO.getRegion())
                .telephone(requestDTO.getTelephone())
                .url_localisation(requestDTO.getUrl_localisation())
                .type(requestDTO.getType())
                .email(requestDTO.getEmail())
                .password(requestDTO.getPassword()) 
                .isActive(requestDTO.getIsActive() != null ? requestDTO.getIsActive() : true)
<<<<<<< HEAD
=======
                .nombreEducateurs(requestDTO.getNombreEducateurs())
                .nombreParents(requestDTO.getNombreParents())
                .nombreEnfants(requestDTO.getNombreEnfants())
>>>>>>> 271e7ff2abf48acd90ea951fd6ee6f27af243e62
                .build();
        
    }
   
       
    
}
