package org.example.workers_backend_services.Repository;

import org.example.workers_backend_services.Entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    Optional<Category> findByCatNameIgnoreCase(String catName);
    boolean existsByCatNameIgnoreCase(String catName);
    List<Category> findByIsActiveTrue();
}
