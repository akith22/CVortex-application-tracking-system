package com.ats.atssystem.service;

import com.ats.atssystem.dto.LoginRequest;
import com.ats.atssystem.dto.RegisterRequest;
import com.ats.atssystem.model.User;
import com.ats.atssystem.repository.UserRepository;
import com.ats.atssystem.security.JwtUtil;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    // Rate limiting: Track failed login attempts
    private final Map<String, Integer> loginAttempts = new ConcurrentHashMap<>();
    private final Map<String, Long> lockoutTime = new ConcurrentHashMap<>();

    // Configuration
    private static final int MAX_ATTEMPTS = 5;
    private static final long LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

    public AuthService(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    // =========================
    // REGISTRATION
    // =========================
    public void register(RegisterRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // Validate password strength
        validatePasswordStrength(request.getPassword());

        // Create and save user
        User user = new User(
                request.getName(),
                request.getEmail(),
                encoder.encode(request.getPassword()),
                request.getRole()
        );

        userRepository.save(user);
    }

    // =========================
    // LOGIN WITH RATE LIMITING
    // =========================
    public String login(LoginRequest request) {
        String email = request.getEmail();

        // Check if account is locked due to too many failed attempts
        checkAndEnforceLockout(email);

        // Find user by email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        // Validate password
        if (!encoder.matches(request.getPassword(), user.getPassword())) {
            recordFailedLoginAttempt(email);
            throw new RuntimeException("Invalid credentials");
        }

        // Clear failed attempts on successful login
        clearFailedAttempts(email);

        // Generate and return JWT token
        return jwtUtil.generateToken(user.getEmail(), user.getRole().name());
    }

    // =========================
    // PASSWORD VALIDATION
    // =========================
    private void validatePasswordStrength(String password) {
        if (password == null || password.trim().isEmpty()) {
            throw new RuntimeException("Password cannot be empty");
        }

        if (password.length() < 8) {
            throw new RuntimeException("Password must be at least 8 characters long");
        }

        if (!password.matches(".*[A-Z].*")) {
            throw new RuntimeException("Password must contain at least one uppercase letter (A-Z)");
        }

        if (!password.matches(".*[a-z].*")) {
            throw new RuntimeException("Password must contain at least one lowercase letter (a-z)");
        }

        if (!password.matches(".*[0-9].*")) {
            throw new RuntimeException("Password must contain at least one digit (0-9)");
        }

        if (!password.matches(".*[!@#$%^&*()_+\\-=\\[\\]{};:'\",.<>?].*")) {
            throw new RuntimeException("Password must contain at least one special character (!@#$%^&* etc.)");
        }
    }

    // =========================
    // RATE LIMITING HELPERS
    // =========================
    private void checkAndEnforceLockout(String email) {
        if (lockoutTime.containsKey(email)) {
            long timeLeft = lockoutTime.get(email) - System.currentTimeMillis();
            if (timeLeft > 0) {
                long minutesLeft = (timeLeft / 60000) + 1;
                throw new RuntimeException(
                        "Account temporarily locked. Try again in " + minutesLeft + " minutes"
                );
            } else {
                // Lockout period expired, clear it
                lockoutTime.remove(email);
                loginAttempts.remove(email);
            }
        }
    }

    private void recordFailedLoginAttempt(String email) {
        int attempts = loginAttempts.getOrDefault(email, 0) + 1;
        loginAttempts.put(email, attempts);

        if (attempts >= MAX_ATTEMPTS) {
            // Lock the account
            lockoutTime.put(email, System.currentTimeMillis() + LOCKOUT_DURATION);
            loginAttempts.remove(email);
        }
    }

    private void clearFailedAttempts(String email) {
        loginAttempts.remove(email);
        lockoutTime.remove(email);
    }
}