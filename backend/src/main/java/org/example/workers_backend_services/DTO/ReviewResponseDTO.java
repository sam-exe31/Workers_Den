package org.example.workers_backend_services.DTO;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewResponseDTO {
    private Long reviewId;
    private Long requestId;
    private Long customerId;
    private String customerName;
    private Long workerId;
    private Double rating;
    private String reviewText;
    private LocalDateTime createdAt;
}