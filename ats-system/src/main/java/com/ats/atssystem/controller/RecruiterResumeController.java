package com.ats.atssystem.controller;

import com.ats.atssystem.service.ResumeDownloadService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * Controller for recruiter operations on resumes.
 *
 * Phase R3: Resume Download
 * - Download resume for an application
 */
@PreAuthorize("hasRole('RECRUITER')")
@RestController
@RequestMapping("/recruiter/resumes")
public class RecruiterResumeController {

    private final ResumeDownloadService resumeDownloadService;

    public RecruiterResumeController(ResumeDownloadService resumeDownloadService) {
        this.resumeDownloadService = resumeDownloadService;
    }

    /**
     * Download a resume file.
     *
     * GET /recruiter/resumes/{resumeId}/download
     *
     * Security:
     * - Only the job owner can download resumes for their job applications
     *
     * @param resumeId the ID of the resume to download
     * @return the resume file as a downloadable resource
     */
    @GetMapping("/{resumeId}/download")
    public ResponseEntity<Resource> downloadResume(@PathVariable Long resumeId) {

        Resource resource = resumeDownloadService.getResumeFile(resumeId);
        String fileName = resumeDownloadService.getResumeFileName(resumeId);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + fileName + "\"")
                .body(resource);
    }
}