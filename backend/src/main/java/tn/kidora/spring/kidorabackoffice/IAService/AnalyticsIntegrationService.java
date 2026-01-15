package tn.kidora.spring.kidorabackoffice.IAService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

@Service
public class AnalyticsIntegrationService {
    @Autowired
    private WebClient webClient;
    public Mono<Map> getDashboardStats() {
        return webClient.get()
                .uri("/api/dashboard/stats")
                .retrieve()
                .bodyToMono(Map.class);
    }
    public Mono<Map> getEtablissementsAvecAbonnement() {
        return webClient.get()
                .uri("/api/etablissements/avec-abonnement")
                .retrieve()
                .bodyToMono(Map.class);
    }
    public Mono<Map> getEtablissementsSansAbonnement() {
        return webClient.get()
                .uri("/api/etablissements/sans-abonnement")
                .retrieve()
                .bodyToMono(Map.class);
    }

    public Mono<Object> getRepartitionParType() {
        return webClient.get()
                .uri("/api/statistiques/repartition-type")
                .retrieve()
                .bodyToMono(Object.class);
    }
    public Mono<Object> getRepartitionParStatut() {
        return webClient.get()
                .uri("/api/statistiques/repartition-statut-abonnement")
                .retrieve()
                .bodyToMono(Object.class);
    }
    public Mono<Object> getEvolutionMensuelle() {
        return webClient.get()
                .uri("/api/statistiques/evolution-mensuelle")
                .retrieve()
                .bodyToMono(Object.class);
    }


}
