package org.example.workers_backend_services.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;


// Role is imported randomly check it

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Setter


public class Users {
    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Long user_id;     // bigint is long here
    @Column(nullable = false)
    private String user_name;
    @Column(nullable = false,unique = true)
    private String email;
    @Column (unique = true)
    private String phone;
    @Column (nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    private LocalDateTime created_at;

}

