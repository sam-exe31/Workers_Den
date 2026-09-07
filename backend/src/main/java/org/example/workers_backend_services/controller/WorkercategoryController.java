package org.example.workers_backend_services.controller;

import jakarta.validation.Valid;
import org.example.workers_backend_services.dto.WorkercategoryrequestDTO;
import org.example.workers_backend_services.dto.WorkercategoryresponseDTO;
import org.example.workers_backend_services.service.WorkercategoryServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/worker/skills")
@PreAuthorize("hasRole('WORKER')")
public class WorkercategoryController {

    @Autowired
    private WorkercategoryServices workerCategoryServices;

    @PostMapping
    public ResponseEntity<WorkercategoryresponseDTO> addSkill(
            @AuthenticationPrincipal String email,
            @Valid @RequestBody WorkercategoryrequestDTO dto) {
        return ResponseEntity.ok(workerCategoryServices.addSkill(email, dto));
    }

    @GetMapping
    public ResponseEntity<List<WorkercategoryresponseDTO>> getMySkills(@AuthenticationPrincipal String email) {
        return ResponseEntity.ok(workerCategoryServices.getMySkills(email));
    }

    @DeleteMapping("/{categoryId}")
    public ResponseEntity<Void> removeSkill(
            @AuthenticationPrincipal String email,
            @PathVariable Long categoryId) {
        workerCategoryServices.removeSkill(email, categoryId);
        return ResponseEntity.noContent().build();
    }
}