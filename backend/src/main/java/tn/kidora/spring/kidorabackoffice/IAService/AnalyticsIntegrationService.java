package tn.kidora.spring.kidorabackoffice.IAService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Map;

@Service
public class AnalyticsIntegrationService {
    @Autowired
    private WebClient webClient;
    public Mono<Map> getDashboardStats() {
        return webClient.get()
                .uri("/api/dashboard/stats")
                .retrieve()
                .bodyToMono(Map.class); }

}
