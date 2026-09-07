package org.example.workers_backend_services.controller;

import jakarta.validation.Valid;
import org.example.workers_backend_services.dto.ReviewRequestDTO;
import org.example.workers_backend_services.dto.ReviewResponseDTO;
import org.example.workers_backend_services.service.ReviewServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewServices reviewServices;

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