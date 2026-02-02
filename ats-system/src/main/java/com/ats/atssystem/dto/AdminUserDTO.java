package com.ats.atssystem.dto;

import com.ats.atssystem.model.Role;

/**
 * DTO for Admin User List View (Phase A2)
 *
 * Returns basic user information without password.
 * Read-only view for admin to see all users.
 */
public class AdminUserDTO {

    private String email;
    private String name;
    private Role role;

    public AdminUserDTO() {
    }

    public AdminUserDTO(String email, String name, Role role) {
        this.email = email;
        this.name = name;
        this.role = role;
    }

    // Getters and Setters

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
}