package org.example.workers_backend_services.DTO;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CategoryRequestDTO {

    @NotBlank(message = "Category name is required")
    private String catName;

    private String description;

    @NotNull(message = "Customer price is required")
    @Min(value = 0, message = "Price cannot be negative")
    private Double customerPrice;

    @NotNull(message = "Worker payout is required")
    @Min(value = 0, message = "Payout cannot be negative")
    private Double workerPayout;

    private String imageUrl;

    private Boolean isActive;
}