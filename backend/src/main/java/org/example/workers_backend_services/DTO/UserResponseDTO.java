package org.example.workers_backend_services.DTO;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponseDTO {
    private Long user_id;
    private String user_name;
    private String email;
    private String phone;
    private String role;
    private LocalDateTime created_at;
}