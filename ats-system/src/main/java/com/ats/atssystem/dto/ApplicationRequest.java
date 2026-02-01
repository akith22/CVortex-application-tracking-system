package com.ats.atssystem.dto;

/**
 * DTO for the apply-for-job request.
 *
 * Phase 4 change: the resume file is uploaded in the SAME request.
 * The file itself is passed as @RequestParam("file") MultipartFile
 * in the controller — this DTO only carries the jobId.
 *
 * Postman example (multipart/form-data):
 *   jobId  → 1
 *   file   → MyResume.pdf
 */
public class ApplicationRequest {

    private Long jobId;

    public ApplicationRequest() {
    }

    public ApplicationRequest(Long jobId) {
        this.jobId = jobId;
    }

    public Long getJobId() {
        return jobId;
    }

    public void setJobId(Long jobId) {
        this.jobId = jobId;
    }
}