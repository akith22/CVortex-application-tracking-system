package com.ats.atssystem.service;

import com.ats.atssystem.model.ApplicationStatus;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class ApplicationStatusTest {

    @Test
    void validTransition_shouldReturnTrue() {
        assertTrue(
                ApplicationStatus.isValidTransition(
                        ApplicationStatus.APPLIED,
                        ApplicationStatus.SHORTLISTED
                )
        );
    }

    @Test
    void invalidTransition_shouldReturnFalse() {
        assertFalse(
                ApplicationStatus.isValidTransition(
                        ApplicationStatus.REJECTED,
                        ApplicationStatus.HIRED
                )
        );
    }
}
