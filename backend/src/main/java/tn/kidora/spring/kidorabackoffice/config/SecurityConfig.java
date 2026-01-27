package tn.kidora.spring.kidorabackoffice.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
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
import tn.kidora.spring.kidorabackoffice.utils.Constants;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import tn.kidora.spring.kidorabackoffice.services.serviceImpl.CustomUserDetailsService;
import tn.kidora.spring.kidorabackoffice.config.JwtFilter;
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@AllArgsConstructor
public class SecurityConfig {
    private final CustomUserDetailsService customUserDetailsService;
    private final JwtUtils jwtUtils; 
    private final JwtFilter jwtFilter;   
    

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean 
    public AuthenticationManager authenticationManager(HttpSecurity http, PasswordEncoder passwordEncoder) throws Exception {
        AuthenticationManagerBuilder authenticationManagerBuilder =http.getSharedObject(AuthenticationManagerBuilder.class);
        authenticationManagerBuilder.userDetailsService(customUserDetailsService).passwordEncoder(passwordEncoder);
        return authenticationManagerBuilder.build();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)  throws Exception {
        return http
               .csrf(AbstractHttpConfigurer::disable)
               .cors(cors -> cors.configurationSource(corsConfigurationSource()))
               .authorizeHttpRequests(auth ->
               auth
                       .requestMatchers(Constants.APP_ROOT + Constants.CLIENT + Constants.CLIENT_REGISTER,
                               Constants.APP_ROOT + Constants.CLIENT + Constants.CLIENT_LOGIN,
                               Constants.APP_ROOT+Constants.AUTH+Constants.LOGIN,
               Constants.APP_ROOT+Constants.ETABLISSEMENT+"/create-test-etablissement",
                Constants.APP_ROOT+Constants.ABONNEMENT+"/create-test-abonnement",
                Constants.APP_ROOT+Constants.EVENEMENT+"/create-test-evenement",
                Constants.APP_ROOT + Constants.ABONNEMENT+"/repartition-annuelle"
               ).permitAll()
               
               // ✅ RENDRE PUBLICS les endpoints Analytics pour le front (3000) → backend (8086)
                .requestMatchers("/api/analytics/**").permitAll()
                .requestMatchers("/api/enfants/count").permitAll()
                .requestMatchers("/api/client/parents/total").permitAll()
                  .requestMatchers("/uploads/**").permitAll()
                  .requestMatchers(
                     "/api/auth/forgot-password",
                    "/api/auth/verify-otp",
                    "/api/auth/reset-password"
                   ).permitAll() // 🔓 Autoriser ces routes sans token

     


                   
                               .requestMatchers(Constants.APP_ROOT+Constants.ETABLISSEMENT+Constants.SAVE,
                                                Constants.APP_ROOT + Constants.ETABLISSEMENT + Constants.UPDATE + "/**",
                                                Constants.APP_ROOT+Constants.ETABLISSEMENT+Constants.DELETE,
                                                Constants.APP_ROOT+Constants.TOOGLE_STATUS
                                                ).hasAnyRole("ADMIN_GENERAL","SUPER_ADMIN")

                                                
                             


                               
                              .requestMatchers(Constants.APP_ROOT + Constants.CLIENT + Constants.DELETE_CLIENT + "/**")
                               .hasAnyRole("SUPER_ADMIN", "ADMIN_GENERAL")

                             .requestMatchers(Constants.APP_ROOT + Constants.CLIENT + Constants.update_CLIENT + "/**")
                             .hasAnyRole("SUPER_ADMIN", "ADMIN_GENERAL")
  
                              .requestMatchers(Constants.APP_ROOT+Constants.AUTH+Constants.REGISTER).hasRole("SUPER_ADMIN")
                              .requestMatchers(Constants.APP_ROOT + Constants.AUTH + Constants.UPDATE + Constants.ID).hasRole("SUPER_ADMIN")
                              .requestMatchers(Constants.APP_ROOT + Constants.AUTH + Constants.DELETE_USER).hasRole("SUPER_ADMIN")




                              .requestMatchers(
                           // Exemple d'endpoints réservés à l'ADMIN
                                    // Constants.APP_ROOT + Constants.CLIENT + Constants.REGISTER,
                                    Constants.APP_ROOT + Constants.CLIENT + Constants.ALL_CLIENTS, 
                                    Constants.APP_ROOT + Constants.CLIENT + Constants.DELETE_CLIENT+"/*",
                                    Constants.APP_ROOT + Constants.CLIENT + Constants.update_CLIENT+"/*",
                                    Constants.APP_ROOT + Constants.CLIENT + Constants.ALL_PARENTS,
                                    Constants.APP_ROOT + Constants.CLIENT + Constants.ALL_EDUCATEURS,
                                    Constants.APP_ROOT + Constants.CLIENT + Constants.ID,
                                    Constants.APP_ROOT + Constants.CLIENT + Constants.GET_ANFANT_BYID_PARENT+"/*",
                                    "/api/enfants/**"

                                    ).hasRole("SUPER_ADMIN")
                              .anyRequest().authenticated())
                     
                     
             //.addFilterBefore(new JwtFilter(customUserDetailsService, jwtUtils), UsernamePasswordAuthenticationFilter.class)
               .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
             .build();
               
    }

     @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000"));
        configuration.setAllowedMethods(List.of("*"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
    }

    

