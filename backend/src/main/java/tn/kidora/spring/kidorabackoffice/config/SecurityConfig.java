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
import tn.kidora.spring.kidorabackoffice.utils.Constants;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import tn.kidora.spring.kidorabackoffice.services.serviceImpl.CustomUserDetailsService;
import tn.kidora.spring.kidorabackoffice.config.JwtFilter;
@Configuration
@EnableWebSecurity
@AllArgsConstructor
public class SecurityConfig {
    private final CustomUserDetailsService customUserDetailsService;
    private final JwtUtils jwtUtils;    
    

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
               .authorizeHttpRequests(auth ->
               auth.requestMatchers(Constants.APP_ROOT+Constants.AUTH+Constants.LOGIN,Constants.APP_ROOT+Constants.AUTH+Constants.REGISTER,
                               Constants.APP_ROOT +Constants.ETABLISSEMENT + "/**").permitAll()
                              .requestMatchers(Constants.APP_ROOT+Constants.ADMIN_GENERAL).hasRole("ADMIN_GENERAL")
                              .anyRequest().authenticated())
                     
                     
             .addFilterBefore(new JwtFilter(customUserDetailsService, jwtUtils), UsernamePasswordAuthenticationFilter.class)
             .build();
               
    }
    }

    

