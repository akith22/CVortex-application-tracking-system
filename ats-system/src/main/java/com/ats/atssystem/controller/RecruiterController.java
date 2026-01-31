package com.ats.atssystem.controller;

import com.ats.atssystem.dto.RecruiterProfileResponse;
import com.ats.atssystem.dto.UpdateRecruiterProfileRequest;
import com.ats.atssystem.service.RecruiterService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/recruiter")
public class RecruiterController {

    private final RecruiterService recruiterService;

    public RecruiterController(RecruiterService recruiterService) {
        this.recruiterService = recruiterService;
    }

    @GetMapping("/profile")
    @PreAuthorize("hasRole('RECRUITER')")
    public RecruiterProfileResponse getProfile() {
        return recruiterService.getMyProfile();
    }

    @PutMapping("/profile")
    @PreAuthorize("hasRole('RECRUITER')")
    public void updateProfile(
            @RequestBody UpdateRecruiterProfileRequest request
    ) {
        recruiterService.updateMyName(request.getName());
    }
}
