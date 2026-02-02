package com.ats.atssystem.dto;

import com.ats.atssystem.model.ApplicationStatus;
import java.time.LocalDateTime;

/**
 * DTO for displaying applicant information to recruiters.
 *
 * Contains all essential information a recruiter needs to see
 * when reviewing applications for a specific job, including resume details.
 */
public class ApplicantDTO {

    private Long applicationId;
    private Long candidateId;
    private String candidateName;
    private String candidateEmail;
    private ApplicationStatus status;
    private LocalDateTime appliedAt;

    // Resume information
    private Long resumeId;
    private String resumeFileName;
    private Boolean hasResume;

    // ============================================================
    // Constructors
    // ============================================================

    public ApplicantDTO() {
    }

    public ApplicantDTO(Long applicationId, Long candidateId, String candidateName,
                        String candidateEmail, ApplicationStatus status, LocalDateTime appliedAt,
                        Long resumeId, String resumeFileName, Boolean hasResume) {
        this.applicationId = applicationId;
        this.candidateId = candidateId;
        this.candidateName = candidateName;
        this.candidateEmail = candidateEmail;
        this.status = status;
        this.appliedAt = appliedAt;
        this.resumeId = resumeId;
        this.resumeFileName = resumeFileName;
        this.hasResume = hasResume;
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

    public Long getCandidateId() {
        return candidateId;
    }

    public void setCandidateId(Long candidateId) {
        this.candidateId = candidateId;
    }

    public String getCandidateName() {
        return candidateName;
    }

    public void setCandidateName(String candidateName) {
        this.candidateName = candidateName;
    }

    public String getCandidateEmail() {
        return candidateEmail;
    }

    public void setCandidateEmail(String candidateEmail) {
        this.candidateEmail = candidateEmail;
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

    public Boolean getHasResume() {
        return hasResume;
    }

    public void setHasResume(Boolean hasResume) {
        this.hasResume = hasResume;
    }
}