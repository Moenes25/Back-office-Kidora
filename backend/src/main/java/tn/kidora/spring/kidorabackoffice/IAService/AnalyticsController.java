package tn.kidora.spring.kidorabackoffice.IAService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;
import tn.kidora.spring.kidorabackoffice.utils.Constants;

import java.util.Map;

@RestController
@RequestMapping(Constants.APP_ROOT + Constants.ANALYTICS)
public class AnalyticsController {
    @Autowired
    private AnalyticsIntegrationService analyticsService;

    @GetMapping(Constants.ANALYTICS_DASHBOARD)
    public Mono<ResponseEntity<Map>> getDashboardStats() {
        return analyticsService.getDashboardStats()
                .map(ResponseEntity::ok)
                .onErrorResume(e -> Mono.just(
                        ResponseEntity.internalServerError()
                                .body(Map.of("error", e.getMessage()))
                ));
    }
    @GetMapping(Constants.ANALYTICS_ETABS_AVEC_ABON)
    public Mono<ResponseEntity<Map>> getAvecAbonnement() {
        return analyticsService.getEtablissementsAvecAbonnement()
                .map(ResponseEntity::ok)
                .onErrorResume(e -> Mono.just(ResponseEntity.internalServerError()
                        .body(Map.of("error", e.getMessage()))));
    }
    @GetMapping(Constants.ANALYTICS_ETABS_SANS_ABON)
    public Mono<ResponseEntity<Map>> getSansAbonnement() {
        return analyticsService.getEtablissementsSansAbonnement()
                .map(ResponseEntity::ok)
                .onErrorResume(e -> Mono.just(ResponseEntity.internalServerError()
                        .body(Map.of("error", e.getMessage()))));
    }
    @GetMapping(Constants.ANALYTICS_REPARTITION_TYPE)
    public Mono<ResponseEntity<Object>> getRepartitionType() {
        return analyticsService.getRepartitionParType()
                .map(ResponseEntity::ok)
                .onErrorResume(e -> Mono.just(
                        ResponseEntity.internalServerError()
                                .body(Map.of("error", e.getMessage()))
                ));
    }
    @GetMapping(Constants.ANALYTICS_REPARTITION_STATUT)
    public Mono<ResponseEntity<Object>> getRepartitionStatut() {
        return analyticsService.getRepartitionParStatut()
                .map(ResponseEntity::ok)
                .onErrorResume(e -> Mono.just(ResponseEntity.internalServerError()
                        .body(Map.of("error", e.getMessage()))));
    }
    @GetMapping(Constants.ANALYTICS_EVOLUTION_MENSUELLE)
    public Mono<ResponseEntity<Object>> getEvolutionMensuelle() {
        return analyticsService.getEvolutionMensuelle()
                .map(ResponseEntity::ok)
                .onErrorResume(e -> Mono.just(ResponseEntity.internalServerError()
                        .body(Map.of("error", e.getMessage()))));
    }








}
