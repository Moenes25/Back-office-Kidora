package tn.kidora.spring.kidorabackoffice.services.serviceImpl;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import tn.kidora.spring.kidorabackoffice.dto.EvenementRequestDTO;
import tn.kidora.spring.kidorabackoffice.dto.EvenementResponseDTO;
import tn.kidora.spring.kidorabackoffice.entities.Etablissement;
import tn.kidora.spring.kidorabackoffice.entities.Evenement;
import tn.kidora.spring.kidorabackoffice.entities.Type_Etablissement;
import tn.kidora.spring.kidorabackoffice.repositories.ActivityRepository;
import tn.kidora.spring.kidorabackoffice.entities.Activity;
import tn.kidora.spring.kidorabackoffice.repositories.Etablissement_Repository;
import tn.kidora.spring.kidorabackoffice.repositories.EvenementRepository;
import tn.kidora.spring.kidorabackoffice.services.EvenementService;
import tn.kidora.spring.kidorabackoffice.utils.mapper.EvenementMapper;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.IsoFields;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class EvenementServiceImpl implements EvenementService {
    private final EvenementRepository evenementRepository;
    private final Etablissement_Repository etablissementRepository;
    private final EvenementMapper evenementMapper;
    private final ActivityRepository activityRepository;
    @Override
    public ResponseEntity<EvenementResponseDTO> ajouterEvenement(EvenementRequestDTO dto) {


        Etablissement etab = etablissementRepository.findById(dto.getEtablissementId())
                .orElseThrow(() -> new RuntimeException("Établissement non trouvé"));

        if (!etab.getType().equals(dto.getType())) {
            throw new IllegalArgumentException("Le type de l'événement (" + dto.getType() +
                    ") ne correspond pas au type de l'établissement (" + etab.getType() + ").");
        }
        Evenement evenement = evenementMapper.toEntity(dto, etab);
        evenementRepository.save(evenement);
       /*  activityRepository.save(Activity.builder()
        .entityName("Evenement")
        .recordName(dto.getTitre())
        .nomEtablissement(etab.getNomEtablissement())
        .action("Création d'événement")
        .adminNom(etab.getUser() != null ? etab.getUser().getNom() : "Inconnu")
        .adminImage(etab.getUser() != null ? etab.getUser().getImageUrl() : null)
        .adminRegion(etab.getUser() != null ? etab.getUser().getRegion() : "Inconnu")
        .adminRole(etab.getUser() != null ? etab.getUser().getRole() : null)
        .dateAction(LocalDateTime.now())
        .build());*/

        EvenementResponseDTO response = evenementMapper.toResponseDTO(evenement);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }


    @Override
    public ResponseEntity<List<EvenementResponseDTO>> getAllEvenements() {
        List<EvenementResponseDTO> events = evenementRepository.findAll()
                .stream()
                .map(evenementMapper::toResponseDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(events);
    }

    @Override
    public ResponseEntity<List<EvenementResponseDTO>> getEvenementsParDate(LocalDate date) {
        List<Evenement> evenements = evenementRepository.findByDate(date);
        List<EvenementResponseDTO> dtoList = evenements.stream()
                .map(evenementMapper::toResponseDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtoList);
    }

    @Override
    public Map<Type_Etablissement, Long> getNombreEvenementParTypeEtablissement() {
        List<Evenement> evenements = evenementRepository.findAll();
        return evenements.stream()
                .filter(e -> e.getType() != null)
                .collect(Collectors.groupingBy(
                        Evenement::getType,
                        Collectors.counting()
                ));
    }



    @Override
    public void supprimerEvenement(String id) {
        Evenement evenement = evenementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Événement non trouvé avec l'id : " + id));

        evenementRepository.delete(evenement);
        Etablissement etab = evenement.getEtablissement();

/*activityRepository.save(Activity.builder()
        .entityName("Evenement")
        .recordName(evenement.getTitre())
        .nomEtablissement(etab != null ? etab.getNomEtablissement() : "Inconnu")
        .action("Suppression d'événement")
        .adminNom(etab != null && etab.getUser() != null ? etab.getUser().getNom() : "Inconnu")
        .adminImage(etab != null && etab.getUser() != null ? etab.getUser().getImageUrl() : null)
        .adminRegion(etab != null && etab.getUser() != null ? etab.getUser().getRegion() : "Inconnu")
        .adminRole(etab != null && etab.getUser() != null ? etab.getUser().getRole() : null)
        .dateAction(LocalDateTime.now())
        .build());*/

    }


    @Override
    public EvenementResponseDTO modifierEvenement(String id, EvenementRequestDTO dto) {
        Evenement evenementExistant = evenementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Événement non trouvé avec l'id : " + id));

        Etablissement etab = etablissementRepository.findById(dto.getEtablissementId())
                .orElseThrow(() -> new RuntimeException("Établissement non trouvé avec l'id : " + dto.getEtablissementId()));

        evenementExistant.setDescription(dto.getDescription());
        evenementExistant.setDate(dto.getDate());
        evenementExistant.setHeureDebut(dto.getHeureDebut());
        evenementExistant.setHeureFin(dto.getHeureFin());
        evenementExistant.setType(dto.getType());
        evenementExistant.setEtablissement(etab);

        evenementRepository.save(evenementExistant);
       /*activityRepository.save(Activity.builder()
        .entityName("Evenement")
        .recordName(evenementExistant.getTitre())
        .nomEtablissement(etab.getNomEtablissement())
        .action("Modification d'événement")
        .adminNom(etab.getUser() != null ? etab.getUser().getNom() : "Inconnu")
        .adminImage(etab.getUser() != null ? etab.getUser().getImageUrl() : null)
        .adminRegion(etab.getUser() != null ? etab.getUser().getRegion() : "Inconnu")
        .adminRole(etab.getUser() != null ? etab.getUser().getRole() : null)
        .dateAction(LocalDateTime.now())
        .build());*/


        return evenementMapper.toResponseDTO(evenementExistant);
    }

    @Override
    public long getNombreEvenementSemaineCouranteParType(String type) {
        LocalDate today = LocalDate.now();
        int currentWeek = today.get(IsoFields.WEEK_OF_WEEK_BASED_YEAR);
        int currentYear = today.getYear();
        List<Evenement> evenements = evenementRepository.findAll();

        return evenements.stream()
                .filter(e -> e.getDate() != null)
                .filter(e -> e.getDate().getYear() == currentYear)
                .filter(e -> e.getDate().get(IsoFields.WEEK_OF_WEEK_BASED_YEAR) == currentWeek)
                .filter(e -> type == null || e.getType().toString().equals(type))
                .count();
    }

    @Override
    public long getNombreEvenementPourUnJour(LocalDate date, Type_Etablissement type) {
        return evenementRepository.countByDateAndType(date,type);

    }

    @Override
    public double getTotalHeuresPlanifieesParType(String type) {
        LocalDate today = LocalDate.now();
        int currentWeek = today.get(IsoFields.WEEK_OF_WEEK_BASED_YEAR);
        int currentYear = today.getYear();
        List<Evenement> evenements = evenementRepository.findAll();


        return evenements.stream()
                .filter(e -> e.getDate() != null && e.getHeureDebut() != null && e.getHeureFin() != null)
                .filter(e -> e.getDate().getYear() == currentYear)
                .filter(e -> e.getDate().get(IsoFields.WEEK_OF_WEEK_BASED_YEAR) == currentWeek)
                .filter(e -> {
                    if (type == null) return true; // pas de filtre = tous types
                    if (e.getEtablissement() == null) return false;
                    return e.getEtablissement().getType().toString().equals(type);
                })
                .mapToDouble(e ->
                        java.time.Duration.between(e.getHeureDebut(), e.getHeureFin()).toMinutes() / 60.0
                )
                .sum();
    }

    @Override
    public long getNombreEvenementParType(Type_Etablissement type) {
        return evenementRepository.countByType(type);
    }


    

}