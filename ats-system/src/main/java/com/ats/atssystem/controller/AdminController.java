package com.ats.atssystem.controller;

import com.ats.atssystem.dto.*;
import com.ats.atssystem.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for Admin operations.
 *
 * All endpoints require ADMIN role.
 *
 * Phase A1: Dashboard statistics
 * Phase A2: View all users
 * Phase A3: View all jobs
 * Phase A4: View and edit admin profile
 */
@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    /**
     * PHASE A1: Get Dashboard Statistics
     *
     * GET /admin/dashboard/stats
     *
     * Returns:
     * {
     *   "totalUsers": 25,
     *   "recruiters": 5,
     *   "candidates": 20,
     *   "totalJobs": 12,
     *   "openJobs": 8,
     *   "closedJobs": 4
     * }
     *
     * Security: Admin only
     */
    @GetMapping("/dashboard/stats")
    public AdminDashboardStatsDTO getDashboardStats() {
        return adminService.getDashboardStats();
    }

    /**
     * PHASE A2: Get All Users
     *
     * GET /admin/users
     *
     * Returns list of all users (recruiters and candidates).
     * Passwords are excluded for security.
     *
     * Sample Response:
     * [
     *   {
     *     "email": "recruiter@test.com",
     *     "name": "Alice",
     *     "role": "RECRUITER"
     *   },
     *   {
     *     "email": "candidate@test.com",
     *     "name": "Bob",
     *     "role": "CANDIDATE"
     *   }
     * ]
     *
     * Security: Admin only
     * Note: Read-only, no editing capability
     */
    @GetMapping("/users")
    public List<AdminUserDTO> getAllUsers() {
        return adminService.getAllUsers();
    }

    /**
     * PHASE A3: Get All Jobs
     *
     * GET /admin/jobs
     *
     * Returns list of all jobs with recruiter information.
     *
     * Sample Response:
     * [
     *   {
     *     "jobId": 1,
     *     "title": "Software Engineer",
     *     "recruiterEmail": "recruiter@test.com",
     *     "recruiterName": "Alice",
     *     "status": "OPEN",
     *     "location": "New York"
     *   }
     * ]
     *
     * Security: Admin only
     * Note: Read-only, no editing capability
     */
    @GetMapping("/jobs")
    public List<AdminJobDTO> getAllJobs() {
        return adminService.getAllJobs();
    }

    /**
     * PHASE A4: Get Admin Profile
     *
     * GET /admin/profile
     *
     * Returns the admin's profile information.
     *
     * Sample Response:
     * {
     *   "email": "admin@test.com",
     *   "name": "Admin User",
     *   "role": "ADMIN",
     *   "createdAt": "2024-01-15T10:30:00"
     * }
     *
     * Security: Admin only
     */
    @GetMapping("/profile")
    public ResponseEntity<AdminProfileDTO> getProfile(Authentication authentication) {
        String email = authentication.getName();
        AdminProfileDTO profile = adminService.getAdminProfile(email);
        return ResponseEntity.ok(profile);
    }

    /**
     * PHASE A4: Update Admin Name
     *
     * PUT /admin/profile
     *
     * Request Body:
     * {
     *   "name": "New Admin Name"
     * }
     *
     * Returns updated profile.
     *
     * Security: Admin only
     * Validation: Name cannot be empty, max 100 characters
     */
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @Valid @RequestBody UpdateNameRequest request,
            Authentication authentication) {
        try {
            String email = authentication.getName();
            AdminProfileDTO updatedProfile = adminService.updateAdminName(email, request.getName());
            return ResponseEntity.ok(updatedProfile);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(new ErrorResponse("Failed to update profile"));
        }
    }

    /**
     * Simple error response class
     */
    private static class ErrorResponse {
        private final String message;

        public ErrorResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }
    }
}