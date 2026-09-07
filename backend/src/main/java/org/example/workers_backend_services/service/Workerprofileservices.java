package org.example.workers_backend_services.service;

import org.example.workers_backend_services.dto.WorkerprofilerequestDTO;
import org.example.workers_backend_services.dto.WorkerprofileresponseDTO;
import org.example.workers_backend_services.entity.Role;
import org.example.workers_backend_services.entity.Users;
import org.example.workers_backend_services.entity.Workerprofile;
import org.example.workers_backend_services.repository.UserRepository;
import org.example.workers_backend_services.repository.WorkerprofileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class Workerprofileservices {

    @Autowired
    private WorkerprofileRepository workerProfileRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public WorkerprofileresponseDTO createOrUpdateProfile(String userEmail, WorkerprofilerequestDTO dto) {
        Users user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found: " + userEmail));

        if (user.getRole() != Role.WORKER) {
            throw new RuntimeException("Only users with WORKER role can have a worker profile");
        }

        Workerprofile profile = workerProfileRepository.findByUser_Email(userEmail)
                .orElseGet(() -> Workerprofile.builder().user(user).locality("").build());

        if (dto.getBio() != null) profile.setBio(dto.getBio());
        if (dto.getExperience() != null) profile.setExperience(dto.getExperience());
        if (dto.getProfileImage() != null) profile.setProfileImage(dto.getProfileImage());
        if (dto.getLocality() != null) profile.setLocality(dto.getLocality());
        profile.setIsAvailable(dto.getIsAvailable() != null ? dto.getIsAvailable() : (profile.getIsAvailable() != null ? profile.getIsAvailable() : true));
        profile.setMaxCapacity(dto.getMaxCapacity() != null ? dto.getMaxCapacity() : (profile.getMaxCapacity() != null ? profile.getMaxCapacity() : 3));

        Workerprofile saved = workerProfileRepository.save(profile);
        return mapToDTO(saved);
    }

    @Transactional
    public WorkerprofileresponseDTO getMyProfile(String userEmail) {
        Users user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found: " + userEmail));

        Workerprofile profile = workerProfileRepository.findByUser_Email(userEmail)
                .orElseGet(() -> {
                    Workerprofile newProfile = Workerprofile.builder()
                            .user(user)
                            .locality("")
                            .isAvailable(true)
                            .maxCapacity(3)
                            .rating(0.0)
                            .completedJobs(0)
                            .build();
                    return workerProfileRepository.save(newProfile);
                });
        return mapToDTO(profile);
    }

    public WorkerprofileresponseDTO getProfileById(Long id) {
        Workerprofile profile = workerProfileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Worker profile not found with ID: " + id));
        return mapToDTO(profile);
    }

    public List<WorkerprofileresponseDTO> getAllProfiles() {
        return workerProfileRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private WorkerprofileresponseDTO mapToDTO(Workerprofile profile) {
        return WorkerprofileresponseDTO.builder()
                .workerId(profile.getId())
                .userId(profile.getUser().getUser_id())
                .userName(profile.getUser().getUser_name())
                .email(profile.getUser().getEmail())
                .phone(profile.getUser().getPhone())
                .bio(profile.getBio())
                .experience(profile.getExperience())
                .rating(profile.getRating())
                .completedJobs(profile.getCompletedJobs())
                .profileImage(profile.getProfileImage())
                .locality(profile.getLocality())
                .isAvailable(profile.getIsAvailable())
                .maxCapacity(profile.getMaxCapacity())
                .build();
    }
}