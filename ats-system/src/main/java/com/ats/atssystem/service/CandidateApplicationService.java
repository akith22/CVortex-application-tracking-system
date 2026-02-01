package com.ats.atssystem.service;

import com.ats.atssystem.dto.ApplicationRequest;
import com.ats.atssystem.dto.ApplicationResponse;
import com.ats.atssystem.dto.CandidateApplicationsResponse;
import com.ats.atssystem.exception.DuplicateApplicationException;
import com.ats.atssystem.exception.JobNotAvailableException;
import com.ats.atssystem.exception.JobNotFoundException;
import com.ats.atssystem.exception.RecruitersCannotApplyException;
import com.ats.atssystem.model.Application;
import com.ats.atssystem.model.Job;
import com.ats.atssystem.model.JobStatus;
import com.ats.atssystem.model.Resume;
import com.ats.atssystem.model.User;
import com.ats.atssystem.repository.ApplicationRepository;
import com.ats.atssystem.repository.JobRepository;
import com.ats.atssystem.repository.ResumeRepository;
import com.ats.atssystem.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service layer for candidate-facing application features.
 *
 * Phase 3 → Phase 4 change:
 *   applyForJob() now accepts a MultipartFile alongside the jobId.
 *   The application and resume are created together in a single transaction.
 *   If the file save fails, the application row is also rolled back.
 *
 * Endpoints served:
 *   POST /candidate/applications          → apply + upload resume (one request)
 *   GET  /candidate/applications          → dashboard (all my applications)
 */
@Service
public class CandidateApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final ResumeRepository resumeRepository;
    private final ResumeStorageService resumeStorageService;

    public CandidateApplicationService(ApplicationRepository applicationRepository,
                                       JobRepository jobRepository,
                                       UserRepository userRepository,
                                       ResumeRepository resumeRepository,
                                       ResumeStorageService resumeStorageService) {
        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
        this.resumeRepository = resumeRepository;
        this.resumeStorageService = resumeStorageService;
    }

    // ============================================================
    // Apply for Job + Upload Resume (single transaction)
    // ============================================================

    /**
     * Applies the authenticated candidate to a job AND uploads their resume.
     * Both happen in one transaction — if anything fails, both roll back.
     *
     * Validation order (fail-fast):
     *   1. Resolve the candidate User entity
     *   2. Resolve the Job entity                      → 404 if missing
     *   3. Job must be OPEN                            → 403 if CLOSED
     *   4. Candidate must NOT be the recruiter         → 403 if they are
     *   5. No duplicate application                    → 409 if already applied
     *   6. Validate and save the resume file to disk
     *   7. Persist the Application row
     *   8. Persist the Resume row linked to that application
     *
     * @param request     DTO containing the jobId
     * @param file        the resume PDF file
     * @param candidateId the user_id extracted from the JWT token
     * @return ApplicationResponse confirming both the application and resume
     */
    @Transactional
    public ApplicationResponse applyForJob(ApplicationRequest request, MultipartFile file, Long candidateId) {

        // ── Step 1: Resolve the candidate ──────────────────────────────
        User candidate = userRepository.findById(candidateId)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found. Token may be stale."));

        // ── Step 2: Resolve the job (404 if not found) ─────────────────
        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() -> new JobNotFoundException(request.getJobId()));

        // ── Step 3: Job must be OPEN (403 if CLOSED) ────────────────────
        if (job.getStatus() != JobStatus.OPEN) {
            throw new JobNotAvailableException(request.getJobId());
        }

        // ── Step 4: Recruiter cannot apply to own job (403) ─────────────
        if (job.getRecruiter().getUserId().equals(candidateId)) {
            throw new RecruitersCannotApplyException(request.getJobId());
        }

        // ── Step 5: Duplicate application check (409) ───────────────────
        if (applicationRepository.existsByCandidateUserIdAndJobJobsId(candidateId, request.getJobId())) {
            throw new DuplicateApplicationException(request.getJobId());
        }

        // ── Step 6: Validate and save resume file to disk ───────────────
        String filePath = resumeStorageService.saveResume(file);

        // ── Step 7: Persist the Application ─────────────────────────────
        Application application = new Application(job, candidate);
        Application savedApplication = applicationRepository.save(application);

        // ── Step 8: Persist the Resume linked to the application ─────────
        Resume resume = new Resume(savedApplication, file.getOriginalFilename(), filePath);
        Resume savedResume = resumeRepository.save(resume);

        // ── Step 9: Map to response DTO ─────────────────────────────────
        return convertToApplicationResponse(savedApplication, savedResume);
    }

    // ============================================================
    // Candidate Dashboard — get all applications
    // ============================================================

    /**
     * Fetches all applications for the authenticated candidate.
     * Used to populate the candidate dashboard.
     *
     * @param candidateId the user_id from the JWT token
     * @return List of CandidateApplicationsResponse (empty list if none)
     */
    @Transactional(readOnly = true)
    public List<CandidateApplicationsResponse> getAllApplications(Long candidateId) {
        List<Application> applications = applicationRepository.findByCandidateUserId(candidateId);

        return applications.stream()
                .map(this::convertToDashboardResponse)
                .collect(Collectors.toList());
    }

    // ============================================================
    // Private helpers
    // ============================================================

    /** Maps Application + Resume to the apply response DTO */
    private ApplicationResponse convertToApplicationResponse(Application application, Resume resume) {
        return new ApplicationResponse(
                application.getApplicationId(),
                application.getJob().getJobsId(),
                application.getJob().getTitle(),
                application.getCandidate().getName(),
                application.getStatus(),
                application.getAppliedAt(),
                resume.getResumeId(),
                resume.getFileName()
        );
    }

    /** Maps Application to the dashboard card DTO */
    private CandidateApplicationsResponse convertToDashboardResponse(Application application) {
        boolean resumeUploaded = resumeRepository
                .findByApplicationApplicationId(application.getApplicationId())
                .isPresent();

        return new CandidateApplicationsResponse(
                application.getApplicationId(),
                application.getJob().getJobsId(),
                application.getJob().getTitle(),
                application.getJob().getLocation(),
                application.getJob().getRecruiter().getName(),
                application.getStatus(),
                resumeUploaded,
                application.getAppliedAt()
        );
    }
}