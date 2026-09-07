package org.example.workers_backend_services.Exception;

public class JobAlreadyAcceptedException extends RuntimeException {
    public JobAlreadyAcceptedException(String message) {
        super(message);
    }
}