package com.ats.atssystem.service;

import com.ats.atssystem.dto.ApplicantDTO;
import com.ats.atssystem.model.Job;
import com.ats.atssystem.model.JobStatus;

import java.util.List;

public interface JobService {

    Job createJob(Job job);

    List<Job> getMyJobs();

    void updateJobStatus(Long jobId, JobStatus status);

    /**
     * Get all applicants for a specific job.
     * Only the job owner (recruiter) can view applicants.
     *
     * @param jobId the ID of the job
     * @return List of ApplicantDTO containing applicant information
     * @throws RuntimeException if job not found or access denied
     */
    List<ApplicantDTO> getApplicantsForJob(Long jobId);
}