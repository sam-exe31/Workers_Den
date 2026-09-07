package org.example.workers_backend_services.Entity;
import com.fasterxml.jackson.annotation.JsonFormat;

@JsonFormat(with = JsonFormat.Feature.ACCEPT_CASE_INSENSITIVE_PROPERTIES)

public enum Role {
    CUSTOMER,
    WORKER,
    ADMIN
}
