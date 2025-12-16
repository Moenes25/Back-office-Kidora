package tn.kidora.spring.kidorabackoffice.audit;

import tn.kidora.spring.kidorabackoffice.entities.Activity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.mapping.event.AbstractMongoEventListener;
import org.springframework.data.mongodb.core.mapping.event.AfterSaveEvent;
import org.springframework.stereotype.Component;
import tn.kidora.spring.kidorabackoffice.entities.Activity;
import tn.kidora.spring.kidorabackoffice.entities.Etablissement;
import tn.kidora.spring.kidorabackoffice.entities.User;
import tn.kidora.spring.kidorabackoffice.repositories.ActivityRepository;

import java.time.LocalDateTime;

@Component
public class GenericAuditListener extends AbstractMongoEventListener<Object> {
    @Autowired
    private ActivityRepository activityRepository;
    @Override
    public void onAfterSave(AfterSaveEvent<Object> event) {
        Object entity  = event.getSource();
        if (entity instanceof Etablissement etab) {
            User user = etab.getUser();
            String adminNom = user != null ? user.getNom() : "Inconnu";
            String adminImage = user != null ? user.getImageUrl() : null;

            Activity activity = Activity.builder()
                    .recordName(etab.getNomEtablissement())
                    .action("CREATION")
                    .adminNom(adminNom)
                    .adminImage(adminImage)
                    .dateAction(LocalDateTime.now())
                    .build();
            activityRepository.save(activity);
        }
    }


}

