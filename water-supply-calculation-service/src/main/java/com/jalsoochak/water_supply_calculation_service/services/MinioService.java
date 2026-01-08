package com.jalsoochak.water_supply_calculation_service.services;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;

@Service
public class MinioService {

    private final MinioClient minioClient;
    private final String bucket;
    private final String endpoint;

    public MinioService(@Value("${minio.endpoint}") String endpoint,
                        @Value("${minio.access-key}") String accessKey,
                        @Value("${minio.secret-key}") String secretKey,
                        @Value("${minio.bucket}") String bucket) {

        this.bucket = bucket;
        this.endpoint = endpoint;

        this.minioClient = MinioClient.builder()
                .endpoint(endpoint)
                .credentials(accessKey, secretKey)
                .build();
    }

    public String upload(byte[] file, String objectName) {
        try {
            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucket)
                            .object(objectName)
                            .stream(new ByteArrayInputStream(file), file.length, -1)
                            .contentType("image/jpeg")
                            .build()
            );

            return endpoint + "/" + bucket + "/" + objectName;

        } catch (Exception e) {
            throw new RuntimeException("Failed to upload image to MinIO", e);
        }
    }
}

