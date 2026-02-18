package com.ats.atssystem.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class RecruiterControllerTest {

    @Autowired
    private MockMvc mockMvc;

    /**
     * TEST CASE: Valid Status Update
     */
    @Test
    @WithMockUser(roles = "RECRUITER")
    void updateApplicationStatus_shouldReturn200() throws Exception {

        String request = """
            {
                "status": "SHORTLISTED"
            }
            """;

        mockMvc.perform(
                        put("/recruiter/applications/1/status")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(request))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("SHORTLISTED"));
    }

    /**
     * TEST CASE: Invalid Status Transition
     */
    @Test
    @WithMockUser(roles = "RECRUITER")
    void invalidStatusTransition_shouldReturn400() throws Exception {

        String request = """
            {
                "status": "HIRED"
            }
            """;

        mockMvc.perform(
                        put("/recruiter/applications/1/status")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(request))
                .andExpect(status().isBadRequest());
    }
}
