package org.example.workers_backend_services.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "worker_category", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"worker_id", "cat_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Worker_category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "worker_id", nullable = false)
    private Worker_profile workerProfile;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cat_id", nullable = false)
    private Category category;
}