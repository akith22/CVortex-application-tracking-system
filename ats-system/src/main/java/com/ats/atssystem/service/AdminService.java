package com.ats.atssystem.service;

import com.ats.atssystem.dto.*;
import com.ats.atssystem.model.Job;
import com.ats.atssystem.model.JobStatus;
import com.ats.atssystem.model.Role;
import com.ats.atssystem.model.User;
import com.ats.atssystem.repository.JobRepository;
import com.ats.atssystem.repository.UserRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for Admin operations.
 *
 * Phases:
 * - A1: Dashboard statistics
 * - A2: View all users
 * - A3: View all jobs
 * - A4: View and edit admin profile
 */
@Service
public class AdminService {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;

    public AdminService(UserRepository userRepository, JobRepository jobRepository) {
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
    }

    /**
     * PHASE A1: Get Dashboard Statistics
     */
    public AdminDashboardStatsDTO getDashboardStats() {
        Long totalUsers = userRepository.count();
        Long recruiters = userRepository.countByRole(Role.RECRUITER);
        Long candidates = userRepository.countByRole(Role.CANDIDATE);

        Long totalJobs = jobRepository.count();
        Long openJobs = jobRepository.countByStatus(JobStatus.OPEN);
        Long closedJobs = jobRepository.countByStatus(JobStatus.CLOSED);

        return new AdminDashboardStatsDTO(
                totalUsers,
                recruiters,
                candidates,
                totalJobs,
                openJobs != null ? openJobs : 0L,
                closedJobs != null ? closedJobs : 0L
        );
    }

    /**
     * PHASE A2: Get All Users
     */
    public List<AdminUserDTO> getAllUsers() {
        List<User> users = userRepository.findAll();

        return users.stream()
                .map(user -> new AdminUserDTO(
                        user.getEmail(),
                        user.getName(),
                        user.getRole()
                ))
                .collect(Collectors.toList());
    }

    /**
     * PHASE A3: Get All Jobs
     */
    public List<AdminJobDTO> getAllJobs() {
        List<Job> jobs = jobRepository.findAll();

        return jobs.stream()
                .map(job -> new AdminJobDTO(
                        job.getJobsId(),
                        job.getTitle(),
                        job.getRecruiter().getEmail(),
                        job.getRecruiter().getName(),
                        job.getStatus(),
                        job.getLocation()
                ))
                .collect(Collectors.toList());
    }

    /**
     * PHASE A4: Get Admin Profile
     */
    public AdminProfileDTO getAdminProfile(String email) {
        User admin = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Admin not found"));

        return new AdminProfileDTO(
                admin.getEmail(),
                admin.getName(),
                admin.getRole(),
                admin.getCreatedAt()
        );
    }

    /**
     * PHASE A4: Update Admin Name
     */
    @Transactional
    public AdminProfileDTO updateAdminName(String email, String newName) {
        User admin = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Admin not found"));

        // Validate name
        if (newName == null || newName.trim().isEmpty()) {
            throw new IllegalArgumentException("Name cannot be empty");
        }

        if (newName.length() > 100) {
            throw new IllegalArgumentException("Name must be 100 characters or less");
        }

        // Update name
        admin.setName(newName.trim());
        userRepository.save(admin);

        return new AdminProfileDTO(
                admin.getEmail(),
                admin.getName(),
                admin.getRole(),
                admin.getCreatedAt()
        );
    }
}