package org.example.workers_backend_services.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class UserRequestDTO {

    @NotBlank(message = "name is required")
    private String user_name;
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;
    @NotBlank(message = "Phone is required")
    @Pattern(regexp = "^[0-9]{10}$",message = "phone must be 10 digits")
    private String phone;
    @NotBlank(message = "password is required")
    @Size(min = 6,message = "password must be atleast 6 character ")
    private String password;
    @NotBlank(message = "Role is required")
    @Pattern(regexp = "CUSTOMER|WORKER", message = "Role must be CUSTOMER or WORKER")
    private String role;
}
