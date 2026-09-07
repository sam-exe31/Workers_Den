package org.example.workers_backend_services.Exception;

public class InvalidJobStateException extends RuntimeException {
    public InvalidJobStateException(String message) {
        super(message);
    }
}