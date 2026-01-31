package com.ats.atssystem.service.impl;

import com.ats.atssystem.dto.RecruiterProfileResponse;
import com.ats.atssystem.model.Role;
import com.ats.atssystem.model.User;
import com.ats.atssystem.repository.UserRepository;
import com.ats.atssystem.service.RecruiterService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class RecruiterServiceImpl implements RecruiterService {

    private final UserRepository userRepository;

    public RecruiterServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // ============================
    // GET LOGGED-IN RECRUITER
    // ============================
    @Override
    @PreAuthorize("hasRole('RECRUITER')")
    public RecruiterProfileResponse getMyProfile() {

        String email = getLoggedInEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Recruiter not found"));

        if (user.getRole() != Role.RECRUITER) {
            throw new RuntimeException("Access denied");
        }

        return new RecruiterProfileResponse(
                user.getUserId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name()
        );
    }

    // ============================
    // UPDATE LOGGED-IN RECRUITER NAME
    // ============================
    @Override
    @PreAuthorize("hasRole('RECRUITER')")
    public void updateMyName(String name) {

        String email = getLoggedInEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Recruiter not found"));

        if (user.getRole() != Role.RECRUITER) {
            throw new RuntimeException("Access denied");
        }

        user.setName(name);
        userRepository.save(user);
    }

    // ============================
    // INTERNAL HELPER
    // ============================
    private String getLoggedInEmail() {
        return SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();
    }
}
