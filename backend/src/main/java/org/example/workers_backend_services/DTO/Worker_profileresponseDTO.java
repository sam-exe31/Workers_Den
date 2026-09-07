package org.example.workers_backend_services.DTO;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Worker_profileresponseDTO {
    private Long workerId;
    private Long userId;
    private String userName;
    private String email;
    private String phone;
    private String bio;
    private Integer experience;
    private Double rating;
    private Integer completedJobs;
    private String profileImage;
    private String locality;
    private Boolean isAvailable;
    private Integer maxCapacity;
}