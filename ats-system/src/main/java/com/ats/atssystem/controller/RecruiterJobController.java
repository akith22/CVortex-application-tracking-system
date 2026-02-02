package com.ats.atssystem.controller;

import com.ats.atssystem.dto.ApplicantDTO;
import com.ats.atssystem.model.Job;
import com.ats.atssystem.model.JobStatus;
import com.ats.atssystem.service.JobService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@PreAuthorize("hasRole('RECRUITER')")
@RestController
@RequestMapping("/recruiter/jobs")
public class RecruiterJobController {

    private final JobService jobService;

    public RecruiterJobController(JobService jobService) {
        this.jobService = jobService;
    }

    @PostMapping
    public Job createJob(@RequestBody Job job) {
        return jobService.createJob(job);
    }

    @GetMapping
    public List<Job> getMyJobs() {
        return jobService.getMyJobs();
    }

    @PutMapping("/{jobId}/status")
    @PreAuthorize("hasRole('RECRUITER')")
    public void updateJobStatus(
            @PathVariable Long jobId,
            @RequestParam JobStatus status
    ) {
        jobService.updateJobStatus(jobId, status);
    }

    /**
     * Get all applicants for a specific job.
     *
     * GET /recruiter/jobs/{jobId}/applicants
     *
     * Returns list of applicants with their:
     * - Name
     * - Email
     * - Application status
     * - Applied date
     *
     * Security: Only the job owner can view applicants
     */
    @GetMapping("/{jobId}/applicants")
    public List<ApplicantDTO> getApplicantsForJob(@PathVariable Long jobId) {
        return jobService.getApplicantsForJob(jobId);
    }
}