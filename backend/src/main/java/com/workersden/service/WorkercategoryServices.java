package com.workersden.service;

import com.workersden.dto.request.WorkercategoryrequestDTO;
import com.workersden.dto.response.WorkercategoryresponseDTO;
import com.workersden.entity.Category;
import com.workersden.entity.Workercategory;
import com.workersden.entity.Workerprofile;
import com.workersden.exception.ResourceNotFoundException;
import com.workersden.repository.CategoryRepository;
import com.workersden.repository.WorkercategoryRepository;
import com.workersden.repository.WorkerprofileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WorkercategoryServices {

    @Autowired
    private WorkercategoryRepository workerCategoryRepository;

    @Autowired
    private WorkerprofileRepository workerProfileRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Transactional
    public WorkercategoryresponseDTO addSkill(String userEmail, WorkercategoryrequestDTO dto) {
        Workerprofile worker = workerProfileRepository.findByUser_Email(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Worker profile not found for: " + userEmail));

        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + dto.getCategoryId()));

        Workercategory mapping = workerCategoryRepository.findByWorkerProfile_IdAndCategory_Id(worker.getId(), category.getId())
                .orElseGet(() -> Workercategory.builder()
                        .workerProfile(worker)
                        .category(category)
                        .build());

        Workercategory saved = workerCategoryRepository.save(mapping);
        return WorkercategoryresponseDTO.builder()
                .id(saved.getId())
                .workerId(saved.getWorkerProfile().getId())
                .categoryId(saved.getCategory().getId())
                .categoryName(saved.getCategory().getCatName())
                .build();
    }

    public List<WorkercategoryresponseDTO> getMySkills(String userEmail) {
        Workerprofile worker = workerProfileRepository.findByUser_Email(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Worker profile not found for: " + userEmail));

        return workerCategoryRepository.findByWorkerProfile_Id(worker.getId()).stream()
                .map(m -> WorkercategoryresponseDTO.builder()
                        .id(m.getId())
                        .workerId(m.getWorkerProfile().getId())
                        .categoryId(m.getCategory().getId())
                        .categoryName(m.getCategory().getCatName())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public void removeSkill(String userEmail, Long categoryId) {
        Workerprofile worker = workerProfileRepository.findByUser_Email(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Worker profile not found for: " + userEmail));
        workerCategoryRepository.deleteByWorkerProfile_IdAndCategory_Id(worker.getId(), categoryId);
    }
}

