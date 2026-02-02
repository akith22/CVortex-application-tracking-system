package com.ats.atssystem.repository;

import com.ats.atssystem.model.Job;
import com.ats.atssystem.model.JobStatus;
import com.ats.atssystem.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for Job entity operations.
 *
 * Provides:
 * - Standard CRUD operations
 * - Custom queries for job filtering
 * - Admin statistics queries
 */
@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

    /**
     * Find all jobs posted by a specific recruiter
     * Used by recruiters to view their own jobs
     */
    List<Job> findByRecruiter(User recruiter);

    /**
     * Find all jobs with a specific status
     * Used for filtering open/closed jobs
     */
    List<Job> findByStatus(JobStatus status);

    /**
     * Count jobs by status (for admin dashboard statistics)
     * Used in Phase A1
     */
    Long countByStatus(JobStatus status);
}