// package tn.kidora.spring.kidorabackoffice.config;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.security.authentication.AuthenticationManager;
// import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
// import org.springframework.security.config.annotation.web.builders.HttpSecurity;
// import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
// import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
// import org.springframework.security.crypto.password.PasswordEncoder;
// import org.springframework.security.web.SecurityFilterChain;
// import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
// import lombok.AllArgsConstructor;
// import tn.kidora.spring.kidorabackoffice.services.serviceImpl.CustomUserDetailsService;
// import tn.kidora.spring.kidorabackoffice.utils.Constants;
// @Configuration
// @EnableWebSecurity
// @AllArgsConstructor
// public class SecurityConfig {
//     private final CustomUserDetailsService customUserDetailsService;
//     private final JwtUtils jwtUtils;    
//     @Bean
//     public PasswordEncoder passwordEncoder() {
//         return new BCryptPasswordEncoder();
//     }
//     @Bean 
//     public AuthenticationManager authenticationManager(HttpSecurity http, PasswordEncoder passwordEncoder) throws Exception {
//         AuthenticationManagerBuilder authenticationManagerBuilder =http.getSharedObject(AuthenticationManagerBuilder.class);
//         authenticationManagerBuilder.userDetailsService(customUserDetailsService).passwordEncoder(passwordEncoder);
//         return authenticationManagerBuilder.build();
//     }
//     @Bean
//     public SecurityFilterChain securityFilterChain(HttpSecurity http)  throws Exception {
//         return http
//                .csrf(AbstractHttpConfigurer::disable)
//                .authorizeHttpRequests(auth ->
//                auth.requestMatchers(Constants.APP_ROOT+Constants.AUTH+Constants.LOGIN,
//                Constants.APP_ROOT+Constants.ETABLISSEMENT+"/create-test-etablissement",
//                 Constants.APP_ROOT+Constants.ABONNEMENT+"/create-test-abonnement",
//                  Constants.APP_ROOT+Constants.EVENEMENT+"/create-test-evenement"
//                ).permitAll()
//                                .requestMatchers(Constants.APP_ROOT+Constants.ETABLISSEMENT+Constants.SAVE,
//                                                 Constants.APP_ROOT+Constants.ETABLISSEMENT+Constants.UPDATE,
//                                                 Constants.APP_ROOT+Constants.ETABLISSEMENT+Constants.DELETE,
//                                                 Constants.APP_ROOT+Constants.TOOGLE_STATUS).hasAnyRole("ADMIN_GENERAL","SUPER_ADMIN")
//                               .requestMatchers(Constants.APP_ROOT+Constants.AUTH+Constants.REGISTER).hasRole("SUPER_ADMIN")
//                               .anyRequest().authenticated())
//              .addFilterBefore(new JwtFilter(customUserDetailsService, jwtUtils), UsernamePasswordAuthenticationFilter.class)
//              .build();
//     }
//     }
package tn.kidora.spring.kidorabackoffice.config;

import java.util.List;

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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import lombok.AllArgsConstructor;
import tn.kidora.spring.kidorabackoffice.services.serviceImpl.CustomUserDetailsService;
import tn.kidora.spring.kidorabackoffice.utils.Constants;
// /----------------------------------------------------

@Configuration
@EnableWebSecurity
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
        AuthenticationManagerBuilder authenticationManagerBuilder = http.getSharedObject(AuthenticationManagerBuilder.class);
        authenticationManagerBuilder.userDetailsService(customUserDetailsService).passwordEncoder(passwordEncoder);
        return authenticationManagerBuilder.build();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Enable CORS with custom configuration
                .authorizeHttpRequests(auth
                        // Public endpoints
                        -> auth.requestMatchers("/api/auth/login").permitAll()
                        .requestMatchers("/api/auth/forgot-password").permitAll()
                        .requestMatchers("/api/auth/verify-otp").permitAll()
                        .requestMatchers("/api/auth/reset-password").permitAll()
                        .requestMatchers("/uploads/**").permitAll()
                        .requestMatchers("/api/auth/update-profile/**").permitAll()


                        
                        // Only SUPER_ADMIN can access 
                        .requestMatchers("/api/auth/all").hasRole("SUPER_ADMIN")
                        .requestMatchers("/api/auth/delete-user/**").hasRole("SUPER_ADMIN")
                        .requestMatchers("/api/auth/roles").hasRole("SUPER_ADMIN")
                        .requestMatchers("/api/auth/update/**").hasRole("SUPER_ADMIN")
                        



                        // ETABLISSEMENT management endpoints
                        .requestMatchers(Constants.APP_ROOT + Constants.ETABLISSEMENT + Constants.ALL)
                        .hasRole("SUPER_ADMIN")
                        .requestMatchers(Constants.APP_ROOT + Constants.ETABLISSEMENT + Constants.SAVE,
                                Constants.APP_ROOT + Constants.ETABLISSEMENT + Constants.UPDATE,
                                Constants.APP_ROOT + Constants.ETABLISSEMENT + Constants.DELETE,
                                Constants.APP_ROOT + Constants.TOOGLE_STATUS).hasAnyRole("ADMIN_GENERAL", "SUPER_ADMIN")
                        .requestMatchers(Constants.APP_ROOT + Constants.AUTH + Constants.REGISTER).hasRole("SUPER_ADMIN")
                        .anyRequest().authenticated())
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                // .addFilterBefore(new JwtFilter(customUserDetailsService, jwtUtils), UsernamePasswordAuthenticationFilter.class)
                .build();

    }

    // Simple CORS configuration allowing only React dev server
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

}
