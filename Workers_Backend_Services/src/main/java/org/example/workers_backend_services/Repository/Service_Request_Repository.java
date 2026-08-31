package org.example.workers_backend_services.Repository;

import org.example.workers_backend_services.Entity.ServiceStatus;
import org.example.workers_backend_services.Entity.Service_request;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface Service_Request_Repository extends JpaRepository<Service_request, Long> {

    List<Service_request> findByCustomer_EmailOrderByCreatedAtDesc(String email);

    List<Service_request> findByWorker_IdOrderByCreatedAtDesc(Long workerId);

    long countByWorker_IdAndStatusIn(Long workerId, List<ServiceStatus> statuses);

    @Query("SELECT sr FROM Service_request sr " +
            "WHERE sr.status = 'OPEN' " +
            "ORDER BY sr.createdAt DESC")
    List<Service_request> findAvailableJobsForWorker(@Param("workerId") Long workerId);
}