package com.ats.atssystem.service;

import com.ats.atssystem.model.Resume;
import com.ats.atssystem.model.User;
import com.ats.atssystem.repository.ResumeRepository;
import com.ats.atssystem.repository.UserRepository;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * Service for downloading resume files.
 *
 * Responsibilities:
 * - Verify recruiter owns the job associated with the resume
 * - Load the file from disk
 * - Return it as a Resource for download
 */
@Service
public class ResumeDownloadService {

    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;

    public ResumeDownloadService(ResumeRepository resumeRepository,
                                 UserRepository userRepository) {
        this.resumeRepository = resumeRepository;
        this.userRepository = userRepository;
    }

    /**
     * Get the resume file as a downloadable resource.
     *
     * Security: Only the job owner (recruiter) can download.
     *
     * @param resumeId the ID of the resume
     * @return Resource containing the file
     * @throws RuntimeException if resume not found, access denied, or file not readable
     */
    @PreAuthorize("hasRole('RECRUITER')")
    public Resource getResumeFile(Long resumeId) {

        // Get authenticated recruiter
        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User recruiter = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Recruiter not found"));

        // Fetch the resume
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new RuntimeException("Resume not found"));

        // 🔒 Ownership check - recruiter must own the job
        Long jobOwnerId = resume.getApplication().getJob().getRecruiter().getUserId();
        if (!jobOwnerId.equals(recruiter.getUserId())) {
            throw new RuntimeException("Access denied: You can only download resumes for your own job applications");
        }

        // Load file from disk
        try {
            Path filePath = Paths.get(resume.getFilePath()).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("Resume file not found or not readable: " + resume.getFileName());
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to load resume file: " + resume.getFileName(), e);
        }
    }

    /**
     * Get the original file name for the resume.
     * Used to set the download filename in the HTTP response.
     *
     * @param resumeId the ID of the resume
     * @return the original file name
     */
    @PreAuthorize("hasRole('RECRUITER')")
    public String getResumeFileName(Long resumeId) {

        // Get authenticated recruiter
        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User recruiter = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Recruiter not found"));

        // Fetch the resume
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new RuntimeException("Resume not found"));

        // 🔒 Ownership check
        Long jobOwnerId = resume.getApplication().getJob().getRecruiter().getUserId();
        if (!jobOwnerId.equals(recruiter.getUserId())) {
            throw new RuntimeException("Access denied");
        }

        return resume.getFileName();
    }
}