package tn.kidora.spring.kidorabackoffice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.beans.factory.annotation.Value;

import tn.kidora.spring.kidorabackoffice.services.serviceImpl.CustomUserDetailsService;
import tn.kidora.spring.kidorabackoffice.config.JwtFilter;
import tn.kidora.spring.kidorabackoffice.utils.Constants;


import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.List;


@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final CustomUserDetailsService customUserDetailsService;
    private final JwtUtils jwtUtils;

    @Value("${app.security.disabled:false}")
    private boolean securityDisabled;

    // ✅ Constructeur explicite sans injection du boolean
    public SecurityConfig(CustomUserDetailsService customUserDetailsService, JwtUtils jwtUtils) {
        this.customUserDetailsService = customUserDetailsService;
        this.jwtUtils = jwtUtils;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http, PasswordEncoder passwordEncoder) throws Exception {
        AuthenticationManagerBuilder authenticationManagerBuilder = http.getSharedObject(AuthenticationManagerBuilder.class);
        authenticationManagerBuilder.userDetailsService(customUserDetailsService).passwordEncoder(passwordEncoder);
        return authenticationManagerBuilder.build();
    }

    @Bean
   public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000")); // frontend URL
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }


    @Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .csrf(csrf -> csrf.disable())         
        .cors(cors -> {})                   

        .authorizeHttpRequests(auth -> {
            if (securityDisabled) {
                // Mode développement : tout est accessible
                auth.anyRequest().permitAll();
            } else {
                // Mode production : sécurité activée
                auth
                    .requestMatchers(Constants.APP_ROOT + Constants.AUTH + Constants.LOGIN,
                                     Constants.APP_ROOT + Constants.AUTH + Constants.REGISTER).permitAll()
                    .requestMatchers(Constants.APP_ROOT + Constants.ABONNEMENT + "/**").authenticated()
                    .requestMatchers(Constants.APP_ROOT + Constants.ETABLISSEMENT + Constants.SAVE,
                                     Constants.APP_ROOT + Constants.ETABLISSEMENT + Constants.UPDATE,
                                     Constants.APP_ROOT + Constants.ETABLISSEMENT + Constants.DELETE,
                                     Constants.APP_ROOT + Constants.TOOGLE_STATUS).hasRole("ADMIN_GENERAL")
                    .requestMatchers(Constants.APP_ROOT + Constants.ADMIN_GENERAL).hasRole("ADMIN_GENERAL")
                    .anyRequest().authenticated();
            }
        })
        .addFilterBefore(new JwtFilter(customUserDetailsService, jwtUtils),
                         UsernamePasswordAuthenticationFilter.class);

    return http.build();
}

}
