package com.ats.atssystem.repository;

import com.ats.atssystem.model.Role;
import com.ats.atssystem.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for User entity operations.
 *
 * Provides:
 * - Standard CRUD operations
 * - Custom queries for user management
 * - Admin statistics queries
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Find user by email (for authentication and profile retrieval)
     */
    Optional<User> findByEmail(String email);

    /**
     * Check if email already exists (for registration validation)
     */
    boolean existsByEmail(String email);

    /**
     * Count users by role (for admin dashboard statistics)
     * Used in Phase A1
     */
    Long countByRole(Role role);
}