package org.example.workers_backend_services.DTO;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Worker_categoryrequestDTO {
    @NotNull(message = "Category ID is required")
    private Long categoryId;
}