package tn.kidora.spring.kidorabackoffice.services.serviceImpl.Client;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import tn.kidora.spring.kidorabackoffice.entities.Client.Absence;
import tn.kidora.spring.kidorabackoffice.entities.Client.Enfants;
import tn.kidora.spring.kidorabackoffice.entities.Client.StatutAbsence;
import tn.kidora.spring.kidorabackoffice.entities.Client.Users;
import tn.kidora.spring.kidorabackoffice.repositories.Client.AbsenceRepository;
import tn.kidora.spring.kidorabackoffice.repositories.Client.ClientRepo;
import tn.kidora.spring.kidorabackoffice.repositories.Client.EnfantRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class AbsenceServiceImpl implements  AbsenceService{
private  final EnfantRepository enfantsRepository;
private final AbsenceRepository absenceRepository;
private final ClientRepo clientRepo;
    @Override
    public Absence marquerStatut(String idEnfant, StatutAbsence statut) {
        Enfants enfant = enfantsRepository.findById(idEnfant)
                .orElseThrow(() -> new IllegalArgumentException("Enfant introuvable"));
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Users educateur = clientRepo.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Éducateur introuvable"));

        Absence absence = Absence.builder()
                .enfants(enfant)
                .EDUCATEUR(educateur)
                .statut(statut)
                .date(LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")))
                .heure(LocalTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss")))
                .build();

        return absenceRepository.save(absence);
    }

    @Override
    public long getNombrePresentsAujourdhui() {
        String dateAujourdhui = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        return absenceRepository.countByStatutAndDate(StatutAbsence.PRESENT, dateAujourdhui);
    }

    @Override
    public long getNombreAbsentsAujourdhui() {
        String dateAujourdhui = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        return absenceRepository.countByStatutAndDate(StatutAbsence.ABSENT, dateAujourdhui);
    }
    //totalenfant de chaque educatur

}
