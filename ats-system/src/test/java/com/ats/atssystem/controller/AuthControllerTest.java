package com.ats.atssystem.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;   // Move import here
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for AuthController
 */
@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc; // Mock MVC to perform HTTP requests in tests

    @Autowired
    private ObjectMapper objectMapper; // For JSON serialization/deserialization

    /**
     * TEST CASE 1:
     * Valid login should return JWT token
     */
    @Test
    void loginWithValidCredentials_shouldReturnJwtToken() throws Exception {

        // JSON body for login
        String loginRequest = """
            {
              "email": "candidate@test.com",
              "password": "password123"
            }
            """;

        // Perform POST /auth/login and check results
        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginRequest))
                .andExpect(status().isOk())              // Expect 200 OK
                .andExpect(jsonPath("$.token").exists()) // JWT token must exist
                .andExpect(jsonPath("$.token").isNotEmpty());
    }

    /**
     * TEST CASE 2:
     * Invalid password should fail login
     */
    @Test
    void loginWithInvalidPassword_shouldFail() throws Exception {

        String loginRequest = """
            {
              "email": "candidate@test.com",
              "password": "wrongpassword"
            }
            """;

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginRequest))
                .andExpect(status().isUnauthorized()); // Expect 401 Unauthorized
    }

    /**
     * TEST CASE 3:
     * Invalid email should fail login
     */
    @Test
    void loginWithInvalidEmail_shouldFail() throws Exception {

        String loginRequest = """
            {
              "email": "wrong@test.com",
              "password": "password123"
            }
            """;

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginRequest))
                .andExpect(status().isUnauthorized()); // Expect 401 Unauthorized
    }

    /**
     * TEST CASE 4:
     * Access secured endpoint without JWT should fail
     */
    @Test
    void accessSecuredEndpoint_withoutToken_shouldReturn403() throws Exception {

        // Perform GET /candidate/profile without Authorization header
        mockMvc.perform(get("/candidate/profile"))
                .andExpect(status().isForbidden()); // Expect 403 Unauthorized
    }
}
