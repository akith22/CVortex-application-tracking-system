package com.ats.atssystem.controller;

import com.ats.atssystem.dto.ApplicationRequest;
import com.ats.atssystem.dto.ApplicationResponse;
import com.ats.atssystem.dto.CandidateApplicationsResponse;
import com.ats.atssystem.model.User;
import com.ats.atssystem.repository.UserRepository;
import com.ats.atssystem.service.CandidateApplicationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * Controller for candidate-facing application features.
 *
 * Endpoints:
 *   POST /candidate/applications   → Apply for a job + upload resume (one multipart request)
 *   GET  /candidate/applications   → Dashboard: all my applications
 *
 * All endpoints require JWT + CANDIDATE role.
 *
 * The JWT filter sets the principal as the user's EMAIL (not userId).
 * So we extract the email from the token, then look up the User entity
 * via UserRepository to get the actual userId.
 */
@RestController
@RequestMapping("/candidate/applications")
public class CandidateApplicationController {

    private final CandidateApplicationService candidateApplicationService;
    private final UserRepository userRepository;

    public CandidateApplicationController(CandidateApplicationService candidateApplicationService,
                                          UserRepository userRepository) {
        this.candidateApplicationService = candidateApplicationService;
        this.userRepository = userRepository;
    }

    // ============================================================
    // Apply for Job + Upload Resume
    // ============================================================

    /**
     * Apply for a job and upload resume in a single multipart request.
     *
     * Content-Type: multipart/form-data
     *   jobId  → the ID of the job to apply to
     *   file   → the resume PDF file
     *
     * Response: 201 Created + ApplicationResponse
     *
     * @param jobId the ID of the job (form field)
     * @param file  the resume PDF (multipart file)
     * @return 201 Created with ApplicationResponse
     */
    @PostMapping(consumes = "multipart/form-data")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<ApplicationResponse> applyForJob(
            @RequestParam("jobId") Long jobId,
            @RequestParam("file") MultipartFile file) {

        Long candidateId = getAuthenticatedUserId();

        ApplicationRequest request = new ApplicationRequest(jobId);
        ApplicationResponse response = candidateApplicationService.applyForJob(request, file, candidateId);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ============================================================
    // Candidate Dashboard
    // ============================================================

    /**
     * Get all applications submitted by the authenticated candidate.
     *
     * Response: 200 OK + List<CandidateApplicationsResponse>
     *
     * @return 200 OK with the list of application dashboard cards
     */
    @GetMapping
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<List<CandidateApplicationsResponse>> getAllMyApplications() {
        Long candidateId = getAuthenticatedUserId();
        List<CandidateApplicationsResponse> applications = candidateApplicationService.getAllApplications(candidateId);
        return ResponseEntity.ok(applications);
    }

    // ============================================================
    // Private helper — extract userId from JWT email
    // ============================================================

    /**
     * Extracts the authenticated user's ID by:
     *   1. Getting the email from the JWT principal (set by JwtFilter)
     *   2. Looking up the User entity by that email
     *   3. Returning the userId
     *
     * @return the userId of the authenticated candidate
     */
    private Long getAuthenticatedUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getPrincipal().toString();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found for email: " + email));

        return user.getUserId();
    }
}