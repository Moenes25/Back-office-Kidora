package tn.kidora.spring.kidorabackoffice.services.serviceImpl.Client;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tn.kidora.spring.kidorabackoffice.dto.Client.ClientUpdateDto;
import tn.kidora.spring.kidorabackoffice.entities.Client.RoleUsers;
import tn.kidora.spring.kidorabackoffice.entities.Client.Users;
import tn.kidora.spring.kidorabackoffice.repositories.Client.ClientRepo;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ClientServiceImpl implements  ClientService{
    private final ClientRepo clientRepo;

    @Override
    public void deleteClient(String clientId) {
        Users client = clientRepo.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client non trouvé"));
        clientRepo.delete(client);
    }

    @Override
    public Users updateProfile(String id, ClientUpdateDto dto) {
        Users user = clientRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable avec l'id : " + id));

        if (dto.getNom() != null) user.setNom(dto.getNom());
        if (dto.getPrenom() != null) user.setPrenom(dto.getPrenom());
        if (dto.getNumTel() != null) user.setNumTel(dto.getNumTel());
        if (dto.getAdresse() != null) user.setAdresse(dto.getAdresse());

        // Mise à jour selon le rôle
        RoleUsers role = dto.getRole() != null ? dto.getRole() : user.getRole();

        if (role == RoleUsers.PARENT) {
            if (dto.getProfession() != null) user.setProfession(dto.getProfession());
            if (dto.getRelation() != null) user.setRelation(dto.getRelation());
        } else if (role == RoleUsers.EDUCATEUR) {
            if (dto.getSpecialisation() != null) user.setSpecialisation(dto.getSpecialisation());
            if (dto.getExperience() != null) user.setExperience(dto.getExperience());
            if (dto.getDisponibilite() != null) user.setDisponibilite(dto.getDisponibilite());
            if (dto.getClasse() != null) user.setClasse(dto.getClasse());
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
}
