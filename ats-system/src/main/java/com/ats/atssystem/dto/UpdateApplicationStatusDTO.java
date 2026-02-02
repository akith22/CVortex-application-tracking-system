package com.ats.atssystem.dto;

import com.ats.atssystem.model.ApplicationStatus;

/**
 * DTO for updating application status.
 * Used by recruiters to change the status of an application.
 */
public class UpdateApplicationStatusDTO {

    private ApplicationStatus status;

    // ============================================================
    // Constructors
    // ============================================================

    public UpdateApplicationStatusDTO() {
    }

    public UpdateApplicationStatusDTO(ApplicationStatus status) {
        this.status = status;
    }

    // ============================================================
    // Getters & Setters
    // ============================================================

    public ApplicationStatus getStatus() {
        return status;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }
}