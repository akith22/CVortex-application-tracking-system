package com.ats.atssystem.service.impl;

import com.ats.atssystem.model.Job;
import com.ats.atssystem.model.JobStatus;
import com.ats.atssystem.model.User;
import com.ats.atssystem.repository.JobRepository;
import com.ats.atssystem.repository.UserRepository;
import com.ats.atssystem.service.JobService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobServiceImpl implements JobService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    public JobServiceImpl(JobRepository jobRepository,
                          UserRepository userRepository) {
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
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
}
