package org.example.workers_backend_services.Controller;

import jakarta.validation.Valid;
import org.example.workers_backend_services.DTO.CategoryRequestDTO;
import org.example.workers_backend_services.DTO.CategoryResponseDTO;
import org.example.workers_backend_services.Service.CategoryServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/Categories")
public class CategoryController {

    @Autowired
    private CategoryServices categoryServices;

    @GetMapping
    public ResponseEntity<List<CategoryResponseDTO>> getAllCategories() {
        return ResponseEntity.ok(categoryServices.getAllActiveCategories());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponseDTO> getCategoryById(@PathVariable Long id) {
        return ResponseEntity.ok(categoryServices.getCategoryById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CategoryResponseDTO> createCategory(@Valid @RequestBody CategoryRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(categoryServices.createCategory(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CategoryResponseDTO> updateCategory(@PathVariable Long id, @Valid @RequestBody CategoryRequestDTO dto) {
        return ResponseEntity.ok(categoryServices.updateCategory(id, dto));
    }
}