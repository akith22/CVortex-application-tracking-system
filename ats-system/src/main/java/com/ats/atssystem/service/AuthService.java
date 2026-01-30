package com.ats.atssystem.service;

import com.ats.atssystem.dto.LoginRequest;
import com.ats.atssystem.dto.RegisterRequest;
import com.ats.atssystem.model.User;
import com.ats.atssystem.repository.UserRepository;
import com.ats.atssystem.security.JwtUtil;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public AuthService(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    public void register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User(
                request.getName(),
                request.getEmail(),
                encoder.encode(request.getPassword()),
                request.getRole()
        );

        userRepository.save(user);
    }

    public String login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!encoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        // IMPORTANT: include role in JWT
        return jwtUtil.generateToken(
                user.getEmail(),
                user.getRole().name()
        );
    }

}
