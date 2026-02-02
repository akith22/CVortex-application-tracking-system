package com.ats.atssystem.controller;

import com.ats.atssystem.dto.UpdateApplicationStatusDTO;
import com.ats.atssystem.service.ApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * Controller for recruiter operations on applications.
 *
 * Phase R4: Application Status Management
 * - Update application status (SHORTLIST, REJECT, HIRE)
 */
@PreAuthorize("hasRole('RECRUITER')")
@RestController
@RequestMapping("/recruiter/applications")
public class RecruiterApplicationController {

    private final ApplicationService applicationService;

    public RecruiterApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    /**
     * Update the status of an application.
     *
     * PUT /recruiter/applications/{applicationId}/status
     *
     * Body:
     * {
     *   "status": "SHORTLISTED" | "REJECTED" | "HIRED"
     * }
     *
     * Valid transitions:
     * - APPLIED → SHORTLISTED
     * - APPLIED → REJECTED
     * - SHORTLISTED → HIRED
     * - SHORTLISTED → REJECTED
     *
     * Security:
     * - Only job owner can update application status
     * - Invalid transitions are rejected
     */
    @PutMapping("/{applicationId}/status")
    public ResponseEntity<String> updateApplicationStatus(
            @PathVariable Long applicationId,
            @RequestBody UpdateApplicationStatusDTO statusDTO
    ) {
        applicationService.updateApplicationStatus(applicationId, statusDTO.getStatus());
        return ResponseEntity.ok("Application status updated successfully");
    }
}