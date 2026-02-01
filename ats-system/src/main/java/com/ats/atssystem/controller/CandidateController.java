package com.ats.atssystem.controller;

import com.ats.atssystem.dto.UpdateCandidateNameRequest;
import com.ats.atssystem.dto.CandidateProfileResponse;
import com.ats.atssystem.service.CandidateService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/candidate")
public class CandidateController {

    private final CandidateService candidateService;

    public CandidateController(CandidateService candidateService) {
        this.candidateService = candidateService;
    }

    /**
     * Get logged-in candidate's profile
     * Secured: Only CANDIDATE role can access
     */
    @GetMapping("/profile")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<CandidateProfileResponse> getCandidateProfile() {
        CandidateProfileResponse profile = candidateService.getCandidateProfile();
        return ResponseEntity.ok(profile);
    }

    /**
     * Update candidate's name
     * Secured: Only CANDIDATE role can access
     */
    @PutMapping("/profile")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<CandidateProfileResponse> updateCandidateProfile(
            @Valid @RequestBody UpdateCandidateNameRequest request) {
        CandidateProfileResponse profile = candidateService.updateCandidateProfile(request.getName());
        return ResponseEntity.ok(profile);
    }
}