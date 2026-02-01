package com.ats.atssystem.exception;

/**
 * Exception thrown when a job is not found by ID
 */
public class JobNotFoundException extends RuntimeException {

    public JobNotFoundException(String message) {
        super(message);
    }

    public JobNotFoundException(Long jobId) {
        super("Job not found with ID: " + jobId);
    }
}