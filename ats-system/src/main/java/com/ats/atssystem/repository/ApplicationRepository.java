package com.ats.atssystem.repository;

import com.ats.atssystem.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for the Application entity.
 *
 * Phase 3 methods:
 *   - existsByCandidateUserIdAndJobJobsId
 *   - findByCandidateUserIdAndJobJobsId
 *
 * Phase 4 methods added:
 *   - findByCandidateUserId  → fetches all applications for the candidate dashboard
 *
 * Phase R3 methods added:
 *   - findByJobJobsId  → fetches all applications for a specific job (recruiter view)
 */
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    // ============================================================
    // Phase 3 — Apply for Job
    // ============================================================

    /**
     * Checks whether a candidate has already applied to a specific job.
     *
     * @param candidateUserId the userId from the User entity
     * @param jobsId          the jobsId from the Job entity
     * @return true if an application already exists for this pair
     */
    boolean existsByCandidateUserIdAndJobJobsId(Long candidateUserId, Long jobsId);

    /**
     * Retrieves an existing application for a specific candidate + job pair.
     *
     * @param candidateUserId the userId from the User entity
     * @param jobsId          the jobsId from the Job entity
     * @return Optional containing the application if it exists
     */
    Optional<Application> findByCandidateUserIdAndJobJobsId(Long candidateUserId, Long jobsId);

    // ============================================================
    // Phase 4 — Candidate Dashboard
    // ============================================================

    /**
     * Fetches all applications submitted by a specific candidate.
     * Used to populate the candidate's dashboard.
     *
     * @param candidateUserId the userId of the authenticated candidate
     * @return List of all applications by this candidate (empty list if none)
     */
    List<Application> findByCandidateUserId(Long candidateUserId);

    // ============================================================
    // Phase R3 — View Applicants per Job
    // ============================================================

    /**
     * Fetches all applications for a specific job.
     * Used by recruiters to view all applicants for their job postings.
     *
     * @param jobsId the jobsId of the job
     * @return List of all applications for this job (empty list if none)
     */
    List<Application> findByJobJobsId(Long jobsId);
}