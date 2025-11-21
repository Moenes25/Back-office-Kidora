package tn.kidora.spring.kidorabackoffice.services;

import tn.kidora.spring.kidorabackoffice.dto.Etab_Dto;
import tn.kidora.spring.kidorabackoffice.entities.Etablissement;

public interface EtabService {
    Etablissement addEtablissement(Etab_Dto dto);
    Etablissement updateEtablissement(Integer id, Etab_Dto dto);
    void deleteEtablissement(Integer id);
}
