package org.example.workers_backend_services.Controller;

import jakarta.validation.Valid;
import org.example.workers_backend_services.Config.JwtUtil;
import org.example.workers_backend_services.DTO.LoginRequestDTO;
import org.example.workers_backend_services.DTO.LoginResponseDTO;
import org.example.workers_backend_services.DTO.UserRequestDTO;
import org.example.workers_backend_services.DTO.UserResponseDTO;
import org.example.workers_backend_services.Entity.Role;
import org.example.workers_backend_services.Entity.Users;
import org.example.workers_backend_services.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody UserRequestDTO dto) {
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email is already in use");
        }

        // Standard instantiation without relying on @Builder
        Users user = new Users();
        user.setUser_name(dto.getUser_name());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        if (dto.getRole() != null) {
            try {
                user.setRole(Role.valueOf(dto.getRole().trim().toUpperCase()));
            } catch (IllegalArgumentException e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Invalid role. Allowed roles are: CUSTOMER, WORKER, ADMIN");
            }
        } else {
            user.setRole(Role.CUSTOMER); // default role fallback
        }

        Users savedUser = userRepository.save(user);

        UserResponseDTO response = new UserResponseDTO();
        response.setUser_id(savedUser.getUser_id());
        response.setUser_name(savedUser.getUser_name());
        response.setEmail(savedUser.getEmail());
        response.setPhone(savedUser.getPhone());

        // Convert Role enum to String to match your UserResponseDTO definition
        response.setRole(savedUser.getRole() != null ? savedUser.getRole().name() : null);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO dto) {
        Users user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name(), user.getUser_id());

        LoginResponseDTO responseDTO = new LoginResponseDTO(
                token,
                user.getEmail(),
                user.getRole().name()
        );
        return ResponseEntity.ok(responseDTO);
    }
}