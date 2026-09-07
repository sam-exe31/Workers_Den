package org.example.workers_backend_services.Controller;

import jakarta.validation.Valid;
import org.example.workers_backend_services.DTO.Worker_profilerequestDTO;
import org.example.workers_backend_services.DTO.Worker_profileresponseDTO;
import org.example.workers_backend_services.Service.Worker_profile_services;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workers")
public class Worker_profile_Controller {

    @Autowired
    private Worker_profile_services workerProfileServices;

    @PostMapping("/profile")
    @PreAuthorize("hasRole('WORKER')")
    public ResponseEntity<Worker_profileresponseDTO> saveProfile(
            @AuthenticationPrincipal String email,
            @Valid @RequestBody Worker_profilerequestDTO dto) {
        return ResponseEntity.ok(workerProfileServices.createOrUpdateProfile(email, dto));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('WORKER')")
    public ResponseEntity<Worker_profileresponseDTO> getMyProfile(@AuthenticationPrincipal String email) {
        return ResponseEntity.ok(workerProfileServices.getMyProfile(email));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Worker_profileresponseDTO> getProfileById(@PathVariable Long id) {
        return ResponseEntity.ok(workerProfileServices.getProfileById(id));
    }

    @GetMapping
    public ResponseEntity<List<Worker_profileresponseDTO>> getAllProfiles() {
        return ResponseEntity.ok(workerProfileServices.getAllProfiles());
    }
}