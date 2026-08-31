package org.example.workers_backend_services.DTO;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryResponseDTO {
    private Long id;
    private String catName;
    private String description;
    private Double customerPrice;
    private Double workerPayout;
    private String imageUrl;
    private Boolean isActive;
}