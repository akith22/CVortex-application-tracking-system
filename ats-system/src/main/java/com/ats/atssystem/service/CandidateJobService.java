package com.ats.atssystem.service;

import com.ats.atssystem.dto.JobResponse;
import com.ats.atssystem.exception.JobNotAvailableException;
import com.ats.atssystem.exception.JobNotFoundException;
import com.ats.atssystem.model.Job;
import com.ats.atssystem.model.JobStatus;
import com.ats.atssystem.repository.JobRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for candidate job browsing functionality (Phase 2)
 * Handles read-only operations for OPEN jobs
 * Works with existing Job model - NO database changes required
 */
@Service
public class CandidateJobService {

    private final JobRepository jobRepository;

    public CandidateJobService(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    /**
     * Get all OPEN jobs for candidates to browse
     * Filters out CLOSED jobs automatically
     *
     * @return List of JobResponse containing only OPEN jobs
     */
    @Transactional(readOnly = true)
    public List<JobResponse> getAllOpenJobs() {
        return jobRepository.findAll()
                .stream()
                .filter(job -> job.getStatus() == JobStatus.OPEN)
                .map(this::convertToJobResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get a specific job by ID
     * Only returns if the job status is OPEN
     *
     * @param jobId The ID of the job to retrieve
     * @return JobResponse with job details
     * @throws JobNotFoundException if job doesn't exist
     * @throws JobNotAvailableException if job is CLOSED
     */
    @Transactional(readOnly = true)
    public JobResponse getJobById(Long jobId) {
        // Find the job or throw exception
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new JobNotFoundException(jobId));

        // Check if job is OPEN (candidates can only view OPEN jobs)
        if (job.getStatus() != JobStatus.OPEN) {
            throw new JobNotAvailableException();
        }

        return convertToJobResponse(job);
    }

    /**
     * Helper method to convert Job entity to JobResponse DTO
     * Includes recruiter information
     * Works with existing Job model fields only
     *
     * @param job The Job entity to convert
     * @return JobResponse DTO
     */
    private JobResponse convertToJobResponse(Job job) {
        return new JobResponse(
                job.getJobsId(),
                job.getTitle(),
                job.getDescription(),
                job.getLocation(),
                job.getStatus(),
                job.getRecruiter().getName(),
                job.getRecruiter().getEmail(),
                job.getCreatedAt()
        );
    }
}