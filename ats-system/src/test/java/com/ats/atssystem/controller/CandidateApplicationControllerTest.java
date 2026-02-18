package com.ats.atssystem.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional   // Rollback after each test
class CandidateApplicationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    /**
     * TEST CASE 1:
     * Apply for a job with resume
     * Expect: 201 Created
     */
    @Test
    @WithMockUser(username = "candidate@test.com", roles = "CANDIDATE")
    void applyForJob_withResume_shouldReturn201() throws Exception {

        MockMultipartFile resumeFile = new MockMultipartFile(
                "file",
                "resume.pdf",
                "application/pdf",
                "dummy content".getBytes()
        );

        mockMvc.perform(multipart("/candidate/applications")
                        .file(resumeFile)
                        .param("jobId", "1"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("APPLIED"));
    }

    /**
     * TEST CASE 2:
     * Apply for same job twice (Duplicate)
     * Expect: 409 Conflict
     */
    @Test
    @WithMockUser(username = "candidate@test.com", roles = "CANDIDATE")
    void applyForSameJobTwice_shouldReturn409() throws Exception {

        MockMultipartFile resumeFile = new MockMultipartFile(
                "file",
                "resume.pdf",
                "application/pdf",
                "dummy content".getBytes()
        );

        // First application (should succeed)
        mockMvc.perform(multipart("/candidate/applications")
                        .file(resumeFile)
                        .param("jobId", "1"))
                .andExpect(status().isCreated());

        // Second application (duplicate - should fail)
        mockMvc.perform(multipart("/candidate/applications")
                        .file(resumeFile)
                        .param("jobId", "1"))
                .andExpect(status().isConflict());
    }

    /**
     * TEST CASE 3:
     * Get all applications for logged-in candidate
     * Expect: 200 OK + Array response
     */
    @Test
    @WithMockUser(username = "candidate@test.com", roles = "CANDIDATE")
    void getAllMyApplications_shouldReturnList() throws Exception {

        mockMvc.perform(get("/candidate/applications"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    /**
     * TEST CASE 4:
     * Access candidate endpoint without authentication
     * Expect: 403 Forbidden
     */
    @Test
    void accessWithoutLogin_shouldReturn403() throws Exception {

        mockMvc.perform(get("/candidate/applications"))
                .andExpect(status().isForbidden());
    }

    /**
     * TEST CASE 5:
     * Access candidate endpoint with wrong role
     * Expect: 403 Forbidden
     */
    @Test
    @WithMockUser(username = "admin@test.com", roles = "ADMIN")
    void adminTryingToAccessCandidateEndpoint_shouldReturn403() throws Exception {

        mockMvc.perform(get("/candidate/applications"))
                .andExpect(status().isForbidden());
    }
}
