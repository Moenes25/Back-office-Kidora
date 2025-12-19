package tn.kidora.spring.kidorabackoffice.audit;

import org.bson.Document;
import org.springframework.data.mongodb.core.mapping.event.*;
import tn.kidora.spring.kidorabackoffice.entities.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import tn.kidora.spring.kidorabackoffice.entities.Activity;
import tn.kidora.spring.kidorabackoffice.repositories.ActivityRepository;
import tn.kidora.spring.kidorabackoffice.repositories.Etablissement_Repository;
import tn.kidora.spring.kidorabackoffice.repositories.EvenementRepository;
import tn.kidora.spring.kidorabackoffice.repositories.UserRepository;

import java.time.LocalDateTime;

@Component
public class GenericAuditListener extends AbstractMongoEventListener<Object> {
    @Autowired
    private ActivityRepository activityRepository;
    @Autowired
    Etablissement_Repository etablissementRepository;
    @Autowired
    private EvenementRepository evenementRepository;
    @Override
    public void onBeforeConvert(BeforeConvertEvent<Object> event) {
        Object entity  = event.getSource();
        if (entity instanceof Etablissement etab) {
            boolean isNew = (etab.getIdEtablissment() == null); // vrai si création
            String action = isNew ? "Création d'établissement" : "Modification d'établissement";

            User user = etab.getUser();
            Activity activity = Activity.builder()
                    .entityName("Etablissement")
                    .recordName(etab.getNomEtablissement())
                    .action(action)
                    .adminNom(user != null ? user.getNom() : "Inconnu")
                    .adminImage(user != null ? user.getImageUrl() : null)
                    .adminRegion(user != null ? user.getRegion() : "Inconnu")
                    .adminRole(user != null ? user.getRole() : null)
                    .dateAction(LocalDateTime.now())
                    .build();
            activityRepository.save(activity);
        }
    }
    @Override
    public void onBeforeSave(BeforeSaveEvent<Object> event) {
        Object entity = event.getSource();

        if (entity instanceof Evenement evt) {
            boolean isNew = (evt.getIdEvenement() == null) ||
                    !evenementRepository.existsById(evt.getIdEvenement());

            String action = isNew ? "Création d'événement" : "Modification d'événement";
            Etablissement etab = evt.getEtablissement();
            User admin = (etab != null) ? etab.getUser() : null;
            Activity activity = Activity.builder()
                    .entityName("Evenement")
                    .recordName(evt.getTitre())
                    .nomEtablissement(evt.getEtablissement() != null
                            ? evt.getEtablissement().getNomEtablissement() : "Inconnu")
                    .adminNom(admin != null ? admin.getNom() : "Inconnu")
                    .adminImage(admin != null ? admin.getImageUrl() : null)
                    .adminRegion(admin != null ? admin.getRegion() : null)
                    .adminRole(admin != null ? admin.getRole() : null)
                    .action(action)
                    .dateAction(LocalDateTime.now())
                    .build();

            activityRepository.save(activity);
        }}

    @Override
    public void onBeforeDelete(BeforeDeleteEvent<Object> event) {
        Document doc = event.getSource();
        Object idObj = doc.get("_id");
        if (idObj == null) return;
        String id = idObj.toString();
        // Evenement
        evenementRepository.findById(id).ifPresent(this::logEvenementDeletion);
        Etablissement etab = etablissementRepository.findById(id).orElse(null);
        if (etab == null) return;
        User user = etab.getUser();
        Activity activity = Activity.builder()
                .entityName("Etablissement")
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
    // Evenement
    private void logEvenementDeletion(Evenement evt) {
        Etablissement etab = evt.getEtablissement();
        User admin = (etab != null) ? etab.getUser() : null;

        Activity activity = Activity.builder()
                .entityName("Evenement")
                .recordName(evt.getTitre())
                .nomEtablissement(etab != null ? etab.getNomEtablissement() : "Établissement inconnu")
                .action("Suppression d'événement")
                .adminNom(admin != null ? admin.getNom() : "Inconnu")
                .adminImage(admin != null ? admin.getImageUrl() : null)
                .adminRegion(admin != null ? admin.getRegion() : "Inconnu")
                .adminRole(admin != null ? admin.getRole() : null)
                .dateAction(LocalDateTime.now())
                .build();

        activityRepository.save(activity);
    }

}

