package com.ats.atssystem.dto;

/**
 * DTO for the resume upload request.
 *
 * The actual file is passed separately as a MultipartFile via @RequestParam.
 * This DTO carries only the applicationId that the resume should be linked to.
 *
 * Endpoint usage:
 *   POST /candidate/applications/{applicationId}/resume
 *   - applicationId comes from the @PathVariable (not this DTO)
 *   - file comes as @RequestParam("file") MultipartFile
 *
 * This class exists primarily as a clear contract; the controller
 * binds applicationId from the path and file from multipart directly.
 */
public class ResumeUploadRequest {

    private Long applicationId;

    public ResumeUploadRequest() {
    }

    public ResumeUploadRequest(Long applicationId) {
        this.applicationId = applicationId;
    }

    public Long getApplicationId() {
        return applicationId;
    }

    public void setApplicationId(Long applicationId) {
        this.applicationId = applicationId;
    }
}