package tn.kidora.spring.kidorabackoffice.services.serviceImpl;

import lombok.AllArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import tn.kidora.spring.kidorabackoffice.dto.Etab_Dto;
import tn.kidora.spring.kidorabackoffice.entities.Etablissement;
import tn.kidora.spring.kidorabackoffice.repositories.Etablissement_Repository;
import tn.kidora.spring.kidorabackoffice.services.EtabService;
@AllArgsConstructor
@Service
public class EtabServiceImpl implements EtabService {
    private final Etablissement_Repository etablissementRepository;
    @Override
    public Etablissement addEtablissement(Etab_Dto dto) {
       BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        Etablissement etab = Etablissement.builder()
                .nomEtablissement(dto.getNomEtablissement())
                .adresse_complet(dto.getAdresse_complet())
                .region(dto.getRegion())
                .telephone(dto.getTelephone())
                .url_localisation(dto.getUrl_localisation())
                .type(dto.getType())
                .email(dto.getEmail())
                .password(dto.getPassword() != null ? encoder.encode(dto.getPassword()) : null)
                .isActive(dto.getIsActive() != null ? dto.getIsActive() : true)
                .build();

        return etablissementRepository.save(etab);
    }

    @Override
    public Etablissement updateEtablissement(Integer id, Etab_Dto dto) {
        Etablissement etab = etablissementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Etablissement non trouvé avec id : " + id));

        etab.setNomEtablissement(dto.getNomEtablissement());
        etab.setAdresse_complet(dto.getAdresse_complet());
        etab.setRegion(dto.getRegion());
        etab.setTelephone(dto.getTelephone());
        etab.setUrl_localisation(dto.getUrl_localisation());
        etab.setType(dto.getType());
        etab.setEmail(dto.getEmail());

        if (dto.getPassword() != null) {
            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
            etab.setPassword(encoder.encode(dto.getPassword()));
        }
        if (dto.getIsActive() != null) {
            etab.setIsActive(dto.getIsActive());
        }
        return etablissementRepository.save(etab);
    }
    @Override
    public void deleteEtablissement(Integer id) {
        Etablissement etab = etablissementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Etablissement non trouvé avec id : " + id));

        etablissementRepository.delete(etab);
    }
}
