package org.example.workers_backend_services.Controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/uploads")
@CrossOrigin(originPatterns = "*", allowCredentials = "true")
public class FileUploadController {

    private final String UPLOAD_DIR = "uploads/";

    @PostMapping(value = "/photo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadPhoto(@RequestParam("file") MultipartFile file, HttpServletRequest request) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "File cannot be empty"));
        }

        try {
            File directory = new File(UPLOAD_DIR);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            String originalName = file.getOriginalFilename() != null ? file.getOriginalFilename().replaceAll("\\s+", "_") : "photo.jpg";
            String uniqueFileName = UUID.randomUUID() + "_" + originalName;

            Path targetPath = Paths.get(UPLOAD_DIR + uniqueFileName);
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            String host = request.getHeader("host");
            String baseUrl = (host != null) ? (request.getScheme() + "://" + host) : "http://localhost:8080";
            String fileUrl = baseUrl + "/uploads/" + uniqueFileName;
            return ResponseEntity.ok(Map.of("url", fileUrl, "path", "/uploads/" + uniqueFileName));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Failed to store file: " + e.getMessage()));
        }
    }
}