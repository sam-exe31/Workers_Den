package org.example.workers_backend_services.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "worker_profile")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Worker_profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "worker_id")
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private Users user;

    @Column(length = 500)
    private String bio;

    private Integer experience;

    @Builder.Default
    @Column(name = "rating", nullable = false)
    private Double rating = 0.0;

    @Builder.Default
    @Column(name = "completed_jobs", nullable = false)
    private Integer completedJobs = 0;

    @Column(name = "profile_image", columnDefinition = "LONGTEXT")
    private String profileImage;

    @Column(nullable = false)
    private String locality;

    @Builder.Default
    @Column(name = "is_available", nullable = false)
    private Boolean isAvailable = true;

    @Builder.Default
    @Column(name = "max_capacity", nullable = false)
    private Integer maxCapacity = 3;

    @OneToMany(mappedBy = "workerProfile", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Worker_category> categories = new ArrayList<>();
}