package org.example.workers_backend_services.Service;

import org.example.workers_backend_services.DTO.Service_requestRequestDTO;
import org.example.workers_backend_services.DTO.Service_requestResponseDTO;

import java.util.List;

public interface Service_Request_interface {
    Service_requestResponseDTO createJob(String customerEmail, Service_requestRequestDTO dto);
    List<Service_requestResponseDTO> getMyCustomerJobs(String customerEmail);
    List<Service_requestResponseDTO> getAvailableJobsForWorker(String workerEmail);
    List<Service_requestResponseDTO> getMyWorkerJobs(String workerEmail);
    Service_requestResponseDTO getJobById(Long jobId, String userEmail);
    Service_requestResponseDTO acceptJob(Long jobId, String workerEmail);
    Service_requestResponseDTO startJob(Long jobId, String workerEmail);
    Service_requestResponseDTO completeJob(Long jobId, String workerEmail);
    Service_requestResponseDTO cancelJob(Long jobId, String userEmail);
}