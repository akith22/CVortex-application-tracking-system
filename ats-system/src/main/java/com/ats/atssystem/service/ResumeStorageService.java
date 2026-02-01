package com.ats.atssystem.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

/**
 * Handles physical file validation and storage for resume uploads.
 *
 * Responsibilities:
 *   - Validate file type (PDF only) and size limit
 *   - Generate a unique file name to prevent collisions
 *   - Write the file to the local upload directory
 *   - Return the saved file path as a string for the Resume entity
 *
 * The upload directory is configured via application.properties:
 *   app.resume.upload-dir=uploads/resumes
 *
 * This service is intentionally isolated so that swapping to S3 or
 * another cloud storage in the future only requires changing this class.
 */
@Service
public class ResumeStorageService {

    /** Allowed MIME types for resume uploads */
    private static final Set<String> ALLOWED_CONTENT_TYPES = new HashSet<>(
            Arrays.asList("application/pdf")
    );

    /** Max file size: 5 MB */
    private static final long MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

    /** Directory where resume files are saved (from application.properties) */
    private final Path uploadDirectory;

    public ResumeStorageService(@Value("${app.resume.upload-dir:uploads/resumes}") String uploadDir) {
        this.uploadDirectory = Paths.get(uploadDir).toAbsolutePath().normalize();
    }

    /**
     * Validates and saves a resume file to disk.
     *
     * @param file the uploaded MultipartFile
     * @return the full file path where the resume was saved
     * @throws IllegalArgumentException if file is empty, wrong type, or too large
     * @throws RuntimeException         if writing to disk fails
     */
    public String saveResume(MultipartFile file) {

        // ── Validation ─────────────────────────────────────────────────
        validateFile(file);

        // ── Generate a unique filename ─────────────────────────────────
        // Format: <UUID>_<originalFileName>
        // Example: a1b2c3d4-..._JohnDoe_Resume.pdf
        String originalName = file.getOriginalFilename();
        String uniqueFileName = UUID.randomUUID() + "_" + originalName;

        // ── Ensure the upload directory exists ─────────────────────────
        try {
            Files.createDirectories(uploadDirectory);
        } catch (IOException e) {
            throw new RuntimeException("Failed to create upload directory: " + uploadDirectory, e);
        }

        // ── Write file to disk ─────────────────────────────────────────
        Path targetPath = uploadDirectory.resolve(uniqueFileName).normalize();

        try {
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new RuntimeException("Failed to save resume file: " + uniqueFileName, e);
        }

        return targetPath.toString();
    }

    // ============================================================
    // Private helpers
    // ============================================================

    /**
     * Validates the uploaded file against size and type constraints.
     *
     * @param file the MultipartFile to validate
     * @throws IllegalArgumentException if any check fails
     */
    private void validateFile(MultipartFile file) {

        // Empty file check
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Resume file cannot be empty.");
        }

        // File size check (max 5 MB)
        if (file.getSize() > MAX_FILE_SIZE_BYTES) {
            throw new IllegalArgumentException("Resume file exceeds the maximum allowed size of 5 MB.");
        }

        // Content type check (PDF only)
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType)) {
            throw new IllegalArgumentException("Only PDF files are allowed for resume upload.");
        }
    }
}