package com.workersden.controller;

import jakarta.validation.Valid;
import com.workersden.dto.request.WorkerprofilerequestDTO;
import com.workersden.dto.response.WorkerprofileresponseDTO;
import com.workersden.service.Workerprofileservices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workers")
public class WorkerprofileController {

    @Autowired
    private Workerprofileservices workerProfileServices;

    @PostMapping("/profile")
    @PreAuthorize("hasRole('WORKER')")
    public ResponseEntity<WorkerprofileresponseDTO> saveProfile(
            @AuthenticationPrincipal String email,
            @Valid @RequestBody WorkerprofilerequestDTO dto) {
        return ResponseEntity.ok(workerProfileServices.createOrUpdateProfile(email, dto));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('WORKER')")
    public ResponseEntity<WorkerprofileresponseDTO> getMyProfile(@AuthenticationPrincipal String email) {
        return ResponseEntity.ok(workerProfileServices.getMyProfile(email));
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkerprofileresponseDTO> getProfileById(@PathVariable Long id) {
        return ResponseEntity.ok(workerProfileServices.getProfileById(id));
    }

    @GetMapping
    public ResponseEntity<List<WorkerprofileresponseDTO>> getAllProfiles() {
        return ResponseEntity.ok(workerProfileServices.getAllProfiles());
    }
}

