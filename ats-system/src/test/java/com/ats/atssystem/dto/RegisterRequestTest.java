package com.ats.atssystem.dto;

import com.ats.atssystem.model.Role;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class RegisterRequestTest {

    private Validator validator;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    void validRegisterRequest_shouldHaveNoViolations() {
        RegisterRequest request = new RegisterRequest(
                "John Doe",
                "john@example.com",
                "password123",
                Role.CANDIDATE
        );

        Set<ConstraintViolation<RegisterRequest>> violations =
                validator.validate(request);

        assertTrue(violations.isEmpty());
    }

    @Test
    void blankName_shouldFailValidation() {
        RegisterRequest request = new RegisterRequest(
                "",
                "john@example.com",
                "password123",
                Role.CANDIDATE
        );

        Set<ConstraintViolation<RegisterRequest>> violations =
                validator.validate(request);

        assertFalse(violations.isEmpty());
    }

    @Test
    void invalidEmail_shouldFailValidation() {
        RegisterRequest request = new RegisterRequest(
                "John Doe",
                "invalid-email",
                "password123",
                Role.CANDIDATE
        );

        Set<ConstraintViolation<RegisterRequest>> violations =
                validator.validate(request);

        assertFalse(violations.isEmpty());
    }

    @Test
    void shortPassword_shouldFailValidation() {
        RegisterRequest request = new RegisterRequest(
                "John Doe",
                "john@example.com",
                "123",
                Role.CANDIDATE
        );

        Set<ConstraintViolation<RegisterRequest>> violations =
                validator.validate(request);

        assertFalse(violations.isEmpty());
    }

    @Test
    void nullRole_shouldFailValidation() {
        RegisterRequest request = new RegisterRequest(
                "John Doe",
                "john@example.com",
                "password123",
                null
        );

        Set<ConstraintViolation<RegisterRequest>> violations =
                validator.validate(request);

        assertFalse(violations.isEmpty());
    }
}
