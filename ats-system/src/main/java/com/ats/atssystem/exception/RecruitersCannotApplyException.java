package com.ats.atssystem.exception;

/**
 * Thrown when the authenticated user is the recruiter who posted the job
 * and attempts to apply to it.
 * Maps to HTTP 403 Forbidden.
 *
 * Constraint enforced: "Recruiter cannot apply to own jobs"
 */
public class RecruitersCannotApplyException extends RuntimeException {

    public RecruitersCannotApplyException() {
        super("Recruiters cannot apply to their own job postings.");
    }

    public RecruitersCannotApplyException(Long jobId) {
        super("You are the recruiter for job ID: " + jobId + ". Recruiters cannot apply to their own postings.");
    }
}