package com.ats.atssystem.service;

import com.ats.atssystem.dto.CandidateProfileResponse;
import com.ats.atssystem.model.User;
import com.ats.atssystem.repository.UserRepository;
import com.ats.atssystem.security.JwtUtil;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class CandidateService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public CandidateService(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    /**
     * Get current logged-in candidate profile from JWT
     */
    public CandidateProfileResponse getCandidateProfile() {
        String email = getCurrentUserEmail();

        User candidate = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));

        return new CandidateProfileResponse(
                candidate.getUserId(),
                candidate.getName(),
                candidate.getEmail(),
                candidate.getRole().name(),
                candidate.getCreatedAt()
        );
    }

    /**
     * Update candidate's name
     */
    public CandidateProfileResponse updateCandidateProfile(String newName) {
        // Validate name
        if (newName == null || newName.trim().isEmpty()) {
            throw new IllegalArgumentException("Name cannot be empty");
        }

        if (newName.length() < 2 || newName.length() > 100) {
            throw new IllegalArgumentException("Name must be between 2 and 100 characters");
        }

        String email = getCurrentUserEmail();

        User candidate = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));

        // Update name
        candidate.setName(newName.trim());
        userRepository.save(candidate);

        return new CandidateProfileResponse(
                candidate.getUserId(),
                candidate.getName(),
                candidate.getEmail(),
                candidate.getRole().name(),
                candidate.getCreatedAt()
        );
    }

    /**
     * Helper: Get current user's email from Spring Security context
     */
    private String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User is not authenticated");
        }

        // The principal contains the email (set in JwtFilter)
        return authentication.getPrincipal().toString();
    }
}