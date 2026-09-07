package org.example.workers_backend_services.Controller;

import jakarta.validation.Valid;
import org.example.workers_backend_services.DTO.ReviewRequestDTO;
import org.example.workers_backend_services.DTO.ReviewResponseDTO;
import org.example.workers_backend_services.Service.Review_Services;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class Review_Controller {

    @Autowired
    private Review_Services reviewServices;

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ReviewResponseDTO> submitReview(
            @AuthenticationPrincipal String email,
            @Valid @RequestBody ReviewRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(reviewServices.submitReview(email, dto));
    }

    @GetMapping("/worker/{workerId}")
    public ResponseEntity<List<ReviewResponseDTO>> getWorkerReviews(@PathVariable Long workerId) {
        return ResponseEntity.ok(reviewServices.getWorkerReviews(workerId));
    }
}