package org.example.workers_backend_services.Config;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {

    private static final Logger log = LoggerFactory.getLogger(CloudinaryConfig.class);

    @Value("${cloudinary.cloud-name}")
    private String cloudName;

    @Value("${cloudinary.api-key}")
    private String apiKey;

    @Value("${cloudinary.api-secret}")
    private String apiSecret;

    @PostConstruct
    public void validateCredentials() {
        if (cloudName == null || cloudName.isBlank()) {
            log.error("CLOUDINARY_CLOUD_NAME is not set — photo uploads will fail!");
        }
        if (apiKey == null || apiKey.isBlank()) {
            log.error("CLOUDINARY_API_KEY is not set — photo uploads will fail!");
        }
        if (apiSecret == null || apiSecret.isBlank()) {
            log.error("CLOUDINARY_API_SECRET is not set — photo uploads will fail!");
        }
    }

    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret,
                "secure", true
        ));
    }
}
