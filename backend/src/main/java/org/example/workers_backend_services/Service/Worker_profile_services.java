package org.example.workers_backend_services.Service;

import org.example.workers_backend_services.DTO.Worker_profilerequestDTO;
import org.example.workers_backend_services.DTO.Worker_profileresponseDTO;
import org.example.workers_backend_services.Entity.Role;
import org.example.workers_backend_services.Entity.Users;
import org.example.workers_backend_services.Entity.Worker_profile;
import org.example.workers_backend_services.Repository.UserRepository;
import org.example.workers_backend_services.Repository.Worker_profileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class Worker_profile_services {

    @Autowired
    private Worker_profileRepository workerProfileRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public Worker_profileresponseDTO createOrUpdateProfile(String userEmail, Worker_profilerequestDTO dto) {
        Users user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found: " + userEmail));

        if (user.getRole() != Role.WORKER) {
            throw new RuntimeException("Only users with WORKER role can have a worker profile");
        }

        Worker_profile profile = workerProfileRepository.findByUser_Email(userEmail)
                .orElseGet(() -> Worker_profile.builder().user(user).locality("").build());

        if (dto.getBio() != null) profile.setBio(dto.getBio());
        if (dto.getExperience() != null) profile.setExperience(dto.getExperience());
        if (dto.getProfileImage() != null) profile.setProfileImage(dto.getProfileImage());
        if (dto.getLocality() != null) profile.setLocality(dto.getLocality());
        profile.setIsAvailable(dto.getIsAvailable() != null ? dto.getIsAvailable() : (profile.getIsAvailable() != null ? profile.getIsAvailable() : true));
        profile.setMaxCapacity(dto.getMaxCapacity() != null ? dto.getMaxCapacity() : (profile.getMaxCapacity() != null ? profile.getMaxCapacity() : 3));

        Worker_profile saved = workerProfileRepository.save(profile);
        return mapToDTO(saved);
    }

    @Transactional
    public Worker_profileresponseDTO getMyProfile(String userEmail) {
        Users user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found: " + userEmail));

        Worker_profile profile = workerProfileRepository.findByUser_Email(userEmail)
                .orElseGet(() -> {
                    Worker_profile newProfile = Worker_profile.builder()
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

    public Worker_profileresponseDTO getProfileById(Long id) {
        Worker_profile profile = workerProfileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Worker profile not found with ID: " + id));
        return mapToDTO(profile);
    }

    public List<Worker_profileresponseDTO> getAllProfiles() {
        return workerProfileRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private Worker_profileresponseDTO mapToDTO(Worker_profile profile) {
        return Worker_profileresponseDTO.builder()
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