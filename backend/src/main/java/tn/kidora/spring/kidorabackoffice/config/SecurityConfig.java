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
//                auth.requestMatchers(Constants.APP_ROOT+Constants.AUTH+Constants.LOGIN).permitAll()
//                        .requestMatchers(
//                                Constants.APP_ROOT + Constants.ABONNEMENT +"/**"
//                        ).authenticated()
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
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.CorsConfigurationSource;

import lombok.AllArgsConstructor;
import tn.kidora.spring.kidorabackoffice.services.serviceImpl.CustomUserDetailsService;
import tn.kidora.spring.kidorabackoffice.utils.Constants;

<<<<<<< Updated upstream
import java.util.List;

=======
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
                .cors() // <-- enable CORS support
                .and()
                .authorizeHttpRequests(auth
                        -> auth.requestMatchers(Constants.APP_ROOT + Constants.AUTH + Constants.LOGIN).permitAll()
                        .requestMatchers(Constants.APP_ROOT + Constants.ABONNEMENT + "/**").authenticated()
                        .requestMatchers(
                                Constants.APP_ROOT + Constants.ETABLISSEMENT + Constants.SAVE,
=======
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Enable CORS with custom configuration
                .authorizeHttpRequests(auth

                          // Public endpoints
                        -> auth.requestMatchers("/api/auth/login").permitAll()
                        .requestMatchers("/api/auth/forgot-password").permitAll()
                        .requestMatchers("/api/auth/verify-otp").permitAll()
                        .requestMatchers("/api/auth/reset-password").permitAll()
                        .requestMatchers("/api/auth/update-profile/**").permitAll()

                           // Only SUPER_ADMIN can access 
                         .requestMatchers("/api/auth/all").hasRole("SUPER_ADMIN")
                         .requestMatchers("/api/auth/delete-user/**").hasRole("SUPER_ADMIN")
                         

                        .requestMatchers(Constants.APP_ROOT + Constants.ETABLISSEMENT + Constants.SAVE,
>>>>>>> Stashed changes
                                Constants.APP_ROOT + Constants.ETABLISSEMENT + Constants.UPDATE,
                                Constants.APP_ROOT + Constants.ETABLISSEMENT + Constants.DELETE,
                                Constants.APP_ROOT + Constants.TOOGLE_STATUS
                        ).hasAnyRole("ADMIN_GENERAL", "SUPER_ADMIN")
                        .requestMatchers(Constants.APP_ROOT + Constants.AUTH + Constants.REGISTER).hasRole("SUPER_ADMIN")
<<<<<<< Updated upstream
                        .anyRequest().authenticated()
                )
                .addFilterBefore(new JwtFilter(customUserDetailsService, jwtUtils), UsernamePasswordAuthenticationFilter.class)
=======
                        .anyRequest().authenticated())
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                // .addFilterBefore(new JwtFilter(customUserDetailsService, jwtUtils), UsernamePasswordAuthenticationFilter.class)
>>>>>>> Stashed changes
                .build();
    }

    // Simple CORS configuration allowing only React dev server
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000")); // <-- allow React dev server
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedOrigins(List.of("http://localhost:3000"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));

        configuration.setAllowCredentials(true); // <-- allow sending cookies/auth headers if needed
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

}
