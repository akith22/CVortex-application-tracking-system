package com.ats.atssystem.service;

import com.ats.atssystem.dto.ApplicationRequest;
import com.ats.atssystem.model.Job;
import com.ats.atssystem.repository.ApplicationRepository;
import com.ats.atssystem.repository.JobRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class CandidateApplicationServiceTest {

    @Mock
    private ApplicationRepository applicationRepository;

    @Mock
    private JobRepository jobRepository;

    @Mock
    private MultipartFile multipartFile;

    @Mock
    private Job job;

    @InjectMocks
    private CandidateApplicationService service;

    /**
     * TEST CASE:
     * If candidate already applied for the job,
     * service should throw RuntimeException
     */
    @Test
    void duplicateApplication_shouldThrowException() {

        // Arrange
        Long userId = 1L;
        Long jobId = 1L;

        ApplicationRequest request = new ApplicationRequest();
        request.setJobId(jobId);

        // Mock job exists
        when(jobRepository.findById(jobId))
                .thenReturn(Optional.of(job));

        // Mock duplicate exists
        when(applicationRepository
                .existsByCandidateUserIdAndJobJobsId(userId, jobId))
                .thenReturn(true);

        // Act + Assert
        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> service.applyForJob(request, multipartFile, userId)
        );

        // Verify duplicate check was called
        verify(applicationRepository, times(1))
                .existsByCandidateUserIdAndJobJobsId(userId, jobId);

        // Ensure save() was NEVER called
        verify(applicationRepository, never())
                .save(any());
    }
}
