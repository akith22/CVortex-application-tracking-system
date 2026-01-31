package com.ats.atssystem.controller;

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

}
