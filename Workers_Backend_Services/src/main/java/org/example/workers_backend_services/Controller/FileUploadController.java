package org.example.workers_backend_services.Controller;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/uploads")
@CrossOrigin(originPatterns = "*", allowCredentials = "true")
public class FileUploadController {

    private final Cloudinary cloudinary;

    public FileUploadController(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    @PostMapping(value = "/photo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadPhoto(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "File cannot be empty"));
        }

        try {
            String uniquePublicId = "workers_den/" + UUID.randomUUID();

            @SuppressWarnings("unchecked")
            Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(),
                    ObjectUtils.asMap(
                            "public_id", uniquePublicId,
                            "resource_type", "image",
                            "overwrite", true
                    ));

            String secureUrl = (String) uploadResult.get("secure_url");

            return ResponseEntity.ok(Map.of(
                    "url", secureUrl,
                    "path", secureUrl
            ));
        } catch (IOException e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("message", "Failed to upload file to cloud storage: " + e.getMessage()));
        }
    }
}