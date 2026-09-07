package org.example.workers_backend_services.exception;

public class JobAlreadyAcceptedException extends RuntimeException {
    public JobAlreadyAcceptedException(String message) {
        super(message);
    }
}