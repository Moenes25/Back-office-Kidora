package tn.kidora.spring.kidorabackoffice.services.serviceImpl;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import tn.kidora.spring.kidorabackoffice.dto.FactureRequestDTO;
import tn.kidora.spring.kidorabackoffice.dto.FactureResponseDto;
import tn.kidora.spring.kidorabackoffice.entities.*;
import tn.kidora.spring.kidorabackoffice.repositories.AbonnementRepository;
import tn.kidora.spring.kidorabackoffice.repositories.Etablissement_Repository;
import tn.kidora.spring.kidorabackoffice.repositories.FactureRepository;
import tn.kidora.spring.kidorabackoffice.services.FactureService;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@AllArgsConstructor
@Service
public class FactureServiceImpl implements FactureService {


    private final FactureRepository factureRepository;
    private final AbonnementRepository abonnementRepository;
    private final  Etablissement_Repository etablissementRepository;


    @Override
    public Facture creerFacture(FactureRequestDTO dto) {
        Etablissement etablissement = etablissementRepository.findById(dto.getEtablissementId())
                .orElseThrow(() -> new RuntimeException("Établissement non trouvé"));
        Facture facture = new Facture();
    //    facture.setAbonnement(abonnement);
      //  facture.setMontant(montant);
        facture.setEtablissement(etablissement);
        facture.setDateFacture(new Date());
        facture.setMethode(dto.getMethode());
        facture.setReference(genererReferenceFacture());
        facture.setStatutFacture(dto.getStatutFacture());

        return factureRepository.save(facture);
    }

    @Override
    public long totalFactures() {
        return factureRepository.count(); // total général
    }

    @Override
    public long totalFacturesPayees() {
        return factureRepository.countByStatutFacture(StatutFacture.PAYEE);
    }

    @Override
    public long totalFacturesImpaye() {
        return factureRepository.countByStatutFacture(StatutFacture.IMPAYEE);
    }

    @Override
    public List<FactureResponseDto> getAllFactures() {
        List<Facture> factures = factureRepository.findAll();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("d MMM yyyy, HH:mm");

        return factures.stream()
                .filter(f -> f.getEtablissement() != null)
                .map(f -> {
                    Etablissement e = f.getEtablissement();

                    return FactureResponseDto.builder()
                            .idFacture("#" + f.getReference())
                            .date(f.getDateFacture() != null
                                    ? f.getDateFacture().toInstant()
                                    .atZone(ZoneId.systemDefault())
                                    .toLocalDateTime()
                                    .format(formatter)
                                    : "—")
                            .nomEtablissement(e.getNomEtablissement() != null ? e.getNomEtablissement() : "—")
                            .type(e.getType() != null ? e.getType().name() : "—")
                            .gouvernorat(e.getRegion() != null ? e.getRegion() : "—")
                            .email(e.getEmail() != null ? e.getEmail() : "—")
                            .statut(f.getStatutFacture() != null ? f.getStatutFacture().name() : "—")
                            .build();
                })
                .collect(Collectors.toList());
    }
    @Override
    public FactureResponseDto getFactureById(String id) {
        Facture f = factureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Facture introuvable"));

        Etablissement e = f.getEtablissement();
        if (e == null) {
            throw new RuntimeException("Aucun établissement lié à cette facture");
        }

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("d MMM yyyy, HH:mm");

        return FactureResponseDto.builder()
                .idFacture("#" + f.getReference())
                .date(f.getDateFacture().toInstant()
                        .atZone(ZoneId.systemDefault())
                        .toLocalDateTime()
                        .format(formatter))
                .nomEtablissement(e.getNomEtablissement() != null ? e.getNomEtablissement() : "—")
                .email(e.getEmail() != null ? e.getEmail() : "—")
                .gouvernorat(e.getRegion() != null ? e.getRegion() : "—")
                .type(e.getType() != null ? e.getType().name() : "—")
                .statut(f.getStatutFacture() != null ? f.getStatutFacture().name() : "EN_ATTENTE")
                .build();
    }



 /*   private double calculerMontantSelonFormule(FormuleAbonnement formule) {
        switch (formule) {
            case ESSAI_14_JOURS:
                return 0.0;
            case STANDARD_MENSUEL:
                return 30.0;
            case STANDARD_ANNUEL:
                return 30.0 * 12 ;
            case PREMIUM_MENSUEL:
                return 60.0;
            case PREMIUM_ANNUEL:
                return 60.0 * 12 ;
            default:
                throw new IllegalArgumentException("Formule inconnue : " + formule);
        }
    }*/
    private String genererReferenceFacture() {
        LocalDateTime now = LocalDateTime.now();
        long compteur = factureRepository.count() + 1;
        return String.format("FAC-%d-%02d-%03d", now.getYear(), now.getMonthValue(), compteur);
    }
}

