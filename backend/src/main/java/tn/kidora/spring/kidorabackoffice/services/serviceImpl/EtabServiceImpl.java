package tn.kidora.spring.kidorabackoffice.services.serviceImpl;

import lombok.AllArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Month;
import java.time.ZoneId;
import java.time.format.TextStyle;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import tn.kidora.spring.kidorabackoffice.dto.DonneesCroissanceDTo;
import tn.kidora.spring.kidorabackoffice.dto.Etab_Dto;
import tn.kidora.spring.kidorabackoffice.dto.EtablissementInactifDTO;
import tn.kidora.spring.kidorabackoffice.dto.EtablissementRequestDTO;
import tn.kidora.spring.kidorabackoffice.dto.EtablissementUpdateDTO;
import tn.kidora.spring.kidorabackoffice.entities.Abonnement;
import tn.kidora.spring.kidorabackoffice.entities.Client.RoleUsers;
import tn.kidora.spring.kidorabackoffice.entities.Client.Users;
import tn.kidora.spring.kidorabackoffice.entities.Etablissement;
import tn.kidora.spring.kidorabackoffice.entities.Type_Etablissement;
import tn.kidora.spring.kidorabackoffice.entities.User;
import tn.kidora.spring.kidorabackoffice.repositories.AbonnementRepository;
import tn.kidora.spring.kidorabackoffice.repositories.Client.ClientRepo;
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
    private final  AbonnementRepository abonnementRepository ;
    private  final ClientRepo clientRepo;
    @Autowired
    private PasswordEncoder passwordEncoder;
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
        etab.setCreatedAt(LocalDateTime.now());
        etab.setPassword(encoder.encode(dto.getPassword()));
        Etablissement saved = etablissementRepository.save(etab);
        Users admin = Users.builder()
                .nom(dto.getNomEtablissement())
                .email(dto.getEmail())
                .password(encoder.encode(dto.getPassword()))
                .numTel(dto.getTelephone())
                .adresse(dto.getAdresse_complet())
                .role(RoleUsers.ADMIN)      // ou ce que tu utilises
                .etablissement(saved)
                .createdAt(LocalDateTime.now())
                .build();
        clientRepo.save(admin);
        System.out.println("DTO reçu : " + dto);

        return ResponseEntity.status(HttpStatus.CREATED).body(etablissementMapper.EntityToEtab_Dto(saved));
    }

    @Override
    public  ResponseEntity<Etab_Dto>  updateEtablissement(String id, EtablissementUpdateDTO dto) {
        Etablissement etab = etablissementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Etablissement non trouvé avec id : " + id));
        
         User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec ID: " + dto.getUserId()));
        Users users = clientRepo.findById(dto.getUsersId())
                .orElseThrow(() -> new RuntimeException("Admin non trouvé avec ID: " + dto.getUsersId()));
        etab.setUser(user);
        etab.setNomEtablissement(dto.getNomEtablissement());
        etab.setAdresse_complet(dto.getAdresse_complet());
        etab.setRegion(dto.getRegion());
        etab.setTelephone(dto.getTelephone());
        etab.setUrl_localisation(dto.getUrl_localisation());
        etab.setType(dto.getType());
        etab.setEmail(dto.getEmail());
        etab.setIsActive(dto.getIsActive());

        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            String encodedPassword = passwordEncoder.encode(dto.getPassword());
            etab.setPassword(encodedPassword);
            users.setPassword(encodedPassword);
        }

        Etablissement updated = etablissementRepository.save(etab);
        users.setNom(dto.getNomEtablissement());
        users.setEmail(dto.getEmail());
        users.setAdresse(dto.getAdresse_complet());
        users.setNumTel(dto.getTelephone());
        clientRepo.save(users);


        return ResponseEntity.status(HttpStatus.OK).body(etablissementMapper.EntityToEtab_Dto(updated));
        
    }
    @Override
    public void deleteEtablissement(String id) {
        Etablissement etab = etablissementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Etablissement non trouvé avec id : " + id));

        Users admin =etab.getUsers();
        if (admin != null) {
            clientRepo.delete(admin);
        }
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
    public ResponseEntity<Etab_Dto> toggleEtablissementStatus(String id) {
        Etablissement etab = etablissementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Etablissement non trouvé avec id : " + id));

        boolean ancienEtat = etab.getIsActive() != null ? etab.getIsActive() : true;
        etab.setIsActive(!ancienEtat);
        if(!ancienEtat){
            etab.setDateDesactivation(null);
        }
        else{
            etab.setDateDesactivation(new Date());
        }
        Etablissement updated = etablissementRepository.save(etab);
        return ResponseEntity.status(HttpStatus.OK).body(etablissementMapper.EntityToEtab_Dto(updated));
    }

    @Override
    public ResponseEntity<List<Etab_Dto>> getEtablissementsAbonnesCeMois() {
        try{
            LocalDate now = LocalDate.now();
            LocalDate debutMois = now.withDayOfMonth(1);
            LocalDate finMois = debutMois.plusMonths(1);

            Date debut = Date.from(debutMois.atStartOfDay(ZoneId.systemDefault()).toInstant());
            Date fin = Date.from(finMois.atStartOfDay(ZoneId.systemDefault()).toInstant());

            List<Etablissement> etablissements = etablissementRepository.findEtablissementsAbonnesCeMois(debut, fin);
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
    @Override
    public List<DonneesCroissanceDTo> obtenirCroissanceMensuelle() {
    List<DonneesCroissanceDTo> resultats = new ArrayList<>();
    for (int m = 1; m <= 12; m++) {
        String nomMois = Month.of(m)
            .getDisplayName(TextStyle.FULL, Locale.FRANCE)
            .toLowerCase();
        resultats.add(new DonneesCroissanceDTo(nomMois, 0, 0, 0));
    }
    
    List<Abonnement> tousAbonnements = abonnementRepository.findAll();
    System.out.println("Nombre total d'abonnements: " + tousAbonnements.size());

    for (Abonnement abonnement : tousAbonnements) {
        if (abonnement.getDateDebutAbonnement() == null) {
            continue;
        }
        
        int mois = abonnement.getDateDebutAbonnement().getMonthValue();
    
        Etablissement etablissement = abonnement.getEtablissement();
        if (etablissement == null) {
            System.out.println("Abonnement " + abonnement.getIdAbonnement() + " sans établissement");
            continue;
        }
        
        Type_Etablissement type = etablissement.getType();
        
        DonneesCroissanceDTo dto = resultats.get(mois - 1);
        
        switch (type) {
            case GARDERIE:
                dto.setNombreGarderies(dto.getNombreGarderies() + 1);
                break;
            case CRECHE:
                dto.setNombreCreches(dto.getNombreCreches() + 1);
                break;
            case ECOLE:
                dto.setNombreEcoles(dto.getNombreEcoles() + 1);
                break;
        }
  
        System.out.println("Abonnement " + abonnement.getIdAbonnement() + ": Mois=" + mois + ", Type=" + type);
    }

    for (DonneesCroissanceDTo dto : resultats) {
        if (dto.getNombreGarderies() > 0 || dto.getNombreCreches() > 0 || dto.getNombreEcoles() > 0) {
                System.out.println("Mois " + dto.getMois() + ": Garderie=" + dto.getNombreGarderies() + ", Crèche=" + dto.getNombreCreches() + ", École=" + dto.getNombreEcoles());
        }
    }
    System.out.println("Fin calcul - " + resultats.size() + " mois générés");
    return resultats;
    }
    

    @Override
    public ResponseEntity<List<EtablissementInactifDTO>> getEtablissementsInactifs() {
        List<Etablissement> etablissements = etablissementRepository.findByIsActiveFalse();
        List<EtablissementInactifDTO> dtos =  etablissements.stream().map(etab -> {
            EtablissementInactifDTO dto = new EtablissementInactifDTO();
            dto.setId(etab.getIdEtablissment());
            dto.setNomEtablissement(etab.getNomEtablissement());
            dto.setJoursInactivite(calculateJoursInactivite(etab));
            return dto;
        }).toList();

        if (dtos.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(Collections.emptyList());
        }
        return ResponseEntity.status(HttpStatus.OK).body(dtos);
        
        }    
        
       
    

     public Long calculateJoursInactivite(Etablissement etab){
        if (etab.getDateDesactivation() == null) {
            return 0L;
        }

        try {
            LocalDate dateDesactivation = etab.getDateDesactivation()
                                           .toInstant()
                                           .atZone(ZoneId.systemDefault())
                                           .toLocalDate();
            LocalDate aujourdhui  = LocalDate.now();

            return  ChronoUnit.DAYS.between(dateDesactivation, aujourdhui);
                

        } catch (Exception e) {
             
            return 0L;
        }
     }
    }

