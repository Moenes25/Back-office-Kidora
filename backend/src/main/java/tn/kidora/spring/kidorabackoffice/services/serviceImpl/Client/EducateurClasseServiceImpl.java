package tn.kidora.spring.kidorabackoffice.services.serviceImpl.Client;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import tn.kidora.spring.kidorabackoffice.dto.Client.EducateurClasseRequestDto;
import tn.kidora.spring.kidorabackoffice.dto.Client.EducateurClasseResponseDTO;
import tn.kidora.spring.kidorabackoffice.entities.Client.Classes;
import tn.kidora.spring.kidorabackoffice.entities.Client.EducateurClasse;
import tn.kidora.spring.kidorabackoffice.entities.Client.RoleUsers;
import tn.kidora.spring.kidorabackoffice.entities.Client.Users;
import tn.kidora.spring.kidorabackoffice.repositories.Client.ClasseRepository;
import tn.kidora.spring.kidorabackoffice.repositories.Client.ClientRepo;
import tn.kidora.spring.kidorabackoffice.repositories.Client.EducateurClasseRepository;
import tn.kidora.spring.kidorabackoffice.utils.mapper.Client.EducateurClasseMapper;


@Service
@RequiredArgsConstructor
public class EducateurClasseServiceImpl implements EducateurClasseService {
    private final EducateurClasseRepository educateurClasseRepository;
    private final ClientRepo clientRepo;
    private final ClasseRepository classesRepository;
    private final EducateurClasseMapper mapper;

    @Override
    public EducateurClasseResponseDTO assignerEducateurAClasse(EducateurClasseRequestDto dto) {
        Users educateur = clientRepo.findById(dto.getEducateurId())
                .orElseThrow(() -> {
                    return new RuntimeException("Éducateur non trouvé");
                });
         if (educateur.getRole() != RoleUsers.EDUCATEUR) {
            throw new RuntimeException("L'utilisateur n'est pas un éducateur");
        }
         Classes classe = classesRepository.findById(dto.getClasseId())
                .orElseThrow(() -> {
                    return new RuntimeException("Classe non trouvée");
                });
        if (educateurClasseRepository.existsByEducateurIdAndClasseId(
                dto.getEducateurId(), dto.getClasseId())) {
            throw new RuntimeException("Cet éducateur est déjà assigné à cette classe");
        }
         LocalDateTime now = LocalDateTime.now();
         EducateurClasse assignation = EducateurClasse.builder()
                .educateur(educateur)
                .classe(classe)
                .dateAssignation(dto.getDateAssignation() != null ? 
                        dto.getDateAssignation() : now)
                .createdAt(now)
                .updatedAt(now)
                .build();
         EducateurClasse savedAssignation = educateurClasseRepository.save(assignation);

         return mapper.mapToResponseDTO(savedAssignation);

    }

    @Override
    public List<EducateurClasseResponseDTO> getClassesByEducateur(String educateurId) {
       clientRepo.findById(educateurId)
                .filter(user -> user.getRole() == RoleUsers.EDUCATEUR)
                .orElseThrow(() -> new RuntimeException("Éducateur non trouvé"));
       List<EducateurClasse> assignations = educateurClasseRepository.findByEducateurId(educateurId);
        return assignations.stream()
                .map(mapper::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<EducateurClasseResponseDTO> getEducateursByClasse(String classeId) {
      classesRepository.findById(classeId)
                .orElseThrow(() -> new RuntimeException("Classe non trouvée"));
       List<EducateurClasse> assignations = educateurClasseRepository.findByClasseId(classeId);
        return assignations.stream()
                .map(mapper::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public EducateurClasseResponseDTO updateEducateurClasse(String id, EducateurClasseRequestDto dto) {
      EducateurClasse assignation = educateurClasseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Assignation non trouvée"));
       if (dto.getEducateurId() != null && 
        !dto.getEducateurId().equals(assignation.getEducateur().getId())) {
             Users nouvelEducateur = clientRepo.findById(dto.getEducateurId())
                    .orElseThrow(() -> new RuntimeException("Nouvel éducateur non trouvé"));
            if (nouvelEducateur.getRole() != RoleUsers.EDUCATEUR) {
                throw new RuntimeException("Le nouvel utilisateur n'est pas un éducateur");
            }
            assignation.setEducateur(nouvelEducateur);

        }
        if(dto.getClasseId() != null &&
          !dto.getClasseId().equals(assignation.getClasse().getId())) {
             Classes nouvelleClasse = classesRepository.findById(dto.getClasseId())
                    .orElseThrow(() -> new RuntimeException("Nouvelle classe non trouvée"));
             assignation.setClasse(nouvelleClasse);
          }

           if (dto.getDateAssignation() != null) {
            assignation.setDateAssignation(dto.getDateAssignation());
        }
          assignation.setUpdatedAt(LocalDateTime.now());
          EducateurClasse updatedAssignation = educateurClasseRepository.save(assignation);
          return mapper.mapToResponseDTO(updatedAssignation);
    }

    @Override
    public void deleteEducateurClasse(String id) {
        if (!educateurClasseRepository.existsById(id)) {
            throw new RuntimeException("Assignation non trouvée");
        }
         educateurClasseRepository.deleteById(id);
    }

   

    @Override
    public List<EducateurClasseResponseDTO> getAllEducateurClasse() {
       return educateurClasseRepository.findAll().stream()
                .map(mapper::mapToResponseDTO)
                .collect(Collectors.toList());
    }
    @Override
     public EducateurClasseResponseDTO getAssignationById(String id) {
        EducateurClasse assignation = educateurClasseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Assignation non trouvée"));
        
        return mapper.mapToResponseDTO(assignation);
    }

    
}
