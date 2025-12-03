package tn.kidora.spring.kidorabackoffice.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import tn.kidora.spring.kidorabackoffice.services.serviceImpl.CustomUserDetailsService;
import tn.kidora.spring.kidorabackoffice.utils.Constants;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

  private final CustomUserDetailsService customUserDetailsService;
  private final JwtUtils jwtUtils;

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)  throws Exception {
        return http
               .csrf(AbstractHttpConfigurer::disable)
               .authorizeHttpRequests(auth ->
               auth.requestMatchers(Constants.APP_ROOT+Constants.AUTH+Constants.LOGIN).permitAll()
                       .requestMatchers(
                               Constants.APP_ROOT + Constants.ABONNEMENT +"/**"
                       ).authenticated()
                               .requestMatchers(Constants.APP_ROOT+Constants.ETABLISSEMENT+Constants.SAVE,
                                                Constants.APP_ROOT+Constants.ETABLISSEMENT+Constants.UPDATE,
                                                Constants.APP_ROOT+Constants.ETABLISSEMENT+Constants.DELETE,
                                                Constants.APP_ROOT+Constants.TOOGLE_STATUS).hasAnyRole("ADMIN_GENERAL","SUPER_ADMIN")
  
                              .requestMatchers(Constants.APP_ROOT+Constants.AUTH+Constants.REGISTER).hasRole("SUPER_ADMIN")
                              .anyRequest().authenticated())
                     
                     
             .addFilterBefore(new JwtFilter(customUserDetailsService, jwtUtils), UsernamePasswordAuthenticationFilter.class)
             .build();
               
    }
    }

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .cors(c -> {})   
        .csrf(AbstractHttpConfigurer::disable)
        .cors(c -> c.configurationSource(corsConfigurationSource()))
        .authorizeHttpRequests(auth -> auth

            // --- PUBLIC ------------------------------------------------------
            .requestMatchers(
                Constants.APP_ROOT + Constants.AUTH + Constants.LOGIN,
                Constants.APP_ROOT + Constants.AUTH + Constants.REGISTER
            ).permitAll()

            // Autoriser les GET publics sur /api/etablissement/**
            // TEMPORAIRE pour tester (pas pour la prod)
.requestMatchers(HttpMethod.POST, Constants.APP_ROOT + Constants.ETABLISSEMENT + Constants.SAVE)
    .permitAll()


            // --- PROTÉGÉ -----------------------------------------------------
            // Ecriture/maj/suppression/toggle => ADMIN_GENERAL
            .requestMatchers(
                Constants.APP_ROOT + Constants.ETABLISSEMENT + Constants.SAVE,
                Constants.APP_ROOT + Constants.ETABLISSEMENT + Constants.UPDATE + "/**",
                Constants.APP_ROOT + Constants.ETABLISSEMENT + Constants.DELETE + "/**",
                // NB: le toggle est bien sous /etablissement/toggle_status/**
                Constants.APP_ROOT + Constants.ETABLISSEMENT + Constants.TOOGLE_STATUS + "/**"
            ).hasRole("ADMIN_GENERAL")

            // si tu as d'autres routes d’admin :
            //.requestMatchers(Constants.APP_ROOT + Constants.ADMIN_GENERAL + "/**").hasRole("ADMIN_GENERAL")
            .requestMatchers(Constants.APP_ROOT + Constants.ETABLISSEMENT + "/**").permitAll()


            // tout le reste nécessite d'être authentifié
            .anyRequest().authenticated()
        )
        // insère ton filtre JWT
        .addFilterBefore(new JwtFilter(customUserDetailsService, jwtUtils),
            UsernamePasswordAuthenticationFilter.class);

    return http.build();
  }

  // CORS pour que le front (http://localhost:3000) puisse appeler l’API
  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration cfg = new CorsConfiguration();
    // En dev : on peut tout autoriser. En prod, restreins à tes domaines.
    cfg.setAllowedOriginPatterns(List.of("*"));
    cfg.setAllowedMethods(List.of("GET","POST","PUT","PATCH","DELETE","OPTIONS"));
    cfg.setAllowedHeaders(List.of("*"));
    cfg.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", cfg);
    return source;
  }
}
