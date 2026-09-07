package org.example.workers_backend_services.repository;

import org.example.workers_backend_services.entity.Worker_category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface Worker_category_Repository extends JpaRepository<Worker_category, Long> {
    List<Worker_category> findByWorkerProfile_Id(Long workerId);
    Optional<Worker_category> findByWorkerProfile_IdAndCategory_Id(Long workerId, Long categoryId);
    void deleteByWorkerProfile_IdAndCategory_Id(Long workerId, Long categoryId);
}