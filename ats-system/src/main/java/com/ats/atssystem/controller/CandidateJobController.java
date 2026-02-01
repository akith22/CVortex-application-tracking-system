package com.ats.atssystem.controller;

import com.ats.atssystem.dto.JobResponse;
import com.ats.atssystem.service.CandidateJobService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for candidate job browsing functionality (Phase 2)
 * Provides read-only access to OPEN jobs for candidates
 * All endpoints require JWT authentication with CANDIDATE role
 */
@RestController
@RequestMapping("/candidate/jobs")
public class CandidateJobController {

    private final CandidateJobService candidateJobService;

    public CandidateJobController(CandidateJobService candidateJobService) {
        this.candidateJobService = candidateJobService;
    }

    /**
     * Get all OPEN jobs
     *
     * Endpoint: GET /candidate/jobs
     * Authorization: CANDIDATE role required
     *
     * @return List of all OPEN jobs with recruiter information
     */
    @GetMapping
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<List<JobResponse>> getAllOpenJobs() {
        List<JobResponse> jobs = candidateJobService.getAllOpenJobs();
        return ResponseEntity.ok(jobs);
    }

    /**
     * Get a specific job by ID
     *
     * Endpoint: GET /candidate/jobs/{jobId}
     * Authorization: CANDIDATE role required
     *
     * @param jobId The ID of the job to retrieve
     * @return Job details if job exists and is OPEN
     * @throws JobNotFoundException if job doesn't exist (404)
     * @throws JobNotAvailableException if job is CLOSED (403)
     */
    @GetMapping("/{jobId}")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<JobResponse> getJobById(@PathVariable Long jobId) {
        JobResponse job = candidateJobService.getJobById(jobId);
        return ResponseEntity.ok(job);
    }
}