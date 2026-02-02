package com.ats.atssystem.service.impl;

import com.ats.atssystem.dto.ApplicantDTO;
import com.ats.atssystem.model.Application;
import com.ats.atssystem.model.Job;
import com.ats.atssystem.model.JobStatus;
import com.ats.atssystem.model.Resume;
import com.ats.atssystem.model.User;
import com.ats.atssystem.repository.ApplicationRepository;
import com.ats.atssystem.repository.JobRepository;
import com.ats.atssystem.repository.ResumeRepository;
import com.ats.atssystem.repository.UserRepository;
import com.ats.atssystem.service.JobService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobServiceImpl implements JobService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final ApplicationRepository applicationRepository;
    private final ResumeRepository resumeRepository;

    public JobServiceImpl(JobRepository jobRepository,
                          UserRepository userRepository,
                          ApplicationRepository applicationRepository,
                          ResumeRepository resumeRepository) {
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
        this.applicationRepository = applicationRepository;
        this.resumeRepository = resumeRepository;
    }

    @Override
    @PreAuthorize("hasRole('RECRUITER')")
    public Job createJob(Job job) {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User recruiter = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Recruiter not found"));

        job.setRecruiter(recruiter);
        job.setStatus(JobStatus.OPEN);

        return jobRepository.save(job);
    }

    @Override
    @PreAuthorize("hasRole('RECRUITER')")
    public List<Job> getMyJobs() {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User recruiter = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Recruiter not found"));

        return jobRepository.findByRecruiter(recruiter);
    }

    @Override
    @PreAuthorize("hasRole('RECRUITER')")
    public void updateJobStatus(Long jobId, JobStatus status) {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User recruiter = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Recruiter not found"));

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        // 🔒 Ownership check
        if (!job.getRecruiter().getUserId().equals(recruiter.getUserId())) {
            throw new RuntimeException("Access denied");
        }

        job.setStatus(status);
        jobRepository.save(job);
    }

    @Override
    @PreAuthorize("hasRole('RECRUITER')")
    public List<ApplicantDTO> getApplicantsForJob(Long jobId) {

        // Get authenticated recruiter
        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User recruiter = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Recruiter not found"));

        // Fetch the job
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        // 🔒 Ownership check - recruiter can only view applicants for their own jobs
        if (!job.getRecruiter().getUserId().equals(recruiter.getUserId())) {
            throw new RuntimeException("Access denied: You can only view applicants for your own jobs");
        }

        // Fetch all applications for this job
        List<Application> applications = applicationRepository.findByJobJobsId(jobId);

        // Map to DTOs with resume information
        return applications.stream()
                .map(app -> {
                    // Fetch resume for this application
                    Resume resume = resumeRepository
                            .findByApplicationApplicationId(app.getApplicationId())
                            .orElse(null);

                    return new ApplicantDTO(
                            app.getApplicationId(),
                            app.getCandidate().getUserId(),
                            app.getCandidate().getName(),
                            app.getCandidate().getEmail(),
                            app.getStatus(),
                            app.getAppliedAt(),
                            resume != null ? resume.getResumeId() : null,
                            resume != null ? resume.getFileName() : null,
                            resume != null
                    );
                })
                .collect(Collectors.toList());
    }
}