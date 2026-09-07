package org.example.workers_backend_services.Service;

import org.example.workers_backend_services.DTO.ReviewRequestDTO;
import org.example.workers_backend_services.DTO.ReviewResponseDTO;
import org.example.workers_backend_services.Entity.Reviews;
import org.example.workers_backend_services.Entity.ServiceStatus;
import org.example.workers_backend_services.Entity.Service_request;
import org.example.workers_backend_services.Entity.Worker_profile;
import org.example.workers_backend_services.Exception.InvalidJobStateException;
import org.example.workers_backend_services.Exception.ResourceNotFoundException;
import org.example.workers_backend_services.Exception.UnauthorizedActionException;
import org.example.workers_backend_services.Repository.Reviews_Request_Repository;
import org.example.workers_backend_services.Repository.Service_Request_Repository;
import org.example.workers_backend_services.Repository.Worker_profileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class Review_Services {

    @Autowired
    private Reviews_Request_Repository reviewsRepository;

    @Autowired
    private Service_Request_Repository serviceRequestRepository;

    @Autowired
    private Worker_profileRepository workerProfileRepository;

    @Transactional
    public ReviewResponseDTO submitReview(String customerEmail, ReviewRequestDTO dto) {
        Service_request request = serviceRequestRepository.findById(dto.getRequestId())
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with ID: " + dto.getRequestId()));

        if (!request.getCustomer().getEmail().equals(customerEmail)) {
            throw new UnauthorizedActionException("Only the customer who posted this job can submit a review");
        }

        if (request.getStatus() != ServiceStatus.COMPLETED) {
            throw new InvalidJobStateException("Reviews are only allowed on COMPLETED jobs. Current status: " + request.getStatus());
        }

        if (reviewsRepository.findByServiceRequest_Id(dto.getRequestId()).isPresent()) {
            throw new InvalidJobStateException("A review has already been submitted for this job");
        }

        Worker_profile worker = request.getWorker();

        Reviews review = Reviews.builder()
                .serviceRequest(request)
                .customer(request.getCustomer())
                .worker(worker)
                .rating(dto.getRating())
                .reviewText(dto.getReviewText())
                .build();

        Reviews saved = reviewsRepository.save(review);

        Double avgRating = reviewsRepository.calculateAverageRatingForWorker(worker.getId());
        worker.setRating(avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : dto.getRating());
        workerProfileRepository.save(worker);

        return mapToDTO(saved);
    }

    public List<ReviewResponseDTO> getWorkerReviews(Long workerId) {
        return reviewsRepository.findByWorker_Id(workerId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private ReviewResponseDTO mapToDTO(Reviews review) {
        return ReviewResponseDTO.builder()
                .reviewId(review.getId())
                .requestId(review.getServiceRequest().getId())
                .customerId(review.getCustomer().getUser_id())
                .customerName(review.getCustomer().getUser_name())
                .workerId(review.getWorker().getId())
                .rating(review.getRating())
                .reviewText(review.getReviewText())
                .createdAt(review.getCreatedAt())
                .build();
    }
}