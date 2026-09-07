package com.workersden.service;

import com.workersden.dto.request.ServicerequestRequestDTO;
import com.workersden.dto.response.ServicerequestResponseDTO;

import java.util.List;

public interface ServiceRequestinterface {
    ServicerequestResponseDTO createJob(String customerEmail, ServicerequestRequestDTO dto);
    List<ServicerequestResponseDTO> getMyCustomerJobs(String customerEmail);
    List<ServicerequestResponseDTO> getAvailableJobsForWorker(String workerEmail);
    List<ServicerequestResponseDTO> getMyWorkerJobs(String workerEmail);
    ServicerequestResponseDTO getJobById(Long jobId, String userEmail);
    ServicerequestResponseDTO acceptJob(Long jobId, String workerEmail);
    ServicerequestResponseDTO startJob(Long jobId, String workerEmail);
    ServicerequestResponseDTO completeJob(Long jobId, String workerEmail);
    ServicerequestResponseDTO cancelJob(Long jobId, String userEmail);
}

