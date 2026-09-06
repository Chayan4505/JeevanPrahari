package com.jeevenprahari;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@EnableAsync
public class JeevanPrahariApplication {

    public static void main(String[] args) {
        System.out.println("==================================================================");
        System.out.println("  JeevanPrahari - Landslide Early Warning");
        System.out.println("  Regional Disaster Management & Decision Support Platform");
        System.out.println("==================================================================");
        SpringApplication.run(JeevanPrahariApplication.class, args);
    }
}
