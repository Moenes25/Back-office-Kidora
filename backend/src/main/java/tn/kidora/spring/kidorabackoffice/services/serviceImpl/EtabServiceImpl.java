package tn.kidora.spring.kidorabackoffice.services.serviceImpl;

import lombok.AllArgsConstructor;

import java.time.Month;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import tn.kidora.spring.kidorabackoffice.dto.DonneesCroissanceDTo;
import tn.kidora.spring.kidorabackoffice.dto.Etab_Dto;
import tn.kidora.spring.kidorabackoffice.dto.EtablissementRequestDTO;
import tn.kidora.spring.kidorabackoffice.dto.EtablissementUpdateDTO;
import tn.kidora.spring.kidorabackoffice.entities.Abonnement;
import tn.kidora.spring.kidorabackoffice.entities.Etablissement;
import tn.kidora.spring.kidorabackoffice.entities.Type_Etablissement;
import tn.kidora.spring.kidorabackoffice.entities.User;
import tn.kidora.spring.kidorabackoffice.repositories.Etablissement_Repository;
import tn.kidora.spring.kidorabackoffice.repositories.UserRepository;
import tn.kidora.spring.kidorabackoffice.services.EtabService;
import tn.kidora.spring.kidorabackoffice.utils.mapper.EtablissementMapper;
@AllArgsConstructor
@Service
public class EtabServiceImpl implements EtabService {
    private final Etablissement_Repository etablissementRepository;
    private final EtablissementMapper etablissementMapper;
    private final UserRepository userRepository;
    @Override
    public ResponseEntity<Etab_Dto>  addEtablissement(EtablissementRequestDTO dto) {
        if(etablissementRepository.existsByEmail(dto.getEmail())){
            throw new RuntimeException("Email is already registred!");
        }
        if (dto.getUserId() == null) {
            throw new RuntimeException("L'ID du user est obligatoire");
        }

         User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec ID: " + dto.getUserId()));
       BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        Etablissement etab = etablissementMapper.toEntity(dto);
        etab.setUser(user);
        etab.setPassword(encoder.encode(dto.getPassword()));
        // Etablissement.builder()
        //         .nomEtablissement(dto.getNomEtablissement())
        //         .adresse_complet(dto.getAdresse_complet())
        //         .region(dto.getRegion())
        //         .telephone(dto.getTelephone())
        //         .url_localisation(dto.getUrl_localisation())
        //         .type(dto.getType())
        //         .email(dto.getEmail())
        //         .password(dto.getPassword() != null ? encoder.encode(dto.getPassword()) : null)
        //         .isActive(dto.getIsActive() != null ? dto.getIsActive() : true)
        //         .build();
        Etablissement saved = etablissementRepository.save(etab);
        System.out.println("DTO reçu : " + dto);

        return ResponseEntity.status(HttpStatus.CREATED).body(etablissementMapper.EntityToEtab_Dto(saved));
    }

    @Override
    public  ResponseEntity<Etab_Dto>  updateEtablissement(Integer id, EtablissementUpdateDTO dto) {
        Etablissement etab = etablissementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Etablissement non trouvé avec id : " + id));
        
         User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec ID: " + dto.getUserId()));
        
        etab.setUser(user);
        etab.setNomEtablissement(dto.getNomEtablissement());
        etab.setAdresse_complet(dto.getAdresse_complet());
        etab.setRegion(dto.getRegion());
        etab.setTelephone(dto.getTelephone());
        etab.setUrl_localisation(dto.getUrl_localisation());
        etab.setType(dto.getType());
        etab.setEmail(dto.getEmail());
        etab.setIsActive(dto.getIsActive());
        Etablissement updated = etablissementRepository.save(etab);
        return ResponseEntity.status(HttpStatus.OK).body(etablissementMapper.EntityToEtab_Dto(updated));
        
    }
    @Override
    public void deleteEtablissement(Integer id) {
        Etablissement etab = etablissementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Etablissement non trouvé avec id : " + id));

        etablissementRepository.delete(etab);
    }

    @Override
    public ResponseEntity<List<Etab_Dto>> getAllEtablissements() {
        List<Etablissement> etablissements = etablissementRepository.findAll();
       List<Etab_Dto>  etablissementsDtos = etablissements.stream()
                                                           .map(etablissementMapper::EntityToEtab_Dto)
                                                           .toList();
        return ResponseEntity.status(HttpStatus.OK).body(etablissementsDtos);
        
    }

