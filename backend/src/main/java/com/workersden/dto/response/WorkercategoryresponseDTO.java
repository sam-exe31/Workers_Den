package com.workersden.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkercategoryresponseDTO {
    private Long id;
    private Long workerId;
    private Long categoryId;
    private String categoryName;
}

