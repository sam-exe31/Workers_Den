package com.workersden.controller;

import jakarta.validation.Valid;
import com.workersden.dto.request.ServicerequestRequestDTO;
import com.workersden.dto.response.ServicerequestResponseDTO;
import com.workersden.service.ServiceRequestinterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(originPatterns = "*", allowCredentials = "true")
public class ServiceRequestController {

    @Autowired
    private ServiceRequestinterface serviceRequestService;

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ServicerequestResponseDTO> createJob(
            @AuthenticationPrincipal String email,
            @Valid @RequestBody ServicerequestRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(serviceRequestService.createJob(email, dto));
    }

    @GetMapping("/customer/my-jobs")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<ServicerequestResponseDTO>> getCustomerJobs(@AuthenticationPrincipal String email) {
        return ResponseEntity.ok(serviceRequestService.getMyCustomerJobs(email));
    }

    @GetMapping("/worker/available")
    @PreAuthorize("hasRole('WORKER')")
    public ResponseEntity<List<ServicerequestResponseDTO>> getAvailableJobs(@AuthenticationPrincipal String email) {
        return ResponseEntity.ok(serviceRequestService.getAvailableJobsForWorker(email));
    }

    @GetMapping("/worker/my-jobs")
    @PreAuthorize("hasRole('WORKER')")
    public ResponseEntity<List<ServicerequestResponseDTO>> getWorkerJobs(@AuthenticationPrincipal String email) {
        return ResponseEntity.ok(serviceRequestService.getMyWorkerJobs(email));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServicerequestResponseDTO> getJobById(
            @PathVariable Long id,
            @AuthenticationPrincipal String email) {
        return ResponseEntity.ok(serviceRequestService.getJobById(id, email));
    }

    @PostMapping("/{id}/accept")
    @PreAuthorize("hasRole('WORKER')")
    public ResponseEntity<ServicerequestResponseDTO> acceptJob(
            @PathVariable Long id,
            @AuthenticationPrincipal String email) {
        return ResponseEntity.ok(serviceRequestService.acceptJob(id, email));
    }

    @PostMapping("/{id}/start")
    @PreAuthorize("hasRole('WORKER')")
    public ResponseEntity<ServicerequestResponseDTO> startJob(
            @PathVariable Long id,
            @AuthenticationPrincipal String email) {
        return ResponseEntity.ok(serviceRequestService.startJob(id, email));
    }

    @PostMapping("/{id}/complete")
    @PreAuthorize("hasRole('WORKER')")
    public ResponseEntity<ServicerequestResponseDTO> completeJob(
            @PathVariable Long id,
            @AuthenticationPrincipal String email) {
        return ResponseEntity.ok(serviceRequestService.completeJob(id, email));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<ServicerequestResponseDTO> cancelJob(
            @PathVariable Long id,
            @AuthenticationPrincipal String email) {
        return ResponseEntity.ok(serviceRequestService.cancelJob(id, email));
    }
}

