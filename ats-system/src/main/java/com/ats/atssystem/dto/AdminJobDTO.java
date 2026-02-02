package com.ats.atssystem.dto;

import com.ats.atssystem.model.JobStatus;

/**
 * DTO for Admin Job List View (Phase A3)
 *
 * Returns job information with recruiter details.
 * Read-only view for admin to see all jobs.
 */
public class AdminJobDTO {

    private Long jobId;
    private String title;
    private String recruiterEmail;
    private String recruiterName;
    private JobStatus status;
    private String location;

    public AdminJobDTO() {
    }

    public AdminJobDTO(Long jobId, String title, String recruiterEmail,
                       String recruiterName, JobStatus status, String location) {
        this.jobId = jobId;
        this.title = title;
        this.recruiterEmail = recruiterEmail;
        this.recruiterName = recruiterName;
        this.status = status;
        this.location = location;
    }

    // Getters and Setters

    public Long getJobId() {
        return jobId;
    }

    public void setJobId(Long jobId) {
        this.jobId = jobId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getRecruiterEmail() {
        return recruiterEmail;
    }

    public void setRecruiterEmail(String recruiterEmail) {
        this.recruiterEmail = recruiterEmail;
    }

    public String getRecruiterName() {
        return recruiterName;
    }

    public void setRecruiterName(String recruiterName) {
        this.recruiterName = recruiterName;
    }

    public JobStatus getStatus() {
        return status;
    }

    public void setStatus(JobStatus status) {
        this.status = status;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }
}