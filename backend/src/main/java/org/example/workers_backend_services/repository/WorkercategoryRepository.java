package org.example.workers_backend_services.repository;

import org.example.workers_backend_services.entity.Workercategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WorkercategoryRepository extends JpaRepository<Workercategory, Long> {
    List<Workercategory> findByWorkerProfile_Id(Long workerId);
    Optional<Workercategory> findByWorkerProfile_IdAndCategory_Id(Long workerId, Long categoryId);
    void deleteByWorkerProfile_IdAndCategory_Id(Long workerId, Long categoryId);
}