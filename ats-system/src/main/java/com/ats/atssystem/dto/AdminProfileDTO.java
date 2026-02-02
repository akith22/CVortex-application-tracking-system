package com.ats.atssystem.dto;

import com.ats.atssystem.model.Role;

import java.time.LocalDateTime;

/**
 * DTO for Admin Profile information.
 * Used for GET /admin/profile responses.
 */
public class AdminProfileDTO {

    private String email;
    private String name;
    private Role role;
    private LocalDateTime createdAt;

    public AdminProfileDTO() {
    }

    public AdminProfileDTO(String email, String name, Role role, LocalDateTime createdAt) {
        this.email = email;
        this.name = name;
        this.role = role;
        this.createdAt = createdAt;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}