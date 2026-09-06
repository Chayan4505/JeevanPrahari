package com.pahaarsaathi.config;

import io.minio.BucketExistsArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MinioConfig {

    @Value("${pahaarsaathi.storage.minio.endpoint:http://localhost:9000}")
    private String endpoint;

    @Value("${pahaarsaathi.storage.minio.access-key:minioadmin}")
    private String accessKey;

    @Value("${pahaarsaathi.storage.minio.secret-key:minioadmin}")
    private String secretKey;

    @Value("${pahaarsaathi.storage.minio.bucket-name:pahaarsaathi-reports}")
    private String bucketName;

    @Bean
    public MinioClient minioClient() {
        try {
            MinioClient client = MinioClient.builder()
                    .endpoint(endpoint)
                    .credentials(accessKey, secretKey)
                    .build();

            // Check if bucket exists, or auto-create in local dev
            boolean found = client.bucketExists(BucketExistsArgs.builder().bucket(bucketName).build());
            if (!found) {
                client.makeBucket(MakeBucketArgs.builder().bucket(bucketName).build());
                System.out.println("[PahaarSaathi MinIO] Created bucket: " + bucketName);
            }
            return client;
        } catch (Exception e) {
            System.err.println("[PahaarSaathi MinIO] Warning: MinIO initialization postponed or not available: " + e.getMessage());
            // Return client instance nonetheless so dependency injection succeeds; StorageService handles fallbacks
            return MinioClient.builder()
                    .endpoint(endpoint)
                    .credentials(accessKey, secretKey)
                    .build();
        }
    }
}
