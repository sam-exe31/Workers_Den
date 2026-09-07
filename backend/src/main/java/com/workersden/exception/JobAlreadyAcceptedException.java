package com.workersden.exception;

public class JobAlreadyAcceptedException extends RuntimeException {
    public JobAlreadyAcceptedException(String message) {
        super(message);
    }
}

