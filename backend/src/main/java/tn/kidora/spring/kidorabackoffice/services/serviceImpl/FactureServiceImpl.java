package tn.kidora.spring.kidorabackoffice.services.serviceImpl;

import lombok.AllArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import tn.kidora.spring.kidorabackoffice.dto.FactureRequestDTO;
import tn.kidora.spring.kidorabackoffice.dto.FactureResponseDto;
import tn.kidora.spring.kidorabackoffice.entities.*;
import tn.kidora.spring.kidorabackoffice.repositories.AbonnementRepository;
import tn.kidora.spring.kidorabackoffice.repositories.Client.EnfantRepository;
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
    private final  Etablissement_Repository etablissementRepository;
    private final EnfantRepository enfantRepository;
    private  final EmailService emailService;


    @Override
    public Facture creerFacture(FactureRequestDTO dto) {
        Etablissement etablissement = etablissementRepository.findById(dto.getEtablissementId())
                .orElseThrow(() -> new RuntimeException("Établissement non trouvé"));
        long nombreEnfants = enfantRepository.countByIdEtablissement(
                new ObjectId(etablissement.getIdEtablissment())
        );
        // Calcul du montant
        double montantBase = nombreEnfants * 15.0;   // 15 DT par enfant
        double montantAvecTVA = montantBase * 1.19;  // TVA 19%
        double montantTotal = montantAvecTVA + 1.0; // +1 DT timbre
        Facture facture = new Facture();
      //facture.setAbonnement(abonnement);
      //  facture.setMontant(montant);
        facture.setEtablissement(etablissement);
        facture.setDateFacture(new Date());
        facture.setMethode(dto.getMethode());
        facture.setReference(genererReferenceFacture());
        facture.setStatutFacture(dto.getStatutFacture());
        facture.setMontant(montantTotal);

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

    @Override
    public void envoyerFactureDepuisFront(String idFacture, MultipartFile file) {
        Facture facture = factureRepository.findById(idFacture)
                .orElseThrow(() -> new RuntimeException("Facture introuvable"));

        Etablissement etab = facture.getEtablissement();
        if (etab == null || etab.getEmail() == null) {
            throw new RuntimeException("Établissement ou email non défini pour cette facture");
        }

        try {
            byte[] pdfBytes = file.getBytes();

            String subject = "Votre facture Kidora #" + facture.getReference();
            String body = "Bonjour " + etab.getNomEtablissement() + ",\n\n" +
                    "Veuillez trouver ci-joint votre facture générée depuis l'application Kidora.\n\n" +
                    "Cordialement,\nL’équipe Kidora.";

            emailService.sendEmailWithAttachment(
                    etab.getEmail(),
                    subject,
                    body,
                    pdfBytes,
                    file.getOriginalFilename() != null ? file.getOriginalFilename() : "Facture_" + facture.getReference() + ".pdf"
            );

            System.out.println("✅ Facture PDF reçue du front et envoyée à : " + etab.getEmail());

        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de l'envoi de la facture : " + e.getMessage());
        }
    }

    private String genererReferenceFacture() {
        LocalDateTime now = LocalDateTime.now();
        long compteur = factureRepository.count() + 1;
        return String.format("FAC-%d-%02d-%03d", now.getYear(), now.getMonthValue(), compteur);
    }

}

