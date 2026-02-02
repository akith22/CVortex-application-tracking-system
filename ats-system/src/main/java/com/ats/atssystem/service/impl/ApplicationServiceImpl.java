package com.ats.atssystem.service.impl;

import com.ats.atssystem.model.Application;
import com.ats.atssystem.model.ApplicationStatus;
import com.ats.atssystem.model.User;
import com.ats.atssystem.repository.ApplicationRepository;
import com.ats.atssystem.repository.UserRepository;
import com.ats.atssystem.service.ApplicationService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ApplicationServiceImpl implements ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;

    public ApplicationServiceImpl(ApplicationRepository applicationRepository,
                                  UserRepository userRepository) {
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
    }

    @Override
    @PreAuthorize("hasRole('RECRUITER')")
    @Transactional
    public void updateApplicationStatus(Long applicationId, ApplicationStatus newStatus) {

        // Get authenticated recruiter
        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User recruiter = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Recruiter not found"));

        // Fetch the application
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        // 🔒 Ownership check - recruiter must own the job
        if (!application.getJob().getRecruiter().getUserId().equals(recruiter.getUserId())) {
            throw new RuntimeException("Access denied: You can only update applications for your own jobs");
        }

        // ✅ Validate status transition
        ApplicationStatus currentStatus = application.getStatus();
        if (!ApplicationStatus.isValidTransition(currentStatus, newStatus)) {
            throw new RuntimeException(
                    String.format("Invalid status transition: Cannot change from %s to %s",
                            currentStatus, newStatus)
            );
        }

        // Update and save
        application.setStatus(newStatus);
        applicationRepository.save(application);
    }
}