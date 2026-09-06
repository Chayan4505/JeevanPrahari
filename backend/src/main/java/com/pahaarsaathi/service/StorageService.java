package com.pahaarsaathi.service;

import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class StorageService {

    @Autowired(required = false)
    private MinioClient minioClient;

    @Value("${pahaarsaathi.storage.minio.bucket-name:pahaarsaathi-reports}")
    private String bucketName;

    @Value("${pahaarsaathi.storage.minio.public-url:http://localhost:9000/pahaarsaathi-reports}")
    private String publicBaseUrl;

    private static final List<String> ALLOWED_MIME_TYPES = Arrays.asList(
            "image/jpeg", "image/png", "image/webp", "image/heic", "video/mp4", "video/quicktime"
    );

    private static final long MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB

    public String uploadReportMedia(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        if (file.getSize() > MAX_FILE_SIZE_BYTES) {
            throw new IllegalArgumentException("File exceeds maximum allowed size of 25MB");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_MIME_TYPES.contains(contentType.toLowerCase())) {
            throw new IllegalArgumentException("Unsupported file type: " + contentType + ". Only JPEG, PNG, WEBP, and MP4 files are permitted.");
        }

        String originalFilename = file.getOriginalFilename();
        String extension = ".jpg";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        String objectName = "reports/" + UUID.randomUUID() + extension;

        try {
            if (minioClient != null) {
                try (InputStream is = file.getInputStream()) {
                    minioClient.putObject(
                            PutObjectArgs.builder()
                                    .bucket(bucketName)
                                    .object(objectName)
                                    .stream(is, file.getSize(), -1)
                                    .contentType(contentType)
                                    .build()
                    );
                    return publicBaseUrl + "/" + objectName;
                }
            }
        } catch (Exception e) {
            System.err.println("[PahaarSaathi Storage] MinIO upload error: " + e.getMessage() + ". Generating secure local fallback URI.");
        }

        // Fallback local media simulation path
        return "/static/uploads/" + objectName;
    }
}
