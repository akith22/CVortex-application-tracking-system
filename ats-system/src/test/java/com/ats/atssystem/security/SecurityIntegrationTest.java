package com.ats.atssystem.security;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class SecurityIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    /**
     * Access admin endpoint without authentication
     */
    @Test
    void accessAdminWithoutLogin_shouldReturn403() throws Exception {

        mockMvc.perform(get("/admin/users"))
                .andExpect(status().isForbidden());
    }

    /**
     * Access recruiter endpoint without authentication
     */
    @Test
    void accessRecruiterWithoutLogin_shouldReturn403() throws Exception {

        mockMvc.perform(get("/recruiter/applications"))
                .andExpect(status().isForbidden());
    }
}
