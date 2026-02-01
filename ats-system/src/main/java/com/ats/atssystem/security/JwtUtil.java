package com.ats.atssystem.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {

    // CRITICAL: Load from environment variables, NOT hardcoded
    @Value("${jwt.secret}")
    private String SECRET;

    @Value("${jwt.expiration:86400000}") // Default 24 hours in milliseconds
    private long EXPIRATION;

    private SecretKey getKey() {
        // Validate secret is long enough for HS256 (minimum 32 characters)
        if (SECRET == null || SECRET.length() < 32) {
            throw new IllegalStateException(
                    "JWT secret must be at least 32 characters. " +
                            "Set 'jwt.secret' property in application.properties or environment variables"
            );
        }
        return Keys.hmacShaKeyFor(SECRET.getBytes());
    }

    // =========================
    // TOKEN GENERATION
    // =========================
    public String generateToken(String email, String role) {
        return Jwts.builder()
                .setSubject(email)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION))
                .signWith(getKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // =========================
    // TOKEN EXTRACTION
    // =========================
    public String extractEmail(String token) {
        return getClaims(token).getSubject();
    }

    public String extractRole(String token) {
        return getClaims(token).get("role", String.class);
    }

    // =========================
    // TOKEN VALIDATION
    // =========================
    public boolean validateToken(String token) {
        try {
            getClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    // =========================
    // INTERNAL
    // =========================
    private Claims getClaims(String token) {
        return Jwts.parser()
                .setSigningKey(getKey())
                .parseClaimsJws(token)
                .getBody();
    }
}