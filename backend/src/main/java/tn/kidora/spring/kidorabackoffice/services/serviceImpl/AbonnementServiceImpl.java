package tn.kidora.spring.kidorabackoffice.services.serviceImpl;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import tn.kidora.spring.kidorabackoffice.dto.AbonnementRequestDTO;
import tn.kidora.spring.kidorabackoffice.dto.AbonnementResponseDTO;
import tn.kidora.spring.kidorabackoffice.entities.Abonnement;
import tn.kidora.spring.kidorabackoffice.entities.Etablissement;
import tn.kidora.spring.kidorabackoffice.entities.StatutPaiement;
import tn.kidora.spring.kidorabackoffice.repositories.AbonnementRepository;
import tn.kidora.spring.kidorabackoffice.repositories.Etablissement_Repository;
import tn.kidora.spring.kidorabackoffice.services.AbonnementService;
import tn.kidora.spring.kidorabackoffice.utils.mapper.AbonnementMapper;

import java.util.List;
import java.util.Map;

@AllArgsConstructor
@Service
public class AbonnementServiceImpl implements  AbonnementService{
Etablissement_Repository etablissementRepository;
AbonnementRepository abonnementRepository;
AbonnementMapper abonnementMapper;
    @Override
    public ResponseEntity<AbonnementResponseDTO> addAbonnement(AbonnementRequestDTO dto) {
        if (dto.getEtablissementId() == null) {
            throw new RuntimeException("L'id de l'établissement est obligatoire");
        }
        Etablissement etab = etablissementRepository.findById(dto.getEtablissementId())
                .orElseThrow(() -> new RuntimeException("Etablissement introuvable !"));

        Abonnement abonnement = new Abonnement();
        abonnement.setDateDebutAbonnement(dto.getDateDebutAbonnement());
        abonnement.setDateFinAbonnement(dto.getDateFinAbonnement());
        abonnement.setMontantPaye(dto.getMontantPaye());
        abonnement.setMontantDu(dto.getMontantDu());
        abonnement.setStatut(dto.getStatut());
        abonnement.setEtablissement(etab);

        Abonnement saved = abonnementRepository.save(abonnement);

        // AbonnementResponseDTO response = new AbonnementResponseDTO();
        // response.setIdAbonnement(saved.getIdAbonnement());
        // response.setDateDebutAbonnement(saved.getDateDebutAbonnement());
        // response.setDateFinAbonnement(saved.getDateFinAbonnement());
        // response.setMontantPaye(saved.getMontantPaye());
        // response.setMontantDu(saved.getMontantDu());
        // response.setStatut(saved.getStatut());
        // response.setEtablissement(null);
        AbonnementResponseDTO response =abonnementMapper.toResponseDTO(saved);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
//updateAbonnement
    @Override
    public ResponseEntity<AbonnementResponseDTO> updateAbonnement(String id, AbonnementRequestDTO dto) {
        Abonnement abonnement = abonnementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Abonnement introuvable !"));
        Etablissement etab = etablissementRepository.findById(dto.getEtablissementId())
                .orElseThrow(() -> new RuntimeException("Etablissement introuvable !"));

        abonnement.setDateDebutAbonnement(dto.getDateDebutAbonnement());
        abonnement.setDateFinAbonnement(dto.getDateFinAbonnement());
        abonnement.setMontantPaye(dto.getMontantPaye());
        abonnement.setMontantDu(dto.getMontantDu());
        abonnement.setStatut(dto.getStatut());
        abonnement.setEtablissement(etab);
        Abonnement updated = abonnementRepository.save(abonnement);
//pour recuperer la reponse
        AbonnementResponseDTO response = new AbonnementResponseDTO();
        response.setIdAbonnement(updated.getIdAbonnement());
        response.setDateDebutAbonnement(updated.getDateDebutAbonnement());
        response.setDateFinAbonnement(updated.getDateFinAbonnement());
        response.setMontantPaye(updated.getMontantPaye());
        response.setMontantDu(updated.getMontantDu());
        response.setStatut(updated.getStatut());

        return  ResponseEntity.ok(response);
    }
//deleteAbonnement
    @Override
    public ResponseEntity<Void> deleteAbonnement(String id) {
        Abonnement abonnement = abonnementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Abonnement introuvable !"));
        abonnementRepository.delete(abonnement);
        return ResponseEntity.noContent().build();
    }
//getAllAbonnements
    @Override
    public ResponseEntity<List<AbonnementResponseDTO>> getAllAbonnements() {
        List<Abonnement> abonnements = abonnementRepository.findAll();
        List<AbonnementResponseDTO> responseList = abonnements.stream().map(abonnement -> {
            // AbonnementResponseDTO dto = new AbonnementResponseDTO();
            // dto.setIdAbonnement(abonnement.getIdAbonnement());
            // dto.setDateDebutAbonnement(abonnement.getDateDebutAbonnement());
            // dto.setDateFinAbonnement(abonnement.getDateFinAbonnement());
            // dto.setMontantPaye(abonnement.getMontantPaye());
            // dto.setMontantDu(abonnement.getMontantDu());
            // dto.setStatut(abonnement.getStatut());
            AbonnementResponseDTO dto  = abonnementMapper.toResponseDTO(abonnement);
            return dto;
        }).toList();
        return  ResponseEntity.ok(responseList);
    }
//getAbonnementsByEtablissement
    @Override
    public ResponseEntity<List<AbonnementResponseDTO>> getAbonnementsByEtablissement(String etablissementId) {
        List<Abonnement> abonnements = abonnementRepository.findByEtablissement_IdEtablissment(etablissementId);
        List<AbonnementResponseDTO> response = abonnements.stream().map(a -> {
            AbonnementResponseDTO dto = new AbonnementResponseDTO();
            dto.setIdAbonnement(a.getIdAbonnement());
            dto.setDateDebutAbonnement(a.getDateDebutAbonnement());
            dto.setDateFinAbonnement(a.getDateFinAbonnement());
            dto.setMontantPaye(a.getMontantPaye());
            dto.setMontantDu(a.getMontantDu());
            dto.setStatut(a.getStatut());
            return dto;
        }).toList();

return  ResponseEntity.ok(response);

    }
    //getAbonnementByStatut
    @Override
    public ResponseEntity<List<AbonnementResponseDTO>> getByStatut(String statut) {
        StatutPaiement statutEnum;
        try {
            statutEnum = StatutPaiement.valueOf(statut.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Statut invalide : " + statut);
        }

        List<Abonnement> abonnements = abonnementRepository.findByStatut(statutEnum);
        List<AbonnementResponseDTO> response = abonnements.stream()
                .map(abonnement -> {
                    AbonnementResponseDTO dto = new AbonnementResponseDTO();
                    dto.setIdAbonnement(abonnement.getIdAbonnement());
                    dto.setDateDebutAbonnement(abonnement.getDateDebutAbonnement());
                    dto.setDateFinAbonnement(abonnement.getDateFinAbonnement());
                    dto.setMontantPaye(abonnement.getMontantPaye());
                    dto.setMontantDu(abonnement.getMontantDu());
                    dto.setStatut(abonnement.getStatut());
                    return dto;
                })
                .toList();

        return ResponseEntity.ok(response);
    }

    @Override
    public List<Map<String, Object>> getRepartitionAnnuelle(int annee) {
        return abonnementRepository.getRepartitionParTypeEtablissement(annee);
    }
}
