package tn.kidora.spring.kidorabackoffice.IAService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {
    @Autowired
    private AnalyticsIntegrationService analyticsService;

    @GetMapping("/dashboard")
    public Mono<ResponseEntity<Map>> getDashboardStats() {
        return analyticsService.getDashboardStats()
                .map(ResponseEntity::ok)
                .onErrorResume(e -> Mono.just(
                        ResponseEntity.internalServerError()
                                .body(Map.of("error", e.getMessage()))
                ));
    }
}
