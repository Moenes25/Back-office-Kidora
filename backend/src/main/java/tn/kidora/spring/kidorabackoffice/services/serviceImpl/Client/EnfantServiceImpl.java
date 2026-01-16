package tn.kidora.spring.kidorabackoffice.services.serviceImpl.Client;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import tn.kidora.spring.kidorabackoffice.dto.Client.EnfantRequestDto;
import tn.kidora.spring.kidorabackoffice.dto.Client.EnfantResponseDto;
import tn.kidora.spring.kidorabackoffice.entities.Client.Classes;
import tn.kidora.spring.kidorabackoffice.entities.Client.Enfants;
import tn.kidora.spring.kidorabackoffice.entities.Client.Users;
import tn.kidora.spring.kidorabackoffice.repositories.UserRepository;
import tn.kidora.spring.kidorabackoffice.repositories.Client.ClasseRepository;
import tn.kidora.spring.kidorabackoffice.repositories.Client.ClientRepo;
import tn.kidora.spring.kidorabackoffice.repositories.Client.EnfantRepository;
import tn.kidora.spring.kidorabackoffice.utils.mapper.Client.EnfantMapper;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EnfantServiceImpl implements  EnfantService {
   private final EnfantRepository enfantRepository;
    private final EnfantMapper enfantMapper;
    private final ClientRepo clientRepo;
    private  final ClasseRepository classeRepository;
    private final UserRepository userRepository;

    @Override
    public EnfantResponseDto ajouterEnfant(EnfantRequestDto dto, String parentId)  {
        Classes classe = classeRepository.findById(dto.getClasse())
                .orElseThrow(() -> new RuntimeException("Classe introuvable avec l'id : " + dto.getClasse()));
        Enfants enfant = enfantMapper.dtoToEntity(dto,classe);
        if (dto.getImageFile() != null && !dto.getImageFile().isEmpty()) {
            try {
                String uploadDir = "uploads/enfants/";
                File directory = new File(uploadDir);
                if (!directory.exists()) {
                    directory.mkdirs();
                }
                String fileName = System.currentTimeMillis() + "_" + dto.getImageFile().getOriginalFilename();
                Path filePath = Paths.get(uploadDir, fileName);
                Files.copy(dto.getImageFile().getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                enfant.setImageUrl("/" + uploadDir + fileName);
            } catch (IOException e) {
                throw new RuntimeException("Erreur lors du téléchargement de l'image : " + e.getMessage(), e);
            }
        }
        Users parent = clientRepo.findById(parentId)
                .orElseThrow(() -> new RuntimeException("Parent not found"));
        enfant.setParent(parent);
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String adminUsername = authentication.getName();
        Users admin = clientRepo.findByEmail(adminUsername)
                .orElseThrow(() -> new RuntimeException("Admin non trouvé"));
        enfant.setAdmin(admin);

        Enfants saved = enfantRepository.save(enfant);
        return   enfantMapper.entityToDto(saved);
    }

    @Override
    public void supprimerEnfant(String idEnfant) {
        Enfants enfant = enfantRepository.findById(idEnfant)
                .orElseThrow(() -> new RuntimeException("Enfant non trouvé"));
        enfantRepository.delete(enfant);
    }
    @Override
    public List<EnfantResponseDto> getAllEnfants() {
        return enfantRepository.findAll().stream()
                .map(enfantMapper::entityToDto)
                .toList();
    }

    @Override
    public EnfantResponseDto updateEnfant(String idEnfant, EnfantRequestDto dto) {
        Enfants enfant = enfantRepository.findById(idEnfant)
                .orElseThrow(() -> new RuntimeException("Enfant non trouvé"));
        if (dto.getNom() != null) enfant.setNom(dto.getNom());
        if (dto.getPrenom() != null) enfant.setPrenom(dto.getPrenom());
        if (dto.getAge() != null) enfant.setAge(dto.getAge());
        if (dto.getClasse() != null) {
            Classes classe = classeRepository.findById(dto.getClasse())
                    .orElseThrow(() -> new RuntimeException("Classe introuvable avec l'id : " + dto.getClasse()));
            enfant.setClasse(classe);
        }

        if (dto.getImageFile() != null && !dto.getImageFile().isEmpty()) {
            try {
                if (enfant.getImageUrl() != null) {
                    File oldFile = new File("." + enfant.getImageUrl());
                    if (oldFile.exists()) oldFile.delete();
                }
                String uploadDir = "uploads/enfants/";
                File directory = new File(uploadDir);
                if (!directory.exists()) directory.mkdirs();

                String fileName = System.currentTimeMillis() + "_" + dto.getImageFile().getOriginalFilename();
                Path filePath = Paths.get(uploadDir, fileName);
                Files.copy(dto.getImageFile().getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                enfant.setImageUrl("/" + uploadDir + fileName);
            } catch (IOException e) {
                throw new RuntimeException("Erreur lors du téléchargement de l'image : " + e.getMessage(), e);
            }
        }
        Enfants saved = enfantRepository.save(enfant);
        return enfantMapper.entityToDto(saved);
    }
    @Override
    public List<EnfantResponseDto> getEnfantsByParent(String parentId) {
        return enfantRepository.findByParentId(parentId).stream()
                .map(enfantMapper::entityToDto)
                .toList();
    }

    @Override
    public long getNombreEnfants() {
        return enfantRepository.count();
    }


}