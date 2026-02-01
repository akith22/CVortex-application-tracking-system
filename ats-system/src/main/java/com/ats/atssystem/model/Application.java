package com.ats.atssystem.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Entity representing a candidate's job application.
 *
 * Maps to the 'applications' table:
 *   - application_id BIGINT (PK, auto-generated)
 *   - jobs_id        BIGINT (FK → jobs.jobs_id)
 *   - candidate_id   BIGINT (FK → users.user_id)
 *   - status         ENUM   (ApplicationStatus — starts as APPLIED)
 *   - applied_at     TIMESTAMP (auto-set on creation)
 *
 * Unique constraint: one application per (candidate, job) pair.
 */
@Entity
@Table(
        name = "applications",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_candidate_job",
                        columnNames = {"candidate_id", "jobs_id"}
                )
        }
)
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "application_id")
    private Long applicationId;

    // ---- Many-to-One: application → job ----
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "jobs_id", nullable = false)
    private Job job;

    // ---- Many-to-One: application → candidate (User) ----
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "candidate_id", nullable = false)
    private User candidate;

    // ---- Application status (enum persisted as STRING to match DB ENUM) ----
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ApplicationStatus status;

    // ---- Timestamp: automatically set when the row is inserted ----
    @Column(name = "applied_at", nullable = false, updatable = false)
    private LocalDateTime appliedAt;

    // ---- Pre-persist hook: set defaults before INSERT ----
    @PrePersist
    protected void onCreate() {
        this.status = ApplicationStatus.APPLIED;
        this.appliedAt = LocalDateTime.now();
    }

    // ============================================================
    // Constructors
    // ============================================================

    public Application() {
    }

    /**
     * Convenience constructor used by the service layer.
     * Status and appliedAt are set automatically by @PrePersist.
     */
    public Application(Job job, User candidate) {
        this.job = job;
        this.candidate = candidate;
    }

    // ============================================================
    // Getters & Setters
    // ============================================================

    public Long getApplicationId() {
        return applicationId;
    }

    public void setApplicationId(Long applicationId) {
        this.applicationId = applicationId;
    }

    public Job getJob() {
        return job;
    }

    public void setJob(Job job) {
        this.job = job;
    }

    public User getCandidate() {
        return candidate;
    }

    public void setCandidate(User candidate) {
        this.candidate = candidate;
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }

    public LocalDateTime getAppliedAt() {
        return appliedAt;
    }

    public void setAppliedAt(LocalDateTime appliedAt) {
        this.appliedAt = appliedAt;
    }
}