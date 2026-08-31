package org.example.workers_backend_services.Controller;

import jakarta.validation.Valid;
import org.example.workers_backend_services.DTO.UserRequestDTO;
import org.example.workers_backend_services.DTO.UserResponseDTO;
import org.example.workers_backend_services.Entity.Users;
import org.example.workers_backend_services.Service.UserServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")

public class UserController {

    @Autowired
    UserServices userServices;

    @GetMapping  // all
    public ResponseEntity<List<UserResponseDTO>> getallUsers(){
        List<UserResponseDTO> use=userServices.getallusers();
        return ResponseEntity.ok(use);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> getUserbyid( @PathVariable  Long id){
        UserResponseDTO use = userServices.getuserbyid(id);
        return ResponseEntity.ok(use);
    }
    @GetMapping("/me")
    public ResponseEntity<UserResponseDTO> getCurrentUser(Authentication authentication) {
        String email = authentication.getName();   // the email set as principal in JwtAuthFilter
        UserResponseDTO user = userServices.getUserByEmail(email);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/me")
    public ResponseEntity<UserResponseDTO> updateCurrentUser(
            Authentication authentication,
            @RequestBody java.util.Map<String, String> body) {
        String email = authentication.getName();
        String fullName = body.get("fullName") != null ? body.get("fullName") : body.get("user_name");
        String phone = body.get("phone");
        UserResponseDTO updatedUser = userServices.updateUserProfile(email, fullName, phone);
        return ResponseEntity.ok(updatedUser);
    }

    @PostMapping
    public ResponseEntity<UserResponseDTO> adduser(@Valid @RequestBody UserRequestDTO dto){
        return ResponseEntity.ok(userServices.adduser(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponseDTO> updateusers(@PathVariable Long id,@Valid @RequestBody UserRequestDTO dto){
        UserResponseDTO updateduser=userServices.updateusers(id,dto);
        return ResponseEntity.ok(updateduser);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteuser(@PathVariable Long id){
        userServices.deleteuser(id);
        return ResponseEntity.ok("User deleted successfully");
    }

}
