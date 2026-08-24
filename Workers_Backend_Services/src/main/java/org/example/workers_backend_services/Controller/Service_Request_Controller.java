package org.example.workers_backend_services.Controller;

import jakarta.validation.Valid;
import org.example.workers_backend_services.DTO.Service_requestRequestDTO;
import org.example.workers_backend_services.DTO.Service_requestResponseDTO;
import org.example.workers_backend_services.Service.Service_Request_interface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"}, allowCredentials = "true")
public class Service_Request_Controller {

    @Autowired
    private Service_Request_interface serviceRequestService;

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<Service_requestResponseDTO> createJob(
            @AuthenticationPrincipal String email,
            @Valid @RequestBody Service_requestRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(serviceRequestService.createJob(email, dto));
    }

    @GetMapping("/customer/my-jobs")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<Service_requestResponseDTO>> getCustomerJobs(@AuthenticationPrincipal String email) {
        return ResponseEntity.ok(serviceRequestService.getMyCustomerJobs(email));
    }

    @GetMapping("/worker/available")
    @PreAuthorize("hasRole('WORKER')")
    public ResponseEntity<List<Service_requestResponseDTO>> getAvailableJobs(@AuthenticationPrincipal String email) {
        return ResponseEntity.ok(serviceRequestService.getAvailableJobsForWorker(email));
    }

    @GetMapping("/worker/my-jobs")
    @PreAuthorize("hasRole('WORKER')")
    public ResponseEntity<List<Service_requestResponseDTO>> getWorkerJobs(@AuthenticationPrincipal String email) {
        return ResponseEntity.ok(serviceRequestService.getMyWorkerJobs(email));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Service_requestResponseDTO> getJobById(
            @PathVariable Long id,
            @AuthenticationPrincipal String email) {
        return ResponseEntity.ok(serviceRequestService.getJobById(id, email));
    }

    @PostMapping("/{id}/accept")
    @PreAuthorize("hasRole('WORKER')")
    public ResponseEntity<Service_requestResponseDTO> acceptJob(
            @PathVariable Long id,
            @AuthenticationPrincipal String email) {
        return ResponseEntity.ok(serviceRequestService.acceptJob(id, email));
    }

    @PostMapping("/{id}/start")
    @PreAuthorize("hasRole('WORKER')")
    public ResponseEntity<Service_requestResponseDTO> startJob(
            @PathVariable Long id,
            @AuthenticationPrincipal String email) {
        return ResponseEntity.ok(serviceRequestService.startJob(id, email));
    }

    @PostMapping("/{id}/complete")
    @PreAuthorize("hasRole('WORKER')")
    public ResponseEntity<Service_requestResponseDTO> completeJob(
            @PathVariable Long id,
            @AuthenticationPrincipal String email) {
        return ResponseEntity.ok(serviceRequestService.completeJob(id, email));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<Service_requestResponseDTO> cancelJob(
            @PathVariable Long id,
            @AuthenticationPrincipal String email) {
        return ResponseEntity.ok(serviceRequestService.cancelJob(id, email));
    }
}