package org.example.workers_backend_services.Controller;

import jakarta.validation.Valid;
import org.example.workers_backend_services.DTO.Worker_categoryrequestDTO;
import org.example.workers_backend_services.DTO.Worker_categoryresponseDTO;
import org.example.workers_backend_services.Service.Worker_category_Services;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/worker/skills")
@PreAuthorize("hasRole('WORKER')")
public class Worker_category_Controller {

    @Autowired
    private Worker_category_Services workerCategoryServices;

    @PostMapping
    public ResponseEntity<Worker_categoryresponseDTO> addSkill(
            @AuthenticationPrincipal String email,
            @Valid @RequestBody Worker_categoryrequestDTO dto) {
        return ResponseEntity.ok(workerCategoryServices.addSkill(email, dto));
    }

    @GetMapping
    public ResponseEntity<List<Worker_categoryresponseDTO>> getMySkills(@AuthenticationPrincipal String email) {
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