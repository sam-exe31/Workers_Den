package org.example.workers_backend_services.Service;

import org.example.workers_backend_services.DTO.UserRequestDTO;
import org.example.workers_backend_services.DTO.UserResponseDTO;
import org.example.workers_backend_services.Entity.Role;
import org.example.workers_backend_services.Entity.Users;
import org.example.workers_backend_services.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserServices {

    @Autowired
    UserRepository repository;
    @Autowired
    PasswordEncoder passwordEncoder;


    public List<UserResponseDTO> getallusers() {
        return repository.findAll()
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    public UserResponseDTO getuserbyid(Long id) {
        Users  user=repository.findById(id).orElseThrow(()->new RuntimeException("user not found"));
        return convertToDTO(user);
    }

    public UserResponseDTO adduser(UserRequestDTO dto) {
        Users user=new Users();
        user.setUser_name(dto.getUser_name());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole(Role.valueOf(dto.getRole()));
        user.setCreated_at(LocalDateTime.now());
        Users saved=repository.save(user);
        return convertToDTO(saved);

    }

    public UserResponseDTO updateusers(Long id, UserRequestDTO dto) {

        Users request=repository.findById(id).orElseThrow(()->new RuntimeException("User not found"));
        request.setUser_name(dto.getUser_name());
        request.setEmail(dto.getEmail());
        request.setPhone(dto.getPhone());
        Users updated=repository.save(request);
        return convertToDTO(updated);
    }

    public boolean deleteuser(Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }

    private UserResponseDTO convertToDTO(Users user) {
        return new UserResponseDTO(
                user.getUser_id(),
                user.getUser_name(),
                user.getEmail(),
                user.getPhone(),
                user.getRole().toString(),
                user.getCreated_at()
        );
    }

    public UserResponseDTO getUserByEmail(String email) {
        Users user = repository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        return convertToDTO(user);
    }

    @org.springframework.transaction.annotation.Transactional
    public UserResponseDTO updateUserProfile(String email, String fullName, String phone) {
        Users user = repository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        if (fullName != null && !fullName.trim().isEmpty()) {
            user.setUser_name(fullName.trim());
        }
        if (phone != null && !phone.trim().isEmpty()) {
            user.setPhone(phone.trim());
        }
        Users updated = repository.save(user);
        return convertToDTO(updated);
    }
}
