package com.workersden.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WorkercategoryrequestDTO {
    @NotNull(message = "Category ID is required")
    private Long categoryId;
}

