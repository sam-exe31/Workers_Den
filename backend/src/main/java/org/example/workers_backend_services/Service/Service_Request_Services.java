package org.example.workers_backend_services.Service;

import org.example.workers_backend_services.DTO.Service_requestRequestDTO;
import org.example.workers_backend_services.DTO.Service_requestResponseDTO;
import org.example.workers_backend_services.Entity.*;
import org.example.workers_backend_services.Exception.InvalidJobStateException;
import org.example.workers_backend_services.Exception.JobAlreadyAcceptedException;
import org.example.workers_backend_services.Exception.ResourceNotFoundException;
import org.example.workers_backend_services.Exception.UnauthorizedActionException;
import org.example.workers_backend_services.Repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class Service_Request_Services implements Service_Request_interface {

    @Autowired
    private Service_Request_Repository serviceRequestRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private Worker_profileRepository workerProfileRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private Worker_category_Repository workerCategoryRepository;

    @Override
    @Transactional
    public Service_requestResponseDTO createJob(String customerEmail, Service_requestRequestDTO dto) {
        Users customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found: " + customerEmail));

        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + dto.getCategoryId()));

        if (!category.getIsActive()) {
            throw new InvalidJobStateException("Category is currently inactive");
        }

        Service_request request = Service_request.builder()
                .customer(customer)
                .category(category)
                .title(dto.getTitle())
                .description(dto.getDescription())
                .address(dto.getAddress())
                .locality(dto.getLocality())
                .preferredDate(dto.getPreferredDate())
                .preferredTime(dto.getPreferredTime())
                .urgency(dto.getUrgency())
                .customerPrice(category.getCustomerPrice())
                .workerPayout(category.getWorkerPayout())
                .status(ServiceStatus.OPEN)
                .build();

        if (dto.getPhotos() != null && !dto.getPhotos().isEmpty()) {
            List<JobPhoto> photoEntities = dto.getPhotos().stream()
                    .map(url -> JobPhoto.builder()
                            .imageUrl(url)
                            .serviceRequest(request)
                            .build())
                    .toList();
            request.setPhotos(photoEntities);
        }

        Service_request savedJob = serviceRequestRepository.save(request);
        return mapToDTO(savedJob);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Service_requestResponseDTO> getMyCustomerJobs(String customerEmail) {
        return serviceRequestRepository.findByCustomer_EmailOrderByCreatedAtDesc(customerEmail).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<Service_requestResponseDTO> getAvailableJobsForWorker(String workerEmail) {
        Worker_profile worker = workerProfileRepository.findByUser_Email(workerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Worker profile not found for: " + workerEmail));

        if (!worker.getIsAvailable()) {
            return List.of();
        }

        long activeCount = serviceRequestRepository.countByWorker_IdAndStatusIn(
                worker.getId(), List.of(ServiceStatus.ACCEPTED, ServiceStatus.IN_PROGRESS));
        if (activeCount >= worker.getMaxCapacity()) {
            return List.of();
        }

        return serviceRequestRepository.findAvailableJobsForWorker(worker.getId()).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<Service_requestResponseDTO> getMyWorkerJobs(String workerEmail) {
        Worker_profile worker = workerProfileRepository.findByUser_Email(workerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Worker profile not found for: " + workerEmail));

        return serviceRequestRepository.findByWorker_IdOrderByCreatedAtDesc(worker.getId()).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Service_requestResponseDTO getJobById(Long jobId, String userEmail) {
        Service_request job = serviceRequestRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with ID: " + jobId));

        // Force Hibernate to initialize lazy photos
        if (job.getPhotos() != null) {
            job.getPhotos().size();
        }

        return mapToDTO(job);
    }

    @Override
    @Transactional
    public Service_requestResponseDTO acceptJob(Long jobId, String workerEmail) {
        Worker_profile worker = workerProfileRepository.findByUser_Email(workerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Worker profile not found for: " + workerEmail));

        if (!worker.getIsAvailable()) {
            throw new InvalidJobStateException("You are marked as unavailable");
        }

        long activeJobs = serviceRequestRepository.countByWorker_IdAndStatusIn(
                worker.getId(), List.of(ServiceStatus.ACCEPTED, ServiceStatus.IN_PROGRESS));
        if (activeJobs >= worker.getMaxCapacity()) {
            throw new InvalidJobStateException("You have reached your maximum active job capacity (" + worker.getMaxCapacity() + ")");
        }

        Service_request job = serviceRequestRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with ID: " + jobId));

        if (job.getStatus() != ServiceStatus.OPEN) {
            throw new JobAlreadyAcceptedException("Job is no longer available. Current status: " + job.getStatus());
        }

        boolean providesCategory = workerCategoryRepository
                .findByWorkerProfile_IdAndCategory_Id(worker.getId(), job.getCategory().getId()).isPresent();
        if (!providesCategory) {
            throw new UnauthorizedActionException("You do not provide service for this category");
        }

        job.setWorker(worker);
        job.setStatus(ServiceStatus.ACCEPTED);
        return mapToDTO(serviceRequestRepository.save(job));
    }

    @Override
    @Transactional
    public Service_requestResponseDTO startJob(Long jobId, String workerEmail) {
        Service_request job = serviceRequestRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with ID: " + jobId));

        if (job.getWorker() == null || !job.getWorker().getUser().getEmail().equals(workerEmail)) {
            throw new UnauthorizedActionException("You are not assigned to this job");
        }

        if (job.getStatus() != ServiceStatus.ACCEPTED) {
            throw new InvalidJobStateException("Job cannot be started from status: " + job.getStatus());
        }

        job.setStatus(ServiceStatus.IN_PROGRESS);
        return mapToDTO(serviceRequestRepository.save(job));
    }

    @Override
    @Transactional
    public Service_requestResponseDTO completeJob(Long jobId, String workerEmail) {
        Service_request job = serviceRequestRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with ID: " + jobId));

        if (job.getWorker() == null || !job.getWorker().getUser().getEmail().equals(workerEmail)) {
            throw new UnauthorizedActionException("You are not assigned to this job");
        }

        if (job.getStatus() != ServiceStatus.IN_PROGRESS) {
            throw new InvalidJobStateException("Job must be IN_PROGRESS before completion");
        }

        job.setStatus(ServiceStatus.COMPLETED);

        Worker_profile worker = job.getWorker();
        worker.setCompletedJobs(worker.getCompletedJobs() + 1);
        workerProfileRepository.save(worker);

        return mapToDTO(serviceRequestRepository.save(job));
    }

    @Override
    @Transactional
    public Service_requestResponseDTO cancelJob(Long jobId, String userEmail) {
        Service_request job = serviceRequestRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with ID: " + jobId));

        boolean isCustomer = job.getCustomer().getEmail().equals(userEmail);
        boolean isWorker = job.getWorker() != null && job.getWorker().getUser().getEmail().equals(userEmail);

        if (!isCustomer && !isWorker) {
            throw new UnauthorizedActionException("You do not have permission to cancel this job");
        }

        if (job.getStatus() == ServiceStatus.COMPLETED || job.getStatus() == ServiceStatus.CANCELLED) {
            throw new InvalidJobStateException("Cannot cancel a job with status: " + job.getStatus());
        }

        job.setStatus(ServiceStatus.CANCELLED);
        return mapToDTO(serviceRequestRepository.save(job));
    }

    private Service_requestResponseDTO mapToDTO(Service_request job) {
        List<String> photoUrls = Collections.emptyList();
        if (job.getPhotos() != null && !job.getPhotos().isEmpty()) {
            photoUrls = job.getPhotos().stream()
                    .map(JobPhoto::getImageUrl)
                    .filter(Objects::nonNull)
                    .toList();
        }

        return Service_requestResponseDTO.builder()
                .requestId(job.getId() != null ? job.getId() : null)
                .customerId(job.getCustomer() != null ? job.getCustomer().getUser_id() : null)
                .customerName(job.getCustomer() != null ? job.getCustomer().getUser_name() : null)
                .customerPhone(job.getCustomer() != null ? job.getCustomer().getPhone() : null)
                .workerId(job.getWorker() != null ? job.getWorker().getId() : null)
                .workerName(job.getWorker() != null && job.getWorker().getUser() != null ? job.getWorker().getUser().getUser_name() : null)
                .workerPhone(job.getWorker() != null && job.getWorker().getUser() != null ? job.getWorker().getUser().getPhone() : null)
                .workerProfileImage(job.getWorker() != null ? job.getWorker().getProfileImage() : null)
                .categoryId(job.getCategory() != null ? job.getCategory().getId() : null)
                .categoryName(job.getCategory() != null ? job.getCategory().getCatName() : null)
                .title(job.getTitle())
                .description(job.getDescription())
                .address(job.getAddress())
                .locality(job.getLocality())
                .preferredDate(job.getPreferredDate())
                .preferredTime(job.getPreferredTime())
                .urgency(job.getUrgency())
                .customerPrice(job.getCustomerPrice())
                .workerPayout(job.getWorkerPayout())
                .status(job.getStatus())
                .createdAt(job.getCreatedAt())
                .photos(photoUrls)
                .build();
    }
}
