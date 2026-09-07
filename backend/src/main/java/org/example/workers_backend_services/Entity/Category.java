package org.example.workers_backend_services.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "category")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cat_id")
    private Long id;

    @Column(name = "cat_name", nullable = false, unique = true)
    private String catName;

    @Column(length = 500)
    private String description;

    @Column(name = "customer_price", nullable = false)
    private Double customerPrice;

    @Column(name = "worker_payout", nullable = false)
    private Double workerPayout;

    @Column(name = "image_url", length = 1000)
    private String imageUrl;

    @Builder.Default
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;
}
