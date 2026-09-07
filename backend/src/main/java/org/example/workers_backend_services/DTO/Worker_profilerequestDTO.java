package org.example.workers_backend_services.DTO;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Worker_profilerequestDTO {

    private String bio;

    @Min(value = 0, message = "Experience cannot be negative")
    private Integer experience;

    private String profileImage;

    @NotBlank(message = "Locality is required")
    private String locality;

    @NotNull(message = "Availability status is required")
    private Boolean isAvailable;

    @Min(value = 1, message = "Capacity must be at least 1")
    private Integer maxCapacity;
}