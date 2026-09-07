package org.example.workers_backend_services.Config;

import org.example.workers_backend_services.Entity.Category;
import org.example.workers_backend_services.Repository.CategoryRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;
import java.util.Optional;

@Configuration
public class DatabaseSeeder {

    @Bean
    CommandLineRunner seedCategories(CategoryRepository categoryRepository) {
        return args -> {
            List<CategorySeedData> categoriesToSeed = List.of(
                new CategorySeedData(
                    "Plumbing",
                    "Pipe leaks, tap fixes, drain clogs and sanitary installations",
                    499.00,
                    399.00,
                    "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=800&q=80"
                ),
                new CategorySeedData(
                    "Electrical",
                    "Wiring, switch repairs, fan installation and appliance diagnostics",
                    399.00,
                    319.00,
                    "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80"
                ),
                new CategorySeedData(
                    "House Cleaning",
                    "Deep cleaning, dusting, floor scrubbing and sanitization",
                    799.00,
                    639.00,
                    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80"
                ),
                new CategorySeedData(
                    "Catering",
                    "Traditional snacks, buffet setup, event food preparation and party catering",
                    850.00,
                    680.00,
                    "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80"
                ),
                new CategorySeedData(
                    "Gardening",
                    "Lawn mowing, hedge trimming, weeding and plant care",
                    450.00,
                    360.00,
                    "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80"
                ),
                new CategorySeedData(
                    "AC & Appliance Repair",
                    "AC gas refill, filter servicing, refrigerator, microwave, and washing machine fixes",
                    699.00,
                    550.00,
                    "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=800&q=80"
                )
            );

            for (CategorySeedData seed : categoriesToSeed) {
                Optional<Category> existing = categoryRepository.findByCatNameIgnoreCase(seed.catName());
                if (existing.isEmpty()) {
                    Category category = Category.builder()
                            .catName(seed.catName())
                            .description(seed.description())
                            .customerPrice(seed.customerPrice())
                            .workerPayout(seed.workerPayout())
                            .imageUrl(seed.imageUrl())
                            .isActive(true)
                            .build();
                    categoryRepository.save(category);
                    System.out.println(">>> Seeded new category: " + seed.catName());
                } else {
                    Category category = existing.get();
                    boolean updated = false;
                    if (category.getImageUrl() == null || category.getImageUrl().isBlank()) {
                        category.setImageUrl(seed.imageUrl());
                        updated = true;
                    }
                    if (category.getDescription() == null || category.getDescription().isBlank()) {
                        category.setDescription(seed.description());
                        updated = true;
                    }
                    if (updated) {
                        categoryRepository.save(category);
                        System.out.println(">>> Updated category metadata for: " + seed.catName());
                    }
                }
            }

            System.out.println(">>> All default categories verified and updated in database.");
        };
    }

    private record CategorySeedData(
        String catName,
        String description,
        Double customerPrice,
        Double workerPayout,
        String imageUrl
    ) {}
}
