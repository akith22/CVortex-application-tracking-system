package com.ats.atssystem.dto;

import com.ats.atssystem.model.ApplicationStatus;
import java.time.LocalDateTime;

/**
 * DTO representing a single application entry on the candidate's dashboard.
 *
 * Combines application data + job data + resume presence into one response
 * so the frontend can render a full card without extra API calls.
 *
 * resumeUploaded is a simple boolean flag — the candidate doesn't need
 * the full resume details on the dashboard list view.
 */
public class CandidateApplicationsResponse {

    private Long applicationId;
    private Long jobId;
    private String jobTitle;
    private String jobLocation;
    private String recruiterName;
    private ApplicationStatus status;
    private boolean resumeUploaded;
    private LocalDateTime appliedAt;

    // ============================================================
    // Constructors
    // ============================================================

    public CandidateApplicationsResponse() {
    }

    public CandidateApplicationsResponse(Long applicationId, Long jobId, String jobTitle,
                                         String jobLocation, String recruiterName,
                                         ApplicationStatus status, boolean resumeUploaded,
                                         LocalDateTime appliedAt) {
        this.applicationId = applicationId;
        this.jobId = jobId;
        this.jobTitle = jobTitle;
        this.jobLocation = jobLocation;
        this.recruiterName = recruiterName;
        this.status = status;
        this.resumeUploaded = resumeUploaded;
        this.appliedAt = appliedAt;
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

    public String getJobLocation() {
        return jobLocation;
    }

    public void setJobLocation(String jobLocation) {
        this.jobLocation = jobLocation;
    }

    public String getRecruiterName() {
        return recruiterName;
    }

    public void setRecruiterName(String recruiterName) {
        this.recruiterName = recruiterName;
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }

    public boolean isResumeUploaded() {
        return resumeUploaded;
    }

    public void setResumeUploaded(boolean resumeUploaded) {
        this.resumeUploaded = resumeUploaded;
    }

    public LocalDateTime getAppliedAt() {
        return appliedAt;
    }

    public void setAppliedAt(LocalDateTime appliedAt) {
        this.appliedAt = appliedAt;
    }
}