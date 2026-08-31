package org.example.workers_backend_services.Service;

import org.example.workers_backend_services.DTO.CategoryRequestDTO;
import org.example.workers_backend_services.DTO.CategoryResponseDTO;
import org.example.workers_backend_services.Entity.Category;
import org.example.workers_backend_services.Exception.ResourceNotFoundException;
import org.example.workers_backend_services.Repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryServices {

    @Autowired
    private CategoryRepository categoryRepository;

    public CategoryResponseDTO createCategory(CategoryRequestDTO dto) {
        Category category = Category.builder()
                .catName(dto.getCatName())
                .description(dto.getDescription())
                .customerPrice(dto.getCustomerPrice())
                .workerPayout(dto.getWorkerPayout())
                .imageUrl(dto.getImageUrl())
                .isActive(dto.getIsActive() != null ? dto.getIsActive() : true)
                .build();
        return mapToDTO(categoryRepository.save(category));
    }

    public List<CategoryResponseDTO> getAllActiveCategories() {
        return categoryRepository.findByIsActiveTrue().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public CategoryResponseDTO getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + id));
        return mapToDTO(category);
    }

    public CategoryResponseDTO updateCategory(Long id, CategoryRequestDTO dto) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + id));
        category.setCatName(dto.getCatName());
        category.setDescription(dto.getDescription());
        category.setCustomerPrice(dto.getCustomerPrice());
        category.setWorkerPayout(dto.getWorkerPayout());
        if (dto.getImageUrl() != null) category.setImageUrl(dto.getImageUrl());
        if (dto.getIsActive() != null) category.setIsActive(dto.getIsActive());
        return mapToDTO(categoryRepository.save(category));
    }

    private CategoryResponseDTO mapToDTO(Category category) {
        return CategoryResponseDTO.builder()
                .id(category.getId())
                .catName(category.getCatName())
                .description(category.getDescription())
                .customerPrice(category.getCustomerPrice())
                .workerPayout(category.getWorkerPayout())
                .imageUrl(category.getImageUrl())
                .isActive(category.getIsActive())
                .build();
    }
}