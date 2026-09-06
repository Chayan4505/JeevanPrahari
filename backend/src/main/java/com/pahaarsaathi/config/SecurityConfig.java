package com.pahaarsaathi.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationEntryPoint unauthorizedHandler;

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(Customizer.withDefaults())
            .csrf(AbstractHttpConfigurer::disable)
            .exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Static assets, OpenAPI docs & health
                .requestMatchers("/", "/index.html", "/favicon.ico", "/static/**").permitAll()
                .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                .requestMatchers("/actuator/**").permitAll()

                // Public Authentication and Demo endpoints
                .requestMatchers("/api/auth/**").permitAll()

                // Public GIS and Read-only Information endpoints
                .requestMatchers(HttpMethod.GET, "/api/risk/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/risk/recompute/**").permitAll() // Allow public risk recomputation
                .requestMatchers(HttpMethod.GET, "/api/weather/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/dashboard/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/alerts/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/reports/**").permitAll()

                // Citizen and Field Officer incident reporting
                .requestMatchers(HttpMethod.POST, "/api/reports").permitAll() // Allowed for anonymous citizens with optional auth
                .requestMatchers(HttpMethod.POST, "/api/reports/upload-media").permitAll()

                // Admin & Officer protected actions
                .requestMatchers(HttpMethod.PUT, "/api/reports/*/verify").hasAnyRole("FIELD_OFFICER", "DISTRICT_ADMIN", "SUPER_ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/alerts/dispatch").hasAnyRole("DISTRICT_ADMIN", "SUPER_ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/admin/seed-reports").permitAll() // Public demo endpoint
                .requestMatchers("/api/admin/**").hasAnyRole("DISTRICT_ADMIN", "SUPER_ADMIN")

                // Any other request requires authentication
                .anyRequest().authenticated()
            );

        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
