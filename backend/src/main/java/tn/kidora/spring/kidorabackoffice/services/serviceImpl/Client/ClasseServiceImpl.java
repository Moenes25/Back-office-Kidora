package tn.kidora.spring.kidorabackoffice.services.serviceImpl.Client;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import tn.kidora.spring.kidorabackoffice.dto.Client.ClasseRequestDto;
import tn.kidora.spring.kidorabackoffice.dto.Client.ClasseResponseDto;
import tn.kidora.spring.kidorabackoffice.entities.Client.Classes;
import tn.kidora.spring.kidorabackoffice.entities.Client.Users;
import tn.kidora.spring.kidorabackoffice.repositories.Client.ClasseRepository;
import tn.kidora.spring.kidorabackoffice.repositories.Client.ClientRepo;
import tn.kidora.spring.kidorabackoffice.utils.mapper.Client.ClasseMapper;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClasseServiceImpl implements  ClasseService{
    private final ClasseRepository classesRepo;
    private final ClientRepo clientRepo;
    @Override
    public ClasseResponseDto ajouterClasse(ClasseRequestDto dto) {
        Classes entity = ClasseMapper.toEntity(dto);
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!clientRepo.existsByEmail(username)) {
            System.out.println("username ==== " + username);
            throw new IllegalArgumentException("Utilisateur non enregistré");
             
        }
        System.out.println("voici username de l'utilisateur connectee : " + username);
        Users user = clientRepo.findByEmail(username)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur non enregistré"));
         entity.setCreated_by(user);
        
       
        Classes saved = classesRepo.save(entity);
        return ClasseMapper.toDto(saved);
    }

    @Override
    public List<ClasseResponseDto> getAllClasses() {
        return classesRepo.findAll()
                .stream()
                .map(ClasseMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public ClasseResponseDto updateClasse(ClasseRequestDto dto, String id) {
        Classes classe = classesRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Classe introuvable avec l'id : " + id));
        if (dto.getNom_classe() != null) classe.setNom_classe(dto.getNom_classe());
        if (dto.getDescription_classe() != null) classe.setDescription_classe(dto.getDescription_classe());
        if (dto.getCouleur_classe() != null) classe.setCouleur_classe(dto.getCouleur_classe());
        if (dto.getCapacite() != null) classe.setCapacite(dto.getCapacite());
        if (dto.getSalle() != null) classe.setSalle(dto.getSalle());
        
        return ClasseMapper.toDto(classe);
    }

    @Override
    public ClasseResponseDto deleteClasse(String id) {
        Classes classe = classesRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Classe introuvable avec l'id : " + id));
        classesRepo.delete(classe);
        return ClasseMapper.toDto(classe);
    }

    @Override
    public ClasseResponseDto getClasseById(String id) {
        final ClasseResponseDto classe = classesRepo.findById(id)
                .map(ClasseMapper::toDto)
                .orElseThrow(() -> new RuntimeException("Classe introuvable avec l'id : " + id));
        return classe;
    }

}
