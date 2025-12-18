package tn.kidora.spring.kidorabackoffice.audit;

import org.bson.Document;
import org.springframework.data.mongodb.core.mapping.event.AfterDeleteEvent;
import org.springframework.data.mongodb.core.mapping.event.BeforeDeleteEvent;
import tn.kidora.spring.kidorabackoffice.entities.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.mapping.event.AbstractMongoEventListener;
import org.springframework.data.mongodb.core.mapping.event.AfterSaveEvent;
import org.springframework.stereotype.Component;
import tn.kidora.spring.kidorabackoffice.entities.Activity;
import tn.kidora.spring.kidorabackoffice.repositories.ActivityRepository;
import tn.kidora.spring.kidorabackoffice.repositories.Etablissement_Repository;
import tn.kidora.spring.kidorabackoffice.repositories.UserRepository;

import java.time.LocalDateTime;

@Component
public class GenericAuditListener extends AbstractMongoEventListener<Object> {
    @Autowired
    private ActivityRepository activityRepository;
    @Autowired
    Etablissement_Repository etablissementRepository;
    @Autowired
    UserRepository userRepository;
    @Override
    public void onAfterSave(AfterSaveEvent<Object> event) {
        Object entity  = event.getSource();
        if (entity instanceof Etablissement etab) {
            User user = etab.getUser();
            String adminNom = user != null ? user.getNom() : "Inconnu";
            String adminImage = user != null ? user.getImageUrl() : null;
            String adminRegion = user != null ? user.getRegion() : "Inconnu";
           Role adminRole = user != null ? user.getRole() : null;

            boolean exists = etab.getIdEtablissment() != null && etablissementRepository.existsById(etab.getIdEtablissment());
            String action = exists ? "Modification d'établissement" : "Création d'établissement";

            Activity activity = Activity.builder()
                    .recordName(etab.getNomEtablissement())
                    .action(action)
                    .adminNom(adminNom)
                    .adminImage(adminImage)
                    .adminRegion(adminRegion) // ajouté
                    .adminRole(adminRole)
                    .dateAction(LocalDateTime.now())
                    .build();
            activityRepository.save(activity);
        }
    }
    @Override
    public void onBeforeDelete(BeforeDeleteEvent<Object> event) {
        Document doc = event.getSource();
        Object idObj = doc.get("_id");
        if (idObj == null) return;
        String id = idObj.toString();
        Etablissement etab = etablissementRepository.findById(id).orElse(null);
        if (etab == null) return;
        User user = etab.getUser();
        Activity activity = Activity.builder()
                .recordName(etab.getNomEtablissement())
                .action("Suppression d'établissement")
                .adminNom(user != null ? user.getNom() : "Inconnu")
                .adminImage(user != null ? user.getImageUrl() : null)
                .adminRegion(user != null ? user.getRegion() : "Inconnu")
                .adminRole(user != null ? user.getRole() : null)
                .dateAction(LocalDateTime.now())
                .build();

        activityRepository.save(activity);
    }



}

