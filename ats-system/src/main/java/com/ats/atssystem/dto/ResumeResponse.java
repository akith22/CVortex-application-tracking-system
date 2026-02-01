package com.ats.atssystem.dto;

import java.time.LocalDateTime;

/**
 * DTO returned to the candidate after a successful resume upload.
 * Confirms the resume was saved and linked to the correct application.
 */
public class ResumeResponse {

    private Long resumeId;
    private Long applicationId;
    private String fileName;
    private LocalDateTime uploadedAt;

    // ============================================================
    // Constructors
    // ============================================================

    public ResumeResponse() {
    }

    public ResumeResponse(Long resumeId, Long applicationId, String fileName, LocalDateTime uploadedAt) {
        this.resumeId = resumeId;
        this.applicationId = applicationId;
        this.fileName = fileName;
        this.uploadedAt = uploadedAt;
    }

    // ============================================================
    // Getters & Setters
    // ============================================================

    public Long getResumeId() {
        return resumeId;
    }

    public void setResumeId(Long resumeId) {
        this.resumeId = resumeId;
    }

    public Long getApplicationId() {
        return applicationId;
    }

    public void setApplicationId(Long applicationId) {
        this.applicationId = applicationId;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }

    public void setUploadedAt(LocalDateTime uploadedAt) {
        this.uploadedAt = uploadedAt;
    }
}