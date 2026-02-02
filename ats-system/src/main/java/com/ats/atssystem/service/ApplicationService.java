package com.ats.atssystem.service;

import com.ats.atssystem.model.ApplicationStatus;

/**
 * Service for managing job applications.
 *
 * Phase R4: Application Status Management
 */
public interface ApplicationService {

    /**
     * Update the status of an application.
     *
     * Validates:
     * - Application exists
     * - Recruiter owns the job
     * - Status transition is valid
     *
     * @param applicationId the ID of the application to update
     * @param newStatus the new status to set
     * @throws RuntimeException if application not found, access denied, or invalid transition
     */
    void updateApplicationStatus(Long applicationId, ApplicationStatus newStatus);
}