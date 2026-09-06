package com.pahaarsaathi.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI pahaarSaathiOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("PahaarSaathi API")
                        .description("Landslide Early Warning & Risk Monitoring Platform for North East India (NER). " +
                                "Integrates static geomorphological susceptibility, dynamic rainfall triggers, " +
                                "OASIS CAP 1.2 XML alert generation, and citizen crowd-sourced incident reporting.")
                        .version("1.2.0")
                        .contact(new Contact()
                                .name("PahaarSaathi Disaster Management Cell")
                                .email("contact@pahaarsaathi.ner.gov.in"))
                        .license(new License().name("Open Government Data License - India")))
                .addSecurityItem(new SecurityRequirement().addList("Bearer Authentication"))
                .schemaRequirement("Bearer Authentication", new SecurityScheme()
                        .name("Bearer Authentication")
                        .type(SecurityScheme.Type.HTTP)
                        .scheme("bearer")
                        .bearerFormat("JWT"));
    }
}
