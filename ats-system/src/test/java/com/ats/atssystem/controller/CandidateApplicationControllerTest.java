package com.ats.atssystem.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

// Standard static imports for MockMvc request building and result matching
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class CandidateApplicationControllerTest {
    @Autowired
    private MockMvc mockMvc;

    /**
     * TEST CASE 1: Apply for Job with Resume
     * Verifies the multipart/form-data endpoint
     */
    @Test
    @WithMockUser(username = "candidate@test.com", roles = "CANDIDATE")
    void applyForJob_withResume_shouldReturn201() throws Exception {

        // Creating a mock PDF file to simulate the resume upload [cite: 206, 2661]
        MockMultipartFile resumeFile = new MockMultipartFile(
                "file", "my_resume.pdf", "application/pdf", "dummy content".getBytes());

        // Performing the multipart request with jobId as a parameter [cite: 206, 759]
        mockMvc.perform(multipart("/candidate/applications")
                        .file(resumeFile)
                        .param("jobId", "1"))
                .andExpect(status().isCreated()) // Expect HTTP 201
                .andExpect(jsonPath("$.status").value("APPLIED")); // Default status [cite: 1472, 1513]
    }

    /**
     * TEST CASE 2: View Candidate Dashboard
     * Fetches all applications for the logged-in candidate [cite: 206, 2623]
     */
    @Test
    @WithMockUser(username = "candidate@test.com", roles = "CANDIDATE")
    void getAllMyApplications_shouldReturnList() throws Exception {
        // Performing GET request to dashboard endpoint
        mockMvc.perform(get("/candidate/applications"))
                .andExpect(status().isOk()) // Expect HTTP 200 [cite: 210]
                .andExpect(jsonPath("$").isArray()); // Should return a list [cite: 214]
    }
}