    @Override
    public ResponseEntity<List<Etab_Dto>> getAllEtablissementsByType(Type_Etablissement type) {
        List<Etablissement> etablissements = etablissementRepository.findByType(type);
        List<Etab_Dto>  etablissementsDtos = etablissements.stream()
                                                           .map(etablissementMapper::EntityToEtab_Dto)
                                                           .collect(Collectors.toList());
       return ResponseEntity.status(HttpStatus.OK).body(etablissementsDtos);
    }

    @Override
    public ResponseEntity<List<Etab_Dto>> getEtablissementsByRegion(String region) {
        if (region == null || region.trim().isEmpty()) {
        return ResponseEntity.badRequest().body(Collections.emptyList());
        }
        List<Etablissement> etablissements = etablissementRepository.findByRegion(region.trim());
        List<Etab_Dto>  etablissementsDtos = etablissements.stream()
                                                           .map(etablissementMapper::EntityToEtab_Dto)
                                                           .collect(Collectors.toList());
       return ResponseEntity.status(HttpStatus.OK).body(etablissementsDtos);
    }

    @Override
    public ResponseEntity<List<Etab_Dto>> getActiveEtablissements() {
        List<Etablissement> etablissements = etablissementRepository.findByIsActiveTrue();
        List<Etab_Dto>  etablissementsDtos = etablissements.stream()
                                                           .map(etablissementMapper::EntityToEtab_Dto)
                                                           .collect(Collectors.toList());
       return ResponseEntity.status(HttpStatus.OK).body(etablissementsDtos);
        
    }

    @Override
    public ResponseEntity<Etab_Dto> toggleEtablissementStatus(Integer id) {
        Etablissement etab = etablissementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Etablissement non trouvé avec id : " + id));

        etab.setIsActive(!etab.getIsActive());
        Etablissement updated = etablissementRepository.save(etab);
        return ResponseEntity.status(HttpStatus.OK).body(etablissementMapper.EntityToEtab_Dto(updated));
    }

    @Override
    public ResponseEntity<List<Etab_Dto>> getEtablissementsAbonnesCeMois() {
        try{
            List<Etablissement> etablissements = etablissementRepository.findEtablissementsAbonnesCeMois();
            if (etablissements.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).body(Collections.emptyList());
            }
            List<Etab_Dto>  etablissementsDtos = etablissements.stream()
                                                           .map(etablissementMapper::EntityToEtab_Dto)
                                                           .collect(Collectors.toList());
            return ResponseEntity.status(HttpStatus.OK).body(etablissementsDtos);
        }catch(Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.emptyList());
        }
    }
//l’API pour fournir les données de croissance des inscriptions par catégorie et par mois.
    @Override
    public List<DonneesCroissanceDTo> obtenirCroissanceMensuelle() {
       List<Etablissement> etablissements=etablissementRepository.findAll();
        Map<Integer,Map<Type_Etablissement,Long>> mapMensuelle= new HashMap<>();
         for(Etablissement etab:etablissements){
             for(Abonnement ab:etab.getAbonnements()){
                 if(ab.getDateDebutAbonnement()!=null){
                     int mois = ab.getDateDebutAbonnement().getMonthValue();
                 mapMensuelle.putIfAbsent(mois, new HashMap<>());
                 Map<Type_Etablissement,Long> mapType = mapMensuelle.get(mois);
                     mapType.put(etab.getType(), mapType.getOrDefault(etab.getType(), 0L) + 1);

                 }
             }
         }
        List<DonneesCroissanceDTo> resultats = new ArrayList<>();
        for (int m = 1; m <= 12; m++) {
            Map<Type_Etablissement, Long> mapType = mapMensuelle.getOrDefault(m, new HashMap<>());
            String nomMois = Month.of(m).getDisplayName(TextStyle.FULL, Locale.FRANCE);
            resultats.add(new DonneesCroissanceDTo(
                    nomMois,
                    mapType.getOrDefault(Type_Etablissement.GARDERIE, 0L).intValue(),
                    mapType.getOrDefault(Type_Etablissement.CRECHE, 0L).intValue(),
                    mapType.getOrDefault(Type_Etablissement.ECOLE, 0L).intValue()
            ));
        }
        return resultats;
    }
}
