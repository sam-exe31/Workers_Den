package org.example.workers_backend_services.Service;

import org.example.workers_backend_services.DTO.Worker_categoryrequestDTO;
import org.example.workers_backend_services.DTO.Worker_categoryresponseDTO;
import org.example.workers_backend_services.Entity.Category;
import org.example.workers_backend_services.Entity.Worker_category;
import org.example.workers_backend_services.Entity.Worker_profile;
import org.example.workers_backend_services.Exception.ResourceNotFoundException;
import org.example.workers_backend_services.Repository.CategoryRepository;
import org.example.workers_backend_services.Repository.Worker_category_Repository;
import org.example.workers_backend_services.Repository.Worker_profileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class Worker_category_Services {

    @Autowired
    private Worker_category_Repository workerCategoryRepository;

    @Autowired
    private Worker_profileRepository workerProfileRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Transactional
    public Worker_categoryresponseDTO addSkill(String userEmail, Worker_categoryrequestDTO dto) {
        Worker_profile worker = workerProfileRepository.findByUser_Email(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Worker profile not found for: " + userEmail));

        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + dto.getCategoryId()));

        Worker_category mapping = workerCategoryRepository.findByWorkerProfile_IdAndCategory_Id(worker.getId(), category.getId())
                .orElseGet(() -> Worker_category.builder()
                        .workerProfile(worker)
                        .category(category)
                        .build());

        Worker_category saved = workerCategoryRepository.save(mapping);
        return Worker_categoryresponseDTO.builder()
                .id(saved.getId())
                .workerId(saved.getWorkerProfile().getId())
                .categoryId(saved.getCategory().getId())
                .categoryName(saved.getCategory().getCatName())
                .build();
    }

    public List<Worker_categoryresponseDTO> getMySkills(String userEmail) {
        Worker_profile worker = workerProfileRepository.findByUser_Email(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Worker profile not found for: " + userEmail));

        return workerCategoryRepository.findByWorkerProfile_Id(worker.getId()).stream()
                .map(m -> Worker_categoryresponseDTO.builder()
                        .id(m.getId())
                        .workerId(m.getWorkerProfile().getId())
                        .categoryId(m.getCategory().getId())
                        .categoryName(m.getCategory().getCatName())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public void removeSkill(String userEmail, Long categoryId) {
        Worker_profile worker = workerProfileRepository.findByUser_Email(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Worker profile not found for: " + userEmail));
        workerCategoryRepository.deleteByWorkerProfile_IdAndCategory_Id(worker.getId(), categoryId);
    }
}