package com.ats.atssystem.repository;

import com.ats.atssystem.model.Resume;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * Repository for the Resume entity.
 *
 * Phase 4 methods:
 *   - findByApplicationApplicationId  → checks if a resume exists for an application
 */
public interface ResumeRepository extends JpaRepository<Resume, Long> {

    /**
     * Find the resume attached to a specific application.
     *
     * @param applicationId the application_id to look up
     * @return Optional containing the Resume if one has been uploaded
     */
    Optional<Resume> findByApplicationApplicationId(Long applicationId);
}