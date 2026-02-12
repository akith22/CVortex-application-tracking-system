package com.ats.atssystem.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class AdminControllerTest {
    @Autowired
    private MockMvc mockMvc;

    /**
     * TEST CASE 1: Get Dashboard Statistics
     * Role: ADMIN
     */
    @Test
    @WithMockUser(roles = "ADMIN")
    void getDashboardStats_asAdmin_shouldReturnStats() throws Exception {
        mockMvc.perform(get("/admin/dashboard/stats"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalUsers").exists())
                .andExpect(jsonPath("$.openJobs").exists());
    }

    /**
     * TEST CASE 2: Get All Users
     * Role: ADMIN
     */
    @Test
    @WithMockUser(roles = "ADMIN")
    void getAllUsers_asAdmin_shouldReturnList() throws Exception {
        mockMvc.perform(get("/admin/users"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    /**
     * TEST CASE 3: Role Security Check
     * Validating that a CANDIDATE cannot access Admin routes
     */
    @Test
    @WithMockUser(roles = "CANDIDATE")
    void getAdminStats_asCandidate_shouldReturn403() throws Exception {
        mockMvc.perform(get("/admin/dashboard/stats"))
                .andExpect(status().isForbidden());
    }
}
