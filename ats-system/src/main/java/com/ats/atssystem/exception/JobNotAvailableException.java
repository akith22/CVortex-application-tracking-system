package com.ats.atssystem.exception;

/**
 * Exception thrown when trying to access a CLOSED job.
 * Maps to HTTP 403 Forbidden.
 *
 * Used in:
 *   - Phase 2: CandidateJobService (viewing a closed job)
 *   - Phase 3: CandidateApplicationService (applying to a closed job)
 */
public class JobNotAvailableException extends RuntimeException {

    public JobNotAvailableException() {
        super("This job is no longer available");
    }

    public JobNotAvailableException(String message) {
        super(message);
    }

    public JobNotAvailableException(Long jobId) {
        super("Job ID: " + jobId + " is closed and not available");
    }
}