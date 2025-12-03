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
import tn.kidora.spring.kidorabackoffice.repositories.Etablissement_Repository;
import tn.kidora.spring.kidorabackoffice.repositories.EvenementRepository;
import tn.kidora.spring.kidorabackoffice.services.EvenementService;
import tn.kidora.spring.kidorabackoffice.utils.mapper.EvenementMapper;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class EvenementServiceImpl implements EvenementService {
    private final EvenementRepository evenementRepository;
    private final Etablissement_Repository etablissementRepository;
    private final EvenementMapper evenementMapper;
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
    public void supprimerEvenement(Long id) {
        Evenement evenement = evenementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Événement non trouvé avec l'id : " + id));

        evenementRepository.delete(evenement);
    }


    @Override
    public EvenementResponseDTO modifierEvenement(Long id, EvenementRequestDTO dto) {
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

        return evenementMapper.toResponseDTO(evenementExistant);
    }




}
