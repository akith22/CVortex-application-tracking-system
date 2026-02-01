package com.ats.atssystem.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Entity representing a resume file attached to an application.
 *
 * Maps to the 'resumes' table:
 *   - resume_id      BIGINT       (PK, auto-generated)
 *   - application_id BIGINT       (FK → applications.application_id)
 *   - file_name      VARCHAR(500)
 *   - file_path      VARCHAR(500) (server-side storage path)
 *   - uploaded_at    TIMESTAMP
 *
 * ⚠️  Phase 3 STUB — file upload logic is deferred to Phase 4.
 *     This entity is defined now so the table mapping exists and
 *     the Application ↔ Resume relationship can be wired up.
 */
@Entity
@Table(name = "resumes")
public class Resume {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "resume_id")
    private Long resumeId;

    // ---- One-to-One: resume → application ----
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false, unique = true)
    private Application application;

    @Column(name = "file_name", length = 500, nullable = false)
    private String fileName;

    @Column(name = "file_path", length = 500, nullable = false)
    private String filePath;

    @Column(name = "uploaded_at", nullable = false, updatable = false)
    private LocalDateTime uploadedAt;

    // ---- Pre-persist hook ----
    @PrePersist
    protected void onCreate() {
        this.uploadedAt = LocalDateTime.now();
    }

    // ============================================================
    // Constructors
    // ============================================================

    public Resume() {
    }

    public Resume(Application application, String fileName, String filePath) {
        this.application = application;
        this.fileName = fileName;
        this.filePath = filePath;
    }

    // ============================================================
    // Getters & Setters
    // ============================================================

    public Long getResumeId() {
        return resumeId;
    }

    public void setResumeId(Long resumeId) {
        this.resumeId = resumeId;
    }

    public Application getApplication() {
        return application;
    }

    public void setApplication(Application application) {
        this.application = application;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }

    public void setUploadedAt(LocalDateTime uploadedAt) {
        this.uploadedAt = uploadedAt;
    }
}