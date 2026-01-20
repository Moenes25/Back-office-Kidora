package tn.kidora.spring.kidorabackoffice.services.serviceImpl.Client;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import tn.kidora.spring.kidorabackoffice.dto.Client.ClientUpdateDto;
import tn.kidora.spring.kidorabackoffice.entities.Client.Classes;
import tn.kidora.spring.kidorabackoffice.entities.Client.RoleUsers;
import tn.kidora.spring.kidorabackoffice.entities.Client.Users;
import tn.kidora.spring.kidorabackoffice.entities.Etablissement;
import tn.kidora.spring.kidorabackoffice.repositories.Client.ClientRepo;
import tn.kidora.spring.kidorabackoffice.repositories.Client.ClasseRepository;
import tn.kidora.spring.kidorabackoffice.repositories.Etablissement_Repository;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ClientServiceImpl implements  ClientService{
    private final ClientRepo clientRepo;
    private final ClasseRepository classeRepository;
    private final Etablissement_Repository  etablissementRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Override
    public void deleteClient(String clientId) {
        Users client = clientRepo.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client non trouvé"));
        clientRepo.delete(client);
    }

    @Override
    public Users updateProfile(String id, ClientUpdateDto dto) {
        System.out.println("DTO complet: " + dto);
        Users user = clientRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable avec l'id : " + id));
        System.out.println("Email DTO: " + dto.getEmail());
        System.out.println("Email actuel: " + user.getEmail());
        if (dto.getNom() != null) user.setNom(dto.getNom());
        if (dto.getPrenom() != null) user.setPrenom(dto.getPrenom());
        if (dto.getNumTel() != null) user.setNumTel(dto.getNumTel());
        if (dto.getAdresse() != null) user.setAdresse(dto.getAdresse());
        if (dto.getEmail() != null && !dto.getEmail().isBlank()) user.setEmail(dto.getEmail());

        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            String encodedPassword = passwordEncoder.encode(dto.getPassword());
            user.setPassword(encodedPassword);
        }

        // Mise à jour selon le rôle
        RoleUsers role = dto.getRole() != null ? dto.getRole() : user.getRole();

        if (role == RoleUsers.PARENT) {
            if (dto.getProfession() != null) user.setProfession(dto.getProfession());
            if (dto.getRelation() != null) user.setRelation(dto.getRelation());
        } else if (role == RoleUsers.EDUCATEUR) {
            if (dto.getSpecialisation() != null) user.setSpecialisation(dto.getSpecialisation());
            if (dto.getExperience() != null) user.setExperience(dto.getExperience());
            if (dto.getDisponibilite() != null) user.setDisponibilite(dto.getDisponibilite());
            if (dto.getClassesIds() != null && !dto.getClassesIds().isEmpty()) {
                List<Classes> classes = classeRepository.findAllById(dto.getClassesIds());
                user.setClasses(classes);
            }
        }
        if (dto.getStatutClient() != null) {
            user.setStatutClient(dto.getStatutClient());
        }
        if (dto.getImageFile() != null && !dto.getImageFile().isEmpty()) {
            String fileName = System.currentTimeMillis() + "_" + dto.getImageFile().getOriginalFilename();
            Path path = Paths.get("uploads/users/" + fileName);

            try {
                Files.createDirectories(path.getParent());
                Files.write(path, dto.getImageFile().getBytes());
                user.setImageUrl("/uploads/users/" + fileName);
            } catch (IOException e) {
                throw new RuntimeException("Erreur lors de l’enregistrement de l’image : " + e.getMessage());
            }
        }
        // 🔹 Synchronisation avec l’établissement
        if (user.getEtablissement() != null) {
            Etablissement etab = etablissementRepository.findById(user.getEtablissement().getIdEtablissment())
                    .orElse(null);
            if (etab != null) {
                if (dto.getNom() != null) etab.setNomEtablissement(dto.getNom());
                if (dto.getAdresse() != null) etab.setAdresse_complet(dto.getAdresse());
                if (dto.getNumTel() != null) etab.setTelephone(dto.getNumTel());
                if (dto.getEmail() != null) etab.setEmail(dto.getEmail());
                if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
                    String encodedPassword = passwordEncoder.encode(dto.getPassword());
                    etab.setPassword(encodedPassword);
                }

                etablissementRepository.save(etab);
            }
        }
        return clientRepo.save(user);
    }

    @Override
    public List<Users> getAllClients() {
        return clientRepo.findAll();
    }

    @Override
    public List<Users> getParents() {
        return clientRepo.findByRole(RoleUsers.PARENT);
    }

    @Override
    public List<Users> getEducateurs() {
        return clientRepo.findByRole(RoleUsers.EDUCATEUR);
    }

    @Override
    public long getTotalParents() {
        return clientRepo.countParents();
    }
    @Override
   public long countByRoleAndEtablissementId(RoleUsers role, String idEtablissement) {
    return clientRepo.countByRoleAndEtablissement_IdEtablissment(role, idEtablissement);
   }

}
