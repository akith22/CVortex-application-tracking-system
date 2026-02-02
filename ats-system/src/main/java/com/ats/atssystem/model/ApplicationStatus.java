package com.ats.atssystem.model;

/**
 * Enum representing the possible statuses of a job application.
 *
 * Phase 3: APPLIED (default initial status)
 * Phase R4: SHORTLISTED, REJECTED, HIRED
 *
 * Valid transitions:
 * - APPLIED → SHORTLISTED
 * - APPLIED → REJECTED
 * - SHORTLISTED → HIRED
 * - SHORTLISTED → REJECTED
 */
public enum ApplicationStatus {
    APPLIED,
    SHORTLISTED,
    REJECTED,
    HIRED;

    /**
     * Validates if a status transition is allowed.
     *
     * @param from the current status
     * @param to   the target status
     * @return true if the transition is valid
     */
    public static boolean isValidTransition(ApplicationStatus from, ApplicationStatus to) {
        if (from == to) {
            return false; // No point in transitioning to the same status
        }

        switch (from) {
            case APPLIED:
                return to == SHORTLISTED || to == REJECTED;
            case SHORTLISTED:
                return to == HIRED || to == REJECTED;
            case REJECTED:
            case HIRED:
                return false; // Terminal states - no further transitions allowed
            default:
                return false;
        }
    }
}