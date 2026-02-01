package com.ats.atssystem.dto;

import com.ats.atssystem.model.JobStatus;
import java.time.LocalDateTime;

/**
 * DTO for returning job information to candidates
 * Works with existing Job table schema (no new fields required)
 */
public class JobResponse {

    private Long jobsId;
    private String title;
    private String description;
    private String location;
    private JobStatus status;
    private String recruiterName;
    private String recruiterEmail;
    private LocalDateTime createdAt;

    // ---- Constructors ----

    public JobResponse() {
    }

    public JobResponse(Long jobsId, String title, String description, String location,
                       JobStatus status, String recruiterName, String recruiterEmail,
                       LocalDateTime createdAt) {
        this.jobsId = jobsId;
        this.title = title;
        this.description = description;
        this.location = location;
        this.status = status;
        this.recruiterName = recruiterName;
        this.recruiterEmail = recruiterEmail;
        this.createdAt = createdAt;
    }

    // ---- Getters & Setters ----

    public Long getJobsId() {
        return jobsId;
    }

    public void setJobsId(Long jobsId) {
        this.jobsId = jobsId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public JobStatus getStatus() {
        return status;
    }

    public void setStatus(JobStatus status) {
        this.status = status;
    }

    public String getRecruiterName() {
        return recruiterName;
    }

    public void setRecruiterName(String recruiterName) {
        this.recruiterName = recruiterName;
    }

    public String getRecruiterEmail() {
        return recruiterEmail;
    }

    public void setRecruiterEmail(String recruiterEmail) {
        this.recruiterEmail = recruiterEmail;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}