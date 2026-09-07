package org.example.workers_backend_services.DTO;

import lombok.*;
import org.example.workers_backend_services.Entity.ServiceStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Service_requestResponseDTO {
    private Long requestId;
    private Long customerId;
    private String customerName;
    private String customerPhone;
    private Long workerId;
    private String workerName;
    private String workerPhone;
    private String workerProfileImage;
    private Long categoryId;
    private String categoryName;
    private String title;
    private String description;
    private String address;
    private String locality;
    private LocalDate preferredDate;
    private LocalTime preferredTime;
    private String urgency;
    private Double customerPrice;
    private Double workerPayout;
    private ServiceStatus status;
    private List<String> photos;
    private LocalDateTime createdAt;
}