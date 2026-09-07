package org.example.workers_backend_services.DTO;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Worker_categoryresponseDTO {
    private Long id;
    private Long workerId;
    private Long categoryId;
    private String categoryName;
}