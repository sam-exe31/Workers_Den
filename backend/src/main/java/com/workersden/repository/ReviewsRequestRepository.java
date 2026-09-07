package com.workersden.repository;

import com.workersden.entity.Reviews;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewsRequestRepository extends JpaRepository<Reviews, Long> {
    Optional<Reviews> findByServiceRequest_Id(Long requestId);
    List<Reviews> findByWorker_Id(Long workerId);

    @Query("SELECT AVG(r.rating) FROM Reviews r WHERE r.worker.id = :workerId")
    Double calculateAverageRatingForWorker(@Param("workerId") Long workerId);
}

