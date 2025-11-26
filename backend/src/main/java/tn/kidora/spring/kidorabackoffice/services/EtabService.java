package tn.kidora.spring.kidorabackoffice.services;

import java.util.List;

import org.springframework.http.ResponseEntity;

import tn.kidora.spring.kidorabackoffice.dto.DonneesCroissanceDTo;
import tn.kidora.spring.kidorabackoffice.dto.Etab_Dto;
import tn.kidora.spring.kidorabackoffice.dto.EtablissementRequestDTO;
import tn.kidora.spring.kidorabackoffice.dto.EtablissementUpdateDTO;
import tn.kidora.spring.kidorabackoffice.entities.Type_Etablissement;


public interface EtabService {
    ResponseEntity<Etab_Dto> addEtablissement(EtablissementRequestDTO dto);
    ResponseEntity<Etab_Dto> updateEtablissement(Integer id, EtablissementUpdateDTO dto);
    ResponseEntity<List<Etab_Dto>> getAllEtablissements();
    void deleteEtablissement(Integer id);
    ResponseEntity<List<Etab_Dto>> getAllEtablissementsByType(Type_Etablissement type);
    ResponseEntity<List<Etab_Dto>> getEtablissementsByRegion(String region);
    ResponseEntity<List<Etab_Dto>> getActiveEtablissements();
    ResponseEntity<Etab_Dto> toggleEtablissementStatus(Integer id);
    ResponseEntity<List<Etab_Dto>> getEtablissementsAbonnesCeMois();
    List<DonneesCroissanceDTo> obtenirCroissanceMensuelle();
   


}
