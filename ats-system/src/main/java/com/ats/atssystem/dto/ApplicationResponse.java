package com.ats.atssystem.dto;

import com.ats.atssystem.model.ApplicationStatus;
import java.time.LocalDateTime;

/**
 * DTO returned after a candidate successfully applies for a job.
 *
 * Phase 4 change: includes resume fields so the single response
 * confirms both the application AND the resume upload together.
 */
public class ApplicationResponse {

    private Long applicationId;
    private Long jobId;
    private String jobTitle;
    private String candidateName;
    private ApplicationStatus status;
    private LocalDateTime appliedAt;

    // ---- Resume confirmation fields ----
    private Long resumeId;
    private String resumeFileName;

    // ============================================================
    // Constructors
    // ============================================================

    public ApplicationResponse() {
    }

    public ApplicationResponse(Long applicationId, Long jobId, String jobTitle,
                               String candidateName, ApplicationStatus status,
                               LocalDateTime appliedAt,
                               Long resumeId, String resumeFileName) {
        this.applicationId = applicationId;
        this.jobId = jobId;
        this.jobTitle = jobTitle;
        this.candidateName = candidateName;
        this.status = status;
        this.appliedAt = appliedAt;
        this.resumeId = resumeId;
        this.resumeFileName = resumeFileName;
    }

    // ============================================================
    // Getters & Setters
    // ============================================================

    public Long getApplicationId() {
        return applicationId;
    }

    public void setApplicationId(Long applicationId) {
        this.applicationId = applicationId;
    }

    public Long getJobId() {
        return jobId;
    }

    public void setJobId(Long jobId) {
        this.jobId = jobId;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getCandidateName() {
        return candidateName;
    }

    public void setCandidateName(String candidateName) {
        this.candidateName = candidateName;
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }

    public LocalDateTime getAppliedAt() {
        return appliedAt;
    }

    public void setAppliedAt(LocalDateTime appliedAt) {
        this.appliedAt = appliedAt;
    }

    public Long getResumeId() {
        return resumeId;
    }

    public void setResumeId(Long resumeId) {
        this.resumeId = resumeId;
    }

    public String getResumeFileName() {
        return resumeFileName;
    }

    public void setResumeFileName(String resumeFileName) {
        this.resumeFileName = resumeFileName;
    }
}