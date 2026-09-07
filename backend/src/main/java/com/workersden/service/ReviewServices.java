package com.workersden.service;

import com.workersden.dto.request.ReviewRequestDTO;
import com.workersden.dto.response.ReviewResponseDTO;
import com.workersden.entity.Reviews;
import com.workersden.entity.ServiceStatus;
import com.workersden.entity.Service_request;
import com.workersden.entity.Workerprofile;
import com.workersden.exception.InvalidJobStateException;
import com.workersden.exception.ResourceNotFoundException;
import com.workersden.exception.UnauthorizedActionException;
import com.workersden.repository.ReviewsRequestRepository;
import com.workersden.repository.ServiceRequestRepository;
import com.workersden.repository.WorkerprofileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewServices {

    @Autowired
    private ReviewsRequestRepository reviewsRepository;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Autowired
    private WorkerprofileRepository workerProfileRepository;

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

        Workerprofile worker = request.getWorker();

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

