package org.example.workers_backend_services.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Getter
@Setter
public class Service_requestRequestDTO {

    @NotNull(message = "Category ID is required")
    private Long categoryId;

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotBlank(message = "Address is required")
    private String address;

    @NotBlank(message = "Locality is required")
    private String locality;

    @NotNull(message = "Preferred date is required")
    private LocalDate preferredDate;

    private LocalTime preferredTime;

    private List<String> photos;

    @NotBlank(message = "Urgency is required (e.g. LOW, MEDIUM, HIGH)")
    private String urgency;
}