package tn.kidora.spring.kidorabackoffice.services.serviceImpl;

import lombok.AllArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

import tn.kidora.spring.kidorabackoffice.dto.FactureDetailResponseDto;
import tn.kidora.spring.kidorabackoffice.dto.FactureRequestDTO;
import tn.kidora.spring.kidorabackoffice.dto.FactureResponseDto;
import tn.kidora.spring.kidorabackoffice.entities.*;
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
    private final Etablissement_Repository etablissementRepository;
    private final EnfantRepository enfantRepository;

    /* ======================= CREATION FACTURE ======================= */

    @Override
    public Facture creerFacture(FactureRequestDTO dto) {

        Etablissement etablissement = etablissementRepository.findById(dto.getEtablissementId())
                .orElseThrow(() -> new RuntimeException("Établissement non trouvé"));

        long nombreEnfants = enfantRepository.countByIdEtablissement(
                new ObjectId(etablissement.getIdEtablissment())
        );

        // 💰 Calcul métier
        double montantHT = nombreEnfants * 15.0;
        double montantTVA = montantHT * 0.19;
        double timbre = 1.0;
        double montantTTC = montantHT + montantTVA + timbre;

        Facture facture = new Facture();
        facture.setEtablissement(etablissement);
        facture.setDateFacture(new Date());
        facture.setMethode(dto.getMethode());
        facture.setReference(genererReferenceFacture());
        facture.setStatutFacture(dto.getStatutFacture());

        // 👉 on stocke uniquement le TTC
        facture.setMontant(montantTTC);

        return factureRepository.save(facture);
    }

    /* ======================= STATS ======================= */

    @Override
    public long totalFactures() {
        return factureRepository.count();
    }

    @Override
    public long totalFacturesPayees() {
        return factureRepository.countByStatutFacture(StatutFacture.PAYEE);
    }

    @Override
    public long totalFacturesImpaye() {
        return factureRepository.countByStatutFacture(StatutFacture.IMPAYEE);
    }

    /* ======================= LISTE FACTURES ======================= */

   @Override
public List<FactureResponseDto> getAllFactures() {

    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("d MMM yyyy, HH:mm");

    return factureRepository.findAll().stream()
        .filter(f -> f.getEtablissement() != null)
        .map(f -> {

            Etablissement e = f.getEtablissement();

            int nombreEnfants = enfantRepository
                .countByIdEtablissement(new ObjectId(e.getIdEtablissment()))
                .intValue();

            double montantHT = nombreEnfants * 15.0;
            double montantTVA = montantHT * 0.19;
            double timbre = 1.0;
            double montantTTC = montantHT + montantTVA + timbre;

            return FactureResponseDto.builder()
                .idFacture("#" + f.getReference())
                .date(
                    f.getDateFacture() != null
                        ? f.getDateFacture().toInstant()
                            .atZone(ZoneId.systemDefault())
                            .toLocalDateTime()
                            .format(formatter)
                        : "—"
                )
                .nomEtablissement(e.getNomEtablissement())
                .type(e.getType().name())
                .gouvernorat(e.getRegion())
                .email(e.getEmail())
                 .telephone(e.getTelephone())

                // 💰 FINANCIER COMPLET
                .montantHT(montantHT)
                .montantTVA(montantTVA)
                .timbreFiscal(timbre)
                .montantTTC(montantTTC)
                .nombreEnfants(nombreEnfants)
                .methode(f.getMethode().name())

                .statut(f.getStatutFacture().name())
                .build();
        })
        .collect(Collectors.toList());
}

    /* ======================= DETAIL FACTURE ======================= */

    @Override
    public FactureDetailResponseDto getFactureById(String id) {

        Facture f = factureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Facture introuvable"));

        Etablissement e = f.getEtablissement();
        if (e == null) {
            throw new RuntimeException("Aucun établissement lié à cette facture");
        }

        int nombreEnfants = enfantRepository.countByIdEtablissement(
                new ObjectId(e.getIdEtablissment())
        ).intValue();

        double montantHT = nombreEnfants * 15.0;
        double montantTVA = montantHT * 0.19;
        double timbre = 1.0;
        double montantTTC = montantHT + montantTVA + timbre;

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("d MMM yyyy, HH:mm");

        return FactureDetailResponseDto.builder()
                .idFacture("#" + f.getReference())
                .date(
                    f.getDateFacture().toInstant()
                        .atZone(ZoneId.systemDefault())
                        .toLocalDateTime()
                        .format(formatter)
                )
                .nomEtablissement(e.getNomEtablissement())
                .type(e.getType().name())
                .gouvernorat(e.getRegion())
                .email(e.getEmail())
                .telephone(e.getTelephone())

                // 💰 FINANCIER
                .montantHT(montantHT)
                .montantTVA(montantTVA)
                .timbreFiscal(timbre)
                .montantTTC(montantTTC)
                 .methode(f.getMethode().name())
                .nombreEnfants(nombreEnfants)
                .statut(f.getStatutFacture().name())
                .build();
    }

    /* ======================= UTIL ======================= */

    private String genererReferenceFacture() {
        LocalDateTime now = LocalDateTime.now();
        long compteur = factureRepository.count() + 1;
        return String.format("FAC-%d-%02d-%03d",
                now.getYear(),
                now.getMonthValue(),
                compteur
        );
    }
}
