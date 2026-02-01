package com.ats.atssystem.exception;

/**
 * Thrown when a candidate attempts to apply to a job they have already applied to.
 * Maps to HTTP 409 Conflict.
 *
 * Constraint enforced: "Candidate can apply only once per job"
 */
public class DuplicateApplicationException extends RuntimeException {

    public DuplicateApplicationException() {
        super("You have already applied to this job.");
    }

    public DuplicateApplicationException(Long jobId) {
        super("You have already applied to job ID: " + jobId);
    }
}